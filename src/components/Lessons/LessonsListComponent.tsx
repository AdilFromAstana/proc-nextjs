"use client";

import React from "react";
import UniversalListComponent, {
  FilterOption,
} from "./../common/UniversalListComponent";
import { LessonItem, mockLessons } from "@/mockData";

export default function LessonsListComponent({
  lessons,
}: {
  lessons?: LessonItem[];
}) {
  const lessonFilters: FilterOption[] = [
    { key: "all", label: "Все уроки" },
    {
      key: "common",
      label: "Общие уроки",
      filterFn: (lesson: any) => lesson.type === "common",
    },
    {
      key: "my",
      label: "Мои уроки",
      filterFn: (lesson: any) => lesson.type === "my",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "common":
        return "bg-blue-100 text-blue-800";
      case "my":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "common":
        return "Общий";
      case "my":
        return "Мой";
      default:
        return type;
    }
  };

  return (
    <UniversalListComponent
      title="Уроки"
      items={mockLessons}
      filters={lessonFilters}
      defaultFilter="all"
      enableHideToggle={false}
      viewAllLink="#"
      emptyMessage="Нет уроков для отображения"
      renderItem={(lesson: LessonItem) => (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2 flex-1 mr-3">
              {lesson.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getTypeBadgeColor(
                lesson.type
              )}`}
            >
              {getTypeLabel(lesson.type)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2 items-center">
            {lesson.category && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {lesson.category}
              </span>
            )}

            {lesson.studentsCount !== undefined &&
              lesson.maxStudents !== undefined && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {lesson.studentsCount}/{lesson.maxStudents} студентов
                </span>
              )}
          </div>

          <div className="text-sm text-gray-600">
            <div>Преподаватель: {lesson.teacher}</div>
            <div>Дата: {formatDate(lesson.date)}</div>
            <div>Длительность: {lesson.duration}</div>
          </div>
        </div>
      )}
    />
  );
}
