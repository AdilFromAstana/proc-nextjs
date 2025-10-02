"use client";

import { fetchCoursesList } from "@/api/courses";
import CoursesList from "@/components/Courses/CoursesList";
import { useEnums } from "@/hooks/useEnums";
import { FilterOption } from "@/types/common";
import { CourseItemInList } from "@/types/courses/courses";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";

export default function CoursesPage() {
  const t = useTranslations();

  const { getEnumOptions, loading } = useEnums();

  const [courses, setCourses] = useState<CourseItemInList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("name_asc");

  const statusFilters = getEnumOptions("CourseStatusType");

  const typeFilters = getEnumOptions("CourseAvailabilityType");

  const sortOptions: FilterOption[] = [
    { key: "date_newest", label: t("option-before-new") },
    { key: "date_oldest", label: t("option-before-old") },
  ];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCoursesList({ page: 1 });
        setCourses(response.entities.data);
      } catch (err) {
        console.error(err);
      } finally {
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
          <h1 className="text-2xl font-bold text-gray-900">
            {t("page-course-index")}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <button
              onClick={handleCreateCourse}
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              + {t("btn-create")}
            </button>
          </div>

          <div className="flex-1 flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder={t("placeholder-query")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {statusFilters.map((filter) => (
                  <option key={filter.raw} value={filter.raw}>
                    {filter.name}
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
                  <option key={filter.raw} value={filter.raw}>
                    {filter.name}
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
