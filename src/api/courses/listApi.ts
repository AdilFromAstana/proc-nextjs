import {
  CourseItem,
  CourseItemEdit,
  CourseItemResponse,
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

export const fetchCourseById = async (
  id: number
): Promise<CourseItemResponse> => {
  let fields = [
    "id",
    "status",
    "availability_type",
    "image",
    "name",
    "description",
    "short_description",
    "starting_at_type",
    "starting_at",
    "ending_at_type",
    "ending_at",
    "groups:id",
    "groups:name",
    "groups:description",
    "groups:materials:id",
    "groups:materials:type",
    "groups:materials:image",
    "groups:materials:color",
    "groups:materials:name",
    "groups:materials:description",
    "groups:materials:short_description",
    "products:id",
    "products:name",
    "products:description",
    "products:image",
    "products:color",
    "products:price",
    "products:formatted_price",
    "records:id",
    "records:title",
    "records:announce",
    "records:image",
    "records:created_at",
  ];
  const response = await axiosClient.get<CourseItemResponse>(`/courses/${id}`, {
    headers: { "X-Requested-Fields": fields.join(",") },
  });
  return response.data;
};

export const fetchCourseByIdEdit = async (
  id: number
): Promise<CourseItemResponse> => {
  let fields = [
    "id",
    "owner_id",
    "invite_code_id",
    "certificate_id",
    "status",
    "availability_type",
    "image",
    "name",
    "description",
    "short_description",
    "settings",
    "starting_at",
    "starting_at_type",
    "ending_at",
    "ending_at_type",
    "materials_count",
    "students_count",
    "teachers_count",
    "records_count",
    "products_count",
  ];
  const response = await axiosClient.get<CourseItemResponse>(`/courses/${id}`, {
    headers: { "X-Requested-Fields": fields.join(",") },
  });
  return response.data;
};

export const updateCourse = async (
  id: number,
  courseData: CourseItemEdit
): Promise<CourseItemResponse> => {
  const response = await axiosClient.put<CourseItemResponse>(
    `/courses/${id}`,
    courseData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await axiosClient.delete(`/courses/${id}`);
};
