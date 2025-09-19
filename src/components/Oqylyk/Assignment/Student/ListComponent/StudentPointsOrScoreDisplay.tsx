// components/Student/StudentPointsOrScoreDisplay.tsx
import { AssignmentDetail } from "@/types/assignment/detail";
import { Student } from "@/types/students";
import { isPointSystemEnabled } from "@/utils/assignmentHelpers";
import React from "react";

interface StudentPointsOrScoreDisplayProps {
  student: Student;
  assignment: AssignmentDetail;
}

const StudentPointsOrScoreDisplay: React.FC<
  StudentPointsOrScoreDisplayProps
> = ({ student, assignment }) => {
  // Получение активной попытки
  const getActiveAttempt = () => {
    if (student.attempts && student.attempts.length > 0) {
      return (
        student.attempts.find((attempt: any) => attempt.status === "active") ||
        student.attempts[0]
      );
    }
    return null;
  };

  // Получение оценки студента
  const getStudentScore = () => {
    // Используем существующую функцию getScore если она есть
    if (typeof (student as any).getScore === "function") {
      return (student as any).getScore();
    }

    // Или старую логику
    if (student.scores && student.scores.length > 0) {
      const score = student.scores[0];
      return score.score || 0;
    }
    return 0;
  };

  if (isPointSystemEnabled(assignment)) {
    const attempt = getActiveAttempt();

    // NEW, IF ATTEMPT EXISTS
    if (attempt) {
      return (
        <div
          className={`
            assignment-points-wrap
            inline-flex items-center justify-center
            w-[25px] h-[25px] leading-[20px]
            rounded-full border-[3px] border-solid text-center
            ${
              attempt.points && attempt.points > 0
                ? "active text-[#0277bd] border-[#0277bd]"
                : "text-[#EEE] border-[#EEE]"
            }
          `}
        >
          <div className="assignment-points-label text-[0.6rem] font-bold text-inherit">
            {attempt.points || 0}
          </div>
        </div>
      );
    }

    // OLD, WITHOUT ATTEMPTS
    return (
      <div
        className={`
          assignment-points-wrap
          inline-flex items-center justify-center
          w-[25px] h-[25px] leading-[20px]
          rounded-full border-[3px] border-solid text-center
          ${
            student.points && student.points > 0
              ? "active text-[#0277bd] border-[#0277bd]"
              : "text-[#EEE] border-[#EEE]"
          }
        `}
      >
        <div className="assignment-points-label text-[0.6rem] font-bold text-inherit">
          {student.points || 0}
        </div>
      </div>
    );
  }

  // SCORE
  const score = getStudentScore();
  return (
    <div
      className={`
        assignment-score-wrap
        score-${score}
        inline-flex items-center justify-center
        w-[25px] h-[25px] leading-[20px]
        rounded-full border-[3px] border-solid text-center
        ${
          score === 1
            ? "text-[#d14141] border-[#d14141]"
            : score === 2
            ? "text-[#d17d41] border-[#d17d41]"
            : score === 3
            ? "text-[#ebcf34] border-[#ebcf34]"
            : score === 4
            ? "text-[#e7f04a] border-[#e7f04a]"
            : score === 5
            ? "text-[#bfe05c] border-[#bfe05c]"
            : "text-[#EEE] border-[#EEE]"
        }
      `}
    >
      <div className="assignment-score-label text-[0.8rem] font-bold text-inherit">
        {score ? score : "0"}
      </div>
    </div>
  );
};

export default StudentPointsOrScoreDisplay;
