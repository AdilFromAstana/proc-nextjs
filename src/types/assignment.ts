import { AssignmentDetail, ProctoringSettings } from "./assignment/detail";
import { Student } from "./students";

// Базовые интерфейсы из API данных
export interface AssignmentOwner {
  id: string;
  school_id: number;
  external_id: string | null;
  group: string;
  firstname: string;
  lastname: string;
  patronymic: string | null;
  username: string | null;
  email: string;
  phone: string | null;
  photo: string | null;
  photo_thumb: {
    big: string | null;
    medium: string | null;
    small: string | null;
  } | null;
  color: string | null;
  description: string | null;
  is_need_complete_challenge: boolean;
  is_online: boolean;
}

export interface AssignmentClass {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  color: string;
}

export interface AssignmentQuiz {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  color: string;
}

export interface AssignmentProgress {
  components: number;
  chapters: number;
  total: number;
}

export interface AssignmentSettings {
  certificate: {
    issue_type: string;
    show_report: boolean;
  };
  score_settings?: Record<string, any>; // Добавлено
  webinar_settings: any;
  scenario_settings: {
    conditions: any[];
  };
  component_settings: {
    all: {
      shuffle: boolean;
      conditions: any[];
      per_student: number;
      variant_split: boolean;
    };
  };
  proctoring_settings: ProctoringSettings;
}

export interface AssignmentEntity {
  id: string;
  external_id: string | null;
  class_id: number;
  owner_id: number;
  lesson_id: number | null;
  quiz_id: number | null;
  webinar_id: number | null;
  chat_id: number;
  invite_code_id: string | null;
  product_id: string | null;
  certificate_id: string | null;
  external_url: string | null;
  status: string;
  type: string;
  access_type: string;
  name: string;
  description: string | null;
  complete_time: number;
  max_attempts: number;
  points_method_type: string;
  settings: AssignmentSettings;
  starting_at: string;
  starting_at_type: string;
  ending_at: string;
  ending_at_type: string;
  observer: string | null;
  application: string;
  is_points_method: number;
  is_straight_answer: number;
  is_show_answers_after_finished: number;
  is_show_results_after_finished: number;
  is_hide_users: number;
  is_comments: number;
  is_chat: number;
  is_invite_code: number;
  is_certificate: boolean;
  is_proctoring: number;
  is_webinar: number;
  is_public: number;
  is_unlisted: number;
  is_random_assessment: number;
  progress: AssignmentProgress;
  owner: AssignmentOwner;
  invite_code: string | null;
  class: AssignmentClass;
  quizzes: AssignmentQuiz[];
  lessons: any[];
  reviewers: any[];
  rooms: any[];
  product: any;
}

// Создаем хелпер для адаптации API данных
export const adaptStudentListFromApi = (apiData: any): StudentList => {
  const entities = apiData.entities || apiData;
  const data = entities.data || [];

  // Создаем StudentList с методами как в Vue
  const studentList = data.map((item: any) => {
    // Адаптируем student
    const student: Student = {
      id: item.id.toString(),
      user_id: item.user_id,
      points: item.points,
      results: item.results.map((result: any) => ({
        ...result,
        id: result.id.toString(),
        assignment_id: result.assignment_id,
        assignment_attempt_id: result.assignment_attempt_id,
        student_id: result.student_id,
        assessment_id: result.assessment_id,
        component_id: result.component_id,
      })),
      scores: item.scores || [],
      attempts: item.attempts.map((attempt: any) => ({
        ...attempt,
        id: attempt.id,
        results: attempt.results.map((result: any) => ({
          ...result,
          id: result.id.toString(),
          assignment_id: result.assignment_id,
          assignment_attempt_id: result.assignment_attempt_id,
          student_id: result.student_id,
          assessment_id: result.assessment_id,
          component_id: result.component_id,
        })),
      })),
      user: {
        ...item.user,
        id: item.user.id.toString(),
      },
      credibility: item.credibility,
    };
    return student;
  }) as Student[];

  // Добавляем методы списка как в Vue
  const enhancedList = studentList as StudentList;

  enhancedList.currentPage = entities.current_page;
  enhancedList.lastPage = entities.last_page;
  enhancedList.perPage = entities.per_page;
  enhancedList.totalPages = entities.total;

  enhancedList.getTotalPages = () => {
    return entities.last_page || 1;
  };

  return enhancedList;
};

// Обновляем существующие интерфейсы для совместимости
export interface User {
  id: string;
  firstname?: string;
  lastname?: string;
  photo?: string;
  is_online?: boolean;
  email?: string;
  phone?: string;
  color?: string;
  group?: string;
}

