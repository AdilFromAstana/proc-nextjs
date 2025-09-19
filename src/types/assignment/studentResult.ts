// src/types/assignment/studentResult.ts

// Студент-оценка
export interface StudentAssessment {
  id: number;
  assignment_id: number;
  student_id: number;
  assessment_id: number;
  assessment_type: string;
  assessment_name: string;
}

// Попытка студента
export interface StudentAttempt {
  id: number;
  assignment_id: number;
  student_id: number;
  quiz_id: number | null;
  classroom_reserve_id: number | null;
  attempt: number;
  status: "active" | "closed" | string;
  state: string | null;
  variant: string | null;
  points: number;
  credibility: number;
  spending_time: number;
  results?: [];
}

// Действие студента
export interface StudentAction {
  id: number;
  assignment_id: number;
  assignment_attempt_id: number;
  student_id: number;
  webinar_session_id: number | null;
  initiator_id: number | null;
  screenshot_storage_id: number | null;
  action_type: string;
  description: string | null;
  screenshot: string | null;
  screenshots: any[];
  extra: any | null;
  is_warning: 0 | 1;
  is_archived: any | null;
  created_at: string;
}

// Пагинация для действий и нарушений
export interface PaginatedData<T> {
  current_page: number;
  data: T[];
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

// Фото идентификации
export interface IdentityPhoto {
  id: number;
  assignment_id: number;
  assignment_attempt_id: number;
  student_id: number;
  webinar_session_id: number | null;
  initiator_id: number | null;
  screenshot_storage_id: number | null;
  action_type: string;
  description: string | null;
  screenshot: string | null;
  screenshots: any[];
  extra: any | null;
  is_warning: 0 | 1;
  is_archived: any | null;
  created_at: string;
}

// Опция вопроса
export interface QuestionOption {
  id: number;
  free_question_id: number;
  type: string | null;
  answer: string;
  feedback: string | null;
  percent: number | null;
  is_true: 0 | 1;
  settings: any | null;
}

// Попытка ответа на вопрос
export interface QuestionAttempt {
  id: number;
  assignment_id: number;
  assignment_attempt_id: number;
  free_question_id: number;
  option_id: number;
  student_id: number;
  result: 0 | 1;
  created_at: string;
}

// Компонент вопроса
export interface QuestionComponent {
  _attempts_showed: boolean;
  _answers_showed: boolean;
  id: number;
  owner_id: number;
  component_type: string;
  question: string;
  hint: string | null;
  feedback: string | null;
  description: string | null;
  is_multiple: 0 | 1;
  created_at: string;
  options: QuestionOption[];
  attempts: QuestionAttempt[];
  settings: any | null;
  updated_at: string;
}

// Элемент викторины
export interface QuizComponent {
  id: number;
  quiz_id: number;
  component_id: number;
  component_type: string;
  data: {
    mode: string;
  };
  position: number;
  settings: any[];
  component: QuestionComponent;
}

// Основные данные студента
export interface AssignmentStudentData {
  student_assessments: StudentAssessment[];
  attempts: StudentAttempt[];
  actions: PaginatedData<StudentAction>;
  violations: PaginatedData<StudentAction>; // тот же тип, что и actions
  identities: IdentityPhoto[];
  credibility: number;
  results_chart: any[];
  is_started: boolean;
  is_finished: boolean;
  available_time: number;
  progress: {
    components: number;
    chapters: number;
    total: number;
  };
  quiz_components: QuizComponent[];
  results?: unknown[];
}

export interface AssignmentStudentDataResponse {
  status: "success" | string;
  status_code: string;
  entity: AssignmentStudentData; // ✅ Используем уже созданный интерфейс
}
