// components/TimeStatesComponent.tsx
import React, { useState } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, History, StopCircle, PlayCircle } from "lucide-react";
import ConfirmModalComponent from "@/components/Chunks/ConfirmModalComponent";
import { Student } from "@/types/students";
import { useTranslations } from "next-intl";

interface Assignment {
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

const TimeStatesComponent: React.FC<
  AssignmentStudentTimeStatesComponentProps
> = ({
  assignment = mockAssignment,
  student = mockStudent,
  available_time = 0,
  is_started = false,
  is_finished = false,
  onChanged,
}) => {
  const t = useTranslations();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "time" | "assignment";
    state: string;
    minutes?: number;
  } | null>(null);

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

  // Methods
  const changeTimeState = async (state: string) => {
    if (state === "reset") {
      setPendingAction({ type: "time", state });
      setConfirmModalOpen(true);
    } else {
      const minutesInput = prompt("Введите количество минут");
      if (minutesInput === null) return;

      const parsedMinutes = parseInt(minutesInput);
      if (isNaN(parsedMinutes) || parsedMinutes <= 0) {
        alert("Не указано количество минут");
        return;
      }

      setPendingAction({ type: "time", state, minutes: parsedMinutes });
      setConfirmModalOpen(true);
    }
  };

  const changeAssignmentState = async (action: string) => {
    setPendingAction({ type: "assignment", state: action });
    setConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === "time") {
        const response = await fetch(changeTimeStatesApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: student.id,
            state: pendingAction.state,
            minutes: pendingAction.minutes || 1,
          }),
        });

        if (response.ok) {
          if (onChanged) onChanged();
        }
      } else {
        const response = await fetch(changeAssignmentStatesApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: student.id,
            state: pendingAction.state,
          }),
        });

        if (response.ok) {
          if (onChanged) onChanged();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ошибка при выполнении действия");
    } finally {
      setConfirmModalOpen(false);
      setPendingAction(null);
    }
  };

  return (
    <div className="assignment-student-time-states-component space-y-6 w-full m-4">
      {/* AVAILABLE TIME SETTINGS */}
      {available_time !== null && (
        <div className="available-time-settings">
          <div className="available-time-label text-gray-700 font-medium mb-2">
            {t("label-available-time")}
          </div>

          <div className="available-time-value mb-4">
            {available_time > 0 ? (
              <Badge variant="default" className="text-lg py-2 px-4">
                {formattedAvailableTime} {getTermTranslation(availableTermTime)}
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

          <div className="flex flex-wrap gap-2">
            {/* INCREASE TIME */}
            <Button
              onClick={() => changeTimeState("increase")}
              disabled={!is_started || available_time <= 0}
              variant="outline"
              size="sm"
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Clock className="h-4 w-4 mr-2" />
              {t("btn-increase-time")}
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
              {t("btn-decrease-time")}
            </Button>

            {/* RESET TIME */}
            <Button
              onClick={() => changeTimeState("reset")}
              disabled={!is_started}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <History className="h-4 w-4 mr-2" />
              {t("btn-reset-time")}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* FINISH ATTEMPT ACTION */}
        <div className="space-y-2">
          <div className="text-gray-700 font-medium">
            {t("label-finish-student-assignment")}
          </div>
          <Button
            onClick={() => changeAssignmentState("finish")}
            disabled={!is_started || is_finished}
            variant="destructive"
            size="sm"
          >
            <StopCircle className="h-4 w-4 mr-2" />
            {t("btn-finish-assignment")}
          </Button>
        </div>

        {/* RESTORE ATTEMPT ACTION */}
        <div className="space-y-2">
          <div className="text-gray-700 font-medium">
            {t("label-restore-student-assignment")}
          </div>
          <Button
            onClick={() => changeAssignmentState("restore")}
            disabled={!is_started || !is_finished}
            variant="default"
            size="sm"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            {t("btn-restore-assignment")}
          </Button>
        </div>
      </div>

      {/* CONFIRM ACTION MODAL */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {t("prompt-confirm-action")}
            </h3>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmModalOpen(false);
                  setPendingAction(null);
                }}
              >
                {t("btn-no")}
              </Button>
              <Button onClick={handleConfirm}> {t("btn-confirm")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeStatesComponent;
