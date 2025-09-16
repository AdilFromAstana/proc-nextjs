// components/Assignment/AssignmentViolationsComponent.tsx

"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { AssignmentAction } from "@/types/assignment/actions";
import { useAssignmentStudentViolations } from "@/hooks/useAssignmentStudentViolations";

interface AssignmentViolationsComponentProps {
  assignmentId: number;
  studentId?: number;
  attemptId?: number;
  clickable?: boolean;
  refreshing?: boolean;
  interval?: number;
  onViolationSelected?: (violation: AssignmentAction) => void;
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
  const [page, setPage] = useState(1);
  const [allViolations, setAllViolations] = useState<AssignmentAction[]>([]);
  const [hasMorePages, setHasMorePages] = useState(true);

  const {
    data: violationsData,
    isLoading,
    isError,
    refetch,
  } = useAssignmentStudentViolations(assignmentId, studentId, attemptId, page);

  // Типы нарушений
  const violationTypes: Record<string, string> = {
    noise_detect: "Обнаружен шум",
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
      "среда",
      "четверг",
      "пятница",
      "суббота",
    ];

    const day = days[date.getDay()];
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // В прошлую среду, в 11:08
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

  const getViolationIcon = (violation: AssignmentAction) => {
    if (violation.initiator_id) return "🛡️";
    if (violation.is_warning === 1) return "⚠️";
    return "ℹ️";
  };

  if (isLoading && page === 1 && allViolations.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Загрузка нарушений...</span>
        </div>
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
    <div className="relative assignment-actions-component w-full">
      {hasMorePages && allViolations.length > 0 && (
        <div className="show-previous-actions-btn" onClick={handleShowPrevious}>
          Показать предыдущие нарушения
        </div>
      )}

      {allViolations.length > 0 ? (
        <div className="assignment-action-list w-full max-h-[250px] overflow-auto">
          {allViolations.map((violation, index) => (
            <div
              key={violation.id}
              className={`assignment-action-item ${
                index % 2 === 0 ? "bg-[#FEFEFE]" : "bg-[#F5F5F5]"
              } ${
                clickable ? "clickable cursor-pointer hover:bg-gray-100" : ""
              } ${violation.is_archived ? "is-archived opacity-10" : ""}`}
            >
              <div className="action-item-time self-stretch max-w-[100px] min-w-[100px] text-gray-700 text-xs font-medium leading-[14px] text-center relative py-1.5 -my-2 -ml-2 bg-[rgba(150,150,150,0.1)]">
                <span className="w-full block absolute top-1/2 left-0 -translate-y-1/2">
                  {formatTime(violation.created_at)}
                </span>
              </div>

              <div
                className="action-item-action text-gray-900 text-sm font-normal ml-2.5 whitespace-nowrap flex items-center"
                onClick={() => clickable && onViolationSelected?.(violation)}
              >
                <div className="action-icon inline-block align-middle w-5 text-center">
                  {getViolationIcon(violation)}
                </div>

                <div className="action-action inline-block align-middle ml-2.5">
                  <span>{getViolationTypeName(violation.action_type)}</span>
                  {violation.description && (
                    <span className="block mt-0.5">
                      {violation.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="assignment-empty-action-list text-white text-base font-semibold p-5 text-center bg-[rgba(0,0,0,0.2)]">
          Нарушений не обнаружено
        </div>
      )}

      <style jsx>{`
        .assignment-actions-component {
          position: relative;
        }

        .assignment-action-list {
          width: 100%;
          max-height: 300px;
          overflow: auto;
        }

        .assignment-action-item {
          width: inherit;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
          padding: 8px 8px;
        }

        .assignment-action-item.clickable {
          cursor: pointer;
        }

        .assignment-action-item.is-archived {
          opacity: 0.1;
        }

        .action-item-action .action-icon .fa-exclamation-circle {
          color: #fcba03;
        }
        .action-item-action .action-icon .fa-user-shield {
          color: #1a73e8;
        }
        .action-item-action .action-icon .fa-info-circle {
          color: #eee;
        }

        .show-previous-actions-btn {
          cursor: pointer;
          width: auto;
          color: #333;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 10px 10px 8px 10px;
          background-color: #fff;
          box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
          border-radius: 0px 0px 3px 3px;
          white-space: nowrap;
          display: inline-block;
          transform: translateX(-50%);
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 1;
        }

        .assignment-empty-action-list {
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          padding: 20px;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AssignmentViolationsComponent;
