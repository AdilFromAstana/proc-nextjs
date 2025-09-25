// src/components/Quiz/QuestionCard/QuestionEditor/QuestionEditor.tsx
import React from "react";
import { QuizQuestionItem } from "@/types/quiz/quiz";
import OpenQuestionEditor from "./OpenQuestionEditor";
import FillBlanksEditor from "./FillBlanksEditor";
import TestQuestionEditor from "./TestQuestionEditor";
import QuestionSettingsAccordion from "@/components/Quiz/QuestionSettingsAccordion";
import DragDropEditor from "./DragDropEditor";
import CustomEditor from "@/components/Chunks/CustomEditor";

interface QuestionEditorProps {
  editedQuestion: QuizQuestionItem;
  questionType: string;
  updateComponent: (updates: any) => void;
  updateSettings: (updates: any) => void;
}

// Опции процентов для множественного выбора
export const percentOptions = [
  { id: 100, label: "100%" },
  { id: 75, label: "75%" },
  { id: 50, label: "50%" },
  { id: 33, label: "33%" },
  { id: 25, label: "25%" },
  { id: 20, label: "20%" },
  { id: 10, label: "10%" },
  { id: 0, label: "0%" },
  { id: null, label: "—" },
];

// Функция рендеринга редактора
// Добавлены параметры height, pToolbar, buttons для большей гибкости
export const renderEditor = (
  content: string,
  onChange: (content: string) => void,
  height: number = 200 // Значение по умолчанию для основного редактора вопроса
) => (
  <CustomEditor
    value={content}
    onChange={onChange}
    height={height}
    toolbar="undo redo | image | styleselect | bold italic | alignleft aligncenter alignright alignjustify | table | bullist numlist | link | preview | codesample"
    plugins={[
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "table",
      "code",
      "fullscreen",
      "preview",
      "codesample",
      "wordcount",
    ]}
    floated={true}
  />
);

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  editedQuestion,
  questionType,
  updateComponent,
  updateSettings,
}) => {
  const renderEditableFields = () => {
    const isTestQuestion = questionType === "test";
    const isOpenQuestion = questionType === "free";
    const isFillBlanks = questionType === "fill-blanks";
    const isDragDrop = questionType === "drag-drop";

    if (isTestQuestion) {
      return (
        <TestQuestionEditor
          editedQuestion={editedQuestion}
          updateComponent={updateComponent}
          renderEditor={renderEditor}
        />
      );
    }

    if (isOpenQuestion) {
      return (
        <OpenQuestionEditor
          editedQuestion={editedQuestion}
          updateComponent={updateComponent}
          renderEditor={renderEditor}
        />
      );
    }

    if (isFillBlanks) {
      return (
        <FillBlanksEditor
          editedQuestion={editedQuestion}
          updateComponent={updateComponent}
          renderEditor={renderEditor}
        />
      );
    }

    if (isDragDrop) {
      return (
        <DragDropEditor
          editedQuestion={editedQuestion}
          updateComponent={updateComponent}
          renderEditor={renderEditor}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {renderEditableFields()}
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
          questionType === "free"
            ? editedQuestion.settings?.attachments === 1
            : undefined
        }
        onAttachmentsChange={
          questionType === "free"
            ? (value) => updateSettings({ attachments: value ? 1 : 0 })
            : undefined
        }
        antiplagiarism={
          questionType === "free"
            ? editedQuestion.settings?.antiplagiarism === 1
            : undefined
        }
        onAntiplagiarismChange={
          questionType === "free"
            ? (value) => updateSettings({ antiplagiarism: value ? 1 : 0 })
            : undefined
        }
      />
    </div>
  );
};

export default QuestionEditor;
