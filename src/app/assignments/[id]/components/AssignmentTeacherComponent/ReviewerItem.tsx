// components/Assignment/TeacherReviewer/ReviewerItem.tsx
import React from "react";
import { Teacher } from "@/types/assignment/teacher";

interface ReviewerItemProps {
  reviewer: Teacher;
  isSelected: boolean;
  onSelect: (reviewer: Teacher) => void;
  getUserInitials: (teacher: Teacher) => string;
}

const ReviewerItem: React.FC<ReviewerItemProps> = React.memo(
  ({ reviewer, isSelected, onSelect, getUserInitials }) => {
    return (
      <div
        className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
          isSelected
            ? "bg-blue-100 border border-blue-300"
            : "hover:bg-gray-100"
        }`}
        onClick={() => onSelect(reviewer)}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0"
          style={{
            backgroundColor: reviewer.user?.color
              ? `#${reviewer.user.color}`
              : "#f97316",
          }}
        >
          {getUserInitials(reviewer)}
        </div>
        <div className="text-left overflow-hidden min-w-0">
          <div className="font-medium truncate">
            {reviewer.user?.firstname} {reviewer.user?.lastname}
          </div>
          {reviewer.user?.email && (
            <div className="text-xs text-gray-500 truncate">
              {reviewer.user.email}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ReviewerItem.displayName = "ReviewerItem";
export default ReviewerItem;
