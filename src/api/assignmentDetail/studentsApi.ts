// src/api/assignmentDetail/studentsApi.ts

import axiosClient from "../axiosClient";
import { AssignmentStudentsResponse } from "@/types/assignment/students";

export const fetchAssignmentStudents = async (
  assignmentId: number,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "lastname"
): Promise<AssignmentStudentsResponse> => {
  const response = await axiosClient.get<AssignmentStudentsResponse>(
    `/students`,
    {
      params: { page, limit, assignment_id: assignmentId, sortBy },
    }
  );
  return response.data;
};
