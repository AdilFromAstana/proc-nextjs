import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import FillBlanksForm from "./FillBlanksForm";
import DragNDropForm from "./DragNDropForm";
import TestQuestionForm from "./TestQuestionForm";
import FreeQuestionForm from "./FreeQuestionForm";
import { ApiQuizResponse, Question, QuestionType } from "@/types/quizQuestion";

type Props = {
  initialQuiz?: ApiQuizResponse;
};

export default function CreateQuizComponent({ initialQuiz }: Props) {
  const [quizName, setQuizName] = useState(initialQuiz?.entity?.name || "");
  const [quizDescription, setQuizDescription] = useState(
    initialQuiz?.entity?.description || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [variant, setVariant] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const remainingChars = 200 - quizDescription.length;

  const [questions, setQuestions] = useState<Question[]>(() => {
    if (initialQuiz?.entity?.components) {
      return initialQuiz.entity.components.map((component, index) => {
        const baseQuestion: Question = {
          id: `q-${component.id}`,
          type: mapApiComponentTypeToQuestionType(component.component_type),
          content: convertApiComponentToContent(component),
          settings: component.settings,
          position: component.position,
        };
        return baseQuestion;
      });
    }
    return [];
  });

  const quizQuestionTypes = [
    { type: "test", name: "Тестовый вопрос", icon: "❓" },
    { type: "free", name: "Открытый вопрос", icon: "💬" },
    { type: "fill-blanks", name: "Заполните пробелы", icon: "🔤" },
    { type: "drag-drop", name: "Drag & Drop", icon: "↔️" },
    { type: "library", name: "Выбрать из библиотеки", icon: "📚" },
    { type: "import", name: "Импортировать из файла", icon: "📁" },
  ];

  const mapApiComponentTypeToQuestionType = (
    componentType: string
  ): QuestionType => {
    switch (componentType) {
      case "FreeQuestionComponent":
        return "test";
      case "OpenQuestionComponent":
        return "free";
      case "FillBlanksComponent":
        return "fill-blanks";
      case "DragDropComponent":
        return "drag-drop";
      default:
        return "test";
    }
  };

  const convertApiComponentToContent = (component: any): any => {
    switch (component.component_type) {
      case "FreeQuestionComponent":
        return {
          text: component.component.question || "",
          allowMultipleAnswers: false,
          options: component.component.options?.map((opt: any) => ({
            id: opt.id.toString(),
            text: opt.answer || "",
            isCorrect: opt.is_true === 1,
          })) || [
            { id: "1", text: "", isCorrect: false },
            { id: "2", text: "", isCorrect: false },
          ],
        };

      case "OpenQuestionComponent":
        return {
          text: component.component.question || "",
          answer: component.component.answer || "",
          hint: component.component.hint || "",
          feedback: component.component.feedback || "",
        };

      default:
        return {};
    }
  };

  const getInitialContentForType = (type: QuestionType) => {
    switch (type) {
      case "test":
        return {
          text: "",
          allowMultipleAnswers: false,
          options: [
            { id: "1", text: "", isCorrect: false },
            { id: "2", text: "", isCorrect: false },
          ],
        };
      case "free":
        return {
          text: "",
          answer: "",
        };
      case "fill-blanks":
        return {
          text: "",
          userHint: "",
          callbackText: "",
          difficulty: "",
          points: undefined,
          penaltyPoints: undefined,
          variant: undefined,
        };
      case "drag-drop":
        return {
          text: "",
          backgroundImage: null,
          elements: [],
        };
      case "import":
        return {
          filename: "",
          size: 0,
        };

      default:
        return {};
    }
  };

  const handleAddQuestion = (questionType: QuestionType) => {
    const initialContent = getInitialContentForType(questionType);

    const newQuestion: Question = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: questionType,
      content: initialContent,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleSaveQuestion = (
    id: string,
    questionData: Omit<Question, "id">
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...questionData } : q))
    );
  };

  const handleCancelQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const renderQuestionForm = (question: Question) => {
    const commonProps = {
      onAdd: (data: Omit<Question, "id">) =>
        handleSaveQuestion(question.id, data),
      onCancel: () => handleCancelQuestion(question.id),
    };

    switch (question.type) {
      case "test":
        return <TestQuestionForm {...commonProps} />;
      case "free":
        return <FreeQuestionForm {...commonProps} />;
      case "fill-blanks":
        return <FillBlanksForm {...commonProps} />;
      case "drag-drop":
        return <DragNDropForm {...commonProps} />;
      case "import":
        // return <ImportFromFileForm {...commonProps} />;
        return null;
      default:
        return null;
    }
  };

  const prepareQuizForSave = () => {
    const quizData = {
      name: quizName,
      description: quizDescription,
      components: questions.map((question, index) => {
        return {
          position: index,
          component_type: mapQuestionTypeToApiComponentType(question.type),
          settings: question.settings || {},
          content: question.content,
        };
      }),
    };
    return quizData;
  };

  const mapQuestionTypeToApiComponentType = (type: QuestionType): string => {
    switch (type) {
      case "test":
        return "FreeQuestionComponent";
      case "free":
        return "OpenQuestionComponent";
      case "fill-blanks":
        return "FillBlanksComponent";
      case "drag-drop":
        return "DragDropComponent";
      default:
        return "FreeQuestionComponent";
    }
  };

  return (
    <div>
      <div className="mt-6 p-6 border border-gray-200 rounded-md bg-white">
        <h1 className="text-2xl text-gray-900">Новый тест</h1>
        <Accordion type="multiple" className="w-full mt-4 space-y-2">
          {/* Основная информация */}
          <AccordionItem
            value="main-info"
            className="p-4 border border-gray-200 rounded-md"
          >
            <AccordionTrigger>Основная информация</AccordionTrigger>
            <AccordionContent>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название теста
                </label>
                <input
                  type="text"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите название теста"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  maxLength={200}
                  placeholder="Описание теста"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Осталось {remainingChars} символа(-ов)
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Фильтры */}
          <AccordionItem
            value="filters"
            className="p-4 border border-gray-200 rounded-md"
          >
            <AccordionTrigger>Фильтры</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Поиск */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Поиск
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Поиск"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Сложность */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Сложность
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите сложность</option>
                    <option value="easy">Легкий</option>
                    <option value="medium">Средний</option>
                    <option value="hard">Сложный</option>
                  </select>
                </div>

                {/* Вариант */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Вариант
                  </label>
                  <select
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите вариант</option>
                    <option value="variant1">Вариант 1</option>
                    <option value="variant2">Вариант 2</option>
                    <option value="variant3">Вариант 3</option>
                  </select>
                </div>

                {/* Сортировка */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Сортировка
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите порядок сортировки</option>
                    <option value="asc">По возрастанию</option>
                    <option value="desc">По убыванию</option>
                    <option value="date">По дате</option>
                  </select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="space-y-6 mt-6">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white rounded-lg shadow-md border"
          >
            {/* Заголовок карточки */}
            <div className="flex items-center px-4 py-3 bg-gray-50 border-b">
              <div className="flex items-center text-sm text-gray-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span>{index + 1}</span>
              </div>
              <div className="ml-4 flex items-center">
                <span className="text-sm">
                  {quizQuestionTypes.find((btn) => btn.type === question.type)
                    ?.icon || "📝"}
                </span>
                <span className="ml-1 text-sm text-gray-700">
                  {
                    quizQuestionTypes.find((btn) => btn.type === question.type)
                      ?.name
                  }
                </span>
              </div>
            </div>

            {/* Форма редактирования */}
            <div className="p-6">{renderQuestionForm(question)}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-8">
        <button
          onClick={togglePanel}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition"
        >
          {isPanelOpen ? "×" : "+"}
        </button>

        {isPanelOpen && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mt-4">
            <div className="flex flex-wrap justify-center gap-6">
              {quizQuestionTypes
                .filter((btn) => btn.type !== "library") // Временно скрываем библиотеку
                .map((btn) => (
                  <button
                    key={btn.type}
                    onClick={() => handleAddQuestion(btn.type as QuestionType)}
                    className="flex flex-col items-center group hover:bg-gray-100 p-3 rounded-md transition min-w-[120px]"
                  >
                    <span className="text-2xl mb-2">{btn.icon}</span>
                    <span className="text-sm text-gray-700 text-center">
                      {btn.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Кнопка сохранения */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              const quizData = prepareQuizForSave();
              console.log("Подготовленные данные для сохранения:", quizData);
              // Здесь будет вызов API для сохранения
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Сохранить тест
          </button>
        </div>
      </div>
    </div>
  );
}
