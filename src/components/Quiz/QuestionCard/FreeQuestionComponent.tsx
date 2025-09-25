// FreeQuestionComponent.tsx
import React, { useState, useEffect, useCallback } from "react";
import { CustomEditor } from "../../Chunks/CustomEditor";
import { Select } from "./Select";
import { ConfirmModal } from "./ConfirmModal";
import { FormatTextModal } from "./FormatTextModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@radix-ui/react-checkbox";

// Модели данных
interface FreeQuestionOption {
  id: string;
  is_true: boolean;
  percent: number | null;
  answer: string;
}

interface FreeQuestionSettings {
  difficulty?: string;
  score_encouragement?: string;
  score_penalty?: string;
  variant?: string;
  hint?: string;
  feedback?: string;
}

interface FreeQuestionEntity {
  question: string;
  is_multiple: boolean;
  options: FreeQuestionOption[];
  settings: FreeQuestionSettings;
  hint: string;
  feedback: string;
}

// Типы для компонента
type Mode = "edit" | "view";
type ActiveSettingOption = "hint" | "feedback" | null;

interface FreeQuestionComponentProps {
  mode: Mode;
  initialEntity?: Partial<FreeQuestionEntity>;
  isEditMode?: boolean;
  onSave?: (entity: FreeQuestionEntity) => void;
  onCancel?: () => void;
}

// Генерация ID для опций
const generateId = () => Math.random().toString(36).substr(2, 9);

// Опции процентов
const percentOptions = [
  { id: 100, label: "100%" },
  { id: 75, label: "75%" },
  { id: 50, label: "50%" },
  { id: 33, label: "33%" },
  { id: 25, label: "25%" },
  { id: 20, label: "20%" },
  { id: 10, label: "10%" },
  { id: 0, label: "0%" },
  { id: null, label: "—" },
];

