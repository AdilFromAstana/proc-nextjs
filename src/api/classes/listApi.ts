import axiosClient from "../axiosClient";
import {
  ClassEntityResponse,
  ClassesListResponse,
  FetchClassesListParams,
  FetchStudentsNTeachersParams,
  StudentsNTeachersResponse,
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
): Promise<ClassEntityResponse> => {
  let fields = [
    "id",
    "name",
    "description",
    "students_count",
    "teachers_count",
  ];

  const response = await axiosClient.get<ClassEntityResponse>(
    `/classes/${id}`,
    {
      headers: { "X-Requested-Fields": fields.join(",") },
    }
  );
  console.log(`fetchClassById: ${JSON.stringify(response.data)}`);
  return response.data;
};

let userFields = [
  "id",
  "user_id",
  "id",
  "user:photo",
  "user:color",
  "user:photo_thumb:big",
  "user:photo_thumb:medium",
  "user:photo_thumb:small",
  "user:firstname",
  "user:lastname",
  "user:last_activity_date",
  "user:is_online",
];

export const fetchStudents = async (
  params: FetchStudentsNTeachersParams
): Promise<StudentsNTeachersResponse> => {
  const response = await axiosClient.get<StudentsNTeachersResponse>(
    "/students",

    {
      headers: { "X-Requested-Fields": userFields.join(",") },
      params: params,
    }
  );

  return response.data;
};

export const fetchTeachers = async (
  params: FetchStudentsNTeachersParams
): Promise<StudentsNTeachersResponse> => {
  const response = await axiosClient.get<StudentsNTeachersResponse>(
    "/teachers",

    {
      headers: { "X-Requested-Fields": userFields.join(",") },
      params: params,
    }
  );

  return response.data;
};
