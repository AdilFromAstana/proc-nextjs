// components/Assignment/ComponentSettingsComponent.tsx
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import CollapsibleCard from "@/components/Oqylyk/Assignment/CollapsibleCard";
import {
  AssignmentDetail,
  ComponentSettings,
  ComponentSetting,
} from "@/types/assignment/detail";
import { numericToBoolean } from "@/utils/numericToBoolean";
import { useTranslations } from "next-intl";

// Определяем тип для одного условия сложности
type DifficultyCondition = NonNullable<ComponentSetting["conditions"]>[number];

interface AssignmentComponentSettingsComponentProps {
  assignment: AssignmentDetail;
  errors?: Record<string, string[]>;
  dropdown?: boolean;
  collapsed?: boolean;
  onAssignmentChange: (assignment: AssignmentDetail) => void;
}

const AssignmentComponentSettingsComponent: React.FC<
  AssignmentComponentSettingsComponentProps
> = ({
  assignment,
  errors = {},
  dropdown = true,
  collapsed = true,
  onAssignmentChange,
}) => {
  const t = useTranslations();

  const [kind, setKind] = useState<string>("all");

  // --- Получаем настройки компонентов из assignment ---
  const componentSettings = useMemo<ComponentSettings>(() => {
    return (
      assignment.settings?.component_settings || {
        all: {
          conditions: [],
          per_student: 0,
          shuffle: 0,
          variant_split: false,
        },
      }
    );
  }, [assignment.settings?.component_settings]);
  // ----------------------------------------------------

  // --- Mock данные для типов сложности ---
  // В реальном приложении эти данные должны приходить из API или контекста
  const difficultTypes = useMemo(
    () => [
      { id: "easy", name: "Легкий" },
      { id: "medium", name: "Средний" },
      { id: "hard", name: "Сложный" },
    ],
    []
  );
  // ---------------------------------------

  // --- Вычисляем pills на основе типа assignment ---
  const pills = useMemo(() => {
    const pillsArray = [{ id: "all", label: "Все" }];

    if (assignment.type === "quiz" && assignment.quizzes) {
      const quizzes = assignment.quizzes.map((entity) => ({
        id: String(entity.id),
        label: entity.name,
      }));
      pillsArray.push(...quizzes);
    } else if (assignment.type === "lesson" && assignment.lessons) {
      const lessons = assignment.lessons.map((entity) => ({
        id: String(entity.id),
        label: entity.name,
      }));
      pillsArray.push(...lessons);
    }

    return pillsArray;
  }, [assignment]);
  // --------------------------------------------------

  // --- Обработчики ---

  const addDifficultCondition = useCallback(() => {
    const currentSettingsForKey = componentSettings[kind] || {
      shuffle: 0,
      per_student: 0,
      variant_split: false,
      conditions: [],
    };

    const newConditions = [
      ...(currentSettingsForKey.conditions || []),
      { group: null, count: null },
    ];

    const updatedSettings: ComponentSettings = {
      ...componentSettings,
      [kind]: {
        ...currentSettingsForKey,
        conditions: newConditions,
      },
    };

    onAssignmentChange({
      ...assignment,
      settings: {
        ...assignment.settings,
        component_settings: updatedSettings,
      },
    });
  }, [componentSettings, kind, assignment, onAssignmentChange]);

  const removeDifficultCondition = useCallback(
    (index: number) => {
      const currentSettingsForKey = componentSettings[kind];
      if (
        !currentSettingsForKey ||
        !currentSettingsForKey.conditions?.[index]
      ) {
        console.warn(
          `Cannot remove condition at index ${index} for kind ${kind}`
        );
        return;
      }

      const newConditions = [...currentSettingsForKey.conditions];
      newConditions.splice(index, 1);

      const updatedSettings: ComponentSettings = {
        ...componentSettings,
        [kind]: {
          ...currentSettingsForKey,
          conditions: newConditions,
        },
      };

      onAssignmentChange({
        ...assignment,
        settings: {
          ...assignment.settings,
          component_settings: updatedSettings,
        },
      });
    },
    [componentSettings, kind, assignment, onAssignmentChange]
  );

  const updateSetting = useCallback(
    (field: keyof ComponentSetting, value: number | boolean) => {
      const currentSettingsForKey = componentSettings[kind] || {
        shuffle: 0,
        per_student: 0,
        variant_split: false,
        conditions: [],
      };

      const updatedSettings: ComponentSettings = {
        ...componentSettings,
        [kind]: {
          ...currentSettingsForKey,
          [field]: value,
        },
      };

      onAssignmentChange({
        ...assignment,
        settings: {
          ...assignment.settings,
          component_settings: updatedSettings,
        },
      });
    },
    [componentSettings, kind, assignment, onAssignmentChange]
  );

  const updateCondition = useCallback(
    (
      index: number,
      field: keyof DifficultyCondition,
      value: string | number | null
    ) => {
      const currentSettingsForKey = componentSettings[kind];
      if (
        !currentSettingsForKey ||
        !currentSettingsForKey.conditions?.[index]
      ) {
        console.warn(
          `Cannot update condition at index ${index} for kind ${kind}`
        );
        return;
      }

      const newConditions = [...currentSettingsForKey.conditions];
      newConditions[index] = {
        ...newConditions[index],
        [field]: value,
      };

      const updatedSettings: ComponentSettings = {
        ...componentSettings,
        [kind]: {
          ...currentSettingsForKey,
          conditions: newConditions,
        },
      };

      onAssignmentChange({
        ...assignment,
        settings: {
          ...assignment.settings,
          component_settings: updatedSettings,
        },
      });
    },
    [componentSettings, kind, assignment, onAssignmentChange]
  );
  // -------------------

  // --- Получаем текущие настройки для выбранного kind ---
  const currentKindSettings = useMemo<ComponentSetting>(() => {
    return (
      componentSettings[kind] || {
        shuffle: 0,
        per_student: 0,
        variant_split: false,
        conditions: [],
      }
    );
  }, [componentSettings, kind]);
  // -------------------------------------------------------

  return (
    <CollapsibleCard
      title={t("label-assignment-component-settings-title")}
      description={t("label-assignment-component-settings-description")}
      icon={<div className="w-5 h-5 bg-blue-500 rounded-full"></div>}
      defaultCollapsed={collapsed}
    >
      {/* Скрытое описание для доступности */}
      <div id="component-settings-description" className="sr-only">
        Форма для настройки компонентов задания. Выберите тип компонента,
        настройте перемешивание, количество на студента и условия сложности.
      </div>

      <div className="space-y-6">
        {/* PILLS для выбора типа компонента */}
        {pills.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {pills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  kind === pill.id
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setKind(pill.id)}
              >
                {pill.label}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-6">
          {/* SHUFFLE COMPONENTS */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t("label-assignment-shuffle-components")}
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                {t("hint-assignment-shuffle-components")}
              </p>
            </div>
            <Switch
              checked={currentKindSettings.shuffle === 1}
              onCheckedChange={(checked) =>
                updateSetting("shuffle", checked ? 1 : 0)
              }
            />
          </div>

          {/* SPLIT BY VARIANT */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t("label-assignment-split-components-by-variant")}
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                {t("hint-assignment-split-components-by-variant")}
              </p>
            </div>
            <Switch
              checked={numericToBoolean(currentKindSettings.variant_split)}
              onCheckedChange={(checked) =>
                updateSetting("variant_split", checked ? 1 : 0)
              }
            />
          </div>

          {/* COMPONENTS PER STUDENT */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t("label-assignment-components-per-student")}
            </Label>
            <p className="text-sm text-gray-500">
              {t("hint-assignment-components-per-student")}
            </p>
            <Input
              type="number"
              value={currentKindSettings.per_student || ""}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value === "" ? 0 : Number(value);
                updateSetting("per_student", isNaN(numValue) ? 0 : numValue);
              }}
              placeholder={t("placeholder-settings-difficult-count")}
            />
          </div>

          {/* DIFFICULT SETTINGS */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Настройки сложности
            </Label>
            <p className="text-sm text-gray-500">
              Настройте количество компонентов для каждого уровня сложности
            </p>

            <div className="component-condition-list space-y-4">
              {/* HEADER */}
              <div className="component-condition-row component-condition-header hidden md:flex text-gray-500 text-sm font-semibold">
                <div className="flex-1">Группа сложности</div>
                <div className="flex-1">Количество</div>
                <div className="flex-none w-10">Actions Column Header</div>
              </div>

              {/* CONTENT */}
              {currentKindSettings.conditions &&
              currentKindSettings.conditions.length > 0 ? (
                currentKindSettings.conditions.map((group, index) => (
                  <div
                    key={`difficult-group-${index}`}
                    className="component-condition-row flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center p-3 md:p-0 border-b border-gray-100 md:border-0 pb-4 md:pb-0"
                  >
                    <div className="flex-1 w-full">
                      <Select
                        value={group.group || ""}
                        onValueChange={(value) =>
                          updateCondition(index, "group", value || null)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите группу сложности" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 w-full">
                      <Input
                        type="number"
                        value={group.count ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = value === "" ? null : Number(value);
                          updateCondition(
                            index,
                            "count",
                            isNaN(numValue as number) ? null : numValue
                          );
                        }}
                        placeholder="Введите количество"
                      />
                    </div>

                    <div className="flex-none w-10 flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeDifficultCondition(index)}
                        aria-label={`Удалить условие сложности ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Нет настроенных условий сложности. Нажмите "Добавить условие".
                </div>
              )}
            </div>

            {/* ADD CONDITION BUTTON */}
            <Button
              onClick={addDifficultCondition}
              className="flex items-center"
            >
              {t("btn-add-condition")}
            </Button>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default React.memo(AssignmentComponentSettingsComponent);
