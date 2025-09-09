import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface EntityListComponentProps {
  entities: any[]; // Массив сущностей
  bordered?: boolean; // С границами
  selectable?: boolean; // Можно выбирать
  multiple?: boolean; // Множественный выбор
  selectOnClick?: boolean; // Выбор по клику
  pagination?: boolean; // С пагинацией
  values?: Record<string, (item: any) => any>; // Значения для отображения
  entityProps?: Record<string, any>; // Пропсы для сущностей
  onSelected?: (selected: any[]) => void; // Callback при выборе
  onPaged?: (page: number) => void; // Callback при пагинации
  onEntityClicked?: (entity: any) => void; // Callback при клике по сущности ✅ Добавлено
  renderData?: (entity: any) => React.ReactNode; // Функция рендеринга данных
  renderIcon?: (entity: any) => React.ReactNode; // Функция рендеринга иконки
  loadingPlaceholderCount?: number; // Количество плейсхолдеров при загрузке
  page?: number; // Текущая страница
  className?: string; // Дополнительный класс
  loading?: boolean; // Состояние загрузки (внешнее)
}

// Интерфейс для ref методов
export interface EntityListRef {
  showLoader: () => void;
  hideLoader: () => void;
}

const EntityListComponent = forwardRef<EntityListRef, EntityListComponentProps>(
  (
    {
      entities,
      bordered = false,
      selectable = false,
      multiple = false,
      selectOnClick = false,
      pagination = false,
      values = {},
      entityProps = {},
      onSelected,
      onPaged,
      onEntityClicked, // ✅ Добавлено
      renderData,
      renderIcon,
      loadingPlaceholderCount = 5,
      page = 1,
      className = "",
      loading: externalLoading = false, // Внешнее состояние загрузки
    },
    ref
  ) => {
    const [internalLoading, setInternalLoading] = useState(false);

    // Используем внешнее состояние загрузки, если оно передано, иначе внутреннее
    const isLoading = externalLoading || internalLoading;

    // Делаем методы доступными через ref
    useImperativeHandle(ref, () => ({
      showLoader: () => setInternalLoading(true),
      hideLoader: () => setInternalLoading(false),
    }));

    // Обработчик выбора сущности
    const [selectedEntities, setSelectedEntities] = useState<any[]>([]);

    const handleEntitySelect = (entity: any, isChecked: boolean) => {
      let newSelected: any[];

      if (multiple) {
        if (isChecked) {
          newSelected = [...selectedEntities, entity];
        } else {
          newSelected = selectedEntities.filter((e) => e.id !== entity.id);
        }
      } else {
        newSelected = isChecked ? [entity] : [];
      }

      setSelectedEntities(newSelected);
      onSelected?.(newSelected);
    };

    // Обработчик клика по сущности ✅ Обновлено
    const handleEntityClick = (entity: any) => {
      // Вызываем callback клика по сущности
      onEntityClicked?.(entity);

      // Если нужно выбрать по клику
      if (selectOnClick && selectable) {
        const isSelected = selectedEntities.some((e) => e.id === entity.id);
        handleEntitySelect(entity, !isSelected);
      }
    };

    // Рендер иконки сущности
    const renderEntityIcon = (entity: any) => {
      if (renderIcon) {
        return renderIcon(entity);
      }

      // Дефолтная иконка
      return (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">📋</span>
        </div>
      );
    };

    // Рендер данных сущности
    const renderEntityData = (entity: any) => {
      if (renderData) {
        return renderData(entity);
      }

      // Дефолтный рендер
      const displayName = values.letter
        ? values.letter(entity)
        : entity.name || entity.title || "Без названия";

      return (
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {displayName}
          </div>
        </div>
      );
    };

    console.log("EntityListComponent rendered with entities:", entities);

    return (
      <div className={`entity-list-component ${className}`}>
        {isLoading ? (
          // Плейсхолдеры при загрузке
          <div className="space-y-2">
            {Array.from({ length: loadingPlaceholderCount }).map((_, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg animate-pulse ${
                  bordered ? "border" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Список сущностей
          <div
            className={`space-y-2 ${bordered ? "border rounded-lg p-2" : ""}`}
          >
            {entities.map((entity) => {
              const isSelected = selectedEntities.some(
                (e) => e.id === entity.id
              );

              return (
                <div
                  key={entity.id}
                  className={`
                    p-3 rounded-lg transition-colors
                    ${bordered ? "border" : ""}
                    ${selectOnClick ? "cursor-pointer hover:bg-gray-50" : ""}
                    ${isSelected ? "bg-blue-50 border-blue-200" : "bg-white"}
                  `}
                  onClick={() => handleEntityClick(entity)}
                >
                  <div className="flex items-center space-x-3">
                    {selectable && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleEntitySelect(entity, !!checked)
                        }
                      />
                    )}

                    {renderEntityIcon(entity)}

                    {renderEntityData(entity)}
                  </div>
                </div>
              );
            })}

            {entities.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                Нет данных для отображения
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

// Добавляем displayName для лучшей отладки
EntityListComponent.displayName = "EntityListComponent";

export default EntityListComponent;
