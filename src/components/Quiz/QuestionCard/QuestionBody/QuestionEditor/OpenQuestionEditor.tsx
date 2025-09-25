// src/components/Quiz/QuestionCard/QuestionEditor/OpenQuestionEditor.tsx
import React from "react";
import { QuizQuestionItem } from "@/types/quiz/quiz";

interface OpenQuestionEditorProps {
  editedQuestion: QuizQuestionItem;
  updateComponent: (updates: any) => void;
  renderEditor: (
    content: string,
    onChange: (content: string) => void,
    height?: number
  ) => React.ReactNode;
}

const OpenQuestionEditor: React.FC<OpenQuestionEditorProps> = ({
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
    </div>
  );
};

export default OpenQuestionEditor;
