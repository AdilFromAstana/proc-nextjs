import { Question } from "@/types/quizQuestion";
import React from "react";

type Props = {
  onAdd: (question: Omit<Question, "id">) => void;
  onCancel: () => void;
};

export default function FreeQuestionForm({ onAdd, onCancel }: Props) {
  const [questionText, setQuestionText] = React.useState("");
  const [answer, setAnswer] = React.useState("");

  const handleAdd = () => {
    if (!questionText.trim() || !answer.trim()) return;

    onAdd({
      type: "free",
      content: {
        text: questionText,
        answer,
      },
    });

    setQuestionText("");
    setAnswer("");
  };

  return (
    <div className="mt-6 p-6 border border-gray-200 rounded-md bg-white">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Открытый вопрос
      </h2>
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
