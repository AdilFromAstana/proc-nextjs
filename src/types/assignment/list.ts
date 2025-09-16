// src/types/assignment/list.ts

// Тип одного задания (Assignment)
export interface Assignment {
  id: number;
  external_id: string | null;
  external_url: string | null;
  class_id: number;
  owner_id: number;
  lesson_id: number | null;
  quiz_id: number | null;
  webinar_id: number | null;
  chat_id: number;
  type: "quiz" | "lesson" | string;
  access_type: "free" | "paid";
  status: "process" | "completed" | "remaining" | string;
  application: "desktop" | "browser" | "mobile" | string;
  name: string;
  description: string | null;
  starting_at: string;
  starting_at_type: "now" | "scheduled" | string;
  ending_at: string;
  ending_at_type: "without" | "scheduled" | string;
  created_at: string;
  updated_at: string;

  // Поля для логики покупки
  product_id?: number | null;
  progress?: {
    total?: number;
  };
}

// Тип пагинации
export interface PaginationMeta {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Ответ API на запрос списка заданий
export interface AssignmentListResponse {
  status: "success" | string;
  status_code: string;
  entities: {
    data: Assignment[];
  } & PaginationMeta;
}

// Тип для параметров запроса
export interface FetchAssignmentsParams {
  page?: number;
  type?: string;
  orderBy?: string;
  query?: string | null;
  status?: string | null;
  date?: string | null;
  webinar?: string | null;
  proctoring?: string | null;
}
