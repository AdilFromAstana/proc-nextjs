// src/api/assignmentQuery.ts

import {
  AssignmentListResponse,
  FetchAssignmentsParams,
} from "@/types/assignment/list";
import { useQuery } from "@tanstack/react-query";
import { fetchAssignments } from "./assignment/listApi";

export const useAssignments = (params: FetchAssignmentsParams) => {
  const { page, type, orderBy, query, status } = params;

  return useQuery<AssignmentListResponse>({
    queryKey: ["assignments", page, type, orderBy, query, status], // ✅ Каждый параметр отдельно
    queryFn: () => fetchAssignments(params),
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });
};
