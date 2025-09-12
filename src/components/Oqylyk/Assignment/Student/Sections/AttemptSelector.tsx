// components/AttemptSelector.tsx
import React from "react";

interface AttemptSelectorProps {
  attempts: any[];
  currentAttempt: any;
  onAttemptSelected: (attempt: any) => void;
}

const AttemptSelector: React.FC<AttemptSelectorProps> = ({
  attempts,
  currentAttempt,
  onAttemptSelected,
}) => {
  if (attempts.length <= 1) return null;

  return (
    <div className="student-attempt-list flex gap-2 p-2 bg-gray-100 rounded w-fit absolute right-0 top-0">
      {attempts.map((attempt, index) => (
        <button
          key={`student-attempt-${attempt.id}`}
          className={`student-attempt-item px-3 py-2 rounded ${
            currentAttempt && currentAttempt.id === attempt.id
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300"
          }`}
          onClick={(e) => {
            e.preventDefault();
            onAttemptSelected(attempt);
          }}
        >
          №{index + 1}
        </button>
      ))}
    </div>
  );
};

export default AttemptSelector;
