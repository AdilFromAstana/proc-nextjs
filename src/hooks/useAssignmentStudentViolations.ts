// hooks/useAssignmentViolations.ts

import { useQuery } from "@tanstack/react-query";
import { fetchAssignmentViolations } from "@/api/assignmentDetail/violationsApi";
import { AssignmentViolationResponse } from "@/types/assignment/violations";

export const useAssignmentStudentViolations = (
  assignmentId: number,
  studentId?: number,
  attemptId?: number,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<AssignmentViolationResponse>({
    queryKey: [
      "assignment-violations",
      assignmentId,
      studentId,
      attemptId,
      page,
      limit,
    ],
    queryFn: () =>
      fetchAssignmentViolations(
        assignmentId,
        page,
        limit,
        true, // только нарушения (is_warning=true)
        studentId,
        attemptId
      ),
    enabled: !!assignmentId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
