// components/Oqylyq/Teacher/ListModalComponent/TeacherItem.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/assignment/teacher";

interface TeacherItemProps {
  user: Teacher;
  isSelected: boolean;
  onSelect: (user: Teacher) => void;
  getUserInitials: (user: Teacher) => string;
}

const TeacherItem: React.FC<TeacherItemProps> = ({
  user,
  isSelected,
  onSelect,
  getUserInitials,
}) => {
  return (
    <li>
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className={`w-full justify-start h-auto py-3 px-4 ${
          isSelected
            ? "bg-blue-100 border border-blue-300 hover:bg-blue-200"
            : "hover:bg-gray-100"
        }`}
        onClick={() => onSelect(user)}
      >
        <div className="flex items-center w-full">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0`}
            style={{
              backgroundColor: user?.user.color
                ? `#${user?.user.color}`
                : "#f97316",
            }}
          >
            {getUserInitials(user)}
          </div>
          <div className="text-left overflow-hidden min-w-0">
            <div className="font-medium truncate">
              {user.user?.firstname} {user.user?.lastname}
            </div>
            {user.user?.email && (
              <div className="text-xs text-gray-500 truncate">
                {user.user.email}
              </div>
            )}
          </div>
        </div>
      </Button>
    </li>
  );
};

export default TeacherItem;
