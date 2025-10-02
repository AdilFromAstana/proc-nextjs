// src/components/Quiz/QuestionCard/QuestionCard.tsx
import React, { useState, useCallback } from "react";
import { QuizQuestionItem } from "@/types/quiz/quiz";
import { updateQuestionInQuiz } from "@/api/quiz";
import QuestionHeader from "./QuestionHeader/QuestionHeader";
import QuestionBody from "./QuestionBody";
import { useTranslations } from "next-intl";

interface QuestionCardProps {
  question: QuizQuestionItem;
  onDeleteRequest: (componentId: number) => void; // Изменили эту строку
  onQuestionUpdated: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = React.memo(
  ({ question, onDeleteRequest, onQuestionUpdated }) => {
    // И здесь изменили
    const t = useTranslations();

    const [isEditing, setIsEditing] = useState(false);
    const [editedQuestion, setEditedQuestion] = useState(question);

    // Мемоизированные маппинги
    const QUESTION_TYPE_MAP = {
      FreeQuestionComponent: { type: "test", name: t("label-quiz-question") },
      OpenQuestionComponent: { type: "free", name: t("label-free-question") },
      FillSpaceQuestionComponent: {
        type: "fill-blanks",
        name: t("label-fill-spaces"),
      },
      DragAndDropQuestionComponent: { type: "drag-drop", name: "Drag & Drop" },
    } as const;

    const getQuestionInfo = useCallback(() => {
      console.log("question:", question);
      const questionTypeInfo =
        QUESTION_TYPE_MAP[
          question.component_type as keyof typeof QUESTION_TYPE_MAP
        ];

      return (
        questionTypeInfo || { type: "test", name: t("label-quiz-question") }
      );
    }, [question.component_type]);

    const questionInfo = getQuestionInfo();
    const questionType = questionInfo.type;

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

    return (
      <div className="my-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <QuestionHeader
          position={question.position}
          questionType={questionType}
          questionName={questionInfo.name}
          score={question.settings?.score_encouragement}
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onDeleteClick={() => onDeleteRequest(question.component_id)}
          onSaveClick={handleSave}
          onCancelClick={handleCancel}
        />
        <QuestionBody
          isEditing={isEditing}
          question={question}
          editedQuestion={editedQuestion}
          questionType={questionType}
          updateComponent={updateComponent}
          updateSettings={updateSettings}
        />
      </div>
    );
  }
);

export default QuestionCard;
