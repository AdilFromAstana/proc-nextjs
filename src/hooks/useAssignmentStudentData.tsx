// hooks/useAssignmentStudentData.ts

import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import {
  AssignmentStudentData,
  AssignmentStudentDataResponse,
} from "@/types/assignment/studentResult";

export const useAssignmentStudentData = (
  assignmentId: number,
  studentId: number,
  attemptId?: number,
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
      "progress",
      "quiz_components",
    ];

    if (fetchResults) {
      fields.push("results");
    }

    if (fetchScores) {
      fields.push("scores");
    }

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

  // ✅ Используем useQuery — запрос выполняется только при изменении queryKey
  return useQuery<AssignmentStudentData>({
    queryKey,
    queryFn,
    enabled: !!assignmentId && !!studentId, // ✅ Запрос не выполняется, пока нет assignmentId и studentId
    staleTime: Infinity, // ✅ Данные никогда не устаревают — обновляются только при изменении ключа
  });
};
