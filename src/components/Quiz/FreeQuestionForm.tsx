import { Question } from "@/types/quizQuestion";
import React, { useState, useEffect } from "react";

type FreeQuestionContent = {
  text: string;
  answer: string;
};

type Props = {
  onAdd: (question: Omit<Question, "id">) => void;
  onCancel: () => void;
  initialData?: Partial<FreeQuestionContent>;
};

export default function FreeQuestionForm({
  onAdd,
  onCancel,
  initialData,
}: Props) {
  const [questionText, setQuestionText] = useState(initialData?.text || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");

  // Обновляем состояние при изменении initialData
  useEffect(() => {
    if (initialData) {
      setQuestionText(initialData.text || "");
      setAnswer(initialData.answer || "");
    }
  }, [initialData]);

  const handleAdd = () => {
    if (!questionText.trim() || !answer.trim()) return;

    onAdd({
      type: "free",
      content: {
        text: questionText,
        answer,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Вопрос
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Введите текст вопроса"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ответ
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Введите правильный ответ"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
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
          onClick={handleAdd}
          disabled={!questionText.trim() || !answer.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Готово
        </button>
      </div>
    </div>
  );
}
