import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";

import {
  DeleteQuestionIcon,
  DragDropIcon,
  EditQuestionIcon,
  FillBlanksIcon,
  FreeQuestionIcon,
  OpenQuestionIcon,
  ScoreIcon,
} from "@/app/icons/Quiz";

import { QuizQuestionItem } from "@/types/quiz/quiz";
import { TestQuestionCard } from "./QuestionForms/TestQuestionCard";
import { OpenQuestionCard } from "./QuestionForms/OpenQuestionCard";
import { FillBlanksQuestionCard } from "./QuestionForms/FillBlanksQuestionCard";
import { DragDropQuestionCard } from "./QuestionForms/DragDropQuestionCard";
import QuestionSettingsAccordion from "./QuestionSettingsAccordion";
import { deleteQuestionFromQuiz, updateQuestionInQuiz } from "@/api/quiz";

const TinyMCEAPI_KEY = `qy8wi8k5sfl8aapsdujc5bw9m2mmzxzeg2fu6uwz3h3qj5vc`;

// Динамический импорт TinyMCE для избежания проблем с SSR
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

interface QuestionCardProps {
  question: QuizQuestionItem;
  onQuestionDeleted: (componentId: number) => void;
  onQuestionUpdated: () => void;
}

// Мемоизированные маппинги
const QUESTION_TYPE_MAP = {
  FreeQuestionComponent: { type: "test", name: "Тестовый вопрос" },
  OpenQuestionComponent: { type: "free", name: "Открытый вопрос" },
  FillBlanksComponent: { type: "fill-blanks", name: "Заполните пробелы" },
  DragDropComponent: { type: "drag-drop", name: "Drag & Drop" },
} as const;

const ICON_MAP = {
  test: OpenQuestionIcon,
  free: FreeQuestionIcon,
  "fill-blanks": FillBlanksIcon,
  "drag-drop": DragDropIcon,
} as const;

