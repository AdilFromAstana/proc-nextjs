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
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

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
    { attempts: 0, label: t("option-assignment-attempts-unlimited") },
    { attempts: 1, label: t("option-assignment-attempts-1") },
    { attempts: 2, label: t("option-assignment-attempts-2") },
    { attempts: 3, label: t("option-assignment-attempts-3") },
    { attempts: 5, label: t("option-assignment-attempts-5") },
    { attempts: "custom", label: t("option-assignment-attempts-custom") },
  ];

  const pointsMethodOptions = [
    { raw: "nan", name: t("option-point-system-nan-method") },
    { raw: "sum", name: t("option-point-system-sum-method") },
    { raw: "avg", name: t("option-point-system-avg-method") },
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
      title={t("label-assignment-misc-settings-title")}
      description={t("label-assignment-misc-settings-description")}
      icon={<Cog className="h-5 w-5 text-blue-600" />}
      defaultCollapsed={true}
    >
      <div className="space-y-6">
        {/* ATTEMPTS COUNT */}
        {(isLessonType || isQuizType) && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t("label-assignment-max-attempts")}
            </Label>

            <p className="text-sm text-gray-500 mt-1">
              {t("hint-assignment-max-attempts")}
            </p>
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
                  placeholder={t("placeholder-assignment-max-attempts-input")}
                  min="1"
                />
              </div>
            )}
          </div>
        )}

        {/* POINT SYSTEM */}
        {(isLessonType || isQuizType || isExternalType) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                {t("btn-point-system-enable")}
              </Label>
              <Switch
                checked={numericToBoolean(assignment.is_points_method)}
                onCheckedChange={(checked) =>
                  handleSwitchChange("is_points_method", checked)
                }
              />
            </div>
            <p className="text-sm text-gray-500">
              {t("hint-point-system-enable")}
            </p>
          </div>
        )}

        {/* POINT SYSTEM CALCULATE METHOD */}
        {assignment.is_points_method && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t("label-point-system-calculate-method")}
            </Label>
            {assignment.reviewers.length <= 0 && (
              <p className="text-sm text-gray-500">
                {t("hint-point-system-calculate-method")}
              </p>
            )}
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
          </div>
        )}

        {/* SHOW ANSWERS BEFORE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              {t("btn-show-answers-do")}
            </Label>
            <Switch
              checked={numericToBoolean(assignment.is_straight_answer)}
              onCheckedChange={(checked) =>
                handleSwitchChange("is_straight_answer", checked)
              }
            />
          </div>
          <p className="text-sm text-gray-500">{t("hint-show-answers-do")}</p>
        </div>

        {/* SHOW ANSWERS AFTER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              {t("btn-show-answers-after")}
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
            {t("hint-show-answers-after")}
          </p>
        </div>

        {/* SHOW RESULTS AFTER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              {t("btn-show-results-after")}
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
            {t("hint-show-results-after")}
          </p>
        </div>

        {/* HIDE STUDENTS NAME */}
        {(isQuizType || isExternalType) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                {t("btn-hide-users")}
              </Label>
              <Switch
                checked={numericToBoolean(assignment.is_hide_users)}
                onCheckedChange={(checked) =>
                  handleSwitchChange("is_hide_users", checked)
                }
              />
            </div>
            <p className="text-sm text-gray-500">{t("hint-hide-users")}</p>
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
