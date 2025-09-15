// src/api/assignmentDetail/detailApi.ts

import axiosClient from "../axiosClient";
import { AssignmentDetailResponse } from "@/types/assignment/detail";

export const fetchAssignmentDetail = async (
  id: number
): Promise<AssignmentDetailResponse> => {
  const response = await axiosClient.get<AssignmentDetailResponse>(
    `/assignments/${id}`
  );
  return response.data;
};
