// src/api/assignmentDetail/commentsApi.ts

import axiosClient from "../axiosClient";
import { AssignmentCommentsResponse } from "@/types/assignment/comments";

export const fetchAssignmentComments = async (
  assignmentId: number
): Promise<AssignmentCommentsResponse> => {
  const response = await axiosClient.get<AssignmentCommentsResponse>(
    `/assignment-comments`,
    {
      params: { assignment_id: assignmentId },
    }
  );
  return response.data;
};
