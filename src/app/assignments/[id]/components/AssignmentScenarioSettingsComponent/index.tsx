// components/Assignment/ScenarioSettingsComponent.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import CollapsibleCard from "@/components/Oqylyk/Assignment/CollapsibleCard";
import { AssignmentDetail } from "@/types/assignment/detail";
// import {
//   ScenarioSettings,
//   ScenarioCondition,
// } from "@/types/assignment/scenario"; // Предполагаемый путь к типам

// Если типы не определены, можно определить их здесь:

interface ScenarioCondition {
  indicator: string | null;
  condition: string | null;
  needle: number | null;
  action: number | string | null;
}

interface ScenarioSettings {
  conditions: ScenarioCondition[];
}

interface AssignmentScenarioSettingsComponentProps {
  assignment: AssignmentDetail;
  errors?: Record<string, string[]>;
  dropdown?: boolean;
  collapsed?: boolean;
  onAssignmentChange: (updatedAssignment: AssignmentDetail) => void;
}

const AssignmentScenarioSettingsComponent: React.FC<
  AssignmentScenarioSettingsComponentProps
> = ({
  assignment,
  errors = {},
  dropdown = true,
  collapsed = true,
  onAssignmentChange,
}) => {
  // State для локальных изменений настроек
  const [settings, setSettings] = useState<ScenarioSettings>({
    conditions: [],
  });

  // Синхронизация локального состояния с пропсом assignment
  useEffect(() => {
    setSettings(assignment.settings?.scenario_settings || { conditions: [] });
  }, [assignment.settings?.scenario_settings]);

  // Mock данные для типов (заменить на реальные данные из API)
  const assignmentIndicatorTypes = [
    { id: "points", name: "Баллы" },
    { id: "time", name: "Время" },
    { id: "attempts", name: "Попытки" },
  ];

  const conditionTypes = [
    { id: "greater", name: "Больше" },
    { id: "less", name: "Меньше" },
    { id: "equal", name: "Равно" },
    { id: "not_equal", name: "Не равно" },
  ];

  // Computed values
  const scoreOptions = useMemo(
    () => [
      { id: 1, label: "Оценка: 1" },
      { id: 2, label: "Оценка: 2" },
      { id: 3, label: "Оценка: 3" },
      { id: 4, label: "Оценка: 4" },
      { id: 5, label: "Оценка: 5" },
      { id: "assignment-completed", label: "Задание завершено" },
      { id: "assignment-failured", label: "Задание провалено" },
    ],
    []
  );

  // Handlers
  const addScoreCondition = () => {
    const newConditions = [
      ...(settings.conditions || []),
      { indicator: null, condition: null, needle: null, action: null },
    ];

    const newSettings = {
      ...settings,
      conditions: newConditions,
    };

    // Обновляем локальное состояние
    setSettings(newSettings);

    // Сообщаем родителю об изменении
    onAssignmentChange({
      ...assignment,
      settings: {
        ...assignment.settings,
        scenario_settings: newSettings,
      },
    });
  };

  const removeScoreCondition = (index: number) => {
    const newConditions = [...(settings.conditions || [])];
    newConditions.splice(index, 1);

    const newSettings = {
      ...settings,
      conditions: newConditions,
    };

    // Обновляем локальное состояние
    setSettings(newSettings);

    // Сообщаем родителю об изменении
    onAssignmentChange({
      ...assignment,
      settings: {
        ...assignment.settings,
        scenario_settings: newSettings,
      },
    });
  };

  const updateCondition = (
    index: number,
    field: keyof ScenarioCondition,
    value: any
  ) => {
    const newConditions = [...(settings.conditions || [])];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value,
    };

    const newSettings = {
      ...settings,
      conditions: newConditions,
    };

    // Обновляем локальное состояние
    setSettings(newSettings);

    // Сообщаем родителю об изменении
    onAssignmentChange({
      ...assignment,
      settings: {
        ...assignment.settings,
        scenario_settings: newSettings,
      },
    });
  };

  return (
    <CollapsibleCard
      title="Настройки сценария"
      description="Настройте условия и действия для сценария задания"
      icon={<div className="w-5 h-5 bg-blue-500 rounded-full"></div>} // Заменить на реальную иконку
      defaultCollapsed={collapsed}
    >
      {/* Скрытое описание для доступности, связанное с descriptionId */}
      <div id="scenario-settings-description" className="sr-only">
        Форма для настройки условий и действий сценария задания. Добавьте
        условия, указав индикатор, условие, значение и действие. Используйте
        кнопку 'Добавить условие' для создания новых правил.
      </div>

      <div className="space-y-4">
        {settings.conditions && settings.conditions.length > 0 && (
          <div className="scenario-condition-list space-y-4">
            {/* HEADER - только для экранов среднего размера и больше */}
            <div className="scenario-condition-row scenario-condition-header hidden md:flex text-gray-500 text-sm font-semibold">
              <div className="flex-1">Индикатор</div>
              <div className="flex-1">Условие</div>
              <div className="flex-1">Значение</div>
              <div className="flex-1">Действие</div>
            </div>

            {/* CONTENT */}
            {settings.conditions.map((group, index) => (
              <div
                key={`score-group-${index}`}
                className="scenario-condition-row flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center p-3 md:p-0 border-b border-gray-100 md:border-0 pb-4 md:pb-0"
              >
                {/* Indicator Select */}
                <div className="flex-1 w-full">
                  <label htmlFor={`indicator-${index}`} className="sr-only">
                    Индикатор для условия {index + 1}
                  </label>
                  <Select
                    value={group.indicator || ""}
                    onValueChange={(value) =>
                      updateCondition(index, "indicator", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите индикатор" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignmentIndicatorTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition Select */}
                <div className="flex-1 w-full">
                  <label htmlFor={`condition-${index}`} className="sr-only">
                    Условие для условия {index + 1}
                  </label>
                  <Select
                    value={group.condition || ""}
                    onValueChange={(value) =>
                      updateCondition(index, "condition", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите условие" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Needle Input */}
                <div className="flex-1 w-full">
                  <label htmlFor={`needle-${index}`} className="sr-only">
                    Значение для условия {index + 1}
                  </label>
                  <Input
                    id={`needle-${index}`}
                    type="number"
                    value={group.needle ?? ""} // Используем ?? для правильной обработки null
                    onChange={(e) =>
                      updateCondition(
                        index,
                        "needle",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    placeholder="Введите значение"
                    aria-label={`Значение для условия ${index + 1}`}
                  />
                </div>

                {/* Action Select */}
                <div className="flex-1 w-full">
                  <label htmlFor={`action-${index}`} className="sr-only">
                    Действие для условия {index + 1}
                  </label>
                  <Select
                    value={group.action?.toString() || ""}
                    onValueChange={(value) => {
                      // Преобразуем значение обратно в число если это число, иначе оставляем строку
                      const parsedValue = isNaN(Number(value))
                        ? value
                        : Number(value);
                      updateCondition(index, "action", parsedValue);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите действие" />
                    </SelectTrigger>
                    <SelectContent>
                      {scoreOptions.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Remove Button */}
                <div className="flex-none w-10 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeScoreCondition(index)}
                    aria-label={`Удалить условие ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Condition Button */}
        <Button
          onClick={addScoreCondition}
          className="flex items-center"
          aria-describedby="scenario-settings-description" // Связывает кнопку с описанием
        >
          Добавить условие
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default AssignmentScenarioSettingsComponent;
