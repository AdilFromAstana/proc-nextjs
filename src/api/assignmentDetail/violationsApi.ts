import axiosClient from "../axiosClient";
import { AssignmentViolationResponse } from "@/types/assignment/violations";

export const fetchAssignmentViolations = async (
  assignmentId: number,
  page: number = 1,
  limit: number = 10,
  isWarning: boolean = true, // для violations мы хотим только нарушения
  studentId?: number,
  assignmentAttemptId?: number
): Promise<AssignmentViolationResponse> => {
  const params: Record<string, any> = {
    page,
    limit,
    is_warning: isWarning,
  };

  if (studentId) {
    params.student_id = studentId;
  }

  if (assignmentAttemptId) {
    params.assignment_attempt_id = assignmentAttemptId;
  }

  const response = await axiosClient.get<AssignmentViolationResponse>(
    `/assignment/actions/${assignmentId}.json`,
    { params }
  );

  return response.data;
};
