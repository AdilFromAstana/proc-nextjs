// src/components/Quiz/QuestionCard/QuestionEditor/FillBlanksEditor.tsx
import React from "react";
import { QuizQuestionItem } from "@/types/quiz/quiz";

interface FillBlanksEditorProps {
  editedQuestion: QuizQuestionItem;
  updateComponent: (updates: any) => void;
  renderEditor: (
    content: string,
    onChange: (content: string) => void,
    height?: number
  ) => React.ReactNode;
}

const FillBlanksEditor: React.FC<FillBlanksEditorProps> = ({
  editedQuestion,
  updateComponent,
  renderEditor,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Текст вопроса
        </label>
        {renderEditor(editedQuestion.component?.question || "", (content) =>
          updateComponent({ question: content })
        )}
      </div>
      {/* Добавьте редактирование пропусков здесь, если нужно */}
    </div>
  );
};

export default FillBlanksEditor;
