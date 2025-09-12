// components/ScoringSection.tsx
import React from "react";
import { faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import SectionWrapper from "../../UI/SectionWrapper";

interface ScoringSectionProps {
  assignment: any;
  student: any;
  isOwner: boolean;
  currentAttempt: any;
  currentScore: number;
  disabled: boolean;
  updateScore: (value: number) => void;
  scores: any;
  reviewerScores: any;
  isReviewer: boolean;
}

const ScoringSection: React.FC<ScoringSectionProps> = ({
  assignment,
  student,
  isOwner,
  currentAttempt,
  currentScore,
  disabled,
  updateScore,
  scores,
  reviewerScores,
  isReviewer,
}) => {
  if (!isOwner) return null;

  // POINTS SECTION
  if (assignment.isPointSystemEnabled?.() && !assignment.isExternalType?.()) {
    return (
      <SectionWrapper
        icon={faStarHalfAlt}
        iconColor="yellow"
        title="Баллы"
        hint={disabled ? "Баллы отключены" : "Подсказка по баллам"}
      >
        <div className="total-points flex items-center">
          <span className="points text-2xl font-bold text-blue-600">
            {student.getPoints?.(
              assignment.pointSystemMethod?.(),
              currentAttempt ? currentAttempt.id : null
            )}
          </span>
          <span className="label text-gray-600 ml-2">баллов</span>
        </div>
      </SectionWrapper>
    );
  }

  // SCORES SECTION
  return (
    <SectionWrapper
      icon={faStarHalfAlt}
      iconColor="orange"
      title="Оценка"
      hint={disabled ? "Оценка отключена" : "Подсказка по оценке"}
    >
      <div className="score-list flex gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            className={`score-item w-12 h-12 rounded-full flex items-center justify-center font-bold ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : currentScore === score
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (!disabled) updateScore(score);
            }}
            disabled={disabled}
          >
            <div className="score-label">{score}</div>
          </button>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ScoringSection;
