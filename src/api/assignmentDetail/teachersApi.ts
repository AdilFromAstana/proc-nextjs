// api/teachersApi.ts
import axiosClient from "../axiosClient"; // Убедитесь, что путь правильный
import {
  TeacherListResponse,
  TeacherCreateData,
} from "@/types/assignment/teacher"; // Предполагаемые типы, создайте их в types/teacher/index.ts

/**
 * Получить список учителей с пагинацией и поиском
 * @param params Параметры запроса (page, search query и т.д.)
 * @returns Promise с данными списка учителей
 */
export const fetchTeachers = async (
  params: Record<string, any> = { nullable: 0, extended: false, page: 1 }
): Promise<TeacherListResponse> => {
  // Поля, которые мы хотим запросить у API (если ваш фронтенд поддерживает X-Requested-Fields)
  const fields = [
    "id",
    "user_id",
    "user:id",
    "user:photo",
    "user:color",
    "user:firstname",
    "user:lastname",
    "user:is_online",
  ];

  const response = await axiosClient.get<TeacherListResponse>(`/teachers`, {
    headers: { "X-Requested-Fields": fields.join(",") }, // Раскомментируйте, если используется
    params,
  });
  return response.data;
};

/**
 * Создать нового учителя
 * @param teacherData Данные нового учителя
 * @returns Promise с данными созданного учителя
 */
export const createTeacher = async (
  teacherData: TeacherCreateData
): Promise<any> => {
  // Используйте более конкретный тип, если он у вас есть
  const response = await axiosClient.post<any>(`/teachers`, teacherData);
  return response.data;
};

// Если API поддерживает PUT/PATCH/DELETE для редактирования/удаления конкретного учителя, добавьте их здесь:
// export const updateTeacher = async (id: number, teacherData: Partial<TeacherUpdateData>): Promise<any> => { ... }
// export const deleteTeacher = async (id: number): Promise<void> => { ... }
