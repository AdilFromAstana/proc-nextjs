"use client";
import React from "react";
import { Question } from "../WordToCreateTest";

interface Props {
  step: number;
  file: File | null;
  isImporting: boolean;
  questions: Question[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onImport: () => void;
}

const FooterControls: React.FC<Props> = ({
  step,
  file,
  isImporting,
  questions,
  onClose,
  onNext,
  onPrev,
  onImport,
}) => {
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
          onClick={onNext}
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
        <button onClick={onPrev} className="px-6 py-2 border rounded-md">
          Назад
        </button>
        <button
          onClick={onImport}
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

export default FooterControls;
