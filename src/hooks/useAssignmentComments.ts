// hooks/useAssignmentComments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAssignmentComments,
  createAssignmentComment,
  updateAssignmentComment,
  deleteAssignmentComment,
} from "@/api/assignmentDetail/commentsApi";
import {
  AssignmentCommentsResponse,
  AssignmentComment,
} from "@/types/assignment/comments";

export const useAssignmentComments = (
  assignmentId: number,
  params: Record<string, any>
) => {
  return useQuery<AssignmentCommentsResponse>({
    queryKey: ["assignment-comments", assignmentId, params],
    queryFn: () => fetchAssignmentComments(assignmentId, params),
    enabled: !!assignmentId,
    staleTime: 20 * 1000, // 20 секунд как в Vue
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Partial<AssignmentComment>) =>
      createAssignmentComment(comment),
    onSuccess: (_, variables) => {
      // Инвалидируем кэш для обновления списка комментариев
      queryClient.invalidateQueries({ queryKey: ["assignment-comments"] });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<AssignmentComment>;
    }) => updateAssignmentComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment-comments"] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAssignmentComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment-comments"] });
    },
  });
};
