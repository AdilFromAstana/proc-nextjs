// hooks/useAssignmentActions.ts

import { useQuery } from "@tanstack/react-query";
import { fetchAssignmentActions } from "@/api/assignmentDetail/actionsApi";
import { AssignmentActionsResponse } from "@/types/assignment/actions";

export const useAssignmentStudentActions = (
  assignmentId: number,
  studentId?: number,
  attemptId?: number,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<AssignmentActionsResponse>({
    queryKey: [
      "assignment-actions",
      assignmentId,
      studentId,
      attemptId,
      page,
      limit,
    ],
    queryFn: () =>
      fetchAssignmentActions(
        assignmentId,
        page,
        limit,
        "desc",
        studentId,
        attemptId
      ),
    enabled: !!assignmentId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
