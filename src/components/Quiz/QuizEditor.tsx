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
import { addQuestionToQuiz, fetchQuizById } from "@/api/quiz";
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

import { EnumOption } from "@/types/enum";
import {
  getDifficultLevelQuestionType,
  getVariantQuestionType,
} from "@/api/enum/listApi";
import { QuestionSettings } from "@/types/quiz/addQuestion";

type Props = {
  quiz: QuizDetailResponse | null;
  quizId: number;
  onUpdateQuiz: (updatedQuiz: QuizDetailResponse) => void;
  onClose?: () => void;
};

const t = (key: string) => {
  const translations: Record<string, string> = {
    "label-import-quiz-type": "Тип вопроса",
    "hint-import-quiz-type": "Выберите тип вопроса для импорта",
    "label-import-quiz-file": "Файл",
    "hint-import-quiz-file": "Выберите файл для импорта (.xls, .xlsx, .csv)",
    "btn-upload-file": "Загрузить файл",
    "label-import-quiz-settings": "Дополнительные настройки",
    "btn-show-additional-settings": "Показать дополнительные настройки",
    "label-import-quiz-offset": "Смещение строк",
    "hint-import-quiz-offset": "Количество строк для пропуска в начале файла",
    "placeholder-import-quiz-offset": "Введите смещение",
    "label-allow-attachments": "Разрешить вложения",
    "hint-allow-attachments": "Разрешить прикрепление файлов к ответам",
    "label-enable-antiplagiarism": "Включить антиплагиат",
    "hint-enable-antiplagiarism": "Проверять ответы на плагиат",
    "label-fill-space-question-placeholder": "Плейсхолдер",
    "hint-fill-space-question-placeholder":
      "Текст плейсхолдера для заполнения пропусков",
    "placeholder-fill-space-question-placeholder": "Введите плейсхолдер",
    "label-import-quiz-difficult-group": "Группы сложности",
    "hint-import-quiz-difficult-group": "Настройте группы сложности",
    "placeholder-difficult-group": "Введите значение группы",
    "label-import-quiz-variant-group": "Группы вариантов",
    "hint-import-quiz-variant-group": "Настройте группы вариантов",
    "placeholder-variant-group": "Введите значение варианта",
    "label-import-quiz-rows": "Сопоставление колонок",
    "hint-import-quiz-rows": "Сопоставьте буквы колонок с полями",
    "placeholder-import-quiz-letter-value": "Выберите поле",
    "btn-show-more": "Показать больше",
    "btn-show-less": "Показать меньше",
    "btn-start-import": "Начать импорт",
    "btn-cancel": "Отмена",
    "label-import-quiz-question": "Вопрос",
    "label-import-quiz-answer-item": "Вариант ответа",
    "label-import-quiz-answer-true": "Правильный ответ",
    "label-import-quiz-answer": "Ответ",
    "label-import-quiz-id": "ID",
    "label-import-quiz-position": "Позиция",
    "label-import-quiz-points-encouragement": "Баллы за правильный ответ",
    "label-import-quiz-points-penalty": "Баллы за неправильный ответ",
    "label-import-quiz-difficult": "Сложность",
    "label-import-quiz-variant": "Вариант",
    "confirm-import-task": "Вы уверены, что хотите начать импорт?",
    "label-difficult-easy": "Легкий",
    "label-difficult-medium": "Средний",
    "label-difficult-hard": "Сложный",
    "label-variant-a": "Вариант A",
    "label-variant-b": "Вариант B",
    "label-free-question": "Вопрос с выбором",
    "label-open-question": "Открытый вопрос",
    "label-fill-space-question": "Заполнение пропусков",
  };
  return translations[key] || key;
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

  const [difficultyOptions, setDifficultyOptions] = useState<EnumOption[]>([]);
  const [variantOptions, setVariantOptions] = useState<EnumOption[]>([]);
  const [isLoadingEnums, setIsLoadingEnums] = useState(true);

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        setIsLoadingEnums(true);

        const difficultyData = await getDifficultLevelQuestionType();
        setDifficultyOptions(difficultyData);

        const variantData = await getVariantQuestionType();
        setVariantOptions(variantData);
      } catch (error) {
        console.error("Ошибка при загрузке enum данных:", error);
        setDifficultyOptions([]);
        setVariantOptions([]);
      } finally {
        setIsLoadingEnums(false);
      }
    };

    fetchEnums();
  }, []);

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
    { label: "По баллу (по возрастанию)", value: "score-asc" },
    { label: "По баллу (по убыванию)", value: "score-desc" },
  ];

  if (!localQuiz) return null;

  return (
    <div className="w-full m-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl text-gray-900">
          {localQuiz.entity.name || "Новый тест"}
        </h1>

        <HeaderActions
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
                disabled={isLoadingEnums}
              >
                <option value="">Сложность</option>
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
                disabled={isLoadingEnums}
              >
                <option value="">Вариант</option>
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

      <div>
        {localQuiz?.entity?.components?.map((q) => (
          <QuestionCard
            key={q.component_id}
            question={q}
            onQuestionDeleted={handleQuestionDeleted}
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
        t={t} // функция перевода
      />
    </div>
  );
}