export const FreeQuestionComponent: React.FC<FreeQuestionComponentProps> = ({
  mode = "edit",
  initialEntity,
  isEditMode = false,
  onSave,
  onCancel,
}) => {
  // Состояние сущности
  const [entity, setEntity] = useState<FreeQuestionEntity>({
    question: "",
    is_multiple: false,
    options: [],
    settings: {},
    hint: "",
    feedback: "",
    ...initialEntity,
  });

  const [activeSettingOption, setActiveSettingOption] =
    useState<ActiveSettingOption>(null);
  const [isFormatTextModalOpen, setIsFormatTextModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [tempQuestion, setTempQuestion] = useState("");

  // Создание начальных опций
  useEffect(() => {
    if (entity.options.length === 0) {
      createOption();
      createOption();
    }
  }, [entity.options.length]);

  // Создание новой опции
  const createOption = useCallback(() => {
    setEntity((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id: generateId(),
          is_true: false,
          percent: null,
          answer: "",
        },
      ],
    }));
  }, []);

  // Удаление опции
  const deleteOption = useCallback((index: number) => {
    setEntity((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  }, []);

  // Обработка изменения опции
  const handleOptionChange = useCallback(
    (index: number, field: keyof FreeQuestionOption, value: any) => {
      setEntity((prev) => {
        const newOptions = [...prev.options];
        newOptions[index] = { ...newOptions[index], [field]: value };

        // Если изменяется флаг правильности ответа
        if (field === "is_true") {
          const trueOptions = newOptions.filter((opt) => opt.is_true);

          // Максимум 5 правильных ответов
          if (trueOptions.length > 5) {
            return prev; // Не обновляем, если превышено ограничение
          }

          // Пересчитываем проценты
          const percent =
            trueOptions.length > 0 ? Math.round(100 / trueOptions.length) : 0;
          newOptions.forEach((opt) => {
            opt.percent = opt.is_true ? percent : 0;
          });
        }

        return { ...prev, options: newOptions };
      });
    },
    []
  );

  // Форматирование текста через GPT
  const formatTextGPT = useCallback(() => {
    setTempQuestion(entity.question);
    setIsFormatTextModalOpen(true);
  }, [entity.question]);

  // Обработка отформатированного текста
  const handleTextFormatted = useCallback(
    (text: string) => {
      setEntity((prev) => ({ ...prev, question: text }));
      setIsFormatTextModalOpen(false);
      // Автоматическое сохранение после форматирования
      onSave?.({ ...entity, question: text });
    },
    [entity, onSave]
  );

  // Отмена изменений
  const discardComponent = useCallback(() => {
    if (isEditMode) {
      setIsConfirmModalOpen(true);
    } else {
      onCancel?.();
    }
  }, [isEditMode, onCancel]);

  // Проверка возможности сохранения
  const allowForSave = entity.question && entity.options.length > 0;

  // Сохранение компонента
  const saveComponent = useCallback(() => {
    if (allowForSave) {
      onSave?.(entity);
    }
  }, [entity, onSave, allowForSave]);

  // Рендер редактора с кнопкой удаления
  const renderEditorWithDelete = (
    value: string,
    onChange: (value: string) => void,
    index: number
  ) => (
    <div className="relative">
      <CustomEditor
        value={value}
        onChange={onChange}
        floated={true}
        height={50}
        pToolbar="delete |"
        buttons={[
          {
            id: "delete",
            icon: "remove",
            onAction: () => deleteOption(index),
          },
        ]}
      />
    </div>
  );

  // Редакторский режим
  if (mode === "edit") {
    return (
      <div className="quiz-free-question-component rounded-lg bg-white p-5">
        {/* ВОПРОС */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Вопрос
          </label>
          <CustomEditor
            value={entity.question}
            onChange={(value) =>
              setEntity((prev) => ({ ...prev, question: value }))
            }
            floated={true}
          />
        </div>

        {/* МНОЖЕСТВЕННЫЙ ВЫБОР */}
        <div className="mb-6">
          <div className="flex items-center">
            <Checkbox
              checked={entity.is_multiple}
              onCheckedChange={(checked) =>
                setEntity((prev) => ({ ...prev, is_multiple: checked }))
              }
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Разрешить несколько ответов
            </span>
          </div>
        </div>

        {/* ОПИСАНИЕ ОПЦИЙ */}
        <div className="question-option-description py-5 px-5 -mx-5 border-t border-b border-gray-300 bg-gray-50 text-gray-600 text-base font-normal mb-6">
          Введите варианты ответов
        </div>

        {/* СПИСОК ОПЦИЙ */}
        {entity.options.length > 0 && (
          <div className="question-option-list mb-6">
            {entity.options.map((option, index) => (
              <div
                key={option.id}
                className="question-option-item flex flex-row flex-nowrap justify-start items-center gap-5 mt-5"
              >
                <div className="question-option-checkbox basis-8 text-center">
                  <Checkbox
                    checked={option.is_true}
                    onChange={(checked) =>
                      handleOptionChange(index, "is_true", checked)
                    }
                  />
                </div>

                {entity.is_multiple && (
                  <div className="question-option-percent basis-24">
                    <Select
                      value={option.percent}
                      onChange={(value) =>
                        handleOptionChange(index, "percent", value)
                      }
                      options={percentOptions}
                      theme="gray"
                      required={true}
                      placeholder="Процент"
                    />
                  </div>
                )}

                <div className="question-option-textarea flex-1">
                  {renderEditorWithDelete(
                    option.answer,
                    (value) => handleOptionChange(index, "answer", value),
                    index
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ДОБАВИТЬ НОВЫЙ ВАРИАНТ */}
        <div className="mb-6">
          <Button color="blue" onClick={createOption}>
            Добавить вариант ответа
          </Button>
        </div>

        {/* НАСТРОЙКИ КОМПОНЕНТА */}
        <div className="component-settings mb-6 -mx-5">
          {/* ПОДСКАЗКА */}
          <div
            className={`component-setting-item ${
              activeSettingOption === "hint"
                ? "active bg-blue-50 border-l-4 border-blue-500"
                : "border-l-4 border-transparent"
            } p-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50`}
            onClick={() => setActiveSettingOption("hint")}
          >
            <div className="setting-item-header flex items-start">
              <div className="setting-icon mr-3 mt-1">
                <Icon name="hand-paper" />
              </div>
              <div className="setting-label">
                <div className="setting-title font-medium text-gray-900">
                  Подсказка
                </div>
                <div className="setting-description text-sm text-gray-500">
                  Подсказка для пользователя
                </div>
              </div>
            </div>

            {activeSettingOption === "hint" && (
              <div
                className="setting-item-content mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <CustomEditor
                  value={entity.hint}
                  onChange={(value) =>
                    setEntity((prev) => ({ ...prev, hint: value }))
                  }
                  floated={true}
                />
              </div>
            )}
          </div>

          {/* ОБРАТНАЯ СВЯЗЬ */}
          <div
            className={`component-setting-item ${
              activeSettingOption === "feedback"
                ? "active bg-blue-50 border-l-4 border-blue-500"
                : "border-l-4 border-transparent"
            } p-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50`}
            onClick={() => setActiveSettingOption("feedback")}
          >
            <div className="setting-item-header flex items-start">
              <div className="setting-icon mr-3 mt-1">
                <Icon name="comment-alt" />
              </div>
              <div className="setting-label">
                <div className="setting-title font-medium text-gray-900">
                  Обратная связь
                </div>
                <div className="setting-description text-sm text-gray-500">
                  Обратная связь после ответа
                </div>
              </div>
            </div>

            {activeSettingOption === "feedback" && (
              <div
                className="setting-item-content mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <CustomEditor
                  value={entity.feedback}
                  onChange={(value) =>
                    setEntity((prev) => ({ ...prev, feedback: value }))
                  }
                  floated={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* ФУТЕР */}
        {isEditMode && (
          <div className="assessment-component-footer flex justify-end gap-3 pt-5 border-t border-gray-200">
            <Button color="red-static" onClick={discardComponent}>
              Отмена
            </Button>
            <Button
              color="blue"
              disabled={!allowForSave}
              onClick={saveComponent}
            >
              Готово
            </Button>
          </div>
        )}

        {/* МОДАЛЬНЫЕ ОКНА */}
        <FormatTextModal
          isOpen={isFormatTextModalOpen}
          text={tempQuestion}
          onClose={() => setIsFormatTextModalOpen(false)}
          onAccept={handleTextFormatted}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => {
            setIsConfirmModalOpen(false);
            onCancel?.();
          }}
          title="Отменить изменения?"
          message="Вы уверены, что хотите отменить все изменения?"
        />
      </div>
    );
  }

  // Режим просмотра
  return (
    <div className="quiz-free-question-component w-full">
      <div className="question-component-view">
        <div className="question-question-wrap relative">
          <div
            className="question-question text-base font-medium leading-5"
            dangerouslySetInnerHTML={{ __html: entity.question }}
          />
          <a
            href="#"
            className="question-gpt-action text-blue-600 cursor-pointer opacity-50 hover:opacity-100 ml-2 transition-all duration-100"
            onClick={(e) => {
              e.preventDefault();
              formatTextGPT();
            }}
          >
            <Icon name="AutoFix" className="w-5 h-5" />
          </a>
        </div>

        {entity.options.length > 0 && (
          <div className="question-options mt-1.5 -mb-5">
            {entity.options.map((option, index) => (
              <div
                key={option.id}
                className="question-option border-b border-gray-100 flex flex-row flex-nowrap justify-start items-center gap-5 py-5 -mx-5 px-5 last:border-b-0"
              >
                <div className="question-option-radio basis-8">
                  <Checkbox
                    checked={option.is_true}
                    disabled={true}
                    onChange={() => null}
                  />
                </div>
                <div
                  className="question-option-answer text-gray-700 text-sm font-medium"
                  dangerouslySetInnerHTML={{ __html: option.answer }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* МОДАЛЬНЫЕ ОКНА */}
      <FormatTextModal
        isOpen={isFormatTextModalOpen}
        text={tempQuestion}
        onClose={() => setIsFormatTextModalOpen(false)}
        onAccept={handleTextFormatted}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          setIsConfirmModalOpen(false);
          onCancel?.();
        }}
        title="Отменить изменения?"
        message="Вы уверены, что хотите отменить все изменения?"
      />
    </div>
  );
};
