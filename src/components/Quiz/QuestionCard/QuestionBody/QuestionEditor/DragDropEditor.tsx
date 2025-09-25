// src/components/Quiz/QuestionCard/QuestionEditor/DragDropEditor.tsx
import React from "react";
import { QuizQuestionItem } from "@/types/quiz/quiz";

interface DragDropEditorProps {
  editedQuestion: QuizQuestionItem;
  updateComponent: (updates: any) => void;
  renderEditor: (
    content: string,
    onChange: (content: string) => void,
    height?: number
  ) => React.ReactNode;
}

const DragDropEditor: React.FC<DragDropEditorProps> = ({
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
      {/* Добавьте редактирование элементов drag & drop здесь, если нужно */}
    </div>
  );
};

export default DragDropEditor;
