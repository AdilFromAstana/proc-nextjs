import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QuizDetailResponse, QuizQuestionComponent } from "@/types/quiz/quiz";
import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import ButtonsPanel from "./ButtonsPanel";
import { fetchQuizById } from "@/api/quiz";
import LibraryOfQuestions from "./Modals/LibraryOfQuestions";
import ImportModal from "./Modals/ImportModal";
import { InfoIcon } from "@/app/icons/InfoIcon";
import { FilterIcon } from "@/app/icons/Quiz/FilterIcon";
import { SaveIcon } from "@/app/icons/Quiz/QuizHeaderIcons/SaveIcon";
import { AppointIcon } from "@/app/icons/Quiz/QuizHeaderIcons/AppointIcon";
import { CloneIcon } from "@/app/icons/Quiz/QuizHeaderIcons/CloneIcon";
import { DeleteIcon } from "@/app/icons/Quiz/QuizHeaderIcons/DeleteIcon";
import { CloseIcon } from "@/app/icons/Quiz/QuizHeaderIcons/CloseIcon";
import { QuizHeaderActions } from "./HeaderActions";

type Props = {
  quiz: QuizDetailResponse | null;
  quizId: number;
  onUpdateQuiz: (updatedQuiz: QuizDetailResponse) => void;
  onClose?: () => void;
};

