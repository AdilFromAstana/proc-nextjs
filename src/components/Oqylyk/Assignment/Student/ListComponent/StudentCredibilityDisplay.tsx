// components/Student/StudentCredibilityDisplay.tsx
import { AssignmentDetail } from "@/types/assignment/detail";
import { Student } from "@/types/students";
import { isProctoringEnabled } from "@/utils/assignmentHelpers";
import React from "react";

interface StudentCredibilityDisplayProps {
  student: Student;
  assignment: AssignmentDetail;
}

const StudentCredibilityDisplay: React.FC<StudentCredibilityDisplayProps> = ({
  student,
  assignment,
}) => {
  if (!isProctoringEnabled(assignment) || student.credibility === undefined) {
    return null;
  }

  // Определение классов достоверности (как в Vue, но с Tailwind)
  const getCredibilityClasses = (credibility: number) => {
    if (credibility === -1) return "bg-gray-300 text-gray-500";
    if (credibility >= 0 && credibility <= 10) return "bg-[#d14141]";
    if (credibility > 10 && credibility <= 30) return "bg-[#d17d41]";
    if (credibility > 30 && credibility <= 60) return "bg-[#ebcf34]";
    if (credibility > 60 && credibility <= 70) return "bg-[#e7f04a]";
    if (credibility > 70) return "bg-[#bfe05c]";
    return "bg-gray-300";
  };

  const getLabelClasses = (credibility: number) => {
    if (credibility === -1) return "text-gray-500 text-lg";
    return "text-white";
  };

  const credibilityClasses = getCredibilityClasses(student.credibility);
  const labelClasses = getLabelClasses(student.credibility);

  return (
    <div className="assignment-student-result-toolbar inline-block align-middle whitespace-nowrap first:ml-0">
      <div
        className={`
          assignment-credibility-wrap
          w-[25px] h-[25px] leading-[27px] rounded-full text-center
          text-white
          ${credibilityClasses}
        `}
      >
        <div
          className={`
            assignment-credibility-label
            text-[0.7rem] font-bold
            ${labelClasses}
            ${student.credibility === -1 ? "text-lg" : ""}
          `}
        >
          {student.credibility === -1 ? "?" : student.credibility}
        </div>
      </div>
    </div>
  );
};

export default StudentCredibilityDisplay;
