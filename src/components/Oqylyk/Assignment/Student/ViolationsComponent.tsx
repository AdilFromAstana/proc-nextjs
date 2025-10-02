// components/Assignment/AssignmentViolationsComponent.tsx

"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AssignmentViolation } from "@/types/assignment/violations";
import { useAssignmentStudentViolations } from "@/hooks/useAssignmentStudentViolations";
import { useTranslations } from "next-intl";

interface AssignmentViolationsComponentProps {
  assignmentId: number;
  studentId?: number;
  attemptId?: number;
  clickable?: boolean;
  refreshing?: boolean;
  interval?: number;
  onViolationSelected?: (violation: AssignmentViolation) => void;
}

const AssignmentViolationsComponent: React.FC<
  AssignmentViolationsComponentProps
> = ({
  assignmentId,
  studentId,
  attemptId,
  clickable = true,
  refreshing = false,
  interval = 20000,
  onViolationSelected,
}) => {
  const t = useTranslations();

  const [page, setPage] = useState(1);
  const [allViolations, setAllViolations] = useState<AssignmentViolation[]>([]);
  const [hasMorePages, setHasMorePages] = useState(true);

  const {
    data: violationsData,
    isLoading,
    isError,
    refetch,
  } = useAssignmentStudentViolations(assignmentId, studentId, attemptId, page);

  // Типы нарушений
  const violationTypes: Record<string, string> = {
    noise_detect: "Обнаружен посторонний шум",
    head_rotated: "Поворот головы",
    head_empty: "Голова не обнаружена",
    head_restored: "Голова восстановлена",
    head_identity: "Идентификация",
    tab_switch: "Переключение вкладок",
    window_blur: "Потеря фокуса окна",
    multiple_devices: "Несколько устройств",
    phone_detected: "Обнаружен телефон",
    screen_switch: "Переключение экрана",
    camera_off: "Камера выключена",
    audio_muted: "Звук отключен",
  };

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);

    const days = [
      "воскресенье",
      "понедельник",
      "вторник",
      "среду",
      "четверг",
      "пятницу",
      "субботу",
    ];

    const day = days[date.getDay()];
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `В прошлую ${day}, в ${hours}:${minutes}`;
  }

  // Обновляем список нарушений при получении новых данных
  useEffect(() => {
    if (violationsData) {
      const newViolations = violationsData.entities.data;
      const hasNextPage = violationsData.entities.next_page_url !== null;

      setHasMorePages(hasNextPage);

      if (page === 1) {
        // Первая страница - заменяем все данные
        setAllViolations(newViolations);
        console.log("newViolations: ", newViolations);
      } else {
        // Следующие страницы - добавляем к существующим
        setAllViolations((prev) => [...prev, ...newViolations]);
      }
    }
  }, [violationsData, page]);

  // Автообновление
  useEffect(() => {
    if (!refreshing || interval <= 0) return;

    const timer = setInterval(() => {
      // При автообновлении сбрасываем на первую страницу
      setPage(1);
      refetch();
    }, interval);

    return () => clearInterval(timer);
  }, [refreshing, interval, refetch]);

  const handleShowPrevious = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const getViolationTypeName = (type: string): string => {
    return violationTypes[type] || type;
  };

  if (isLoading && page === 1 && allViolations.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Загрузка нарушений...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded">
        Ошибка загрузки нарушений
      </div>
    );
  }

  return (
    <div className="relative w-full max-h-[250px] overflow-auto">
      {hasMorePages && allViolations.length > 0 && (
        <div
          className="cursor-pointer w-auto text-gray-700 text-xs font-semibold py-2.5 px-2.5 bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)] rounded-b-[3px] whitespace-nowrap inline-block absolute top-0 left-1/2 transform -translate-x-1/2 z-10"
          onClick={handleShowPrevious}
        >
          {t("btn-assignment-show-previous-actions")}
        </div>
      )}

      {allViolations.length > 0 ? (
        <div className="relative">
          {allViolations.map((violation, index) => (
            <div
              key={violation.id}
              className={`p-[15px_20px] block ${
                index % 2 === 1 ? "bg-[#F4F4F4]" : "bg-white"
              } hover:bg-[#F0F0F0]`}
              onClick={() => clickable && onViolationSelected?.(violation)}
            >
              <div className="text-gray-700 text-sm font-semibold leading-[18px]">
                {getViolationTypeName(violation.action_type)}
              </div>
              <div className="text-gray-400 font-normal text-xs mt-2">
                {formatTime(violation.created_at)}
              </div>
              {violation.screenshot && (
                <a
                  href={violation.screenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[100px] h-[80px] border-[5px] border-white rounded-sm shadow-[0px_0px_3px_0px_rgba(0,0,0,0.1)] inline-block mt-[10px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={violation.screenshot}
                    className="w-full h-full object-cover"
                    alt="Нарушение"
                  />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">✅</div>
          <p>Нарушений не обнаружено</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentViolationsComponent;
