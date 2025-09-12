"use client";

import React from "react";
import UniversalListComponent, {
  FilterOption,
} from "../common/UniversalListComponent";
import { mockTasks, TaskItem } from "@/mockData";

type TasksListComponentProps = {
  tasks?: TaskItem[];
};

export default function TasksListComponent({ tasks }: TasksListComponentProps) {
  const actualTasks = tasks || mockTasks;

  // Функции для получения цветов (можно вынести в хелперы)
  const getTypeColor = (type: string) => {
    switch (type) {
      case "app":
        return "bg-blue-100 text-blue-800";
      case "tray":
        return "bg-green-100 text-green-800";
      case "web":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "В процессе":
        return "bg-yellow-100 text-yellow-800";
      case "В ожидании":
        return "bg-gray-100 text-gray-800";
      case "Завершено":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrustRatingColor = (rating: number) => {
    if (rating >= 80) return "bg-green-500";
    if (rating >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Не назначено";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Фильтры для заданий
  const taskFilters: FilterOption[] = [
    { key: "all", label: "Все задания" },
    {
      key: "В процессе",
      label: "В процессе",
      filterFn: (task: any) => task.status === "В процессе",
    },
    {
      key: "В ожидании",
      label: "В ожидании",
      filterFn: (task: any) => task.status === "В ожидании",
    },
    {
      key: "Завершено",
      label: "Завершено",
      filterFn: (task: any) => task.status === "Завершено",
    },
  ];

  return (
    <UniversalListComponent
      title="Задания"
      //   icon={/* иконка, если нужна */}
      items={actualTasks}
      filters={taskFilters}
      defaultFilter="all"
      enableHideToggle={true}
      viewAllLink="#"
      renderItem={(task: any) => (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2 flex-1 mr-3">
              {task.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2 items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                task.type
              )}`}
            >
              {task.type.toUpperCase()}
            </span>

            {task.trustRating !== undefined && (
              <div className="relative group">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <div
                    className={`w-4 h-4 rounded-full ${getTrustRatingColor(
                      task.trustRating
                    )}`}
                  ></div>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Рейтинг доверия: {task.trustRating}%
                </div>
              </div>
            )}

            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {task.assignedStudents}/{task.totalStudents} студентов
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <div>Начало: {formatDate(task.startTime)}</div>
            {task.duration && <div>Длительность: {task.duration}</div>}
            {task.endTime && <div>Завершение: {formatDate(task.endTime)}</div>}
          </div>
        </div>
      )}
    />
  );
}
