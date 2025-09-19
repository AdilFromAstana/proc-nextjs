// hooks/useTeachers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTeachers,
  createTeacher,
} from "@/api/assignmentDetail/teachersApi"; // Убедитесь, что путь правильный
import {
  TeacherListResponse,
  TeacherCreateData,
} from "@/types/assignment/teacher"; // Предполагаемые типы

/**
 * Хук для получения списка учителей
 * @param params Параметры запроса (page, search и т.д.)
 * @returns Объект useQuery с данными списка учителей
 */
export const useTeachers = (params: Record<string, any> = {}) => {
  // Значения по умолчанию для параметров запроса
  const defaultParams = { nullable: 0, extended: false, page: 1, ...params };

  return useQuery<TeacherListResponse>({
    queryKey: ["teachers", defaultParams], // queryKey должен быть сериализуемым и уникальным для этого запроса
    queryFn: () => fetchTeachers(defaultParams),
    // enabled: true, // Можно добавить условие, например, если params.searchTerm.length > 2
    staleTime: 1000 * 60 * 5, // 5 минут, можно настроить по желанию
  });
};

/**
 * Хук для создания нового учителя
 * @returns Объект useMutation для создания учителя
 */
export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teacherData: TeacherCreateData) => createTeacher(teacherData),
    onSuccess: () => {
      // Инвалидируем кэш списка учителей, чтобы получить обновленные данные
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      // Или, если нужно быть более точным (если ключи кэша зависят от параметров):
      // queryClient.invalidateQueries({ queryKey: ["teachers", /* конкретные params, если нужно */] });
    },
    // onError: (error) => {
    //   // Обработка ошибок создания
    //   console.error("Ошибка при создании учителя:", error);
    // }
  });
};

// Если API поддерживает редактирование/удаление:
// export const useUpdateTeacher = () => { ... }
// export const useDeleteTeacher = () => { ... }
