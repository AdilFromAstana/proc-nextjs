// src/components/Quiz/QuestionCard/QuestionCard.tsx
import React, { useState, useCallback } from "react";
import { QuizQuestionItem } from "@/types/quiz/quiz";
import { deleteQuestionFromQuiz, updateQuestionInQuiz } from "@/api/quiz";
import QuestionHeader from "./QuestionHeader/QuestionHeader";
import QuestionBody from "./QuestionBody";

// Мемоизированные маппинги
const QUESTION_TYPE_MAP = {
  FreeQuestionComponent: { type: "test", name: "Тестовый вопрос" },
  OpenQuestionComponent: { type: "free", name: "Открытый вопрос" },
  FillSpaceQuestionComponent: {
    type: "fill-blanks",
    name: "Заполните пробелы",
  },
  DragAndDropQuestionComponent: { type: "drag-drop", name: "Drag & Drop" },
} as const;

interface QuestionCardProps {
  question: QuizQuestionItem;
  onQuestionDeleted: (componentId: number) => void;
  onQuestionUpdated: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = React.memo(
  ({ question, onQuestionDeleted, onQuestionUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedQuestion, setEditedQuestion] = useState(question);

    const getQuestionInfo = useCallback(() => {
      console.log("question:", question);
      const questionTypeInfo =
        QUESTION_TYPE_MAP[
          question.component_type as keyof typeof QUESTION_TYPE_MAP
        ];

      return questionTypeInfo || { type: "test", name: "Тестовый вопрос" };
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

    return (
      <div className="my-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <QuestionHeader
          position={question.position}
          questionType={questionType}
          questionName={questionInfo.name}
          score={question.settings?.score_encouragement}
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onDeleteClick={() => handleDeleteQuestion(question.component_id)}
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
