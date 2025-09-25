"use client";

import { fetchCoursesList } from "@/api/courses";
import CoursesList from "@/components/Courses/CoursesList";
import { FilterOption } from "@/types/common";
import { CourseItemInList } from "@/types/courses/courses";
import React, { useState, useEffect } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItemInList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("name_asc");

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

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await fetchCoursesList({ page: 1 });
        setCourses(response.entities.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleCreateCourse = () => {
    console.log("Создание нового курса");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Курсы</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <button
              onClick={handleCreateCourse}
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              +  Создать
            </button>
          </div>

          <div className="flex-1 flex flex-wrap gap-4">
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

        <CoursesList courses={courses} />
      </div>
    </div>
  );
}
