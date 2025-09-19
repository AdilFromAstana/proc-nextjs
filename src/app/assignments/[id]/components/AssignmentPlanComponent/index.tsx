// components/Assignment/PlanComponent.tsx
import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import CollapsibleCard from "@/components/Oqylyk/Assignment/CollapsibleCard";
import { AssignmentDetail } from "@/types/assignment/detail";

interface AssignmentPlanComponentProps {
  assignment: AssignmentDetail;
  errors?: Record<string, string[]>;
  onAssignmentChange: (assignment: AssignmentDetail) => void;
}

const AssignmentPlanComponent: React.FC<AssignmentPlanComponentProps> = ({
  assignment,
  errors = {},
  onAssignmentChange,
}) => {
  // Options
  const completeTimesOptions = [
    { minutes: 0, label: "Без ограничений" },
    { minutes: 30, label: "30 минут" },
    { minutes: 45, label: "45 минут" },
    { minutes: 60, label: "60 минут" },
    { minutes: 90, label: "90 минут" },
    { minutes: 120, label: "120 минут" },
    { minutes: 180, label: "180 минут" },
    { minutes: 240, label: "240 минут" },
    { minutes: "custom", label: "Другое время" },
  ];

  const startingAtTypes = [
    { id: "now", name: "Немедленно", raw: "now" },
    { id: "plan", name: "Запланировать", raw: "plan" },
  ];

  const endingAtTypes = [
    { id: "without", name: "Без ограничений", raw: "without" },
    { id: "until", name: "До определенной даты", raw: "until" },
  ];

  // Computed values
  const isCustomCompleteTime = useMemo(() => {
    return (
      assignment.complete_time === "custom" ||
      !completeTimesOptions.find(
        (option) => option.minutes === assignment.complete_time
      )
    );
  }, [assignment.complete_time, completeTimesOptions]);

  const hintStartingAtType = useMemo(() => {
    switch (assignment.starting_at_type) {
      case "now":
        return "Задание будет доступно сразу после публикации";
      case "plan":
        return "Задание будет доступно с указанной даты и времени";
      default:
        return null;
    }
  }, [assignment.starting_at_type]);

  const hintEndingAtType = useMemo(() => {
    switch (assignment.ending_at_type) {
      case "without":
        return "Задание будет доступно бессрочно";
      case "until":
        return "Задание будет доступно до указанной даты и времени";
      default:
        return null;
    }
  }, [assignment.ending_at_type]);

  // Methods
  const handleCompleteTimeChange = (value: string) => {
    const parsedValue = value === "custom" ? "custom" : parseInt(value) || 0;
    onAssignmentChange({
      ...assignment,
      complete_time: parsedValue,
    });
  };

  const handleStartingAtTypeChange = (value: "now" | "plan") => {
    onAssignmentChange({
      ...assignment,
      starting_at_type: value,
    });
  };

  const handleEndingAtTypeChange = (value: "without" | "until") => {
    onAssignmentChange({
      ...assignment,
      ending_at_type: value,
    });
  };

  const handleStartingAtDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [datePart, timePart] = e.target.value.split("T");
    if (datePart && timePart) {
      const formattedDate = `${datePart}T${timePart}:00Z`;
      onAssignmentChange({
        ...assignment,
        starting_at: formattedDate,
      });
    }
  };

  const handleEndingAtDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [datePart, timePart] = e.target.value.split("T");
    if (datePart && timePart) {
      const formattedDate = `${datePart}T${timePart}:00Z`;
      onAssignmentChange({
        ...assignment,
        ending_at: formattedDate,
      });
    }
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onAssignmentChange({
      ...assignment,
      complete_time: value,
    });
  };

  // Date helpers
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const minStartingAtDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split("T")[0];
  }, []);

  const minEndingAtDate = useMemo(() => {
    if (assignment.starting_at_type === "plan" && assignment.starting_at) {
      const startingDate = new Date(assignment.starting_at);
      startingDate.setDate(startingDate.getDate() - 1);
      return startingDate.toISOString().split("T")[0];
    }
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split("T")[0];
  }, [assignment.starting_at_type, assignment.starting_at]);

  return (
    <CollapsibleCard
      title="Планирование задания"
      description="Настройте время доступности и прохождения задания"
      icon={<Calendar className="h-5 w-5 text-blue-600" />}
      defaultCollapsed={true}
    >
      <div className="space-y-6">
        {/* ASSIGNMENT COMPLETE TIME */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Время на выполнение задания
          </Label>
          <Select
            value={assignment.complete_time?.toString() || "0"}
            onValueChange={handleCompleteTimeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите время" />
            </SelectTrigger>
            <SelectContent>
              {completeTimesOptions.map((option) => (
                <SelectItem
                  key={option.minutes}
                  value={option.minutes.toString()}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isCustomCompleteTime && (
            <div className="mt-2">
              <Input
                type="number"
                value={
                  typeof assignment.complete_time === "number"
                    ? assignment.complete_time
                    : ""
                }
                onChange={handleCustomTimeChange}
                placeholder="Введите время в минутах"
                min="1"
              />
            </div>
          )}

          <p className="text-sm text-gray-500 mt-1">
            Укажите максимальное время, отведенное на выполнение задания
          </p>
        </div>

        {/* STARTING AT TYPE */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Начало доступности задания
          </Label>
          <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
            {startingAtTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  assignment.starting_at_type === type.raw
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() =>
                  handleStartingAtTypeChange(type.raw as "now" | "plan")
                }
              >
                {type.name}
              </button>
            ))}
          </div>

          {hintStartingAtType && (
            <p className="text-sm text-gray-500">{hintStartingAtType}</p>
          )}
        </div>

        {/* STARTING AT DATE */}
        {assignment.starting_at_type === "plan" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Дата и время начала
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="datetime-local"
                  value={formatDateForInput(assignment.starting_at)}
                  onChange={handleStartingAtDateChange}
                  min={minStartingAtDate}
                  className="pl-10"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Укажите точную дату и время, когда задание станет доступно
            </p>
          </div>
        )}

        {/* ENDING AT TYPE */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Окончание доступности задания
          </Label>
          <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
            {endingAtTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  assignment.ending_at_type === type.raw
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() =>
                  handleEndingAtTypeChange(type.raw as "without" | "until")
                }
              >
                {type.name}
              </button>
            ))}
          </div>

          {hintEndingAtType && (
            <p className="text-sm text-gray-500">{hintEndingAtType}</p>
          )}
        </div>

        {/* ENDING AT DATE */}
        {assignment.ending_at_type === "until" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Дата и время окончания
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="datetime-local"
                  value={formatDateForInput(assignment.ending_at)}
                  onChange={handleEndingAtDateChange}
                  min={minEndingAtDate}
                  className="pl-10"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Укажите точную дату и время, когда задание перестанет быть
              доступным
            </p>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default AssignmentPlanComponent;
