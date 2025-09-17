// components/Student/StudentCredibilityDisplay.tsx
import { AssignmentDetail } from "@/types/assignment/detail";
import { Student } from "@/types/students";
import React from "react";

interface StudentCredibilityDisplayProps {
  student: Student;
  assignment: AssignmentDetail;
}

const StudentCredibilityDisplay: React.FC<StudentCredibilityDisplayProps> = ({
  student,
  assignment,
}) => {
  // Проверка включено ли прокторинг
  const isProctoringEnabled = (assignment: any) => {
    return assignment?.isProctoringEnabled || false;
  };

  if (!isProctoringEnabled(assignment) || student.credibility === undefined) {
    return null;
  }

  // Определение класса достоверности
  const getCredibilityClass = (credibility: number) => {
    if (credibility === -1) return "credibility-empty";
    if (credibility >= 0 && credibility <= 10) return "credibility-5";
    if (credibility > 10 && credibility <= 30) return "credibility-4";
    if (credibility > 30 && credibility <= 60) return "credibility-3";
    if (credibility > 60 && credibility <= 70) return "credibility-2";
    if (credibility > 70) return "credibility-1";
    return "credibility-empty";
  };

  // Определение цвета фона
  const getBackgroundColorClass = (credibility: number) => {
    if (credibility === -1) return "bg-gray-300";
    if (credibility >= 0 && credibility <= 10) return "bg-[#d14141]";
    if (credibility > 10 && credibility <= 30) return "bg-[#d17d41]";
    if (credibility > 30 && credibility <= 60) return "bg-[#ebcf34]";
    if (credibility > 60 && credibility <= 70) return "bg-[#e7f04a]";
    if (credibility > 70) return "bg-[#bfe05c]";
    return "bg-gray-300";
  };

  // Определение цвета текста
  const getTextColorClass = (credibility: number) => {
    if (credibility === -1) return "text-gray-500";
    return "text-white";
  };

  const credibilityClass = getCredibilityClass(student.credibility);
  const backgroundColorClass = getBackgroundColorClass(student.credibility);
  const textColorClass = getTextColorClass(student.credibility);

  return (
    <div
      className={`
        assignment-credibility-wrap ${credibilityClass}
        inline-flex items-center justify-center
        w-[25px] h-[25px] leading-[27px]
        rounded-full text-center
        ${backgroundColorClass}
      `}
    >
      <div
        className={`
          assignment-credibility-label
          text-[0.7rem] font-bold
          ${textColorClass}
          ${student.credibility === -1 ? "text-lg" : ""}
        `}
      >
        {student.credibility === -1 ? "?" : student.credibility}
      </div>
    </div>
  );
};

export default StudentCredibilityDisplay;
