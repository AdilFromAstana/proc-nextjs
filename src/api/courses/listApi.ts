import {
  CoursesListResponse,
  FetchCoursesListParams,
} from "@/types/courses/courses";
import axiosClient from "../axiosClient";

export const fetchCoursesList = async (
  params: FetchCoursesListParams
): Promise<CoursesListResponse> => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "all"
    )
  );

  const response = await axiosClient.get<CoursesListResponse>("/courses", {
    params: cleanedParams,
  });

  return response.data;
};
