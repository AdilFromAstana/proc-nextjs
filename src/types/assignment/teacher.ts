// types/teacher/index.ts
// Или разбейте на отдельные файлы: types/teacher/types.ts, types/teacher/responses.ts и т.д.

// Базовая модель пользователя/учителя (адаптируйте под реальные поля из API)
export interface TeacherUser {
  id: number;
  firstname: string;
  lastname: string;
  photo: string | null;
  color: string | null;
  email: string;
  is_online: boolean; // Используем snake_case, так как это формат API
  // email и phone могут отсутствовать в этом конкретном ответе,
  // но могут быть в других частях API. Добавьте при необходимости.
  // email?: string;
  // phone?: string;
}

// Модель учителя (адаптируйте под реальные поля из API)
export interface Teacher {
  id: number;
  user_id: number;
  user: TeacherUser;
  // department_id и другие поля учителя могут быть, добавьте при необходимости.
  // department_id?: number | null;
}

// Тип для отдельной ссылки в пагинации
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Тип для ответа API на запрос списка учителей
export interface TeacherListResponse {
  status: string; // "success"
  status_code: string; // "0000"
  entities: {
    current_page: number;
    data: Teacher[]; // Массив учителей
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

// Тип для данных, отправляемых при создании учителя
// (Базируется на примере из предыдущего сообщения)
export interface TeacherCreateData {
  id: null;
  user_id: null;
  department_id: null;
  user: {
    REQUEST_CONTINUE: number; // 0
    REQUEST_REDUNDANT: number; // 1
    REQUEST_SKIP: number; // 2
    id: null;
    school_id: null;
    auth_type: null;
    group: null; // или установить значение по умолчанию
    photo: null;
    photo_thumb: {}; // или Record<string, any> или null
    color: null;
    firstname: string;
    lastname: string;
    patronymic: null; // Если используется
    email: string;
    phone: string; // Убедитесь, что формат правильный (например, "7 (776) 115-6415")
    username: null;
    description: null;
    password: string; // !!! Обработка паролей!
    school: {
      REQUEST_CONTINUE: number; // 0
      REQUEST_REDUNDANT: number; // 1
      REQUEST_SKIP: number; // 2
      id: null;
      type: null;
      name: null;
      logo: null;
      logo_thumb: {}; // или Record<string, any> или null
      website: null;
      email: null;
    };
    register_date: null;
    last_activity_date: null;
    additional: {
      almaty_daryn_school_id: null;
      almaty_daryn_teacher_name: null;
      // ... другие дополнительные поля
    };
    is_online: false;
    is_need_complete_challenge: false;
    is_multiple_schools: false;
  };
  notify_via_sms: false;
  notify_via_email: false;
  // ... другие поля, если есть
}

// Типы для useUpdateTeacher и useDeleteTeacher, если они понадобятся
// export interface TeacherUpdateData { ... }
