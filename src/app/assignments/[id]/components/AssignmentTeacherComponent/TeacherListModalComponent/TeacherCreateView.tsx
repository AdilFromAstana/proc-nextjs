// components/Oqylyq/Teacher/ListModalComponent/TeacherCreateView.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { TeacherCreateData } from "@/types/assignment/teacher";

interface TeacherCreateViewProps {
  isCreatingLoading: boolean;
  localCreateError: string | null;
  isCreateError: boolean;
  createError: unknown; // Типизируйте это правильно, если знаете структуру ошибки
  onCancel: () => void;
  onBackToList: () => void;
  onSubmit: (data: TeacherCreateData) => void;
}

const TeacherCreateView: React.FC<TeacherCreateViewProps> = ({
  isCreatingLoading,
  localCreateError,
  isCreateError,
  createError,
  onCancel,
  onBackToList,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });

  const creationErrorMessage =
    localCreateError ||
    (isCreateError && createError
      ? typeof createError === "string"
        ? createError
        : (createError as any).message ||
          "Неизвестная ошибка при создании пользователя."
      : null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      // В реальном приложении лучше использовать библиотеку валидации
      alert("Имя и фамилия обязательны для заполнения.");
      return;
    }

    const teacherDataToSend: TeacherCreateData = {
      id: null,
      user_id: null,
      department_id: null,
      user: {
        REQUEST_CONTINUE: 0,
        REQUEST_REDUNDANT: 1,
        REQUEST_SKIP: 2,
        id: null,
        school_id: null,
        auth_type: null,
        group: null,
        photo: null,
        photo_thumb: {},
        color: null,
        firstname: formData.firstname,
        lastname: formData.lastname,
        patronymic: null,
        email: formData.email || "",
        phone: formData.phone || "",
        username: null,
        description: null,
        password: formData.password || "defaultPassword123",
        school: {
          REQUEST_CONTINUE: 0,
          REQUEST_REDUNDANT: 1,
          REQUEST_SKIP: 2,
          id: null,
          type: null,
          name: null,
          logo: null,
          logo_thumb: {},
          website: null,
          email: null,
        },
        register_date: null,
        last_activity_date: null,
        additional: {
          almaty_daryn_school_id: null,
          almaty_daryn_teacher_name: null,
        },
        is_online: false,
        is_need_complete_challenge: false,
        is_multiple_schools: false,
      },
      notify_via_sms: false,
      notify_via_email: false,
    };

    onSubmit(teacherDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
      <div className="flex-grow overflow-y-auto space-y-4 mb-4">
        {creationErrorMessage && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {creationErrorMessage}
          </div>
        )}
        <div>
          <label
            htmlFor="firstname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Имя *
          </label>
          <Input
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            disabled={isCreatingLoading}
          />
        </div>
        <div>
          <label
            htmlFor="lastname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Фамилия *
          </label>
          <Input
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            disabled={isCreatingLoading}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isCreatingLoading}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Телефон
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={isCreatingLoading}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Пароль *
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isCreatingLoading}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 pt-2 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBackToList}
          className="flex items-center justify-center w-full sm:w-auto"
          disabled={isCreatingLoading}
        >
          <User className="w-4 h-4 mr-2" />
          Выбрать из списка
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isCreatingLoading}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isCreatingLoading}
            className="flex-1 flex items-center justify-center"
          >
            {isCreatingLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Создание...
              </>
            ) : (
              "Создать"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TeacherCreateView;