export interface AssignmentResult {
  id: number;
  className?: string;
  points?: number | undefined | null;
  // другие поля
}

export interface AssignmentReviewerResult extends AssignmentResult {
  // дополнительные поля для ревьюера
}

export interface Attempt {
  id: number;
  status: string;
  results: AssignmentResult[];
  variant?: any;
  points?: number;
}

export type StudentList = Student[] & {
  totalPages?: number;
  currentPage?: number;
  lastPage?: number;
  perPage?: number;
  getTotalPages?: () => number;
};

// Функции-хелперы
export const isPointSystemEnabled = (assignment: AssignmentDetail): boolean => {
  return assignment.is_points_method === 1;
};

export const isProctoringEnabled = (assignment: AssignmentDetail): boolean => {
  return assignment.is_proctoring === 1;
};

export const isAssignmentCompleted = (
  assignment: AssignmentDetail
): boolean => {
  return assignment.status === "completed";
};

export const getStudentFullName = (student: Student): string => {
  if (student.user.firstname && student.user.lastname) {
    return `${student.user.firstname} ${student.user.lastname}`;
  }
  return "Неизвестный студент";
};

export const getActiveAttempt = (student: Student): Attempt | null => {
  if (!student.attempts) return null;
  return (
    student.attempts.find((attempt) => attempt.status === "active") || null
  );
};

export const getStudentScore = (student: Student): string | number | null => {
  return student.scores?.[0] || null;
};

export const getReviewerResult = (
  student: Student,
  result: AssignmentResult
): AssignmentReviewerResult => {
  if (student.reviewer_results) {
    const existing = student.reviewer_results.find((rr) => rr.id === result.id);
    if (existing) return existing;
  }

  return {
    ...result,
    id: result.id,
  } as AssignmentReviewerResult;
};

// Типы для Viewer
export type ViewerType = "owner" | "reviewer" | "proctor" | null;

// Основной интерфейс для AssignmentStudentListComponent
export interface AssignmentStudentListComponentProps {
  assignment: AssignmentDetail;
  students?: Student[];
  page?: number;
  totalPages?: number;
  loading?: boolean;
  viewer?: ViewerType;
  isOwner?: boolean;
  isReviewer?: boolean;
  isProctor?: boolean;
  isManager?: boolean;
  onStudentSelected?: (student: Student) => void;
  onSetStudentListPage?: (page: number) => void;
  onStudentAttemptSelected?: (student: Student, attempt: Attempt) => void;
  onStudentAttemptUpdated?: (student: Student) => void;
  showStudentSettings?: (student: Student) => void;
  copyReportUrl?: (student: Student) => void;
  showLoader?: () => void;
  hideLoader?: () => void;
  sortBy?: string;
  onSortByChange?: (sortBy: string) => void;
}

export type AssignmentStudentListComponentNotReqProps =
  Partial<AssignmentStudentListComponentProps>;

export interface AssignmentStudentListRef {
  showLoader: () => void;
  hideLoader: () => void;
}

// Типы для сортировки
export interface SortOption {
  id: string;
  name: string;
}

// Хелперы для фильтрации
export const getStudentFilterFields = (
  assignment: AssignmentDetail
): string[] => {
  const fields = [
    "id",
    "user_id",
    "points",
    "results",
    "scores",
    "attempts:id",
    "attempts:status",
    "attempts:results",
    "attempts:variant",
    "attempts:points",
    "user:id",
    "user:photo",
    "user:color",
    "user:firstname",
    "user:lastname",
    "user:is_online",
  ];

  if (isProctoringEnabled(assignment)) {
    fields.push("credibility");
  }

  if (assignment.reviewers && assignment.reviewers.length > 0) {
    fields.push("reviewer_results");
    fields.push("reviewer_scores");
  }

  return fields;
};

export const getStudentFilterParams = (
  assignmentId: string,
  sortBy: string
): Record<string, any> => {
  return {
    assignment_id: assignmentId,
    sortBy: sortBy,
  };
};

export const getViewerType = (
  assignment: AssignmentDetail,
  currentUser: User,
  isManager: boolean,
  isProctor: boolean
): ViewerType => {
  if (assignment.owner_id.toString() === currentUser.id || isManager) {
    return "owner";
  }

  if (
    assignment.reviewers?.find(
      (reviewer: any) => reviewer.user_id?.toString() === currentUser.id
    )
  ) {
    return "reviewer";
  }

  if (isProctor) {
    return "proctor";
  }

  return null;
};
