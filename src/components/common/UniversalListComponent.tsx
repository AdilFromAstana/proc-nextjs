"use client";

import React, { useState, useEffect } from "react";

// Базовый тип для элемента списка
export type BaseItem = {
  id: number | string;
  [key: string]: any; // Позволяет добавлять любые дополнительные поля
};

// Тип для фильтра
export type FilterOption = {
  key: string;
  label: string;
  filterFn?: (item: BaseItem) => boolean; // Кастомная функция фильтрации
};

// Тип для пропсов универсального компонента
type UniversalListComponentProps<T extends BaseItem = BaseItem> = {
  title: string;
  icon?: React.ReactNode;
  items: T[];
  filters?: FilterOption[];
  defaultFilter?: string;
  renderItem: (item: T) => React.ReactNode;
  onClickItem?: (item: T) => void;
  viewAllLink?: string;
  enableHideToggle?: boolean;
  loading?: boolean;
  emptyMessage?: string;
};

export default function UniversalListComponent<T extends BaseItem>({
  title,
  icon,
  items = [],
  filters = [],
  defaultFilter = "all",
  renderItem,
  onClickItem,
  viewAllLink = "#",
  enableHideToggle = false,
  loading = false,
  emptyMessage = "Нет элементов для отображения",
}: UniversalListComponentProps<T>) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(defaultFilter);
  const [hideItems, setHideItems] = useState(false);

  // Обработка загрузки
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Фильтрация элементов
  const filteredItems = (() => {
    if (hideItems) return [];

    const activeFilterObj = filters.find((f) => f.key === activeFilter);

    if (!activeFilterObj || activeFilter === "all") return items;

    // Используем кастомную функцию фильтрации или фильтр по ключу
    if (activeFilterObj.filterFn) {
      return items.filter(activeFilterObj.filterFn);
    }

    return items;
  })();

  // Загрузочное состояние
  if (isLoading || loading) {
    return (
      <div className="mb-4 rounded-lg border bg-card p-6 w-full h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {icon && <div className="text-xl">{icon}</div>}
            <h2 className="font-semibold text-xl">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Посмотреть все</span>
            <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="flex justify-between items-start mb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex gap-2 mb-2">
                <div className="h-5 bg-gray-200 rounded w-12"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border bg-card p-6 w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {icon && <div className="text-xl">{icon}</div>}
          <h2 className="font-semibold text-xl">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {enableHideToggle && (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">
                Скрыть элементы
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={hideItems}
                  onChange={(e) => setHideItems(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </>
          )}
          <a
            className="text-blue-600 hover:text-blue-800 text-sm"
            href={viewAllLink}
          >
            Посмотреть все
          </a>
        </div>
      </div>

      {/* Фильтры */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                activeFilter === filter.key
                  ? "border-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Список элементов */}
      <div className="space-y-3 ">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {hideItems ? "Элементы скрыты" : emptyMessage}
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onClickItem && onClickItem(item)}
              className={onClickItem ? "cursor-pointer" : ""}
            >
              {renderItem(item)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
