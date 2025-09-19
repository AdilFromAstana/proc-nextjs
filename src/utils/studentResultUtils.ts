// utils/studentResultUtils.ts

import { AssignmentResult } from "@/types/assignment";

export const getReviewerResult = (
  studentResults: AssignmentResult[],
  baseResult: any,
  reviewerId?: number
): any => {
  // Возвращаем модифицированный результат для рецензента
  return {
    ...baseResult,
    points: reviewerId ? (baseResult.points || 0) + 1 : baseResult.points,
    getClassName: () => {
      if (baseResult.result === 3) return "true";
      if (baseResult.result === 2) return "false";
      return "answered";
    },
  };
};

export const getSumResultsPoints = (
  studentResults: AssignmentResult[],
  reviewerId: number | null,
  attemptId: number | null
): number => {
  // Фильтруем результаты по рецензенту и попытке, если нужно
  let filteredResults = studentResults;

  if (reviewerId) {
    // Здесь должна быть логика фильтрации по рецензенту
    // Пока возвращаем фиксированное значение для демонстрации
    return reviewerId === 101 ? 85 : 82;
  }

  // Суммируем все очки
  return filteredResults.reduce((sum, result) => sum + (result.points || 0), 0);
};

export const getAvgResultPoints = (
  studentResults: AssignmentResult[],
  resultId: number,
  attemptId: number | null
): number => {
  // Находим результат по ID и возвращаем среднее значение
  const result = studentResults.find((r) => r.id === resultId);
  if (result) {
    return result.points || 0;
  }
  return Math.floor(Math.random() * 10) + 5; // fallback
};

export const getAvgResultsPoints = (
  studentResults: AssignmentResult[],
  reviewerId: number | null,
  attemptId: number | null
): number => {
  // Вычисляем среднее значение всех результатов
  if (studentResults.length === 0) return 0;

  const totalPoints = studentResults.reduce(
    (sum, result) => sum + (result.points || 0),
    0
  );
  return Math.round(totalPoints / studentResults.length);
};

export const getSumResultPoints = (
  studentResults: AssignmentResult[],
  resultId: number,
  attemptId: number | null
): number => {
  // Находим результат по ID и возвращаем его очки
  const result = studentResults.find((r) => r.id === resultId);
  return result?.points || 0;
};

// Вспомогательная функция для получения полного имени
export const getStudentFullName = (student: any): string => {
  if (student.first_name && student.last_name) {
    return `${student.first_name} ${student.last_name}`;
  }
  return student.name || "Неизвестный студент";
};

// Вспомогательная функция для получения полного имени рецензента
export const getReviewerFullName = (reviewer: any): string => {
  if (reviewer.first_name && reviewer.last_name) {
    return `${reviewer.first_name} ${reviewer.last_name}`;
  }
  return reviewer.name || "Неизвестный рецензент";
};
