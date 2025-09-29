"use client";
import React, { useEffect, useRef, useState } from "react";
import parseDocx from "../parseDocxLogic/parseDocx";

// Типы
export type Option = {
  text: string;
  isCorrect: boolean;
  id: string;
};

export type Question = {
  id: number;
  question: string;
  options: Option[];
};

export type ParseError = { line: string; reason: string; questionId?: number };

// Компоненты
import StepIcon from "./StepIcon";
import StepUpload from "./StepUpload";
import StepReview, { StepReviewHandle } from "./StepReview";
import ModalEdit from "./ModalEdit";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const WordToCreateTest: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showErrorSidebar, setShowErrorSidebar] = useState(false);

  const stepReviewRef = useRef<StepReviewHandle>(null);

  // --- Handlers ---
  const handleFileChange = async (f: File) => {
    setFile(f);
    try {
      const { questions, errors } = await parseDocx(f);
      setQuestions(questions);
      setParseErrors(errors);
      setStep(2);
    } catch (error) {
      console.error("Ошибка парсинга:", error);
      alert("Ошибка при чтении файла.");
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setQuestions([]);
  };

  const handleSaveEdit = (updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm("Удалить этот вопрос?")) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleFinalImport = async () => {
    setIsImporting(true);
    await new Promise((res) => setTimeout(res, 1500)); // эмуляция запроса
    alert(`Импорт завершен! Всего вопросов: ${questions.length}`);
    setIsImporting(false);
    onClose();
  };

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (step === 2 && parseErrors.length > 0 && !showErrorSidebar) {
      setShowConfirm(true);
      const timer = setTimeout(() => setShowConfirm(false), 5000); // ⏱️ 5 секунд
      return () => clearTimeout(timer);
    }
  }, [step, parseErrors, showErrorSidebar]);

  // --- Контент шагов ---
  const renderStepContent = () => {
    if (step === 1) {
      return (
        <StepUpload
          file={file}
          onFileChange={handleFileChange}
          onFileRemove={handleFileRemove}
        />
      );
    }

    if (step === 2) {
      return (
        <StepReview
          ref={stepReviewRef}
          parseErrors={parseErrors}
          questions={questions}
          onEdit={setEditingQuestion}
          onDelete={handleDeleteQuestion}
          onShowErrors={() => setShowErrorSidebar(true)}
        />
      );
    }

    return null;
  };

  // --- Кнопки футера ---
  const renderFooter = () => {
    if (step === 1) {
      return (
        <div className="flex justify-between w-full">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-md bg-red-700 cursor-pointer text-white"
          >
            Закрыть
          </button>
          <button
            onClick={() => setStep(2)}
            disabled={!file}
            className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 cursor-pointer"
          >
            Далее
          </button>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="flex justify-between w-full">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-2 border rounded-md"
          >
            Назад
          </button>
          <button
            onClick={handleFinalImport}
            disabled={questions.length === 0 || isImporting}
            className="px-6 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 flex items-center gap-2"
          >
            {isImporting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Импортировать
          </button>
        </div>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* фон */}
      <div className="fixed inset-0 bg-black/60 z-40" />

      {/* контент */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
          {/* Header со степпером */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-2">
              <StepIcon
                number={1}
                isActive={step === 1}
                isComplete={step > 1}
              />
              <span>Загрузка</span>
            </div>
            <div
              className={`flex-1 h-0.5 mx-4 ${
                step > 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
            <div className="flex items-center space-x-2">
              <StepIcon number={2} isActive={step === 2} isComplete={false} />
              <span>Проверка</span>
            </div>
          </div>

          <div className="px-6 pt-4 pb-2 border-b">
            <h2 className="text-xl font-semibold flex items-center justify-between">
              {step === 1 && "Шаг 1: Загрузка файла"}
              {step === 2 && "Шаг 2: Проверка и редактирование"}

              {/* Кнопка показать/скрыть ошибки */}
              {step === 2 && parseErrors.length > 0 && (
                <div className="relative">
                  <Button
                    onClick={() => setShowErrorSidebar((v) => !v)}
                    className={`ml-4 text-sm ${
                      showErrorSidebar
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                  >
                    {showErrorSidebar ? "Скрыть ошибки" : "Показать ошибки"}
                  </Button>

                  {/* Popconfirm (авто-скрытие через showConfirm) */}
                  {!showErrorSidebar && (
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-md border border-black bg-white shadow-lg z-50
      transition-opacity duration-700
      ${showConfirm ? "opacity-100" : "opacity-0"}`}
                    >
                      {/* стрелка */}
                      <div
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 
                    border-l-8 border-r-8 border-b-8 
                    border-l-transparent border-r-transparent 
                    border-b-white"
                        style={{
                          borderBottomColor: "white",
                          filter: "drop-shadow(0 -1px 0 black)",
                        }}
                      />

                      <div className="p-3 text-sm text-gray-700 text-center">
                        ⚠️ Обнаружены ошибки при парсинге.
                        <div className="mt-2 text-xs text-gray-500">
                          Нажмите, чтобы открыть список
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </h2>
          </div>

          {/* Контент */}
          <div className="flex gap-2 p-6 flex-1 overflow-hidden">
            {/* Контент */}
            <div className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
              {renderStepContent()}
            </div>

            {/* Сайдбар */}
            {step === 2 && (
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden
                ${showErrorSidebar ? "w-76 opacity-100" : "w-0 opacity-0"}`}
              >
                <div className="h-full bg-white rounded-lg shadow-lg overflow-y-auto">
                  <ul className="space-y-3">
                    {parseErrors.map((err, i) => (
                      <li
                        key={i}
                        className="p-3 border rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          if (err.questionId) {
                            stepReviewRef.current?.scrollToQuestion(
                              err.questionId
                            );
                          }
                        }}
                      >
                        <p className="text-sm">
                          {err.questionId && (
                            <span className="font-medium">
                              Вопрос {err.questionId}:{" "}
                            </span>
                          )}
                          {err.reason}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t flex justify-end">{renderFooter()}</div>
        </div>

        {editingQuestion && (
          <ModalEdit
            question={editingQuestion}
            onSave={handleSaveEdit}
            onClose={() => setEditingQuestion(null)}
          />
        )}
      </div>
    </>
  );
};

export default WordToCreateTest;
