"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Интерфейсы для типов данных
interface AssignmentAction {
  id: number;
  assignment_id: number;
  student_id: number;
  webinar_session_id: number;
  action_type: string;
  screenshot: string;
  is_warning: boolean;
  created_at: string;
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
  getDuration: (time: string) => string;
  getTime: () => string;
}

interface AssignmentActionType {
  id: string;
  name: string;
}

const mockActionTypes: AssignmentActionType[] = [
  { id: "camera_off", name: "Камера выключена" },
  { id: "multiple_faces", name: "Несколько лиц" },
  { id: "screen_switch", name: "Переключение экрана" },
  { id: "no_face", name: "Нет лица" },
  { id: "head_turning", name: "Поворот головы" },
  { id: "phone_detected", name: "Обнаружен телефон" },
  { id: "window_switch", name: "Переключение окон" },
  { id: "audio_muted", name: "Звук отключен" },
  { id: "typing_detected", name: "Обнаружен ввод текста" },
  { id: "mouse_movement", name: "Движение мыши" },
];

const mockActions: AssignmentAction[] = [
  {
    id: 1,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 1,
    action_type: "camera_off",
    screenshot: "https://placehold.co/300x200/FF0000/FFFFFF?text=Camera+Off+1",
    is_warning: true,
    created_at: "2023-01-01T10:00:00Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "00:05:30",
    getTime: () => "10:00:00",
  },
  {
    id: 2,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 1,
    action_type: "multiple_faces",
    screenshot:
      "https://placehold.co/300x200/00FF00/000000?text=Multiple+Faces",
    is_warning: true,
    created_at: "2023-01-01T10:05:15Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "00:10:45",
    getTime: () => "10:05:15",
  },
  {
    id: 3,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 2,
    action_type: "screen_switch",
    screenshot: "https://placehold.co/300x200/0000FF/FFFFFF?text=Screen+Switch",
    is_warning: true,
    created_at: "2023-01-01T10:15:30Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "00:15:30",
    getTime: () => "10:15:30",
  },
  {
    id: 4,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 2,
    action_type: "no_face",
    screenshot: "https://placehold.co/300x200/FFFF00/000000?text=No+Face",
    is_warning: true,
    created_at: "2023-01-01T10:25:45Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "00:25:45",
    getTime: () => "10:25:45",
  },
  {
    id: 5,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 3,
    action_type: "head_turning",
    screenshot: "https://placehold.co/300x200/FF00FF/FFFFFF?text=Head+Turning",
    is_warning: true,
    created_at: "2023-01-01T10:35:20Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "00:35:20",
    getTime: () => "10:35:20",
  },
  {
    id: 6,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 3,
    action_type: "phone_detected",
    screenshot:
      "https://placehold.co/300x200/00FFFF/000000?text=Phone+Detected",
    is_warning: true,
    created_at: "2023-01-01T10:45:10Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "00:45:10",
    getTime: () => "10:45:10",
  },
  {
    id: 7,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 1,
    action_type: "window_switch",
    screenshot: "https://placehold.co/300x200/800080/FFFFFF?text=Window+Switch",
    is_warning: true,
    created_at: "2023-01-01T10:55:05Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "00:55:05",
    getTime: () => "10:55:05",
  },
  {
    id: 8,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 2,
    action_type: "audio_muted",
    screenshot: "https://placehold.co/300x200/FFA500/000000?text=Audio+Muted",
    is_warning: false,
    created_at: "2023-01-01T11:05:30Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "01:05:30",
    getTime: () => "11:05:30",
  },
  {
    id: 9,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 3,
    action_type: "typing_detected",
    screenshot:
      "https://placehold.co/300x200/008000/FFFFFF?text=Typing+Detected",
    is_warning: false,
    created_at: "2023-01-01T11:15:45Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "01:15:45",
    getTime: () => "11:15:45",
  },
  {
    id: 10,
    assignment_id: 1,
    student_id: 1,
    webinar_session_id: 1,
    action_type: "mouse_movement",
    screenshot:
      "https://placehold.co/300x200/800000/FFFFFF?text=Mouse+Movement",
    is_warning: false,
    created_at: "2023-01-01T11:25:15Z",
    user: { id: 1, firstname: "Иван", lastname: "Иванов" },
    getDuration: (time: string) => "01:25:15",
    getTime: () => "11:25:15",
  },
  {
    id: 11,
    assignment_id: 1,
    student_id: 2,
    webinar_session_id: 4,
    action_type: "camera_off",
    screenshot: "https://placehold.co/300x200/000080/FFFFFF?text=Camera+Off+2",
    is_warning: true,
    created_at: "2023-01-01T10:10:20Z",
    user: { id: 2, firstname: "Мария", lastname: "Петрова" },
    getDuration: (time: string) => "00:10:20",
    getTime: () => "10:10:20",
  },
  {
    id: 12,
    assignment_id: 1,
    student_id: 2,
    webinar_session_id: 4,
    action_type: "multiple_faces",
    screenshot:
      "https://placehold.co/300x200/808000/000000?text=Multiple+Faces+2",
    is_warning: true,
    created_at: "2023-01-01T10:20:35Z",
    user: { id: 2, firstname: "Мария", lastname: "Петрова" },
    getDuration: (time: string) => "00:20:35",
    getTime: () => "10:20:35",
  },
];

