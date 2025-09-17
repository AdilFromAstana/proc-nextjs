// components/Assignment/StudentAttemptList.tsx
import React from "react";

interface StudentAttemptListProps {
  attempts?: any[];
  currentAttempt: any;
  handleAttemptSelected: (attempt: any) => void;
}

const StudentAttemptList: React.FC<StudentAttemptListProps> = ({
  attempts,
  currentAttempt,
  handleAttemptSelected,
}) => {
  if (!attempts || attempts.length <= 1) {
    return null;
  }

  return (
    <div className="inline-flex flex-nowrap flex-row justify-center items-start absolute top-[10px] right-[10px] z-10">
      {attempts.map((attempt: any, index: number) => {
        const isActive = currentAttempt && currentAttempt.id === attempt.id;

        const baseClasses = `
          cursor-pointer
          text-xs font-semibold
          w-[30px] h-[30px] leading-[30px]
          rounded-[5px]
          mx-[5px]
          text-center
          whitespace-nowrap overflow-hidden text-ellipsis
          transition-shadow duration-150
        `;

        const activeClasses = `
          text-white bg-[#1a73e8]
          shadow-[0_1px_1px_0_rgba(0,0,0,0.5)]
          hover:shadow-[0_1px_1px_0_rgba(0,0,0,0.5)]
        `;

        const inactiveClasses = `
          text-[#333] bg-white
          shadow-[0_1px_1px_0_rgba(0,0,0,0.3)]
          hover:shadow-[0_1px_1px_0_rgba(0,0,0,0.5)]
        `;

        const className = `${baseClasses} ${
          isActive ? activeClasses : inactiveClasses
        }`;

        return (
          <button
            key={`student-attempt-${attempt.id}`}
            onClick={() => handleAttemptSelected(attempt)}
            className={className.trim().replace(/\s+/g, " ")}
          >
            №{index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default StudentAttemptList;