export default function QuizEditor({
  quiz,
  quizId,
  onUpdateQuiz,
  onClose,
}: Props) {
  const [quizName, setQuizName] = useState(quiz?.entity.name || "");
  const [quizDescription, setQuizDescription] = useState(
    quiz?.entity.description || ""
  );
  const [localQuiz, setLocalQuiz] = useState(quiz);

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [variantFilter, setVariantFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleAddQuestions = (questions: QuizQuestionComponent[]) => {
    console.log("Добавлены вопросы:", questions);
  };

  const handleOpenLibraryModal = () => {
    setIsLibraryModalOpen(true);
  };
  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  useEffect(() => {
    if (quiz) {
      setLocalQuiz(quiz);
      setQuizName(quiz.entity.name || "");
      setQuizDescription(quiz.entity.description || "");
    }
  }, [quiz]);

  const handleQuestionDeleted = (componentId: number) => {
    if (localQuiz) {
      const updatedComponents = localQuiz.entity.components.filter(
        (component) => component.component_id !== componentId
      );
      setLocalQuiz({
        ...localQuiz,
        entity: {
          ...localQuiz.entity,
          components: updatedComponents,
        },
      });
    }
  };

  const handleQuestionUpdated = async () => {
    try {
      const updatedQuiz = await fetchQuizById(quizId);
      setLocalQuiz(updatedQuiz);
      onUpdateQuiz(updatedQuiz);
    } catch (error) {
      console.error("Ошибка при обновлении теста:", error);
    }
  };

  const remainingChars = 200 - quizDescription.length;

  const difficultyMap: Record<string, string> = {
    easy: "Легкий",
    medium: "Средний",
    hard: "Сложный",
    easy_alpha: "Легкий (Альфа)",
    medium_alpha: "Средний (Альфа)",
    hard_alpha: "Сложный (Альфа)",
  };

  const reverseDifficultyMap: Record<string, string> = Object.fromEntries(
    Object.entries(difficultyMap).map(([eng, rus]) => [rus, eng])
  );

  const variantMap: Record<string, string> = {
    "": "Без варианта",
    first: "1-й вариант",
    second: "2-й вариант",
    third: "3-й вариант",
    fourth: "4-й вариант",
  };

  const reverseVariantMap: Record<string, string> = Object.fromEntries(
    Object.entries(variantMap).map(([eng, rus]) => [rus, eng])
  );

  const difficultyOptions = Object.values(difficultyMap);
  const variantOptions = Object.values(variantMap);

  const sortOptions = [
    { label: "По баллу (по возрастанию)", value: "score-asc" },
    { label: "По баллу (по убыванию)", value: "score-desc" },
  ];

  // Фильтрация и сортировка вопросов
  const getFilteredAndSortedQuestions = () => {
    if (!localQuiz) return [];

    let filteredQuestions = [...localQuiz.entity.components];

    // Фильтр по поиску
    if (searchQuery) {
      filteredQuestions = filteredQuestions.filter((q) =>
        q.component.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по сложности
    if (difficultyFilter) {
      const englishDifficulty = reverseDifficultyMap[difficultyFilter];
      if (englishDifficulty) {
        filteredQuestions = filteredQuestions.filter(
          (q) => q.settings.group === englishDifficulty
        );
      }
    }

    // Фильтр по варианту
    if (variantFilter) {
      const englishVariant = reverseVariantMap[variantFilter];
      if (englishVariant !== undefined) {
        filteredQuestions = filteredQuestions.filter(
          (q) => q.settings.variant === englishVariant
        );
      }
    }

    // Сортировка
    if (sortOption) {
      filteredQuestions.sort((a, b) => {
        const scoreA = parseInt(a.settings.score_encouragement) || 0;
        const scoreB = parseInt(b.settings.score_encouragement) || 0;

        if (sortOption === "score-asc") {
          return scoreA - scoreB;
        } else if (sortOption === "score-desc") {
          return scoreB - scoreA;
        }
        return 0;
      });
    }

    return filteredQuestions;
  };

  if (!localQuiz) return null;

  const filteredQuestions = getFilteredAndSortedQuestions();

  return (
    <div className="w-full m-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl text-gray-900">
          {localQuiz.entity.name || "Новый тест"}
        </h1>

        <QuizHeaderActions
          actions={[
            {
              icon: SaveIcon,
              label: "Сохранить",
              onClick: () => console.log("Сохранить"),
              className: "hover:text-blue-600 hover:bg-blue-50",
            },
            {
              icon: AppointIcon,
              label: "Назначить",
              onClick: () => console.log("Назначить"),
              className: "hover:text-blue-600 hover:bg-blue-50",
            },
            {
              icon: CloneIcon,
              label: "Клонировать",
              onClick: () => console.log("Клонировать"),
              className: "hover:text-blue-600 hover:bg-blue-50",
            },
            {
              icon: DeleteIcon,
              label: "Удалить",
              onClick: () => console.log("Удалить"),
              className: "hover:text-red-600 hover:bg-red-50",
            },
            {
              icon: CloseIcon,
              label: "Закрыть",
              onClick: () => (onClose ? onClose() : console.log("Закрыть")),
              className: "hover:text-gray-800 hover:bg-gray-100",
            },
          ]}
        />
      </div>

      <Accordion type="multiple" className="w-full space-y-2">
        {/* Основная информация */}
        <AccordionItem
          value="main-info"
          className="border border-gray-200 rounded-lg shadow-sm bg-white"
        >
          <AccordionTrigger className="flex items-center justify-between px-6 py-4 text-gray-500">
            <div className="flex items-center space-x-2">
              <InfoIcon height={24} />
              <span className="text-gray-600 font-semibold">
                Основная информация
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 pb-6 pt-0">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название теста
              </label>
              <input
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder="Введите название теста"
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание теста
              </label>
              <textarea
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                maxLength={200}
                placeholder="Описание теста"
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                rows={3}
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
          className="border border-gray-200 rounded-lg shadow-sm bg-white"
        >
          <AccordionTrigger className="flex items-center justify-between px-6 py-4 text-gray-500">
            <div className="flex items-center space-x-2">
              <FilterIcon height={24} />
              <span className="text-gray-600 font-semibold">Фильтры</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 pb-6 pt-0 space-y-2">
            <div>
              <input
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              >
                <option value="">Сложность</option>
                {difficultyOptions.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={variantFilter}
                onChange={(e) => setVariantFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              >
                <option value="">Вариант</option>
                {variantOptions.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              >
                <option value="">Сортировать</option>
                {sortOptions.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Questions list - используем отфильтрованные вопросы */}
      <div>
        {filteredQuestions.map((q) => (
          <QuestionCard
            key={q.component_id}
            question={q}
            onQuestionDeleted={handleQuestionDeleted}
            onQuestionUpdated={handleQuestionUpdated}
          />
        ))}
      </div>

      <ButtonsPanel
        onCreateTestQuestion={() => {}}
        onCreateOpenQuestion={() => {}}
        onCreateFillBlanksQuestion={() => {}}
        onCreateDragDropQuestion={() => {}}
        onOpenLibrary={handleOpenLibraryModal}
        onImportFromFile={handleOpenImportModal}
      />

      <LibraryOfQuestions
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onAddQuestions={handleAddQuestions}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onAdd={() => {}}
      />
    </div>
  );
}
