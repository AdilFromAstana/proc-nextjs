import { Question } from "@/types/quizQuestion";
import React, { useState, useEffect } from "react";

type AnswerOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type TestQuestionContent = {
  text: string;
  allowMultipleAnswers: boolean;
  options: AnswerOption[];
};

type Props = {
  onAdd: (question: Omit<Question, "id">) => void;
  onCancel: () => void;
  initialData?: TestQuestionContent;
};

export default function TestQuestionForm({
  onAdd,
  onCancel,
  initialData,
}: Props) {
  const [questionText, setQuestionText] = useState(initialData?.text || "");
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(
    initialData?.allowMultipleAnswers || false
  );
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>(
    initialData?.options || [
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
    ]
  );

  // Обновляем состояние при изменении initialData
  useEffect(() => {
    if (initialData) {
      setQuestionText(initialData.text || "");
      setAllowMultipleAnswers(initialData.allowMultipleAnswers || false);
      setAnswerOptions(
        initialData.options || [
          { id: "1", text: "", isCorrect: false },
          { id: "2", text: "", isCorrect: false },
        ]
      );
    }
  }, [initialData]);

  const addAnswerOption = () => {
    if (answerOptions.length < 5) {
      const newId = Date.now().toString();
      setAnswerOptions([
        ...answerOptions,
        { id: newId, text: "", isCorrect: false },
      ]);
    }
  };

  const removeAnswerOption = (id: string) => {
    if (answerOptions.length > 2) {
      setAnswerOptions(answerOptions.filter((option) => option.id !== id));
    }
  };

  const updateAnswerText = (id: string, text: string) => {
    setAnswerOptions(
      answerOptions.map((option) =>
        option.id === id ? { ...option, text } : option
      )
    );
  };

  const toggleAnswerCorrect = (id: string) => {
    if (allowMultipleAnswers) {
      setAnswerOptions(
        answerOptions.map((option) =>
          option.id === id
            ? { ...option, isCorrect: !option.isCorrect }
            : option
        )
      );
    } else {
      setAnswerOptions(
        answerOptions.map((option) => ({
          ...option,
          isCorrect: option.id === id ? !option.isCorrect : false,
        }))
      );
    }
  };

  const saveQuestion = () => {
    if (!questionText.trim()) return;

    const hasCorrectAnswer = answerOptions.some((option) => option.isCorrect);
    if (!hasCorrectAnswer) {
      alert("Пожалуйста, отметьте хотя бы один правильный ответ");
      return;
    }

    onAdd({
      type: "test",
      content: {
        text: questionText,
        allowMultipleAnswers,
        options: answerOptions,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Поле для вопроса */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Вопрос
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Введите текст вопроса"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>

      {/* Свитч разрешения нескольких ответов */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={allowMultipleAnswers}
            onChange={(e) => setAllowMultipleAnswers(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`relative w-12 h-6 rounded-full ${
              allowMultipleAnswers ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                allowMultipleAnswers ? "transform translate-x-6" : ""
              }`}
            ></div>
          </div>
          <span className="ml-3 text-sm text-gray-700">
            Разрешить несколько ответов
          </span>
        </label>
      </div>

      {/* Варианты ответов */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Введите варианты ответов
        </h3>
        <div className="space-y-3">
          {answerOptions.map((option) => (
            <div key={option.id} className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => toggleAnswerCorrect(option.id)}
                className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${
                  option.isCorrect
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {option.isCorrect && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateAnswerText(option.id, e.target.value)}
                placeholder="Введите вариант ответа"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {answerOptions.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeAnswerOption(option.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {answerOptions.length < 5 && (
          <button
            type="button"
            onClick={addAnswerOption}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <span>+</span>
            <span>Добавить вариант ответа</span>
          </button>
        )}
      </div>

      {/* Кнопки действия */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
        >
          Отмена
        </button>
        <button
          onClick={saveQuestion}
          disabled={!questionText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Готово
        </button>
      </div>
    </div>
  );
}
