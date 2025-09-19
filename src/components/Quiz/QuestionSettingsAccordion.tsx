import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "../ui/accordion";

// Тип для уровней сложности
type DifficultyLevel = {
  value: string;
  label: string;
};

// Предустановленные уровни сложности
const DEFAULT_DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { value: "easy", label: "Легкий" },
  { value: "medium", label: "Средний" },
  { value: "hard", label: "Сложный" },
  { value: "easy-alpha", label: "Легкий (Альфа)" },
  { value: "medium-alpha", label: "Средний (Альфа)" },
  { value: "hard-alpha", label: "Сложный (Альфа)" },
];

type Props = {
  // Настройки сложности
  difficulty: string;
  onDifficultyChange: (value: string) => void;

  // Баллы
  points: string;
  onPointsChange: (value: string) => void;

  penaltyPoints: string;
  onPenaltyPointsChange: (value: string) => void;

  // Вариант
  variant: string;
  onVariantChange: (value: string) => void;

  // Подсказка и обратная связь
  userHint: string;
  onUserHintChange: (value: string) => void;

  callbackText: string;
  onCallbackTextChange: (value: string) => void;

  // Новые переключатели (только для открытых вопросов)
  attachments?: boolean;
  onAttachmentsChange?: (value: boolean) => void;

  antiplagiarism?: boolean;
  onAntiplagiarismChange?: (value: boolean) => void;

  // Тип вопроса для определения отображения переключателей
  questionType?: string;

  // Опционально: кастомные уровни сложности
  difficultyLevels?: DifficultyLevel[];
};

export default function QuestionSettingsAccordion({
  difficulty,
  onDifficultyChange,
  points,
  onPointsChange,
  penaltyPoints,
  onPenaltyPointsChange,
  variant,
  onVariantChange,
  userHint,
  onUserHintChange,
  callbackText,
  onCallbackTextChange,
  attachments,
  onAttachmentsChange,
  antiplagiarism,
  onAntiplagiarismChange,
  questionType = "test", // по умолчанию тестовый вопрос
  difficultyLevels = DEFAULT_DIFFICULTY_LEVELS,
}: Props) {
  // Показываем переключатели только для открытых вопросов
  const showToggleSwitches = questionType === "free";

  // Опции для вариантов
  const variantOptions = [
    { value: "", label: "Без варианта" },
    { value: "first", label: "1-й вариант" },
    { value: "second", label: "2-й вариант" },
    { value: "third", label: "3-й вариант" },
    { value: "fourth", label: "4-й вариант" },
  ];

  return (
    <div className="w-full">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="w-full text-left rounded-md">
            <div>
              <p>Дополнительные настройки</p>
              <p className="text-gray-500">
                Сложность вопроса, кол-во баллов и т.д.
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent className="p-4 border border-t-0 border-gray-300 rounded-b-md">
            <div className="space-y-4">
              {/* Выбор сложности */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сложность вопроса
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={difficulty}
                  onChange={(e) => onDifficultyChange(e.target.value)}
                >
                  <option value="">Выберите сложность</option>
                  {difficultyLevels.map((level: DifficultyLevel) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Баллы за правильный ответ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Баллы за правильный ответ
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={points}
                  onChange={(e) => onPointsChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите количество баллов"
                />
              </div>

              {/* Штрафные баллы */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Штрафные баллы за неправильный ответ
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={penaltyPoints}
                  onChange={(e) => onPenaltyPointsChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите штрафные баллы"
                />
              </div>

              {/* Вариант вопроса */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Вариант вопроса
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={variant}
                  onChange={(e) => onVariantChange(e.target.value)}
                >
                  {variantOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="w-full text-left rounded-md">
            <div>
              <p>Подсказка</p>
              <p className="text-gray-500">
                Подсказка пользователю перед ответом
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent className="p-4 border border-t-0 border-gray-300 rounded-b-md">
            <textarea
              value={userHint}
              onChange={(e) => onUserHintChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Введите подсказку для пользователя"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="w-full text-left rounded-md">
            <div>
              <p>Обратная связь</p>
              <p className="text-gray-500">
                Пользователь увидит объяснение после отправки ответа
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent className="p-4 border border-t-0 border-gray-300 rounded-b-md">
            <textarea
              value={callbackText}
              onChange={(e) => onCallbackTextChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Введите текст обратной связи"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Переключатели только для открытых вопросов */}
      {showToggleSwitches && onAttachmentsChange && onAntiplagiarismChange && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={attachments}
                onChange={(e) => onAttachmentsChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Разрешить прикреплять файлы
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={antiplagiarism}
                onChange={(e) => onAntiplagiarismChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Проверка на уникальность
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
