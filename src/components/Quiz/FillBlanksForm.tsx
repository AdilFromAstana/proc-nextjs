import React, { useState } from "react";
import { Question } from "@/types/quizQuestion";
import QuestionSettingsAccordion from "./QuestionSettingsAccordion";

type Props = {
  onAdd: (question: Omit<Question, "id">) => void;
  onCancel: () => void;
};

export default function FillBlanksForm({ onAdd, onCancel }: Props) {
  const [questionText, setQuestionText] = useState("");
  const [userHint, setUserHint] = useState("");
  const [callbackText, setCallbackText] = useState("");

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

      <QuestionSettingsAccordion
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        points={points}
        onPointsChange={setPoints}
        penaltyPoints={penaltyPoints}
        onPenaltyPointsChange={setPenaltyPoints}
        variant={variant}
        onVariantChange={setVariant}
        userHint={userHint}
        onUserHintChange={setUserHint}
        callbackText={callbackText}
        onCallbackTextChange={setCallbackText}
      />

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
