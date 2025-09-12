// types/student.ts

import IdentificationList from "@/components/Oqylyk/Assignment/Student/IdentificationList";
import {
  AssignmentResult,
  AssignmentReviewerResult,
  Attempt,
} from "./assignment";

// Базовые интерфейсы данных (plain objects)
export interface User {
  id?: number;
  firstname?: string;
  lastname?: string;
  photo?: string;
  is_online?: boolean;
  email?: string;
  phone?: string;
  color?: string;
}

export interface Student {
  id: number;
  user_id: number;
  user: User;
  points?: number;
  results?: AssignmentResult[];
  scores?: any[];
  attempts?: Attempt[];
  identities?: IdentificationList[];
  credibility?: number;
  reviewer_results?: AssignmentReviewerResult[];
  reviewer_scores?: any[];
}

// Функции-хелперы для работы со студентами (функциональный подход)
export const getStudentFullName = (student: Student): string => {
  if (student.user.firstname && student.user.lastname) {
    return `${student.user.firstname} ${student.user.lastname}`;
  }
  return "Неизвестный студент";
};

export const getStudentPhoto = (student: Student): string | undefined => {
  return student.user.photo;
};

export const isStudentOnline = (student: Student): boolean => {
  return !!student.user.is_online;
};

export const getStudentColor = (student: Student): string | undefined => {
  return student.user.color;
};

export const getActiveAttempt = (student: Student): Attempt | null => {
  if (!student.attempts) return null;
  return (
    student.attempts.find((attempt) => attempt.status === "active") || null
  );
};

export const getStudentScore = (student: Student): string | number | null => {
  // Логика получения оценки
  return null;
};

export const getReviewerResult = (student: Student, result: any): any => {
  // Логика получения результата ревьюера
  return result;
};

// Типы для списка студентов
export type StudentList = Student[] & {
  totalPages?: number;
  currentPage?: number;
};

// Основной интерфейс для пропсов
export interface StudentListComponentProps {
  /** Список студентов для отображения */
  entities?: StudentList;

  /** Разрешить выбор студентов */
  selectable?: boolean;

  /** Разрешить множественный выбор */
  multiple?: boolean;

  /** Показывать пагинацию */
  pagination?: boolean;

  /** Текущая страница */
  page?: number;

  /** Общее количество страниц */
  totalPages?: number;

  /** Количество скелетонов при загрузке */
  loadingPlaceholderCount?: number;

  /** ID расширенного студента (для отображения дополнительной информации) */
  extendedStudentId?: string | null;

  /** Дополнительные CSS классы */
  className?: string;

  /** Callback при смене страницы */
  onPaged?: (page: number) => void;

  /** Callback при клике на студента */
  onItemClicked?: (student: Student) => void;

  /** Callback при выборе студентов */
  onSelected?: (selectedStudents: Student[]) => void;

  /** Callback для отображения основных данных студента */
  renderData?: (student: Student) => React.ReactNode;

  /** Callback для отображения дополнительной информации */
  renderAdditional?: (student: Student) => React.ReactNode;

  /** Callback для отображения мета-информации */
  renderMeta?: (student: Student) => React.ReactNode;
}

// Интерфейс для ref методов
export interface StudentListRef {
  /** Показать индикатор загрузки */
  showLoader: () => void;

  /** Скрыть индикатор загрузки */
  hideLoader: () => void;

  /** Выбрать всех студентов (только для multiple=true) */
  selectAll: () => void;

  /** Снять выбор со всех студентов */
  deselectAll: () => void;
}

// Пропсы без обязательных полей
export type StudentListNotReqProps = Partial<StudentListComponentProps>;
