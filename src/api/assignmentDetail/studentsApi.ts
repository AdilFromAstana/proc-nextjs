// src/api/assignmentDetail/studentsApi.ts
import axiosClient from "../axiosClient";
import { AssignmentStudentsResponse } from "@/types/assignment/students";

export const fetchAssignmentStudents = async (
  assignmentId: number,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "lastname",
  query?: string | null
): Promise<AssignmentStudentsResponse> => {
  const fields = [
    "id",
    "user_id",
    "points",
    "results",
    "scores",
    "attempts:id",
    "attempts:status",
    "attempts:results",
    "attempts:variant",
    "attempts:points",
    "user:id",
    "user:photo",
    "user:color",
    "user:firstname",
    "user:lastname",
    "user:is_online",
    "credibility",
  ];

  const params: Record<string, any> = {
    page,
    limit,
    assignment_id: assignmentId,
    sortBy,
  };

  // Добавляем query в параметры, если он есть
  if (query) {
    params.query = query;
  }

  const response = await axiosClient.get<AssignmentStudentsResponse>(
    `/students`,
    {
      headers: { "X-Requested-Fields": fields.join(",") },
      params,
    }
  );
  return response.data;
};
