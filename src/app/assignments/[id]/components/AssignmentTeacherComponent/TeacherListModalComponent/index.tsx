// components/Oqylyq/Teacher/ListModalComponent/index.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTeachers, useCreateTeacher } from "@/hooks/useTeachers";
import { Teacher, TeacherCreateData } from "@/types/assignment/teacher";
import TeacherListView from "./TeacherListView";
import TeacherCreateView from "./TeacherCreateView";
import SearchInput from "./SearchInput";

interface TeacherListModalComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  multiple: boolean;
  onSelect: (user: Teacher | Teacher[]) => void;
  exceptedEntities?: Teacher[];
}

const TeacherListModalComponent: React.FC<TeacherListModalComponentProps> = ({
  open,
  onOpenChange,
  multiple,
  onSelect,
  exceptedEntities = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Teacher[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [localCreateError, setLocalCreateError] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: teachersData,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useTeachers({
    nullable: 0,
    extended: false,
    page: 1,
    ...(debouncedSearchTerm ? { q: debouncedSearchTerm } : {}),
  });

  const {
    mutate: createTeacher,
    isPending: isCreatingLoading,
    isError: isCreateError,
    error: createError,
  } = useCreateTeacher();

  const allUsersFromApi = teachersData?.entities?.data || [];
  const exceptedIds = new Set(exceptedEntities.map((u) => u.id));
  const filteredUsers = allUsersFromApi.filter(
    (user: Teacher) => !exceptedIds.has(user.id)
  );

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setSelectedUsers([]);
      setIsCreating(false);
      setLocalCreateError(null);
    } else {
      setIsCreating(false);
      setLocalCreateError(null);
    }
  }, [open]);

  const handleSelectUser = (user: Teacher) => {
    if (multiple) {
      setSelectedUsers((prev) => {
        const isSelected = prev.some((u) => u.id === user.id);
        if (isSelected) {
          return prev.filter((u) => u.id !== user.id);
        } else {
          return [...prev, user];
        }
      });
    } else {
      onSelect(user);
      onOpenChange(false);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple) {
      onSelect(selectedUsers);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleCreateNewUser = () => {
    setIsCreating(true);
    setLocalCreateError(null);
  };

  const handleBackToList = () => {
    setIsCreating(false);
    setLocalCreateError(null);
  };

  const handleSubmitNewUser = async (teacherData: TeacherCreateData) => {
    setLocalCreateError(null);
    createTeacher(teacherData, {
      onSuccess: (data) => {
        const createdTeacher: Teacher =
          data?.data || data?.entities?.data || data;

        if (createdTeacher) {
          if (multiple) {
            setSelectedUsers((prev) => [...prev, createdTeacher]);
            setIsCreating(false);
          } else {
            onSelect(createdTeacher);
            onOpenChange(false);
          }
        } else {
          setLocalCreateError(
            "Ошибка: данные созданного пользователя отсутствуют."
          );
        }
      },
      onError: (error) => {
        console.error("Ошибка при создании пользователя:", error);
      },
    });
  };

  const getUserInitials = (teacher: Teacher) => {
    return `${teacher?.user?.firstname?.charAt(0) || ""}${
      teacher?.user?.lastname?.charAt(0) || ""
    }`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogDescription className="sr-only">
          Модальное окно для выбора{" "}
          {multiple ? "преподавателей/рецензентов" : "преподавателя"}.
          Используйте поле поиска для фильтрации списка. Нажмите "Создать
          нового" для добавления нового пользователя.
        </DialogDescription>

        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isCreating
              ? `Создать нового ${multiple ? "пользователя" : "преподавателя"}`
              : `Выбрать ${
                  multiple ? "преподавателей/рецензентов" : "преподавателя"
                }`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-hidden flex flex-col">
          {!isCreating ? (
            <>
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                disabled={isLoading}
              />

              <TeacherListView
                users={filteredUsers}
                selectedUsers={selectedUsers}
                multiple={multiple}
                isLoading={isLoading}
                isError={isError}
                errorMessage={
                  isError && fetchError
                    ? typeof fetchError === "string"
                      ? fetchError
                      : fetchError.message ||
                        "Неизвестная ошибка при загрузке данных."
                    : null
                }
                onSelectUser={handleSelectUser}
                onRetry={refetch}
                getUserInitials={getUserInitials}
              />

              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={handleCreateNewUser}
                  className="flex items-center justify-center w-full sm:w-auto"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать нового
                </Button>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                  {multiple && (
                    <Button
                      onClick={handleConfirmSelection}
                      disabled={selectedUsers.length === 0 || isLoading}
                      className="flex-1"
                    >
                      Выбрать ({selectedUsers.length})
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <TeacherCreateView
              isCreatingLoading={isCreatingLoading}
              localCreateError={localCreateError}
              isCreateError={isCreateError}
              createError={createError}
              onCancel={handleCancel}
              onBackToList={handleBackToList}
              onSubmit={handleSubmitNewUser}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherListModalComponent;
