"use client";
import React, { useState, useEffect } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import parseDocx from "./parseDocx";

// Типы
export type Option = {
  text: string;
  isCorrect: boolean;
  id: string; // уникальный ID для отслеживания
};

export type Question = {
  id: number;
  question: string;
  options: Option[];
};

// --- Иконка степпера ---
const StepIcon = ({
  number,
  isActive,
  isComplete,
}: {
  number: number;
  isActive: boolean;
  isComplete: boolean;
}) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300
        ${
          isComplete ? "bg-blue-600" : isActive ? "bg-blue-500" : "bg-gray-400"
        }`}
  >
    {number}
  </div>
);

// --- Модальное редактирование ---
const ModalEdit = ({
  question,
  onSave,
  onClose,
}: {
  question: Question;
  onSave: (q: Question) => void;
  onClose: () => void;
}) => {
  const [edited, setEdited] = useState<Question>(question);

  const handleOptionChange = (index: number, newText: string) => {
    const newOptions = [...edited.options];
    newOptions[index].text = newText;
    setEdited({ ...edited, options: newOptions });
  };

  const handleCorrectChange = (index: number) => {
    const newOptions = edited.options.map((o, i) => ({
      ...o,
      isCorrect: i === index,
    }));
    setEdited({ ...edited, options: newOptions });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Редактировать вопрос</h3>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          value={edited.question}
          onChange={(e) => setEdited({ ...edited, question: e.target.value })}
          rows={3}
        />
        {edited.options.map((opt, i) => (
          <div key={opt.id} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              checked={opt.isCorrect}
              onChange={() => handleCorrectChange(i)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <input
              type="text"
              value={opt.text}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        ))}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(edited)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Компонент для отображения вопроса с формулами ---
const QuestionRenderer = ({ question }: { question: Question }) => {
  const needOne = question.id === 1;
  if (needOne) console.log("question: ", question);
  // Обработка текста вопроса с формулами
  const processTextWithFormulas = (text: string) => {
    if (needOne)
      console.log("processTextWithFormulas in:", JSON.stringify(text));
    const parts = text.split(/(\[FORMULA:.*?\])/g);
    return parts.map((part, index) => {
      if (needOne) console.log("part: ", part);
      if (part.startsWith("[FORMULA:") && part.endsWith("]")) {
        const formulaContent = part.substring(9, part.length - 1);
        return <InlineMath key={index} math={formulaContent} />;
      } else {
        return part;
      }
    });
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <div className="font-semibold mb-2">
        <span className="font-bold">{question.id}.</span>{" "}
        {processTextWithFormulas(question.question)}
      </div>
      <ul className="list-disc list-inside text-sm">
        {question.options.map((o, i) => (
          <li
            key={o.id}
            className={o.isCorrect ? "text-green-600 font-medium" : ""}
          >
            {processTextWithFormulas(o.text)} {o.isCorrect && "(Верный)"}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Основной компонент ---
const WordToCreateTest = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleFileChange = async (f: File) => {
    setFile(f);

    try {
      const parsed = await parseDocx(f);
      console.log("Парсер нашёл вопросов:", parsed.length);
      setQuestions(parsed);
      setStep(2); // Переходим к списку вопросов
    } catch (error) {
      console.error("Ошибка парсинга:", error);
      alert("Ошибка при чтении файла.");
    }
  };

  const handleSaveEdit = (updated: Question) => {
    setQuestions(questions.map((q) => (q.id === updated.id ? updated : q)));
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот вопрос?")) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleFinalImport = () => {
    alert(`Импорт завершен! Всего вопросов: ${questions.length}`);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Шаг 1: Загрузка файла
            </h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
            >
              <p className="text-gray-500 mb-2">
                Перетащите DOCX сюда или выберите файл
              </p>
              <input
                type="file"
                className="hidden"
                id="file"
                accept=".docx"
                onChange={(e) =>
                  e.target.files && handleFileChange(e.target.files[0])
                }
              />
              <label
                htmlFor="file"
                className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
              >
                Выбрать файл
              </label>
            </div>
            {file && (
              <div className="mt-4 p-2 border bg-gray-50">{file.name}</div>
            )}
            <div className="mt-8 text-right">
              <button
                onClick={() => file && setStep(2)}
                disabled={!file}
                className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                Далее
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Шаг 2: Проверка и редактирование
            </h2>
            <div className="space-y-4">
              {questions.length === 0 ? (
                <p className="text-center text-gray-500">
                  Вопросы не найдены. Проверьте формат файла.
                </p>
              ) : (
                questions.map((q) => (
                  <div key={q.id}>
                    <QuestionRenderer question={q} />
                    <div className="mt-2 flex justify-between">
                      <button
                        onClick={() => {
                          setEditingQuestion(q);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 border rounded-md text-blue-600 text-sm"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="px-3 py-1 border rounded-md text-red-600 text-sm"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border rounded-md"
              >
                Назад
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={questions.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                Далее
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Шаг 3: Импорт</h2>
            <p>Всего вопросов для импорта: {questions.length}</p>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 border rounded-md"
              >
                Назад
              </button>
              <button
                onClick={handleFinalImport}
                className="px-6 py-2 bg-green-600 text-white rounded-md"
              >
                Импортировать
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 h-full">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl h-full">
        {/* Степпер */}
        <div className="flex justify-between items-center p-8 border-b">
          <div className="flex items-center space-x-2">
            <StepIcon number={1} isActive={step === 1} isComplete={step > 1} />
            <span>Загрузка</span>
          </div>
          <div
            className={`flex-1 h-0.5 mx-4 ${
              step > 1 ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
          <div className="flex items-center space-x-2">
            <StepIcon number={2} isActive={step === 2} isComplete={step > 2} />
            <span>Проверка</span>
          </div>
          <div
            className={`flex-1 h-0.5 mx-4 ${
              step > 2 ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
          <div className="flex items-center space-x-2">
            <StepIcon number={3} isActive={step === 3} isComplete={step > 3} />
            <span>Импорт</span>
          </div>
        </div>
        <div className="p-6">{renderStepContent()}</div>
        {isModalOpen && editingQuestion && (
          <ModalEdit
            question={editingQuestion}
            onSave={handleSaveEdit}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default WordToCreateTest;
