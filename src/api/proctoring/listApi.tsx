import {
  AssignmentActionsResponse,
  AssignmentProctoringResponse,
  ProctoringStudentsResponse,
} from "@/types/assignment/proctoring";
import axiosClient from "../axiosClient";

// Получение основной информации о прокторинге
export const fetchAssignmentProctoring = async (
  id: number
): Promise<AssignmentProctoringResponse> => {
  const proctoringRequestedFields = [
    "id",
    "owner_id",
    "class_id",
    "quiz_id",
    "lesson_id",
    "webinar_id",
    "type",
    "status",
    "name",
    "progress",
    "settings",

    "class:id",
    "class:name",

    "chat:id",
    "chat:owner_id",
    "chat:status",
    "chat:type",
    "chat:image",
    "chat:color",
    "chat:name",
    "chat:description",
    "chat:created_at",
    "chat:updated_at",

    "webinars:id",

    "webinar:id",
    "webinar:status",
    "webinar:name",
    "webinar:description",
    "webinar:room",
    "webinar:token",
    "webinar:is_moderator",

    "webinar:server:id",
    "webinar:server:provider",
    "webinar:server:host",
    "webinar:server:options",
    "webinar:server:is_active",

    "webinar:class:id",
    "webinar:class:name",
    "webinar:class:description",

    "webinar:ice_servers:id",
    "webinar:ice_servers:type",
    "webinar:ice_servers:server",
    "webinar:ice_servers:urls",
    "webinar:ice_servers:username",
    "webinar:ice_servers:credential",
  ];

  const response = await axiosClient.get<AssignmentProctoringResponse>(
    `/assignments/${id}`,
    {
      headers: {
        "X-Requested-Fields": proctoringRequestedFields.join(","),
      },
    }
  );
  return response.data;
};

// Получение действий прокторинга
export const fetchAssignmentActions = async (
  id: number,
  page: number = 1,
  limit: number = 10,
  orderBy: "asc" | "desc" = "desc"
): Promise<AssignmentActionsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    orderBy,
  });

  const actionsRequestedFields = [
    "id",
    "assignment_id",
    "student_id",
    "action_type",
    "description",
    "screenshot",
    "is_warning",
    "created_at",

    "user:id",
    "user:firstname",
    "user:lastname",
  ];

  const response = await axiosClient.get<AssignmentActionsResponse>(
    `/assignment/actions/${id}.json`,
    {
      params,
      headers: {
        "X-Requested-Fields": actionsRequestedFields.join(","),
      },
    }
  );
  return response.data;
};

// Получение студентов для прокторинга
export const fetchProctoringStudents = async (
  assignmentId: number,
  webinarId: number,
  page: number = 1,
  limit: number = 12
): Promise<ProctoringStudentsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    assignment_id: assignmentId.toString(),
    webinar_id: webinarId.toString(),
  });

  const studentsRequestedFields = [
    "id",
    "user_id",

    "user:id",
    "user:photo",
    "user:color",
    "user:photo_thumb:big",
    "user:photo_thumb:medium",
    "user:photo_thumb:small",
    "user:firstname",
    "user:lastname",
    "user:last_activity_date",
    "user:is_online",
  ];

  const response = await axiosClient.get<ProctoringStudentsResponse>(
    `/students`,
    {
      params,
      headers: {
        "X-Requested-Fields": studentsRequestedFields.join(","),
      },
    }
  );
  return response.data;
};

// Обновление настроек прокторинга
export const updateProctoringSettings = async (
  id: number,
  settings: Partial<AssignmentProctoringResponse["entity"]["settings"]>
): Promise<AssignmentProctoringResponse> => {
  const response = await axiosClient.put<AssignmentProctoringResponse>(
    `/assignments/${id}/proctoring-settings`,
    { settings }
  );
  return response.data;
};

// Получение статистики прокторинга
export const fetchProctoringStats = async (
  id: number
): Promise<{
  status: string;
  status_code: string;
  entity: {
    total_actions: number;
    warning_actions: number;
    unique_students: number;
    average_actions_per_student: number;
  };
}> => {
  const response = await axiosClient.get(`/assignments/${id}/proctoring-stats`);
  return response.data;
};
