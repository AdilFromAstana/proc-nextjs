import { Question, QuestionType } from "@/types/quizQuestion";
import React, { useState, useEffect } from "react";

import { mockQuizLibrary } from "@/mockQuiz";

// Типы для вопросов из библиотеки
type LibraryQuestion = {
  id: number;
  type: QuestionType;
  text: string;
  options?: Array<{ id: number; text: string; isCorrect: boolean }>;
  answer?: string;
  hint?: string;
  difficulty?: string;
  points?: number;
};

type Props = {
  onAdd: (question: Omit<Question, "id">) => void;
  onCancel: () => void;
};

export default function LibraryQuestionsForm({ onAdd, onCancel }: Props) {
  // Преобразование данных в формат LibraryQuestion
  const questions: LibraryQuestion[] = mockQuizLibrary.entities.data.map(
    (component: any) => {
      if (component.component_type === "FreeQuestionComponent") {
        return {
          id: component.id,
          type: "test",
          text: component.question || "",
          options:
            component.options?.map((opt: any) => ({
              id: opt.id,
              text: opt.answer || "",
              isCorrect: opt.is_true === 1,
            })) || [],
          hint: component.hint || undefined,
          difficulty: component.settings?.group,
          points: component.settings?.score_encouragement
            ? parseInt(component.settings.score_encouragement)
            : undefined,
        };
      } else if (component.component_type === "OpenQuestionComponent") {
        return {
          id: component.id,
          type: "free",
          text: component.question || "",
          answer: component.answer || "",
          hint: component.hint || undefined,
          difficulty: component.settings?.group,
          points: component.settings?.score_encouragement
            ? parseInt(component.settings.score_encouragement)
            : undefined,
        };
      }
      return {
        id: component.id,
        type: "test",
        text: component.question || "",
        hint: component.hint || undefined,
        difficulty: component.settings?.group,
        points: component.settings?.score_encouragement
          ? parseInt(component.settings.score_encouragement)
          : undefined,
      };
    }
  );

  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "test" | "free">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Фильтрация и пагинация
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || question.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Обработчики
  const handleSelectQuestion = (id: number) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((qid) => qid !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const handleAddSelected = () => {
    if (selectedQuestions.length === 0) return;

    selectedQuestions.forEach((questionId) => {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        onAdd({
          type: question.type,
          content: {
            text: question.text,
            options: question.options,
            answer: question.answer,
            hint: question.hint,
            difficulty: question.difficulty,
            points: question.points,
          },
        });
      }
    });

    setSelectedQuestions([]);
  };

  const handleCancel = () => {
    onCancel();
  };

  // Обновление страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Выбор типа компонента */}
      <div className="mb-6">
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as "all" | "test" | "free")
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Все типы</option>
          <option value="test">Тестовый вопрос</option>
          <option value="free">Открытый вопрос</option>
        </select>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по вопросам..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Список вопросов */}
      <div className="max-h-[60vh] overflow-y-auto mb-6">
        {currentQuestions.map((question) => (
          <div
            key={question.id}
            className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all ${
              selectedQuestions.includes(question.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onClick={() => handleSelectQuestion(question.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">
                {question.type === "test"
                  ? "Тестовый вопрос"
                  : "Открытый вопрос"}
              </span>
              {selectedQuestions.includes(question.id) && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 text-sm text-gray-600">Выбрать</span>
                </div>
              )}
            </div>

            <div className="mb-3">
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: question.text }}
              />
            </div>

            {question.type === "test" && question.options && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      disabled
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">{option.text}</span>
                  </div>
                ))}
              </div>
            )}

            {question.type === "free" && question.answer && (
              <div className="mt-2 p-2 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">Ответ</p>
                <p className="text-sm">{question.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Пагинация */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Показано {startIndex + 1}-
          {Math.min(endIndex, filteredQuestions.length)} из{" "}
          {filteredQuestions.length} вопросов
        </p>

        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Вперед
          </button>
        </div>
      </div>

      {/* Кнопки действия */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancel}
          className="px-6 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
        >
          Отмена
        </button>
        <button
          onClick={handleAddSelected}
          disabled={selectedQuestions.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Готово
        </button>
      </div>
    </div>
  );
}