// Mock реализации
const useAssignmentActionTypes = () => {
  const [types, setTypes] = useState<AssignmentActionType[]>([]);

  const getName = useCallback(
    (actionType: string) => {
      const type = types.find((t) => t.id === actionType);
      return type ? type.name : actionType;
    },
    [types]
  );

  const fetchTypes = useCallback(async () => {
    setTypes(mockActionTypes);
  }, []);

  return { types, getName, fetchTypes };
};

const useAssignmentActions = (apiUrl: string | null, params: any) => {
  const [actions, setActions] = useState<AssignmentAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchActions = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        // Для mock данных
        const data = {
          data: mockActions,
          current_page: page,
          last_page: 3,
          per_page: 10,
          total: 30,
        };

        setActions(data.data);
        setCurrentPage(data.current_page);
        setTotalPages(data.last_page);
      } catch (error) {
        console.error("Error fetching actions:", error);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl]
  );

  return { actions, loading, currentPage, totalPages, fetchActions };
};

interface AssignmentViolationsComponentProps {
  apiUrl?: string;
  assignment?: any;
  student?: any;
  attempt?: any;
  fetching?: boolean;
  refreshing?: boolean;
  interval?: number;
  portion?: number;
  params?: Record<string, any>;
  durationAtTime?: string;
  onViolationSelected?: (violation: AssignmentAction) => void;
  className?: string;
}

const AssignmentViolationsComponent: React.FC<
  AssignmentViolationsComponentProps
> = ({
  apiUrl = null,
  assignment = null,
  student = null,
  attempt = null,
  fetching = true,
  refreshing = true,
  interval = 20000,
  portion = 10,
  params = {},
  durationAtTime = null,
  onViolationSelected,
}) => {
  const { types, getName, fetchTypes } = useAssignmentActionTypes();
  const { actions, loading, currentPage, totalPages, fetchActions } =
    useAssignmentActions(apiUrl, params);

  const [page, setPage] = useState(1);
  const [limit] = useState(portion);

  // Формирование параметров API
  const actionsApiParams = {
    page,
    limit,
    is_warning: true,
    ...(student ? { student_id: student.id } : {}),
    ...(attempt ? { assignment_attempt_id: attempt.id } : {}),
    ...params,
  };

  // Проверка возможности показа предыдущих действий
  const canShowPreviousActions =
    currentPage < totalPages && actions.length > 0 && actions.length >= limit;

  // Загрузка типов действий при монтировании
  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  // Загрузка действий при монтировании и изменении параметров
  useEffect(() => {
    if (fetching) {
      fetchActions(page);
    }
  }, [fetching, page, fetchActions]);

  // Автообновление данных
  useEffect(() => {
    let syncInterval: NodeJS.Timeout | null = null;

    if (refreshing && interval > 0) {
      syncInterval = setInterval(() => {
        fetchActions(page);
      }, interval);
    }

    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [refreshing, interval, page, fetchActions]);

  const showPreviousActions = () => {
    setPage((prev) => prev + 1);
  };

  const onViolationItemSelected = (violation: AssignmentAction) => {
    if (onViolationSelected) {
      onViolationSelected(violation);
    }
  };

  if (loading && actions.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 h-[300px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Загрузка...</span>
      </div>
    );
  }

  return (
    <div className="assignment-violations-component relative h-[300px]">
      {canShowPreviousActions && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            variant="outline"
            size="sm"
            className="shadow-md rounded-t-none"
            onClick={showPreviousActions}
          >
            Показать предыдущие действия
          </Button>
        </div>
      )}

      {actions.length > 0 && (
        <div className="h-full pt-10 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2">
            {actions.map((violation, index) => (
              <Card
                key={index}
                className={`m-0 p-0 cursor-pointer hover:shadow-md transition-shadow rounded-none ${
                  index % 2 === 1 ? "bg-muted" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  onViolationItemSelected(violation);
                }}
              >
                <CardContent className="my-2 mx-4 p-0">
                  <div className="flex justify-between items-start flex-col gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {getName(violation.action_type)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {durationAtTime
                        ? violation.getDuration(durationAtTime)
                        : violation.getTime()}
                    </p>

                    <img
                      src={violation.screenshot}
                      alt="Скриншот нарушения"
                      className="w-32 object-cover rounded"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentViolationsComponent;
