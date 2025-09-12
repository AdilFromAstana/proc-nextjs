"use client";

import React, { useState } from "react";

import { CourseItem, CourseStatus, CourseType, mockCourses } from "@/mockData";
import { FilterOption } from "@/components/common/UniversalListComponent";
// Типы для курсов

// Компонент для отображения одного курса
const CourseCard = ({ course }: { course: CourseItem }) => {
  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: CourseType) => {
    switch (type) {
      case "free":
        return "Бесплатный";
      case "paid":
        return "По предоплате";
      case "private":
        return "Приватный";
      default:
        return type;
    }
  };

  const getTypeColor = (type: CourseType) => {
    switch (type) {
      case "free":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-purple-100 text-purple-800";
      case "private":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              course.status
            )}`}
          >
            {course.status === "published" ? "Опубликован" : "Черновик"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
              course.type
            )}`}
          >
            {getTypeLabel(course.type)}
          </span>
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
            {course.lessonsCount} уроков
          </span>
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
            {course.studentsCount} студентов
          </span>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>
            Обновлено: {new Date(course.updatedAt).toLocaleDateString("ru-RU")}
          </span>
          <button className="text-blue-600 hover:text-blue-800">Открыть</button>
        </div>
      </div>
    </div>
  );
};

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("name_asc");

  // Фильтрация курсов
  const filteredCourses = mockCourses.filter((course) => {
    // Поиск по названию
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Фильтр по статусу
    if (statusFilter !== "all" && course.status !== statusFilter) {
      return false;
    }

    // Фильтр по типу
    if (typeFilter !== "all" && course.type !== typeFilter) {
      return false;
    }

    return true;
  });

  // Сортировка курсов
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOrder === "name_asc") {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === "name_desc") {
      return b.title.localeCompare(a.title);
    } else if (sortOrder === "date_newest") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sortOrder === "date_oldest") {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }
    return 0;
  });

  // Опции фильтров
  const statusFilters: FilterOption[] = [
    { key: "all", label: "Все статусы" },
    { key: "published", label: "Опубликованные" },
    { key: "draft", label: "Черновики" },
  ];

  const typeFilters: FilterOption[] = [
    { key: "all", label: "Все типы" },
    { key: "free", label: "Бесплатные" },
    { key: "paid", label: "По предоплате" },
    { key: "private", label: "Приватные" },
  ];

  const sortOptions: FilterOption[] = [
    { key: "name_asc", label: "Название А-Я" },
    { key: "name_desc", label: "Название Я-А" },
    { key: "date_newest", label: "Новые" },
    { key: "date_oldest", label: "Старые" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Курсы</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Кнопка создания */}
          <div className="flex-shrink-0">
            <button className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Создать
            </button>
          </div>

          {/* Фильтры */}
          <div className="flex-1 flex flex-wrap gap-4">
            {/* Поиск */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Статус */}
            <div className="min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {statusFilters.map((filter) => (
                  <option key={filter.key} value={filter.key}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Тип */}
            <div className="min-w-[150px]">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {typeFilters.map((filter) => (
                  <option key={filter.key} value={filter.key}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Порядок */}
            <div className="min-w-[150px]">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((filter) => (
                  <option key={filter.key} value={filter.key}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Список курсов */}
        {sortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Элементы отсутствуют
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить фильтры или создать новый курс.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
