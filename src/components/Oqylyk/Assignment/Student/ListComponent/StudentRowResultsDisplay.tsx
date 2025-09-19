// components/Student/StudentAttemptResultsDisplay.tsx
import { AssignmentDetail } from "@/types/assignment/detail";
import { Student } from "@/types/students";
import { isPointSystemEnabled } from "@/utils/assignmentHelpers";
import React from "react";

interface StudentAttemptResultsDisplayProps {
  student: Student;
  assignment: AssignmentDetail;
  isReviewer: boolean;
  isOwner: boolean;
  isManager: boolean;
  isProctor: boolean;
}

const StudentAttemptResultsDisplay: React.FC<
  StudentAttemptResultsDisplayProps
> = ({ student, assignment, isReviewer, isOwner, isManager, isProctor }) => {
  // Проверка наличия попыток
  const hasAttempts =
    student.attempts && student.attempts && student.attempts.length > 0;

  // Функция для получения цвета результата
  const getResultColor = (result: number) => {
    switch (result) {
      case 0: // UNDEFINED
        return "bg-gray-300";
      case 1: // ANSWERED
        return "bg-blue-400";
      case 2: // FALSE
        return "bg-red-500";
      case 3: // TRUE
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  // Функция для получения класса квадрата
  const getSquareClass = (className: string, hasPoints: boolean = false) => {
    const baseClasses =
      "w-[20px] h-[20px] rounded-sm border border-gray-200 inline-block";
    const pointsClass = hasPoints ? "border-2 border-yellow-400" : "";
    return `${baseClasses} ${className} ${pointsClass}`;
  };

  // Функция для получения результата для ревьюера (заглушка)
  const getReviewerResult = (result: any) => {
    // Здесь должна быть настоящая логика получения результата для ревьюера
    // Пока возвращаем оригинальный результат как заглушку
    return {
      ...result,
      getClassName: () => getResultColor(result.result),
      points: result.points,
    };
  };

  // Определение, кто может видеть результаты как ревьюер
  // Обычно это isReviewer, но может быть расширено для isOwner или isManager
  const shouldShowReviewerResults = isReviewer;

  // Рендер результатов с попытками
  const renderAttemptResults = () => {
    if (!hasAttempts) return null;

    return (
      <div className="assignment-student-result-toolbar assignment-student-attempt-list">
        {student.attempts!!.map((attempt: any) => {
          const isActive = attempt.status === "active";

          return (
            <div
              key={`attempt-${attempt.id}`}
              className={`assignment-result-list ${isActive ? "active" : ""} flex items-center`}
            >
              {attempt.results?.map((result: any, index: number) => {
                if (shouldShowReviewerResults) {
                  const reviewerResult = getReviewerResult(result);
                  const hasPoints =
                    isPointSystemEnabled(assignment) &&
                    reviewerResult.points !== null &&
                    reviewerResult.points !== undefined;
                  const className =
                    typeof reviewerResult.getClassName === "function"
                      ? reviewerResult.getClassName()
                      : getResultColor(reviewerResult.result);

                  return (
                    <div
                      key={`reviewer-result-${attempt.id}-${index}`}
                      className={getSquareClass(className, hasPoints)}
                      title={
                        hasPoints
                          ? `Points: ${reviewerResult.points}`
                          : undefined
                      }
                    />
                  );
                } else {
                  const hasPoints =
                    isPointSystemEnabled(assignment) &&
                    result.points !== null &&
                    result.points !== undefined;
                  const className =
                    typeof result.getClassName === "function"
                      ? result.getClassName()
                      : getResultColor(result.result);

                  return (
                    <div
                      key={`owner-result-${attempt.id}-${index}`}
                      className={getSquareClass(className, hasPoints)}
                      title={hasPoints ? `Points: ${result.points}` : undefined}
                    />
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // Рендер старых результатов (без попыток)
  const renderOldResults = () => {
    const results = student.results;
    if (!results || results.length === 0) return null;

    return (
      <div className="assignment-result-list active flex items-center align-center">
        {results.map((result: any, index: number) => {
          if (shouldShowReviewerResults) {
            const reviewerResult = getReviewerResult(result);
            const hasPoints =
              isPointSystemEnabled(assignment) &&
              reviewerResult.points !== null &&
              reviewerResult.points !== undefined;
            const className =
              typeof reviewerResult.getClassName === "function"
                ? reviewerResult.getClassName()
                : getResultColor(reviewerResult.result);

            return (
              <div
                key={`old-reviewer-result-${index}`}
                className={getSquareClass(className, hasPoints)}
                title={
                  hasPoints ? `Points: ${reviewerResult.points}` : undefined
                }
              />
            );
          } else {
            const hasPoints =
              isPointSystemEnabled(assignment) &&
              result.points !== null &&
              result.points !== undefined;
            const className =
              typeof result.getClassName === "function"
                ? result.getClassName()
                : getResultColor(result.result);

            return (
              <div
                key={`old-owner-result-${index}`}
                className={getSquareClass(className, hasPoints)}
                title={hasPoints ? `Points: ${result.points}` : undefined}
              />
            );
          }
        })}
      </div>
    );
  };

  // Основной рендер
  return hasAttempts ? renderAttemptResults() : renderOldResults();
};

export default StudentAttemptResultsDisplay;
