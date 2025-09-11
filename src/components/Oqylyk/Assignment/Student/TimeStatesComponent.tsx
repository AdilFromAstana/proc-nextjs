import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  StopCircle,
  PlayCircle,
  History,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Assignment {
  id: number;
}

interface Student {
  id: number;
}

interface AssignmentStudentTimeStatesComponentProps {
  assignment?: Assignment;
  student?: Student;
  available_time?: number;
  is_started?: boolean;
  is_finished?: boolean;
  onChanged?: () => void;
}

const mockAssignment = {
  id: 123,
};

const mockStudent = {
  id: 456,
};

const mockFinished = {
  assignment: mockAssignment,
  student: mockStudent,
  available_time: 0,
  is_started: true,
  is_finished: true,
};

const TimeStatesComponent: React.FC<
  AssignmentStudentTimeStatesComponentProps
> = ({
  assignment = mockFinished.assignment,
  student = mockFinished.student,
  available_time = mockFinished.available_time,
  is_started = true,
  is_finished = false,
  onChanged,
}) => {
  // State for local toasts
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      variant?: "default" | "destructive" | "success";
    }>
  >([]);

  // Computed values
  const changeTimeStatesApiUrl = `/api/assignment/actions/${assignment.id}/time-states.json`;
  const changeAssignmentStatesApiUrl = `/api/assignment/actions/${assignment.id}/assignment-states.json`;

  const formattedAvailableTime = (() => {
    const hours = Math.floor(Math.abs(available_time) / 3600);
    const minutes = Math.floor((Math.abs(available_time) % 3600) / 60);
    const seconds = Math.abs(available_time) % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  })();

  const availableTermTime = (() => {
    if (available_time <= 60) {
      return "seconds";
    } else if (available_time <= 3600) {
      return "minutes";
    } else {
      return "hours";
    }
  })();

  // Local toast function
  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" | "success" = "default"
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, variant };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Local Toast Component
  const LocalToastComponent = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            relative flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300
            ${
              toast.variant === "destructive"
                ? "bg-red-50 border-red-200"
                : toast.variant === "success"
                ? "bg-green-50 border-green-200"
                : "bg-white border-gray-200"
            }
          `}
        >
          <div className="flex-1">
            <div className="flex items-center">
              {toast.variant === "destructive" && (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              {toast.variant === "success" && (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              )}
              <h4
                className={`text-sm font-medium ${
                  toast.variant === "destructive"
                    ? "text-red-800"
                    : toast.variant === "success"
                    ? "text-green-800"
                    : "text-gray-800"
                }`}
              >
                {toast.title}
              </h4>
            </div>
            <p
              className={`mt-1 text-sm ${
                toast.variant === "destructive"
                  ? "text-red-600"
                  : toast.variant === "success"
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {toast.description}
            </p>
          </div>
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className="flex-shrink-0 ml-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            <XCircle className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );

  // Methods
  const changeTimeState = async (state: string, minutes: number = 1) => {
    if (state === "reset") {
      const isConfirm = confirm("Подтвердить действие");
      if (!isConfirm) return;
    } else {
      const minutesInput = prompt("Введите количество минут");
      if (minutesInput === null) return;

      const parsedMinutes = parseInt(minutesInput);
      if (isNaN(parsedMinutes) || parsedMinutes <= 0) {
        showToast("Ошибка", "Не указано количество минут", "destructive");
        return;
      }

      minutes = parsedMinutes;
    }

    try {
      const response = await fetch(changeTimeStatesApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: student.id,
          state: state,
          minutes: minutes,
        }),
      });

      if (response.ok) {
        if (onChanged) onChanged();
        showToast("Успех", "Время успешно изменено", "success");
      } else {
        throw new Error("Failed to change time state");
      }
    } catch (error) {
      console.error("Error changing time state:", error);
      showToast("Ошибка", "Ошибка при изменении времени", "destructive");
    }
  };

  const changeAssignmentState = async (action: string) => {
    const isConfirm = confirm("Подтвердить действие");
    if (!isConfirm) return;

    try {
      const response = await fetch(changeAssignmentStatesApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: student.id,
          state: action,
        }),
      });

      if (response.ok) {
        if (onChanged) onChanged();
        showToast("Успех", "Состояние задания успешно изменено", "success");
      } else {
        throw new Error("Failed to change assignment state");
      }
    } catch (error) {
      console.error("Error changing assignment state:", error);
      showToast(
        "Ошибка",
        "Ошибка при изменении состояния задания",
        "destructive"
      );
    }
  };

  // Helper function to get term translation
  const getTermTranslation = (term: string) => {
    switch (term) {
      case "seconds":
        return "секунд";
      case "minutes":
        return "минут";
      case "hours":
        return "часов";
      default:
        return "секунд";
    }
  };

  return (
    <div className="assignment-student-time-states-component space-y-6">
      {/* Local Toasts */}
      <LocalToastComponent />

      {/* AVAILABLE TIME SETTINGS */}
      {available_time !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Доступное время</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              {available_time > 0 ? (
                <Badge variant="default" className="text-lg py-2 px-4">
                  {formattedAvailableTime}{" "}
                  {getTermTranslation(availableTermTime)}
                </Badge>
              ) : available_time < 0 ? (
                <Badge variant="destructive" className="text-lg py-2 px-4">
                  Время истекло
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-lg py-2 px-4">
                  00:00:00 секунд
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {/* INCREASE TIME */}
              <Button
                onClick={() => changeTimeState("increase")}
                disabled={!is_started || available_time <= 0}
                variant="outline"
                size="sm"
              >
                <Clock className="h-4 w-4 mr-2" />
                Увеличить
              </Button>

              {/* DECREASE TIME */}
              <Button
                onClick={() => changeTimeState("decrease")}
                disabled={!is_started || available_time <= 0}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <Clock className="h-4 w-4 mr-2" />
                Уменьшить
              </Button>

              {/* RESET TIME */}
              <Button
                onClick={() => changeTimeState("reset")}
                disabled={!is_started}
                variant="outline"
                size="sm"
              >
                <History className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ASSIGNMENT ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Управление заданием</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* FINISH ATTEMPT ACTION */}
          <div className="space-y-2">
            <CardDescription>Завершить задание студента</CardDescription>
            <Button
              onClick={() => changeAssignmentState("finish")}
              disabled={!is_started || is_finished}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Завершить задание
            </Button>
          </div>

          {/* RESTORE ATTEMPT ACTION */}
          <div className="space-y-2">
            <CardDescription>Восстановить задание студента</CardDescription>
            <Button
              onClick={() => changeAssignmentState("restore")}
              disabled={!is_started || !is_finished}
              variant="default"
              size="sm"
              className="w-full"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Восстановить задание
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeStatesComponent;
