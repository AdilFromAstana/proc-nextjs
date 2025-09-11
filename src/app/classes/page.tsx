"use client";

import React from "react";
import UniversalListComponent, {
  FilterOption,
} from "../../components/common/UniversalListComponent";
import { Class } from "@/types/groups";
import { mockClasses } from "@/mockData";
import { useRouter } from "next/navigation";

const classFilters: FilterOption[] = [
  { key: "all", label: "Все классы и группы" },
  {
    key: "groups",
    label: "Группы",
    filterFn: (item) => item.studentCount > 20,
  },
  {
    key: "classes",
    label: "Классы",
    filterFn: (item) => item.studentCount <= 20,
  },
];

export default function ClassGroupsList() {
  const router = useRouter();

  const handleItemClick = (item: Class) => {
    router.push(`/classes/${item.id}`);
  };
  return (
    <UniversalListComponent<Class>
      title="Мои группы"
      items={mockClasses}
      filters={classFilters}
      defaultFilter="all"
      viewAllLink="/classes"
      enableHideToggle
      renderItem={(classGroup) => (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{classGroup.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {classGroup.description}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                classGroup.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {classGroup.status === "active" ? "Активен" : "Неактивен"}
            </span>
          </div>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1">
              👨‍🎓 {classGroup.studentCount} учеников
            </span>
            <span className="flex items-center gap-1">
              👨‍🏫 {classGroup.teacherCount} преподавателей
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Создан: {new Date(classGroup.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
      onClickItem={handleItemClick}
    />
  );
}
