import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  QuestionComponentType,
  QuizDetailResponse,
  QuizQuestionComponent,
  QuizQuestionItem,
} from "@/types/quiz/quiz";
import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import ButtonsPanel from "./ButtonsPanel";
import {
  addQuestionToQuiz,
  deleteQuestionFromQuiz,
  fetchQuizById,
} from "@/api/quiz";
import LibraryOfQuestions from "./Modals/LibraryOfQuestions";
import QuizComponentImportModal from "./Modals/QuizComponentImportModal/index";
import { InfoIcon } from "@/app/icons/InfoIcon";
import { FilterIcon } from "@/app/icons/Quiz/FilterIcon";
import { SaveIcon } from "@/app/icons/Quiz/QuizHeaderIcons/SaveIcon";
import { AppointIcon } from "@/app/icons/Quiz/QuizHeaderIcons/AppointIcon";
import { CloneIcon } from "@/app/icons/Quiz/QuizHeaderIcons/CloneIcon";
import { DeleteIcon } from "@/app/icons/Quiz/QuizHeaderIcons/DeleteIcon";
import { CloseIcon } from "@/app/icons/Quiz/QuizHeaderIcons/CloseIcon";
import { HeaderActions } from "./HeaderActions";

import { QuestionSettings } from "@/types/quiz/addQuestion";
import { useTranslations } from "next-intl";
import { useEnums } from "@/hooks/useEnums";

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
  const t = useTranslations();
  const { getEnumOptions, loading } = useEnums();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

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

  const difficultyOptions = getEnumOptions("DifficultLevelQuestionType");
  const variantOptions = getEnumOptions("QuestionType");

  const reverseDifficultyMap: Record<string, string> = {};
  if (Array.isArray(difficultyOptions)) {
    difficultyOptions.forEach((option) => {
      if (option && option.name && option.raw) {
        reverseDifficultyMap[option.name] = option.raw;
      }
    });
  }

  const reverseVariantMap: Record<string, string> = {};
  if (Array.isArray(variantOptions)) {
    variantOptions.forEach((option) => {
      if (option && option.name && option.raw) {
        reverseVariantMap[option.name] = option.raw;
      }
    });
  }

  const handleAddQuestions = (questions: QuizQuestionComponent[]) => {
    console.log("Добавлены вопросы:", questions);
  };

  const handleOpenLibraryModal = () => {
    setIsLibraryModalOpen(true);
  };

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleImportCreated = () => {
    // Обработка успешного создания импорта
    console.log("Импорт создан");
    // Здесь можно обновить список вопросов
    handleQuestionUpdated();
  };

  const handleImportFinished = () => {
    // Обработка завершения импорта
    console.log("Импорт завершен");
    setIsImportModalOpen(false);
  };

  const handleCreateQuestion = async (questionType: string) => {
    try {
      if (!localQuiz) return;

      // Базовые настройки для нового вопроса
      const baseSettings = {
        group: "easy",
        variant: "first",
        score_encouragement: "1",
        score_penalty: "0",
      };

      let newQuestion;

      switch (questionType) {
        case "FreeQuestionComponent":
          newQuestion = {
            id: null,
            owner_id: null,
            question: "Новый вопрос с выбором",
            hint: "",
            description: null,
            is_multiple: 0,
            options: [
              {
                id: null,
                free_question_id: null,
                answer: "Правильный ответ",
                feedback: "",
                is_true: true,
                percent: 100,
                settings: {},
              },
            ],
            attempts: [],
            difficult: null,
            score: null,
            settings: baseSettings,
            _attempts_showed: false,
            _answers_showed: false,
            component_type: questionType,
            feedback: "",
          };
          break;

        case "OpenQuestionComponent":
          newQuestion = {
            id: null,
            owner_id: null,
            question: "Новый открытый вопрос",
            answer: "",
            hint: "",
            description: null,
            attempt: {
              REQUEST_CONTINUE: 0,
              REQUEST_REDUNDANT: 0,
              REQUEST_SKIP: 0,
              id: null,
              question_id: null,
              student_id: null,
              assignment_attempt_id: null,
              antiplagiarism_task_id: null,
              answer: null,
              result: null,
              antiplagiarism_task: {
                REQUEST_CONTINUE: 0,
                REQUEST_REDUNDANT: 0,
                REQUEST_SKIP: 0,
                id: null,
                antiplagiarism_service_id: null,
                author_id: null,
                state: null,
                uid: null,
                text: null,
                file_url: null,
                file_name: null,
                file_size: null,
                mime_type: null,
                name: null,
                description: null,
                unique: null,
                references: [],
                report_url: null,
                failure_state_code: null,
                failure_state_message: null,
              },
              attachments: [],
            },
            difficult: null,
            score: null,
            settings: baseSettings,
            _attempts_showed: false,
            _answers_showed: false,
            component_type: questionType,
            feedback: "",
          };
          break;

        default:
          console.error("Unknown question type:", questionType);
          return;
      }

      // Добавляем тип для функции addQuestionToQuiz
      const questionToSend = {
        ...newQuestion,
        type: questionType,
      };

      const updatedQuiz = await addQuestionToQuiz(localQuiz, questionToSend);

      handleQuestionUpdated();
    } catch (error) {
      console.error("Error creating question:", error);
      // Здесь можно добавить уведомление об ошибке
    }
  };

  useEffect(() => {
    if (quiz) {
      setLocalQuiz(quiz);
      setQuizName(quiz.entity.name || "");
      setQuizDescription(quiz.entity.description || "");
    }
  }, [quiz]);

  // Функция для открытия модального окна подтверждения
  const handleDeleteClick = (componentId: number) => {
    setQuestionToDelete(componentId);
    setDeleteModalOpen(true);
  };

  // Функция для подтверждения удаления
  // В компоненте QuizEditor обновите функцию handleConfirmDelete:

  const handleConfirmDelete = async () => {
    if (questionToDelete !== null) {
      try {
        // Используем функцию deleteQuestionFromQuiz для удаления через API
        const updatedQuiz = await deleteQuestionFromQuiz(
          quizId,
          questionToDelete
        );

        // Обновляем локальное состояние
        setLocalQuiz(updatedQuiz);

        // Вызываем колбэк для обновления родительского компонента
        onUpdateQuiz(updatedQuiz);

        console.log("Вопрос успешно удален");
      } catch (error) {
        console.error("Ошибка при удалении вопроса:", error);
        // Здесь можно добавить уведомление об ошибке
      } finally {
        setQuestionToDelete(null);
        setDeleteModalOpen(false);
      }
    }
  };

  // Функция для отмены удаления
  const handleCancelDelete = () => {
    setQuestionToDelete(null);
    setDeleteModalOpen(false);
  };

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

  const sortOptions = [
    { label: t("label-quiz-points-sort-asc"), value: "score-asc" },
    { label: t("label-quiz-points-sort-desc"), value: "score-desc" },
  ];

  if (!localQuiz) return null;

  return (
    <div className="w-full m-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl text-gray-900">
          {localQuiz.entity.name || t("page-quiz-create")}
        </h1>

        <HeaderActions
          actions={[
            {
              icon: SaveIcon,
              label: t("btn-save"),
              onClick: () => console.log("Сохранить"),
              className: "hover:text-blue-600 hover:bg-blue-50",
            },
            {
              icon: AppointIcon,
              label: t("btn-assign"),
              onClick: () => console.log("Назначить"),
              className: "hover:text-blue-600 hover:bg-blue-50",
            },
            {
              icon: CloneIcon,
              label: t("btn-clone"),
              onClick: () => console.log("Клонировать"),
              className: "hover:text-blue-600 hover:bg-blue-50",
            },
            {
              icon: DeleteIcon,
              label: t("btn-delete"),
              onClick: () => console.log("Удалить"),
              className: "hover:text-red-600 hover:bg-red-50",
            },
            {
              icon: CloseIcon,
              label: t("btn-close"),
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
                {t("label-quiz-info-title")}
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 pb-6 pt-0">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("label-quiz-name")}
              </label>
              <input
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder={t("placeholder-quiz-name")}
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("label-quiz-description")}
              </label>
              <textarea
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                maxLength={200}
                placeholder={t("placeholder-quiz-description")}
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
              <span className="text-gray-600 font-semibold">
                {t("label-quiz-filter-title")}
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 pb-6 pt-0 space-y-2">
            <div>
              <input
                type="text"
                placeholder={t("placeholder-query")}
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
                disabled={loading}
              >
                <option value="">{t("placeholder-quiz-difficult")}</option>
                {Array.isArray(difficultyOptions) &&
                  difficultyOptions.map((difficulty) => (
                    <option key={difficulty.raw} value={difficulty.name}>
                      {difficulty.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <select
                value={variantFilter}
                onChange={(e) => setVariantFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                disabled={loading}
              >
                <option value="">{t("placeholder-quiz-variant")}</option>
                {variantOptions.map((variant) => (
                  <option key={variant.raw} value={variant.name}>
                    {variant.name}
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
                <option value="">{t("placeholder-quiz-points-sort")}</option>
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

      <div>
        {localQuiz?.entity?.components?.map((q) => (
          <QuestionCard
            key={q.component_id}
            question={q}
            onDeleteRequest={handleDeleteClick}
            onQuestionUpdated={handleQuestionUpdated}
          />
        ))}
      </div>

      <ButtonsPanel
        onCreateTestQuestion={() =>
          handleCreateQuestion("FreeQuestionComponent")
        }
        onCreateOpenQuestion={() =>
          handleCreateQuestion("OpenQuestionComponent")
        }
        onCreateFillBlanksQuestion={() =>
          handleCreateQuestion("FillSpaceQuestionComponent")
        }
        onCreateDragDropQuestion={() =>
          handleCreateQuestion("DragAndDropQuestionComponent")
        }
        onOpenLibrary={handleOpenLibraryModal}
        onImportFromFile={handleOpenImportModal}
      />

      <LibraryOfQuestions
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onAddQuestions={handleAddQuestions}
      />

      <QuizComponentImportModal
        assessmentType="quiz" // или нужный тип
        assessment={localQuiz?.entity} // передаем объект теста
        isVisible={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onCreated={handleImportCreated}
        onFinished={handleImportFinished}
      />

      {/* Модальное окно подтверждения удаления */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">
              {t("label-confirm-modal-title")}
            </h2>
            <p className="mb-6 text-gray-600">
              {t("label-confirm-modal-description")}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t("btn-no")}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t("btn-confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
