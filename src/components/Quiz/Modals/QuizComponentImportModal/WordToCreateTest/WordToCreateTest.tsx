"use client";
import React, { useEffect, useRef, useState } from "react";
import parseDocx from "../parseDocxLogic/parseDocx";

// Типы
export type Option = {
  answer: string;
  isCorrect: boolean;
  id: string;
  percent: number;
};

export type Question = {
  id: number;
  question: string;
  options: Option[];
  is_multiple: 1 | 0;
};

export type ParseError = { line: string; reason: string; questionId?: number };

// Компоненты
import { StepReviewHandle } from "./StepReview";
import ModalEdit from "./ModalEdit";
import FooterControls from "./StepContent/FooterControls";
import StepContent from "./StepContent/StepContent";
import StepHeader from "./StepHeader";

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
          {/* header */}
          <StepHeader
            step={step}
            parseErrors={parseErrors}
            showErrorSidebar={showErrorSidebar}
            setShowErrorSidebar={setShowErrorSidebar}
            showConfirm={showConfirm}
          />

          {/* content */}
          <StepContent
            ref={stepReviewRef}
            step={step}
            file={file}
            questions={questions}
            parseErrors={parseErrors}
            showErrorSidebar={showErrorSidebar}
            onFileChange={handleFileChange}
            onFileRemove={() => setFile(null)}
            onEdit={setEditingQuestion}
            onDelete={handleDeleteQuestion}
            onShowErrors={() => setShowErrorSidebar(true)}
            onClickError={(id) => stepReviewRef.current?.scrollToQuestion(id)}
          />

          {/* footer */}
          <div className="p-6 border-t flex justify-end">
            <FooterControls
              step={step}
              file={file}
              isImporting={isImporting}
              questions={questions}
              onClose={onClose}
              onNext={() => setStep(2)}
              onPrev={() => setStep(1)}
              onImport={handleFinalImport}
            />
          </div>
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
