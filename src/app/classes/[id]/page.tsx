"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTranslations } from "next-intl";
import { fetchClassById, fetchStudents, fetchTeachers } from "@/api/classes";
import { ClassEntity, StudentNTeacherEntity } from "@/types/classes/classes";
import { HeaderActions } from "@/components/common/HeaderActions";
import { ImportIcon } from "lucide-react";
import { SaveIcon } from "@/app/icons/Quiz/QuizHeaderIcons/SaveIcon";
import { DeleteIcon } from "@/app/icons/DeleteIcon";
import { CloseIcon } from "@/app/icons/Quiz/QuizHeaderIcons/CloseIcon";

interface CollapsibleCardProps {
  item: StudentNTeacherEntity;
  itemType: "students" | "teachers";
  title: string;
  onOpen?: (id: number) => void;
  className?: string;
}

export default function ClassItemPage({ params }: { params: { id: number } }) {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassEntity | null>(null);
  const [students, setStudents] = useState<StudentNTeacherEntity[]>([]);
  const [teachers, setTeachers] = useState<StudentNTeacherEntity[]>([]);
  const [activeTab, setActiveTab] = useState<"students" | "teachers">(
    "students"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classId = Number(params.id);

  const validateClassId = useCallback(() => {
    if (!classId || isNaN(classId)) {
      throw new Error("Некорректный ID группы");
    }
  }, [classId]);

  const loadSelectedClass = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      validateClassId();

      const response = await fetchClassById(classId);
      setSelectedClass(response.entity);
    } catch (err) {
      console.error("Ошибка загрузки группы:", err);
      setError(err instanceof Error ? err.message : "Ошибка загрузки группы");
      setSelectedClass(null);
    } finally {
      setLoading(false);
    }
  }, [classId, validateClassId]);

  const loadData = useCallback(
    async (type: "students" | "teachers") => {
      try {
        setActiveTab(type);
        setLoading(true);
        setError(null);
        validateClassId();

        const responseParams = {
          page: 1,
          limit: type === "students" ? 10 : 5,
          class_id: classId,
        };

        const response =
          type === "students"
            ? await fetchStudents(responseParams)
            : await fetchTeachers(responseParams);

        if (type === "students") {
          setStudents(response.entities.data);
        } else {
          setTeachers(response.entities.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка загрузки";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [classId, validateClassId]
  );

  useEffect(() => {
    loadSelectedClass();
  }, [loadSelectedClass]);

  // Автоматически загружаем студентов при первой загрузке
  useEffect(() => {
    if (selectedClass && students.length === 0) {
      loadData("students");
    }
  }, [selectedClass, students.length, loadData]);

  if (loading && !selectedClass) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !selectedClass) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={loadSelectedClass}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  if (!selectedClass) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl">Группа не найдена</div>
        </div>
      </div>
    );
  }

  const currentItems = activeTab === "students" ? students : teachers;
  const itemsCount =
    activeTab === "students"
      ? selectedClass.students_count
      : selectedClass.teachers_count;

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl text-gray-900">{selectedClass.name}</h1>

        <HeaderActions
          actions={[
            {
              icon: ImportIcon,
              label: t("btn-class-group-import"),
              onClick: () => console.log("Сохранить"),
              className: "hover:text-blue-600 hover:bg-blue-50",
            },
            {
              icon: SaveIcon,
              label: t("btn-save"),
              onClick: () => console.log("Сохранить"),
              className: "hover:text-blue-600 hover:bg-blue-50",
            },
            {
              icon: DeleteIcon,
              label: t("btn-delete"),
              onClick: () => console.log("Удалить"),
              className: "hover:text-red-600 hover:bg-red-50",
            },
            {
              icon: CloseIcon,
              label: t("btn-close"),
              onClick: () => console.log("Закрыть"),
              className: "hover:text-gray-800 hover:bg-gray-100",
            },
          ]}
        />
      </div>
      {/* Основная информация */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium text-gray-500">
            {t("label-class-info-title")}
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isEditing ? t("btn-save") : t("btn-edit")}
          </button>
        </div>

        {isEditing ? (
          <EditMode selectedClass={selectedClass} />
        ) : (
          <ViewMode selectedClass={selectedClass} />
        )}
      </div>

      {/* Табы */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex space-x-4 mb-4 border-b pb-2">
          <TabButton
            active={activeTab === "students"}
            onClick={() => loadData("students")}
            icon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            }
            label={t("label-class-students")}
            count={selectedClass.students_count}
          />
          <TabButton
            active={activeTab === "teachers"}
            onClick={() => loadData("teachers")}
            icon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
              </svg>
            }
            label={t("label-class-teachers")}
            count={selectedClass.teachers_count}
          />
        </div>

        {/* Поиск и фильтры */}
        <SearchAndFilters activeTab={activeTab} />

        {/* Список */}
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-4">Загрузка...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : currentItems.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              {t("label-empty-elements")}
            </div>
          ) : (
            currentItems.map((item) => (
              <CollapsibleCard
                key={`${activeTab}-${item.id}`}
                item={item}
                itemType={activeTab}
                title={t("label-firstname")}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Вспомогательные компоненты
function EditMode({ selectedClass }: { selectedClass: ClassEntity }) {
  const t = useTranslations();

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("label-class-name")}
        </label>
        <input
          type="text"
          value={selectedClass.name}
          onChange={() => {}}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("label-class-description")}
        </label>
        <textarea
          value={selectedClass.description}
          onChange={() => {}}
          maxLength={200}
          placeholder={t("placeholder-class-description")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          Осталось {200 - (selectedClass.description?.length || 0)} символа(-ов)
        </p>
      </div>
    </>
  );
}

function ViewMode({ selectedClass }: { selectedClass: ClassEntity }) {
  const t = useTranslations();
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("label-class-name")}
        </label>
        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
          {selectedClass.name}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("placeholder-class-description")}
        </label>
        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
          {selectedClass.description || t("placeholder-class-description")}
        </div>
      </div>
    </>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 font-medium pb-1 ${
        active
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon}
      {label}
      <span className="text-sm text-gray-500">{count}</span>
    </button>
  );
}

