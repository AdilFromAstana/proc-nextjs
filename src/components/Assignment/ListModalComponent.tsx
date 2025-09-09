"use client";

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useTranslation } from "next-i18next";

// shadcn-ui компоненты
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Кастомные компоненты
import EntityListComponent, { EntityListRef } from "@/components/ui/EntityList";
import PaginateComponent from "@/components/Pagination/PaginateComponent";

// Типы
import { Assignment } from "@/types/assignment";

// Хуки
import { useAssignments } from "@/hooks/useAssignments"; // ✅ Новый хук
import { useAssignmentTypes } from "@/hooks/useAssignmentTypes";
import { useAssignmentStatuses } from "@/hooks/useAssignmentStatuses";

interface AssignmentListModalComponentProps {
  // Убираем entities и entity - теперь используем хук
  values?: Record<string, (item: any) => any>; // Значения для отображения
  entityProps?: Record<string, any>; // Пропсы для сущностей
  selectable?: boolean; // Можно выбирать
  multiple?: boolean; // Множественный выбор
  bordered?: boolean; // С границами
  onSelected?: (assignments: Assignment[]) => void; // Callback при выборе нескольких
  onEntitySelected?: (assignment: Assignment) => void; // Callback при выборе одного
}

// Интерфейс для ref методов
export interface AssignmentListModalRef {
  open: () => Promise<void>;
  close: () => Promise<void>;
}

const AssignmentListModalComponent = forwardRef<
  AssignmentListModalRef,
  AssignmentListModalComponentProps
>(
  (
    {
      values = { letter: (item: any) => item.getName() },
      entityProps = { hideLabels: true },
      selectable = true,
      multiple = false,
      bordered = false,
      onSelected,
      onEntitySelected,
    }: AssignmentListModalComponentProps,
    ref
  ) => {
    const { t } = useTranslation();

    // Refs
    const entityListRef = useRef<EntityListRef>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Состояния
    const [page, setPage] = useState<number>(1);
    const [selectedEntity, setSelectedEntity] = useState<Assignment | null>(
      null
    );
    const [selectedEntities, setSelectedEntities] = useState<Assignment[]>([]);

    // Данные для фильтрации
    const [postData, setPostData] = useState({
      query: null as string | null,
    });

    // ✅ Используем хук вместо класса
    const { assignments, loading, pagination, fetchAssignments, totalPages } =
      useAssignments();

    // Используем хуки для enum'ов
    const { getTypeName } = useAssignmentTypes();
    const { getStatusName } = useAssignmentStatuses();

    // Методы для управления модальным окном
    const open = (): Promise<void> => {
      return new Promise((resolve) => {
        setIsOpen(true);
        setTimeout(() => {
          handleFetchAssignments();
          resolve();
        }, 0);
      });
    };

    const close = (): Promise<void> => {
      return new Promise((resolve) => {
        setIsOpen(false);
        resolve();
      });
    };

    // Делаем методы доступными через ref
    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    // Функция загрузки заданий
    const handleFetchAssignments = async () => {
      try {
        // Показываем loader
        entityListRef.current?.showLoader();

        // Формируем параметры для запроса
        const params = {
          ...postData,
          page: page,
        };

        // Загружаем данные через хук
        await fetchAssignments(params);

        // Скрываем loader
        entityListRef.current?.hideLoader();
      } catch (error) {
        console.error("Error fetching assignments:", error);
        entityListRef.current?.hideLoader();
      }
    };

    // Обработчики выбора
    const onSelectEntity = (assignment: Assignment) => {
      setSelectedEntity(assignment);
    };

    const onSelectEntities = (assignments: Assignment[]) => {
      setSelectedEntities(assignments);
    };

    // Обработчик клика по сущности
    const onClickedEntity = (assignment: Assignment) => {
      if (!multiple) {
        onSelectEntity(assignment);
      }
    };

    // Подтверждение выбора
    const confirmSelected = () => {
      // Передаем выбранные задания родителю
      if (multiple) {
        onSelected?.(selectedEntities);
      } else {
        onEntitySelected?.(selectedEntity as Assignment);
      }
      // Закрываем модальное окно
      close();
    };

    // Отмена выбора
    const discardSelected = () => {
      // Очищаем выбор
      setSelectedEntity(null);
      setSelectedEntities([]);
      // Закрываем модальное окно
      close();
    };

    // Рендер данных задания
    const renderAssignmentData = (entity: Assignment) => {
      return (
        <div className="relative">
          <div className="flex items-center">
            <div>
              <span className="text-black text-base font-semibold">
                {entity.getName()}
              </span>
              <span
                className={`ml-2.5 px-1.5 py-1 text-xs font-medium rounded text-gray-700 bg-gray-100`}
              >
                {getTypeName(entity.type)}
              </span>
            </div>
          </div>

          {entity.class && (
            <div className="mt-1 text-gray-500 text-sm font-normal">
              {entity.getClassName()}
            </div>
          )}

          <div className="absolute top-1/2 right-5 transform -translate-y-1/2">
            <span
              className={`text-white text-xs font-semibold px-2 py-1 rounded text-center ${
                entity.status === "process"
                  ? "bg-blue-500"
                  : entity.status === "completed"
                  ? "bg-green-500"
                  : entity.status === "remaining"
                  ? "bg-yellow-500"
                  : entity.status === "suspended"
                  ? "bg-gray-500"
                  : "bg-gray-300"
              }`}
            >
              {getStatusName(entity.status)}
            </span>
          </div>
        </div>
      );
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl modal-entity-list assignment-list-modal">
          <DialogHeader>
            <DialogTitle>{t("label-select-assignments")}</DialogTitle>
            {/* SEARCH FORM */}
            <div className="pt-2">
              <Input
                placeholder={t("placeholder-query")}
                value={postData.query || ""}
                onChange={(e) =>
                  setPostData({ ...postData, query: e.target.value || null })
                }
                className="bg-gray-100"
              />
            </div>
          </DialogHeader>

          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {/* ASSIGNMENT LIST */}
            <EntityListComponent
              ref={entityListRef}
              entities={assignments} // ✅ Используем assignments из хука
              bordered={bordered}
              selectable={selectable}
              multiple={multiple}
              selectOnClick={true}
              pagination={false}
              values={values}
              entityProps={entityProps}
              onSelected={onSelectEntities}
              onEntityClicked={onClickedEntity}
              renderData={renderAssignmentData}
              className="modal-assignment-list"
              loading={loading} // ✅ Передаем состояние загрузки
            />

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-4">
                <PaginateComponent
                  pageCount={totalPages}
                  value={page}
                  onPageChange={({ selected }) => {
                    setPage(selected + 1);
                    setTimeout(() => handleFetchAssignments(), 0);
                  }}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              onClick={confirmSelected}
              disabled={
                multiple ? selectedEntities.length === 0 : !selectedEntity
              }
              variant="default"
            >
              {t("btn-ready")}
            </Button>
            <Button onClick={discardSelected} variant="destructive">
              {t("btn-cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

// Добавляем displayName для лучшей отладки
AssignmentListModalComponent.displayName = "AssignmentListModalComponent";

export default AssignmentListModalComponent;
