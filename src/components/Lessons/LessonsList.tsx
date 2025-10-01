"use client";

import { fetchLessonsList } from "@/api/lessons/listApi";
import { LessonItem } from "@/types/lessons/lessons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";

export default function LessonsList() {
  const t = useTranslations();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const response = await fetchLessonsList({ page: 1 });
        setLessons(response.entities.data);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить список уроков");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  const handleCreateLesson = () => {
    router.push("/lessons/create");
  };

  const handleLessonClick = (lessonId: number) => {
    router.push(`/lessons/${lessonId}`);
  };

  // Фильтрация тестов с поиском
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) {
      return lessons;
    }

    const query = searchQuery.toLowerCase().trim();
    return lessons.filter(
      (lesson) =>
        lesson.name.toLowerCase().includes(query) ||
        (lesson.description && lesson.description.toLowerCase().includes(query))
    );
  }, [searchQuery, lessons]);

  if (loading) {
    return (
      <div className="w-full m-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">{t("label-upload")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full m-8">
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full m-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("page-lesson-index")}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-shrink-0">
          <button
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={handleCreateLesson}
          >
            {t("btn-create")}
          </button>
        </div>

        <div className="flex-1 flex flex-wrap gap-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={t("placeholder-query")}
          />
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t("label-empty-elements")}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => handleLessonClick(lesson.id)}
              className="bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer rounded-lg"
            >
              <div className="flex items-start">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg"
                  style={{
                    backgroundColor: lesson.color
                      ? `#${lesson.color}`
                      : "#6b7280",
                  }}
                >
                  {lesson.image ? (
                    <img
                      src={lesson.image}
                      alt={lesson.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    lesson.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {lesson.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 truncate">
                    {lesson.description || t("label-empty-description")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder: string;
}

function SearchInput({
  searchQuery,
  setSearchQuery,
  placeholder,
}: SearchInputProps) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-md"
      />
    </div>
  );
}
