import {
  FetchLessonsListParams,
  LessonsListResponse,
} from "@/types/lessons/lessons";
import axiosClient from "../axiosClient";
import { LessonDetailResponse } from "@/types/lessons/lessonQuestions";

export const fetchLessonsList = async (
  params: FetchLessonsListParams
): Promise<LessonsListResponse> => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "all"
    )
  );

  const response = await axiosClient.get<LessonsListResponse>("/lessons", {
    params: cleanedParams,
  });

  console.log(`fetchLessonsList: ${response.data}`);

  return response.data;
};

export const fetchLessonById = async (
  id: number
): Promise<LessonDetailResponse> => {
  let fields = [
    "id",
    "owner_id",
    "status",
    "name",
    "description",
    "settings",
    "chapters",
  ];

  const response = await axiosClient.get<LessonDetailResponse>(
    `/lessons/${id}`,
    {
      headers: { "X-Requested-Fields": fields.join(",") },
    }
  );
  console.log(`fetchLessonById: ${JSON.stringify(response.data)}`);
  return response.data;
};
