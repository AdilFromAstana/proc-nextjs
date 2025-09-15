"use client";

import { useState, forwardRef, useImperativeHandle, useRef } from "react";
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

import EntityListComponent, { EntityListRef } from "@/components/ui/EntityList";
import AssignmentRadialChartComponent from "@/components/Assignment/UI/RadialChartComponent";
import AssignmentStatusComponent from "@/components/Assignment/UI/StatusComponent";

import { useBasket } from "@/hooks/useBasket";
import { Assignment } from "@/api/assignmentApi";

// Типы пропсов
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
  loading?: boolean;
}

export interface AssignmentListRef {
  showLoader: () => void;
  hideLoader: () => void;
}

// ✅ Вспомогательные функции (вместо методов класса)
const getTypeName = (type: string): string => {
  const map: Record<string, string> = {
    quiz: "Тест",
    lesson: "Урок",
    // Добавь переводы по необходимости
  };
  return map[type] || type;
};

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
      loading = false,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const router = useRouter();

    // Ref для EntityListComponent
    const entityListRef = useRef<EntityListRef>(null);

    // Хуки для модального окна
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] =
      useState<Assignment | null>(null);

    // Хук корзины
    const { addProduct, removeProduct, setShowBasket } = useBasket();

    // ✅ Экспорт методов через ref
    useImperativeHandle(ref, () => ({
      showLoader: () => entityListRef.current?.showLoader(),
      hideLoader: () => entityListRef.current?.hideLoader(),
    }));

    // ✅ Логика клика по заданию
    const handleAssignmentClick = (assignment: Assignment) => {
      // Если доступ платный и продукт не куплен (в корзине или приобретен)
      // ⚠️ В оригинале: assignment.product.isAcquired() → мы заменяем на хук useBasket
      // Пока что для демо — считаем, что если product_id существует и access_type === 'paid', то нужно показать модалку
      if (assignment.access_type === "paid" && assignment.product_id) {
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

    // ✅ Подтверждение покупки
    const handleConfirmPrepaid = async () => {
      if (!selectedAssignment || !selectedAssignment.product_id) {
        setModalOpen(false);
        return;
      }

      try {
        await removeProduct(selectedAssignment.product_id); // Удаляем, если был
        await addProduct(selectedAssignment.product_id); // Добавляем в корзину
        setShowBasket(true); // Показываем корзину
      } catch (error) {
        console.error("Error adding to basket:", error);
      } finally {
        setModalOpen(false);
      }
    };

    // ✅ Рендер иконки (замена slot="entity-item-view")
    const renderAssignmentIcon = (entity: Assignment) => {
      if (entity.access_type === "paid" && entity.product_id) {
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-lg">🔒</span>
          </div>
        );
      }

      return (
        <AssignmentRadialChartComponent
          width={40}
          progress={entity.progress?.total || 0} // ⚠️ progress не приходит в твоих данных — нужно уточнить API
        />
      );
    };

    // ✅ Рендер данных (замена slot="entity-item-data")
    const renderAssignmentData = (entity: Assignment) => {
      if (entity.access_type === "paid" && entity.product_id) {
        return (
          <>
            <div className="flex items-center">
              <span className="text-black text-base font-semibold truncate">
                {entity.name}
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
              {entity.name}
            </span>
            <span
              className={`ml-2.5 px-1.5 py-1 text-xs font-medium rounded text-gray-700 bg-gray-100`}
            >
              {getTypeName(entity.type)}
            </span>
          </div>

          {entity.class_id && (
            <div className="mt-1 text-gray-500 text-sm font-normal">
              {/* ⚠️ В данных нет имени класса — пока выводим ID или заглушку */}
              Класс ID: {entity.class_id}
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

    // ✅ Скелетон
    if (loading) {
      return (
        <div className="space-y-4 p-4">
          {Array.from({ length: loadingPlaceholderCount }).map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ✅ Основной рендер
    return (
      <div className="assignment-list-component">
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

        {/* ✅ Модальное окно подтверждения покупки */}
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

AssignmentListComponent.displayName = "AssignmentListComponent";

export default AssignmentListComponent;
