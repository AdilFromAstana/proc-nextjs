// hooks/useAssignmentStudentData.ts
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import {
  AssignmentStudentData,
  AssignmentStudentDataResponse,
} from "@/types/assignment/studentResult";

export const useAssignmentStudentData = (
  assignmentId: number | null,
  studentId: number | null,
  attemptId?: number | null,
  fetchResults: boolean = false,
  fetchScores: boolean = false
) => {
  // ✅ Формируем ключ запроса — зависит от всех параметров
  const queryKey = [
    "assignment-student-data",
    assignmentId,
    studentId,
    attemptId,
    fetchResults,
    fetchScores,
  ];

  // ✅ Формируем функцию запроса
  const queryFn = async (): Promise<AssignmentStudentData> => {
    // Формируем fields как в Vue-компоненте
    let fields = [
      "student_assessments",
      "attempts",
      "actions",
      "violations",
      "identities",
      "credibility",
      "results_chart",
      "is_started",
      "is_finished",
      "progress", // добавил
      "quiz_components", // добавил
    ];

    // Добавляем дополнительные поля
    fields = fields.concat(["available_time"]);

    if (fetchResults) {
      fields.push("results");
    }

    if (fetchScores) {
      fields.push("scores");
    }

    // Добавляем certificate field если нужно (предполагаем что assignmentId существует)
    fields.push("student_certificate");

    const params: Record<string, any> = {
      context: studentId,
    };

    if (attemptId) {
      params.assignment_attempt_id = attemptId;
    }

    const response = await axiosClient.get<AssignmentStudentDataResponse>(
      `/assignments/${assignmentId}`,
      {
        headers: { "X-Requested-Fields": fields.join(",") },
        params,
      }
    );

    return response.data.entity;
  };

  // ✅ Используем useQuery
  return useQuery<AssignmentStudentData>({
    queryKey,
    queryFn,
    enabled: !!assignmentId && !!studentId, // Запрос выполняется только когда есть оба ID
    staleTime: 5 * 60 * 1000, // 5 минут кэширования
  });
};
