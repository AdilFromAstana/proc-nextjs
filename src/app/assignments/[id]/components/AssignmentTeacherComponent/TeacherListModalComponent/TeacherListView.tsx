// components/Oqylyq/Teacher/ListModalComponent/TeacherListView.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/assignment/teacher";
import TeacherItem from "./TeacherItem";

interface TeacherListViewProps {
  users: Teacher[];
  selectedUsers: Teacher[];
  multiple: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  onSelectUser: (user: Teacher) => void;
  onRetry: () => void;
  getUserInitials: (user: Teacher) => string;
}

const TeacherListView: React.FC<TeacherListViewProps> = ({
  users,
  selectedUsers,
  multiple,
  isLoading,
  isError,
  errorMessage,
  onSelectUser,
  onRetry,
  getUserInitials,
}) => {
  if (isLoading) {
    return (
      <div className="flex-grow overflow-y-auto mb-4 flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (isError && errorMessage) {
    return (
      <div className="flex-grow overflow-y-auto mb-4 flex flex-col items-center justify-center text-red-500">
        <p>{errorMessage}</p>
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">
          Повторить попытку
        </Button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex-grow overflow-y-auto mb-4 flex items-center justify-center text-gray-500">
        Список пользователей пуст.
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto mb-4">
      <ul className="space-y-1">
        {users.map((user) => {
          const isSelected = multiple
            ? selectedUsers.some((u) => u.id === user.id)
            : false;

          return (
            <TeacherItem
              key={user.id}
              user={user}
              isSelected={isSelected}
              onSelect={onSelectUser}
              getUserInitials={getUserInitials}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default TeacherListView;
