// components/ActionsSection.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import SectionWrapper from "../../UI/SectionWrapper";
import { AssignmentViolation } from "@/types/assignment/violations";
import { useAssignmentStudentViolations } from "@/hooks/useAssignmentStudentViolations";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ActionsSectionProps {
  assignmentId: number;
  studentId?: number;
  attemptId?: number;
  clickable?: boolean;
  refreshing?: boolean;
  live?: boolean;
  interval?: number;
  onViolationSelected?: (violation: AssignmentViolation) => void;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  assignmentId,
  studentId,
  attemptId,
  clickable = true,
  refreshing = false,
  live = false,
  interval = 20000,
  onViolationSelected,
}) => {
  const t = useTranslations();

  const [page, setPage] = useState(1);
  const [allViolations, setAllViolations] = useState<AssignmentViolation[]>([]);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const actionListRef = useRef<HTMLDivElement>(null);

  // Имитация хука для получения данных (замените на ваш реальный хук)
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

  // Улучшенное форматирование времени
  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();

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

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Проверяем, сегодня ли дата
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return `Сегодня в ${hours}:${minutes}`;
    }

    // Проверяем, вчера ли дата
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isYesterday) {
      return `Вчера в ${hours}:${minutes}`;
    }

    // Для остальных случаев
    return `В прошлую ${day}, в ${hours}:${minutes}`;
  }

  // Автопрокрутка к последнему элементу
  const scrollToBottom = useCallback(() => {
    if (actionListRef.current) {
      actionListRef.current.scrollTop = actionListRef.current.scrollHeight;
    }
  }, []);

  // Обновляем список нарушений при получении новых данных
  useEffect(() => {
    if (violationsData) {
      const newViolations = violationsData.entities.data;
      const hasNextPage = violationsData.entities.next_page_url !== null;

      setHasMorePages(hasNextPage);

      if (page === 1) {
        // Первая страница - заменяем все данные
        setAllViolations(newViolations);
        setIsLoadingInitial(false);
      } else {
        // Следующие страницы - добавляем к существующим
        setAllViolations((prev) => [...prev, ...newViolations]);
      }
    }
  }, [violationsData, page]);

  // Автопрокрутка после загрузки данных
  useEffect(() => {
    if (!isLoading && allViolations.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isLoading, allViolations.length, scrollToBottom]);

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

  // Имитация WebSocket подписки (замените на реальную реализацию)
  useEffect(() => {
    if (!live) return;

    // Здесь должна быть реальная подписка на WebSocket
    // Пример:
    // const channelName = `$private:assignment-actions.${assignmentId}`;
    // const subscription = centrifuge.subscribe(channelName, (message) => {
    //   const data = message.data;
    //   if (data.event === 'AssignmentViolationCreated') {
    //     // Добавляем новое нарушение в начало списка
    //     setAllViolations(prev => [new AssignmentViolationModel(data), ...prev]);
    //   }
    // });

    // return () => {
    //   subscription.unsubscribe();
    // };

    // Пока просто имитация
    console.log(
      `Подписка на канал: $private:assignment-actions.${assignmentId}`
    );
  }, [assignmentId, live]);

  const handleShowPrevious = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const getViolationTypeName = (type: string): string => {
    return violationTypes[type] || type;
  };

  const getViolationIcon = (violation: AssignmentViolation) => {
    if (violation.initiator_id) return "🛡️";
    if (violation.is_warning === 1) return "⚠️";
    return "ℹ️";
  };

  // Показываем лоадер только при первой загрузке
  if (isLoadingInitial && page === 1 && allViolations.length === 0) {
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
    <SectionWrapper
      icon={faClipboardList}
      title={t("label-assignment-user-actions")}
      hint={t("hint-assignment-user-actions")}
    >
      <div className="relative assignment-actions-component w-full">
        {hasMorePages && allViolations.length > 0 && (
          <div
            className="absolute cursor-pointer w-auto text-gray-700 text-xs font-semibold py-2.5 px-2.5 bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)] rounded-b-[3px] whitespace-nowrap inline-block absolute top-0 left-1/2 transform -translate-x-1/2 z-10"
            onClick={handleShowPrevious}
          >
            {t("btn-assignment-show-previous-violations")}
          </div>
        )}

        {allViolations.length > 0 ? (
          <div
            ref={actionListRef}
            className="assignment-action-list w-full max-h-[300px] overflow-auto"
          >
            {[...allViolations].reverse().map((violation, index) => (
              <div
                key={violation.id}
                className={`
                assignment-action-item
                ${index % 2 === 0 ? "bg-[#FEFEFE]" : "bg-[#F5F5F5]"}
                ${clickable ? "clickable cursor-pointer hover:bg-gray-100" : ""}
                ${violation.is_archived ? "is-archived opacity-10" : ""}
                w-full flex flex-row flex-nowrap justify-start items-center p-2
              `}
              >
                <div className="action-item-time self-stretch max-w-[100px] min-w-[100px] text-gray-700 text-xs font-medium leading-[14px] text-center relative py-1.5 -my-2 -ml-2 bg-[rgba(150,150,150,0.1)]">
                  <span className="w-full block absolute top-1/2 left-0 -translate-y-1/2">
                    {formatTime(violation.created_at)}
                  </span>
                </div>

                <div
                  className="action-item-action text-gray-900 text-sm font-normal ml-2.5 whitespace-nowrap flex items-center flex-1"
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

          .assignment-action-item.clickable:hover {
            background-color: #f0f0f0;
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
    </SectionWrapper>
  );
};

export default ActionsSection;
