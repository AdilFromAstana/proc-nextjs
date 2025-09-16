// src/api/assignment/listApi.ts

import axiosClient from "../axiosClient";
import {
  AssignmentListResponse,
  FetchAssignmentsParams,
} from "@/types/assignment/list";

export const fetchAssignments = async (
  params: FetchAssignmentsParams
): Promise<AssignmentListResponse> => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "all"
    )
  );

  const response = await axiosClient.get<AssignmentListResponse>(
    "/assignments",
    {
      params: cleanedParams,
    }
  );

  return response.data;
};
