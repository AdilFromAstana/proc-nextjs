// components/Assignment/TeacherReviewer/SelectedTeacherDisplay.tsx
import React from "react";
import { Teacher } from "@/types/assignment/teacher";

interface SelectedTeacherDisplayProps {
  selectedTeacher: Teacher | null;
  getUserInitials: (teacher: Teacher) => string;
}

const SelectedTeacherDisplay: React.FC<SelectedTeacherDisplayProps> =
  React.memo(({ selectedTeacher, getUserInitials }) => {
    if (!selectedTeacher) return null;

    return (
      <div className="mt-4 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0"
          style={{
            backgroundColor: selectedTeacher.user?.color
              ? `#${selectedTeacher.user.color}`
              : "#f97316",
          }}
        >
          {getUserInitials(selectedTeacher)}
        </div>
        <span>
          {selectedTeacher.user?.firstname} {selectedTeacher.user?.lastname}
        </span>
      </div>
    );
  });

SelectedTeacherDisplay.displayName = "SelectedTeacherDisplay";
export default SelectedTeacherDisplay;
