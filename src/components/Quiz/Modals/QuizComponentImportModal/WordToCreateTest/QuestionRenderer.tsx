"use client";
import { RefObject, useState } from "react";
import { Question } from "./WordToCreateTest";
import { ProcessTextWithRichContent } from "../parseDocxLogic/processRichText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen, // редактировать
  faTrash, // удалить
  faSave, // сохранить
  faTimes, // отмена
} from "@fortawesome/free-solid-svg-icons";
import { AnswerOption } from "./AnswerOption";
import { useQuestionOptions } from "@/hooks/useQuestionOptions";

interface QuestionRendererProps {
  questionRefs: RefObject<Record<number, HTMLDivElement>>;
  highlightedId: number | null;
  question: Question;
  onEdit: (q: Question) => void;
  onDelete: (id: number) => void;
}

export default function QuestionRenderer({
  questionRefs,
  highlightedId,
  question,
  onEdit,
  onDelete,
}: QuestionRendererProps) {
  const {
    options,
    setOptions,
    toggleCorrect,
    updatePercent,
    removeOption,
    addOption,
    updateOptionAnswer,
  } = useQuestionOptions(
    question.options.map((opt) => ({
      ...opt,
      percent: opt.percent ?? 0,
    }))
  );

  const [isEditing, setIsEditing] = useState(false);

  const saveQuestion = () => {
    const updatedQuestion: Question = {
      ...question,
      options: options.map((o) => ({
        id: o.id,
        answer: o.answer,
        isCorrect: o.isCorrect,
        percent: o.percent,
      })),
    };
    onEdit(updatedQuestion);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setOptions(
      question.options.map((opt) => ({
        ...opt,
        isEditing: false,
        answer: opt.answer,
      }))
    );
    setIsEditing(false);
  };

  return (
    <div
      ref={(el) => {
        questionRefs.current[question.id] = el;
      }}
      className={`p-4 border rounded-lg bg-gray-50 shadow-sm transition-colors ${
        highlightedId === question.id ? "flash-3" : ""
      }`}
    >
      {/* 🔽 Скрываем MathML, чтобы не дублировалось (сохраняем для совместимости) */}
      <style jsx global>{`
        .katex .katex-html {
          display: none !important;
        }
      `}</style>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Блок Вопроса */}
        <div className="p-5 border-b border-slate-100">
          <div className="text-xl font-extrabold text-slate-800 flex items-start">
            <span className="font-bold mr-3 text-blue-600">{question.id}.</span>
            {/* Предполагаем, что processTextWithRichContent возвращает JSX */}
            <div className="flex-1 relative text-lg">
              <ProcessTextWithRichContent
                text={question.question}
                editable={isEditing}
                key={question.id}
              />
            </div>
          </div>
        </div>

        {/* Варианты ответа */}
        <div className="divide-y divide-slate-100 flex flex-col p-2">
          {options.map((o) => {
            return (
              <AnswerOption
                updateOptionAnswer={updateOptionAnswer}
                isEditing={isEditing}
                option={o}
                removeOption={removeOption}
                toggleCorrect={toggleCorrect}
                updatePercent={updatePercent}
              />
            );
          })}
        </div>

        {isEditing && (
          <div className="p-4 border-t bg-slate-50 text-center rounded-b-xl">
            <button
              onClick={addOption}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md flex items-center mx-auto cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Добавить новый вариант
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-end gap-3">
        {isEditing ? (
          <>
            {/* Сохранить */}
            <button
              onClick={saveQuestion}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
            >
              <FontAwesomeIcon icon={faSave} />
              <span>Сохранить</span>
            </button>

            {/* Отмена */}
            <button
              onClick={cancelEditing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:ring-2 focus:ring-slate-300 transition"
            >
              <FontAwesomeIcon icon={faTimes} />
              <span>Отмена</span>
            </button>
          </>
        ) : (
          <>
            {/* Редактировать */}
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 focus:ring-2 focus:ring-blue-300 transition"
            >
              <FontAwesomeIcon icon={faPen} />
              <span>Редактировать</span>
            </button>

            {/* Удалить */}
            <button
              onClick={() => {
                if (confirm("Вы уверены, что хотите удалить этот вопрос?")) {
                  onDelete(question.id);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 focus:ring-2 focus:ring-red-300 transition"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>Удалить</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
