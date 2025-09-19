// components/Assignment/MiscSettingsComponent.tsx
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
import { Switch } from "@/components/ui/switch";
import { Cog } from "lucide-react";
import CollapsibleCard from "@/components/Oqylyk/Assignment/CollapsibleCard";
import { AssignmentDetail } from "@/types/assignment/detail";
import { numericToBoolean } from "@/utils/numericToBoolean";

// interface AssignmentModel {
//   id: number;
//   type: string;
//   max_attempts: number | "custom" | null;
//   is_points_method: boolean;
//   points_method_type: "nan" | "sum" | "avg";
//   is_straight_answer: boolean;
//   is_show_answers_after_finished: boolean;
//   is_show_results_after_finished: boolean;
//   is_hide_users: boolean;
//   is_comments: boolean;
//   reviewers: any[]; // Массив рецензентов
// }

interface AssignmentMiscSettingsComponentProps {
  assignment: AssignmentDetail;
  errors?: Record<string, string[]>;
  onAssignmentChange: (assignment: AssignmentDetail) => void;
}

const AssignmentMiscSettingsComponent: React.FC<
  AssignmentMiscSettingsComponentProps
> = ({ assignment, errors = {}, onAssignmentChange }) => {
  // Helper functions для проверки типа задания
  const isLessonType = useMemo(
    () => assignment.type === "lesson",
    [assignment.type]
  );
  const isQuizType = useMemo(
    () => assignment.type === "quiz",
    [assignment.type]
  );
  const isExternalType = useMemo(
    () => assignment.type === "external",
    [assignment.type]
  );

  // Options
  const maxAttemptsOptions = [
    { attempts: 0, label: "Без ограничений" },
    { attempts: 1, label: "1 попытка" },
    { attempts: 2, label: "2 попытки" },
    { attempts: 3, label: "3 попытки" },
    { attempts: 5, label: "5 попыток" },
    { attempts: "custom", label: "Другое количество" },
  ];

  const pointsMethodOptions = [
    { raw: "nan", name: "По умолчанию" },
    { raw: "sum", name: "Сумма баллов" },
    { raw: "avg", name: "Среднее арифметическое" },
  ];

  // Computed values
  const isCustomMaxAttempts = useMemo(() => {
    return (
      assignment.max_attempts === "custom" ||
      !maxAttemptsOptions.find(
        (option) => option.attempts === assignment.max_attempts
      )
    );
  }, [assignment.max_attempts, maxAttemptsOptions]);

  // Handlers
  const handleMaxAttemptsChange = (value: string) => {
    const parsedValue = value === "custom" ? "custom" : parseInt(value) || 0;
    onAssignmentChange({
      ...assignment,
      max_attempts: parsedValue,
    });
  };

  const handleCustomMaxAttemptsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value) || 0;
    onAssignmentChange({
      ...assignment,
      max_attempts: value,
    });
  };

  const handlePointsMethodChange = (value: "nan" | "sum" | "avg") => {
    onAssignmentChange({
      ...assignment,
      points_method_type: value,
    });
  };

  const handleSwitchChange = (field: string, checked: boolean) => {
    // Преобразуем boolean в number для API/состояния
    const valueForState: number = checked ? 1 : 0;

    onAssignmentChange({
      ...assignment,
      [field]: valueForState, // Теперь передаем number
    });
  };

  return (
    <CollapsibleCard
      title="Дополнительные настройки"
      description="Настройте дополнительные параметры задания"
      icon={<Cog className="h-5 w-5 text-blue-600" />}
      defaultCollapsed={true}
    >
      <div className="space-y-6">
        {/* ATTEMPTS COUNT */}
        {(isLessonType || isQuizType) && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Максимальное количество попыток
            </Label>
            <Select
              value={assignment.max_attempts?.toString() || "1"}
              onValueChange={handleMaxAttemptsChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите количество попыток" />
              </SelectTrigger>
              <SelectContent>
                {maxAttemptsOptions.map((option) => (
                  <SelectItem
                    key={option.attempts}
                    value={option.attempts.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isCustomMaxAttempts && (
              <div className="mt-2">
                <Input
                  type="number"
                  value={
                    typeof assignment.max_attempts === "number"
                      ? assignment.max_attempts
                      : ""
                  }
                  onChange={handleCustomMaxAttemptsChange}
                  placeholder="Введите количество попыток"
                  min="1"
                />
              </div>
            )}

            <p className="text-sm text-gray-500 mt-1">
              Укажите максимальное количество попыток прохождения задания
            </p>
          </div>
        )}

        {/* POINT SYSTEM */}
        {(isLessonType || isQuizType || isExternalType) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Включить систему баллов
              </Label>
              <Switch
                checked={numericToBoolean(assignment.is_points_method)}
                onCheckedChange={(checked) =>
                  handleSwitchChange("is_points_method", checked)
                }
              />
            </div>
            <p className="text-sm text-gray-500">
              Активировать систему баллов для оценки задания
            </p>
          </div>
        )}

        {/* POINT SYSTEM CALCULATE METHOD */}
        {assignment.is_points_method && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Метод расчета баллов
            </Label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {pointsMethodOptions.map((option) => (
                <button
                  key={option.raw}
                  type="button"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex-1 ${
                    assignment.points_method_type === option.raw
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() =>
                    handlePointsMethodChange(
                      option.raw as "nan" | "sum" | "avg"
                    )
                  }
                  disabled={assignment.reviewers.length <= 0}
                >
                  {option.name}
                </button>
              ))}
            </div>
            {assignment.reviewers.length <= 0 && (
              <p className="text-sm text-gray-500">
                Для выбора метода расчета необходимо назначить рецензентов
              </p>
            )}
            <p className="text-sm text-gray-500">
              Выберите метод расчета итогового балла
            </p>
          </div>
        )}

        {/* SHOW ANSWERS BEFORE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Показывать ответы сразу
            </Label>
            <Switch
              checked={numericToBoolean(assignment.is_straight_answer)}
              onCheckedChange={(checked) =>
                handleSwitchChange("is_straight_answer", checked)
              }
            />
          </div>
          <p className="text-sm text-gray-500">
            Ответы будут показываться студенту сразу после ответа на вопрос
          </p>
        </div>

        {/* SHOW ANSWERS AFTER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Показывать ответы после завершения
            </Label>
            <Switch
              checked={numericToBoolean(
                assignment.is_show_answers_after_finished
              )}
              onCheckedChange={(checked) =>
                handleSwitchChange("is_show_answers_after_finished", checked)
              }
              disabled={numericToBoolean(assignment.is_straight_answer)}
            />
          </div>
          <p className="text-sm text-gray-500">
            Ответы будут показываться студенту после завершения задания
          </p>
        </div>

        {/* SHOW RESULTS AFTER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Показывать результаты после завершения
            </Label>
            <Switch
              checked={numericToBoolean(
                assignment.is_show_results_after_finished
              )}
              onCheckedChange={(checked) =>
                handleSwitchChange("is_show_results_after_finished", checked)
              }
              disabled={numericToBoolean(
                assignment.is_straight_answer ||
                  assignment.is_show_answers_after_finished
              )}
            />
          </div>
          <p className="text-sm text-gray-500">
            Результаты будут показываться студенту после завершения задания
          </p>
        </div>

        {/* HIDE STUDENTS NAME */}
        {(isQuizType || isExternalType) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Скрыть имена студентов
              </Label>
              <Switch
                checked={numericToBoolean(assignment.is_hide_users)}
                onCheckedChange={(checked) =>
                  handleSwitchChange("is_hide_users", checked)
                }
              />
            </div>
            <p className="text-sm text-gray-500">
              Имена студентов будут скрыты при просмотре результатов
            </p>
          </div>
        )}

        {/* ENABLE COMMENTS */}
        {isLessonType && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Включить комментарии
              </Label>
              <Switch
                checked={numericToBoolean(assignment.is_comments)}
                onCheckedChange={(checked) =>
                  handleSwitchChange("is_comments", checked)
                }
              />
            </div>
            <p className="text-sm text-gray-500">
              Разрешить добавление комментариев к заданию
            </p>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default AssignmentMiscSettingsComponent;
