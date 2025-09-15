// api/assignmentDetail/actionsApi.ts

import axiosClient from "../axiosClient";
import { AssignmentActionsResponse } from "@/types/assignment/actions";

export const fetchAssignmentActions = async (
  assignmentId: number,
  page: number = 1,
  limit: number = 10,
  orderBy: string = "desc",
  context?: number, // ✅ Добавлено
  assignmentAttemptId?: number // ✅ Добавлено
): Promise<AssignmentActionsResponse> => {
  const params: Record<string, any> = {
    page,
    limit,
    orderBy,
  };

  if (context) {
    params.context = context;
  }

  if (assignmentAttemptId) {
    params.assignment_attempt_id = assignmentAttemptId;
  }

  const response = await axiosClient.get<AssignmentActionsResponse>(
    `/assignment/actions/${assignmentId}.json`,
    { params }
  );

  return response.data;
};