function SearchAndFilters({
  activeTab,
}: {
  activeTab: "students" | "teachers";
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder={t("placeholder-query")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>
            {t("placeholder-limit")} {activeTab === "students" ? "10" : "5"}{" "}
            {activeTab === "students" ? "студентов" : "преподавателей"}
          </option>
        </select>
      </div>
    </div>
  );
}

export function CollapsibleCard({
  title,
  item,
  itemType,
  onOpen,
  className = "",
}: CollapsibleCardProps) {
  const t = useTranslations();

  const [imgError, setImgError] = useState(false);

  const defaultAvatar =
    "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png";
  const avatarUrl =
    item.user.photo_thumb?.small || item.user.photo || defaultAvatar;
  const displayName = `${item.user.firstname} ${item.user.lastname}`;

  const handleOpen = () => {
    console.log(`Open ${itemType}`, item.id);
    onOpen?.(item.id);
  };

  return (
    <Collapsible className={`group/collapsible ${className}`}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors hover:bg-gray-50 bg-white">
          <img
            src={imgError ? defaultAvatar : avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
            onError={() => setImgError(true)}
          />
          <span className="font-medium">{displayName}</span>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="bg-gray-50 p-4 border border-t-0 rounded-b-md flex flex-col gap-3">
          <div className="text-sm text-gray-600">{title}</div>
          <div className="font-medium">{displayName}</div>

          {item.user.last_activity_date && (
            <div className="text-sm text-gray-500">
              Последняя активность:{" "}
              {new Date(item.user.last_activity_date).toLocaleDateString()}
            </div>
          )}

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium w-fit"
            onClick={handleOpen}
          >
            {t("btn-open")}
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
