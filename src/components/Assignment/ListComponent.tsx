"use client";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";

// shadcn-ui компоненты
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Типы
import { Assignment } from "@/types/assignment";

// Кастомные компоненты
import EntityListComponent, { EntityListRef } from "@/components/ui/EntityList";
import AssignmentRadialChartComponent from "@/components/Assignment/UI/RadialChartComponent";
import AssignmentStatusComponent from "@/components/Assignment/UI/StatusComponent";

// Хуки для enum'ов
import { useAssignmentTypes } from "@/hooks/useAssignmentTypes";
import { useAssignmentStatuses } from "@/hooks/useAssignmentStatuses";
import { useBasket } from "@/hooks/useBasket";

interface AssignmentListComponentProps {
  assignments: Assignment[];
  route?: string;
  page?: number;
  pagination?: boolean;
  bordered?: boolean;
  loadingPlaceholderCount?: number;
  visibleStatus?: boolean;
  onPaged?: (page: number) => void;
  onSelected?: (assignment: Assignment) => void;
}

// ✅ Интерфейс для ref методов
export interface AssignmentListRef {
  showLoader: () => void;
  hideLoader: () => void;
}

// ✅ Используем forwardRef
const AssignmentListComponent = forwardRef<
  AssignmentListRef,
  AssignmentListComponentProps
>(
  (
    {
      assignments,
      route = "teacher-assignment-view",
      page = 1,
      pagination = false,
      bordered = false,
      loadingPlaceholderCount = 5,
      visibleStatus = true,
      onPaged,
      onSelected,
    }: AssignmentListComponentProps,
    ref
  ) => {
    const { t } = useTranslation();
    const router = useRouter();

    // Ref для EntityListComponent
    const entityListRef = useRef<EntityListRef>(null);

    // Используем хуки вместо классов
    const { getTypeName } = useAssignmentTypes();
    const { getStatusName } = useAssignmentStatuses();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] =
      useState<Assignment | null>(null);

    const { addProduct, removeProduct, refresh: setShowBasket } = useBasket();

    // ✅ Делаем методы доступными через ref
    useImperativeHandle(ref, () => ({
      showLoader: () => entityListRef.current?.showLoader(),
      hideLoader: () => entityListRef.current?.hideLoader(),
    }));

    const handleAssignmentClick = async (assignment: Assignment) => {
      // Если это премиум задание и не куплено
      if (
        assignment.isPrepaidAccessType() &&
        !assignment.product?.isAcquired()
      ) {
        setSelectedAssignment(assignment);
        setModalOpen(true);
        return;
      }

      // Обычная навигация
      if (route) {
        router.push(`/assignments/${assignment.id}`);
      } else {
        onSelected?.(assignment);
      }
    };

    const handleConfirmPrepaid = async () => {
      if (selectedAssignment && selectedAssignment.product_id != null) {
        try {
          // Удаляем, если уже есть
          await removeProduct(selectedAssignment.product_id);
          // Добавляем в корзину
          await addProduct(selectedAssignment.product_id);
          // Показываем корзину
          setShowBasket();
        } catch (error) {
          console.error("Error adding to basket:", error);
        }
      }
      setModalOpen(false);
    };

    const renderAssignmentIcon = (entity: Assignment) => {
      if (entity.isPrepaidAccessType() && !entity.product?.isAcquired()) {
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-lg">🔒</span>
          </div>
        );
      }

      return (
        <AssignmentRadialChartComponent
          width={40}
          progress={entity.progress?.total || 0}
        />
      );
    };

    const renderAssignmentData = (entity: Assignment) => {
      if (entity.isPrepaidAccessType() && !entity.product?.isAcquired()) {
        return (
          <>
            <div className="flex items-center">
              <span className="text-black text-base font-semibold truncate">
                {entity.getName()}
              </span>
              <span
                className={`ml-2.5 px-1.5 py-1 text-xs font-medium rounded text-gray-700 bg-gray-100`}
              >
                {getTypeName(entity.type)}
              </span>
            </div>
            <div className="mt-1 text-gray-500 text-sm font-normal">
              {t("label-assignment-access-type-prepaid")}
            </div>
          </>
        );
      }

      return (
        <>
          <div className="flex items-center">
            <span className="text-black text-base font-semibold truncate">
              {entity.getName()}
            </span>
            <span
              className={`ml-2.5 px-1.5 py-1 text-xs font-medium rounded text-gray-700 bg-gray-100`}
            >
              {getTypeName(entity.type)}
            </span>
          </div>

          {entity.class && (
            <div className="mt-1 text-gray-500 text-sm font-normal">
              {entity.getClassName()}
            </div>
          )}

          {visibleStatus && (
            <div className="absolute top-1/2 right-5 transform -translate-y-1/2">
              <AssignmentStatusComponent status={entity.status} size="small" />
            </div>
          )}
        </>
      );
    };

    return (
      <div className="assignment-list-component">
        {/* ✅ Используем EntityListComponent */}
        <EntityListComponent
          ref={entityListRef}
          entities={assignments}
          pagination={pagination}
          bordered={bordered}
          loadingPlaceholderCount={loadingPlaceholderCount}
          page={page}
          entityProps={{ hideLabels: true }}
          onEntityClicked={handleAssignmentClick}
          onPaged={onPaged}
          renderIcon={renderAssignmentIcon}
          renderData={renderAssignmentData}
        />

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("label-assignment-prepaid-confirm-title")}
              </DialogTitle>
              <DialogDescription>
                {t("label-assignment-prepaid-confirm-description")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                {t("btn-cancel")}
              </Button>
              <Button onClick={handleConfirmPrepaid}>{t("btn-confirm")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

// ✅ Важно: добавляем displayName для лучшей отладки
AssignmentListComponent.displayName = "AssignmentListComponent";

export default AssignmentListComponent;
