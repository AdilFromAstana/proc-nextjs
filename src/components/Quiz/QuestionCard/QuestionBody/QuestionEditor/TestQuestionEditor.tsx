// src/components/Quiz/QuestionCard/QuestionEditor/TestQuestionEditor.tsx
"use client"; // Добавляем, если используете Next.js App Router

import React, { useState } from "react";
import { QuizQuestionItem } from "@/types/quiz/quiz";
// Импорты shadcn/ui компонентов
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { percentOptions } from ".";

// Предполагаемая структура для варианта ответа тестового вопроса
interface TestQuestionOption {
  id?: string | number;
  is_true: boolean;
  percent?: number | null;
  answer: string;
}

interface TestQuestionEditorProps {
  editedQuestion: QuizQuestionItem;
  updateComponent: (updates: any) => void;
  renderEditor: (
    content: string,
    onChange: (content: string) => void,
    height?: number,
    readonly?: boolean
  ) => React.ReactNode;
}

const TestQuestionEditor: React.FC<TestQuestionEditorProps> = ({
  editedQuestion,
  updateComponent,
  renderEditor,
}) => {
  // Состояние для отслеживания, какой вариант ответа находится в режиме редактирования
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
    null
  );

  // Получение вариантов ответов с учетом возможных структур данных
  const getTestOptions = (): TestQuestionOption[] => {
    const component: any = editedQuestion.component;
    if (!component) return [];

    if (Array.isArray(component.options)) {
      return component.options;
    }
    if (component.options?.models && Array.isArray(component.options.models)) {
      return component.options.models;
    }
    return [];
  };

  // Обновление вариантов ответов
  const updateTestOptions = (newOptions: TestQuestionOption[]) => {
    updateComponent({ options: newOptions });
  };

  // Создание нового варианта ответа
  const createOption = () => {
    const currentOptions = getTestOptions();
    const newOption: TestQuestionOption = {
      id: Date.now(),
      is_true: false,
      answer: "",
    };
    updateTestOptions([...currentOptions, newOption]);
    // Переводим новый вариант в режим редактирования
    setEditingOptionIndex(currentOptions.length);
  };

  // Удаление варианта ответа
  const deleteOption = (index: number) => {
    const currentOptions = [...getTestOptions()];
    currentOptions.splice(index, 1);
    updateTestOptions(currentOptions);
    // Если удалили редактируемый вариант, сбрасываем состояние
    if (editingOptionIndex === index) {
      setEditingOptionIndex(null);
    } else if (editingOptionIndex !== null && editingOptionIndex > index) {
      // Корректируем индекс, если удалили вариант выше текущего редактируемого
      setEditingOptionIndex(editingOptionIndex - 1);
    }
  };

  // Обновление отдельного варианта ответа
  const updateOption = (
    index: number,
    field: keyof TestQuestionOption,
    value: any
  ) => {
    const currentOptions = [...getTestOptions()];
    const updatedOption = { ...currentOptions[index], [field]: value };
    currentOptions[index] = updatedOption;

    // Логика пересчета процентов для множественного выбора
    // @ts-ignore
    if (field === "is_true" && editedQuestion.component?.is_multiple) {
      const trueOptions = currentOptions.filter(
        (opt: TestQuestionOption) => opt.is_true
      );

      if (trueOptions.length <= 5) {
        const percent =
          trueOptions.length > 0 ? Math.round(100 / trueOptions.length) : 0;
        currentOptions.forEach((opt: TestQuestionOption) => {
          // @ts-ignore
          opt.percent = opt.is_true ? percent : 0;
        });
      } else {
        return;
      }
    }

    updateTestOptions(currentOptions);
  };

  // @ts-ignore
  const isMultiple = editedQuestion.component?.is_multiple || false;
  const testOptions = getTestOptions();

  return (
    <div className="space-y-6">
      {/* Текст вопроса */}
      <div className="space-y-2">
        <Label
          htmlFor="question-text"
          className="text-sm font-medium text-gray-700"
        >
          Текст вопроса
        </Label>
        <div className="border rounded-md">
          {renderEditor(editedQuestion.component?.question || "", (content) =>
            updateComponent({ question: content })
          )}
        </div>
      </div>

      {/* Опция множественного выбора */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="allow-multiple"
          // @ts-ignore
          checked={isMultiple}
          onCheckedChange={(checked) =>
            updateComponent({ is_multiple: checked })
          }
        />
        <Label
          htmlFor="allow-multiple"
          className="text-sm font-medium text-gray-700"
        >
          Разрешить несколько ответов
        </Label>
      </div>

      {/* Заголовок для вариантов ответов */}
      <div className="py-3 px-4 border-t border-b border-gray-200 bg-gray-50 text-gray-600 text-sm rounded-md">
        Варианты ответов
      </div>

      {/* Список вариантов ответов */}
      <div className="flex flex-col gap-4">
        {testOptions.map((option: TestQuestionOption, index: number) => {
          return (
            <div
              key={option.id || index}
              className="flex items-center justify-between gap-2"
            >
              <Checkbox
                checked={option.is_true}
                onCheckedChange={(checked) =>
                  updateOption(index, "is_true", checked)
                }
              />

              {isMultiple && (
                <Select
                  value={option.percent?.toString() ?? "null"}
                  onValueChange={(value) =>
                    updateOption(
                      index,
                      "percent",
                      value === "null" ? null : Number(value)
                    )
                  }
                >
                  <SelectTrigger className="h-[50px] text-xs ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {percentOptions.map((opt) => (
                      <SelectItem
                        key={opt.id?.toString() || null}
                        value={opt.id?.toString() || null}
                        className="text-xs"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex-1">
                {renderEditor(option.answer, (content) =>
                  updateOption(index, "answer", content)
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Кнопка добавления нового варианта */}
      <Button
        type="button"
        onClick={createOption}
        className="w-full"
        variant="outline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Добавить вариант ответа
      </Button>
    </div>
  );
};

export default TestQuestionEditor;
