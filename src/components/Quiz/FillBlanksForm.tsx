import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "../ui/accordion";
import { Question } from "@/types/quizQuestion";

type Props = {
  onAdd: (question: Omit<Question, "id">) => void;
  onCancel: () => void;
};

export default function FillBlanksForm({ onAdd, onCancel }: Props) {
  const [questionText, setQuestionText] = useState("");
  const [userHint, setUserHint] = useState("");
  const [callbackText, setCallbackText] = useState("");

  const difficultyLevels = [
    { value: "easy", label: "Легкий" },
    { value: "medium", label: "Средний" },
    { value: "hard", label: "Сложный" },
    { value: "easy-alpha", label: "Легкий (Альфа)" },
    { value: "medium-alpha", label: "Средний (Альфа)" },
    { value: "hard-alpha", label: "Сложный (Альфа)" },
  ];

  // Состояния для значений
  const [difficulty, setDifficulty] = useState("");
  const [points, setPoints] = useState("");
  const [penaltyPoints, setPenaltyPoints] = useState("");
  const [variant, setVariant] = useState("");

  const handleAdd = () => {
    if (!questionText.trim()) return;

    onAdd({
      type: "fill-blanks",
      content: {
        text: questionText,
        userHint,
        callbackText,
        difficulty,
        points: points ? parseFloat(points) : undefined,
        penaltyPoints: penaltyPoints ? parseFloat(penaltyPoints) : undefined,
        variant: variant ? parseInt(variant) : undefined,
      },
    });

    // Сброс формы
    setQuestionText("");
    setUserHint("");
    setCallbackText("");
    setDifficulty("");
    setPoints("");
    setPenaltyPoints("");
    setVariant("");
  };

  return (
    <div className="mt-6 p-6 border border-gray-200 rounded-md bg-white">
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
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">Выберите сложность</option>
                  {difficultyLevels.map((level) => (
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
                  onChange={(e) => setPoints(e.target.value)}
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
                  onChange={(e) => setPenaltyPoints(e.target.value)}
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
                  onChange={(e) => setVariant(e.target.value)}
                >
                  <option value="">Без варианта</option>
                  {Array.from({ length: 4 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Вариант {i + 1}
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
              <p className="text-gray-400">
                Подсказка пользователю перед ответом
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent className="p-4 border border-t-0 border-gray-300 rounded-b-md">
            <textarea
              value={userHint}
              onChange={(e) => setUserHint(e.target.value)}
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
              onChange={(e) => setCallbackText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Введите текст обратной связи"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
        >
          Отмена
        </button>
        <button
          onClick={handleAdd}
          disabled={!questionText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Готово
        </button>
      </div>
    </div>
  );
}
