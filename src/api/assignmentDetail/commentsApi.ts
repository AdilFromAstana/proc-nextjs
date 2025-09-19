// api/assignmentDetail/commentsApi.ts
import axiosClient from "../axiosClient";
import {
  AssignmentCommentsResponse,
  AssignmentComment,
} from "@/types/assignment/comments";

export const fetchAssignmentComments = async (
  assignmentId: number,
  params: Record<string, any>
): Promise<AssignmentCommentsResponse> => {
  const fields = [
    "id",
    "assignment_id",
    "assignment_result_id",
    "user_id",
    "component_id",
    "component_type",
    "message",
    "user:id",
    "user:firstname",
    "user:lastname",
    "user:photo",
    "created_at",
    "updated_at",
  ];

  const response = await axiosClient.get<AssignmentCommentsResponse>(
    `/assignment-comments`,
    {
      headers: { "X-Requested-Fields": fields.join(",") },
      params: { assignment_id: assignmentId, ...params },
    }
  );
  return response.data;
};

export const createAssignmentComment = async (
  comment: Partial<AssignmentComment>
): Promise<AssignmentComment> => {
  const response = await axiosClient.post<AssignmentComment>(
    `/assignment-comments`,
    comment
  );
  return response.data;
};

export const updateAssignmentComment = async (
  id: number,
  data: Partial<AssignmentComment>
): Promise<AssignmentComment> => {
  const response = await axiosClient.put<AssignmentComment>(
    `/assignment-comments/${id}`,
    data
  );
  return response.data;
};

export const deleteAssignmentComment = async (id: number): Promise<void> => {
  await axiosClient.delete(`/assignment-comments/${id}`);
};
