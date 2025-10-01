"use client";

import { fetchClassesList } from "@/api/classes";
import ClassesList from "@/components/Classes/ClassesList";
import { ClassEntity } from "@/types/classes/classes";
import { FilterOption } from "@/types/common";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

export default function ClassGroupsList() {
  const t = useTranslations();

  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("name_asc");

  const allClassesFilters: FilterOption[] = [
    { key: "all-classes", label: t("option-all-classes") },
    { key: "only-classes", label: t("option-only-classes") },
    { key: "only-groups", label: t("option-only-groups") },
  ];

  const sortOptions: FilterOption[] = [
    { key: "date_newest", label: t("option-before-new") },
    { key: "date_oldest", label: t("option-before-old") },
  ];

  const handleCreateClass = () => {
    console.log("Создание новой группы");
  };

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        const response = await fetchClassesList({ page: 1 });
        setClasses(response.entities.data);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить список уроков");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("page-class-index")}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <button
              onClick={handleCreateClass}
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
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {allClassesFilters.map((filter) => (
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
        <ClassesList classes={classes} />
      </div>
    </div>
  );
}