const QuestionCard: React.FC<QuestionCardProps> = React.memo(
  ({ question, onQuestionDeleted, onQuestionUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedQuestion, setEditedQuestion] = useState(question);

    // Мемоизированные функции
    const getQuestionInfo = useCallback(() => {
      const questionTypeInfo =
        QUESTION_TYPE_MAP[
          question.component_type as keyof typeof QUESTION_TYPE_MAP
        ];
      return questionTypeInfo || { type: "test", name: "Тестовый вопрос" };
    }, [question.component_type]);

    const questionInfo = getQuestionInfo();
    const questionType = questionInfo.type;
    const isTestQuestion = questionType === "test";
    const isOpenQuestion = questionType === "free";
    const isFillBlanks = questionType === "fill-blanks";
    const isDragDrop = questionType === "drag-drop";

    // Мемоизированные обработчики
    const handleEditClick = useCallback(() => {
      setIsEditing(true);
      setEditedQuestion({ ...question });
    }, [question]);

    const handleCancel = useCallback(() => {
      setIsEditing(false);
      setEditedQuestion({ ...question });
    }, [question]);

    const handleSave = useCallback(async () => {
      try {
        const quizId = question.quiz_id;
        await updateQuestionInQuiz(
          quizId,
          question.component_id,
          editedQuestion
        );
        setIsEditing(false);
        onQuestionUpdated();
      } catch (error) {
        console.error("Ошибка при сохранении вопроса:", error);
      }
    }, [question, editedQuestion, onQuestionUpdated]);

    const handleDeleteQuestion = useCallback(
      async (componentId: number) => {
        try {
          const quizId = question.quiz_id;
          await deleteQuestionFromQuiz(quizId, componentId);
          onQuestionDeleted(componentId);
        } catch (error) {
          console.error("Ошибка при удалении вопроса:", error);
        }
      },
      [question, onQuestionDeleted]
    );

    const updateComponent = useCallback((updates: any) => {
      setEditedQuestion((prev) => ({
        ...prev,
        component: {
          ...prev.component,
          ...updates,
        },
      }));
    }, []);

    const updateSettings = useCallback((updates: any) => {
      setEditedQuestion((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...updates,
        },
      }));
    }, []);

    // Мемоизированный рендер иконки
    const renderQuestionIcon = useCallback(() => {
      const IconComponent =
        ICON_MAP[questionType as keyof typeof ICON_MAP] || OpenQuestionIcon;
      return <IconComponent height={18} color="blue" />;
    }, [questionType]);

    // Мемоизированный рендер карточек вопросов
    const renderQuestionCard = useCallback(() => {
      if (isTestQuestion) return <TestQuestionCard question={question} />;
      if (isOpenQuestion) return <OpenQuestionCard question={question} />;
      if (isFillBlanks) return <FillBlanksQuestionCard question={question} />;
      if (isDragDrop) return <DragDropQuestionCard question={question} />;
      return null;
    }, [isTestQuestion, isOpenQuestion, isFillBlanks, isDragDrop, question]);

    // Мемоизированный рендер аккордеона настроек
    const renderSettingsAccordion = useCallback(
      () => (
        <QuestionSettingsAccordion
          questionType={questionType}
          difficulty={editedQuestion.settings?.group || ""}
          onDifficultyChange={(value) => updateSettings({ group: value })}
          points={editedQuestion.settings?.score_encouragement || ""}
          onPointsChange={(value) =>
            updateSettings({ score_encouragement: value })
          }
          penaltyPoints={editedQuestion.settings?.score_penalty || ""}
          onPenaltyPointsChange={(value) =>
            updateSettings({ score_penalty: value })
          }
          variant={editedQuestion.settings?.variant || ""}
          onVariantChange={(value) => updateSettings({ variant: value })}
          userHint={editedQuestion.component?.hint || ""}
          onUserHintChange={(value) => updateComponent({ hint: value })}
          callbackText={editedQuestion.component?.feedback || ""}
          onCallbackTextChange={(value) => updateComponent({ feedback: value })}
          attachments={
            isOpenQuestion
              ? editedQuestion.settings?.attachments === 1
              : undefined
          }
          onAttachmentsChange={
            isOpenQuestion
              ? (value) => updateSettings({ attachments: value ? 1 : 0 })
              : undefined
          }
          antiplagiarism={
            isOpenQuestion
              ? editedQuestion.settings?.antiplagiarism === 1
              : undefined
          }
          onAntiplagiarismChange={
            isOpenQuestion
              ? (value) => updateSettings({ antiplagiarism: value ? 1 : 0 })
              : undefined
          }
        />
      ),
      [
        questionType,
        editedQuestion,
        isOpenQuestion,
        updateSettings,
        updateComponent,
      ]
    );

    return (
      <div className="my-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        {/* Заголовок вопроса */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-blue-700 bg-blue-100 rounded">
              {question.position + 1}
            </div>

            <div className="flex items-center space-x-1">
              {renderQuestionIcon()}
              <span className="text-sm font-medium text-gray-700">
                {questionInfo.name}
              </span>
            </div>

            {question.settings?.score_encouragement && (
              <div className="flex items-center space-x-1">
                <ScoreIcon height={18} />
                <span className="text-sm font-medium text-gray-700">
                  {question.settings.score_encouragement} Б
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {!isEditing ? (
              <>
                <EditQuestionIcon
                  height={20}
                  className="text-blue-600 cursor-pointer hover:text-blue-800"
                  onClick={handleEditClick}
                />
                <DeleteQuestionIcon
                  height={20}
                  className="text-red-600 cursor-pointer hover:text-red-800"
                  onClick={() => handleDeleteQuestion(question.component_id)}
                />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  type="button"
                >
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  type="button"
                >
                  Отмена
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Тело вопроса */}
        <div className="p-4">
          {!isEditing ? (
            renderQuestionCard()
          ) : (
            <div className="mt-6">{renderSettingsAccordion()}</div>
          )}
        </div>
      </div>
    );
  }
);

export default QuestionCard;
