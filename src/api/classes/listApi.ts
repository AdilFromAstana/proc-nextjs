import axiosClient from "../axiosClient";
import { LessonDetailResponse } from "@/types/lessons/lessonQuestions";
import {
  ClassesListResponse,
  FetchClassesListParams,
} from "@/types/classes/classes";

export const fetchClassesList = async (
  params: FetchClassesListParams
): Promise<ClassesListResponse> => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "all"
    )
  );

  const response = await axiosClient.get<ClassesListResponse>("/classes", {
    params: cleanedParams,
  });

  console.log(`fetchClassesList: ${response.data}`);

  return response.data;
};

export const fetchClassById = async (
  id: number
): Promise<LessonDetailResponse> => {
  let fields = [
    "id",
    "name",
    "description",
    "students_count",
    "teachers_count",
  ];

  const response = await axiosClient.get<LessonDetailResponse>(
    `/classes/${id}`,
    {
      headers: { "X-Requested-Fields": fields.join(",") },
    }
  );
  console.log(`fetchClassById: ${JSON.stringify(response.data)}`);
  return response.data;
};

export const fetchStudents = async (
  params: FetchClassesListParams
): Promise<ClassesListResponse> => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "all"
    )
  );

  const response = await axiosClient.get<ClassesListResponse>("/students", {
    params: cleanedParams,
  });

  console.log(`fetchClassesList: ${response.data}`);

  return response.data;
};

export const fetchTeachers = async (
  params: FetchClassesListParams
): Promise<ClassesListResponse> => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "all"
    )
  );

  const response = await axiosClient.get<ClassesListResponse>("/teachers", {
    params: cleanedParams,
  });

  console.log(`fetchClassesList: ${response.data}`);

  return response.data;
};
