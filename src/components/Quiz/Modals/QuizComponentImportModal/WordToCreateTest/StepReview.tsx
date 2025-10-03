"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ParseError, Question } from "./WordToCreateTest";
import QuestionRenderer from "./QuestionRenderer";
import { Button } from "@/components/ui/button";

export type StepReviewHandle = {
  scrollToQuestion: (id: number) => void;
};

const StepReview = forwardRef<
  StepReviewHandle,
  {
    questions: Question[];
    onEdit: (q: Question) => void;
    onDelete: (id: number) => void;
    parseErrors: ParseError[];
    onShowErrors: () => void;
  }
>(({ questions, onEdit, onDelete, parseErrors, onShowErrors }, ref) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showErrorSidebar, setShowErrorSidebar] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const totalPages = Math.ceil(questions.length / pageSize);

  const currentQuestions = questions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ссылки на вопросы для скролла
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useImperativeHandle(ref, () => ({
    scrollToQuestion,
  }));

  const scrollToQuestion = (id: number) => {
    const qIndex = questions.findIndex((q) => q.id === id);
    if (qIndex === -1) return;

    const targetPage = Math.floor(qIndex / pageSize) + 1;
    setPage(targetPage);

    setTimeout(() => {
      const el = questionRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedId(id);

        // сброс через время чуть больше анимации: 0.6s × 3 = 1.8s, добавим чуть
        setTimeout(() => {
          setHighlightedId(null);
        }, 3000);
      }
    }, 200);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages.map((p, i) =>
      typeof p === "number" ? (
        <Button
          key={i}
          onClick={() => setPage(p)}
          className={`px-3 py-1 border rounded cursor-pointer ${
            p === page
              ? "bg-blue-600 text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          {p}
        </Button>
      ) : (
        <span key={i} className="px-2">
          {p}
        </span>
      )
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Список вопросов */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {currentQuestions.map((q) => (
          <QuestionRenderer
            key={q.id}
            questionRefs={questionRefs}
            highlightedId={highlightedId}
            question={q}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Пагинация и селект */}
      {questions.length > 0 && (
        <div className="mt-4 flex justify-between items-center border-t pt-4">
          {/* Левая часть - страницы */}
          <div className="flex items-center gap-2">{renderPageNumbers()}</div>

          {/* Правая часть - селект */}
          <div className="flex items-center gap-2">
            <span>Показать:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              {[5, 10, 20, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Сайдбар ошибок */}
      {showErrorSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowErrorSidebar(false)}
          />
          <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Ошибки парсинга</h3>
            <ul className="space-y-3">
              {parseErrors.map((err, i) => (
                <li
                  key={i}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (err.questionId) {
                      scrollToQuestion(err.questionId);
                      setShowErrorSidebar(false);
                    }
                  }}
                >
                  <p className="text-sm">
                    {err.questionId ? (
                      <span className="font-medium">
                        Вопрос {err.questionId}:{" "}
                      </span>
                    ) : null}
                    {err.reason}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
});

export default StepReview;
