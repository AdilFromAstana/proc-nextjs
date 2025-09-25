// src/components/Quiz/QuestionCard/QuestionBody.tsx
import React from "react";
import { QuizQuestionItem } from "@/types/quiz/quiz";
import QuestionViewer from "./QuestionViewer";
import QuestionEditor from "./QuestionEditor";

interface QuestionBodyProps {
  isEditing: boolean;
  question: QuizQuestionItem;
  editedQuestion: QuizQuestionItem;
  questionType: string;
  updateComponent: (updates: any) => void;
  updateSettings: (updates: any) => void;
}

const QuestionBody: React.FC<QuestionBodyProps> = ({
  isEditing,
  question,
  editedQuestion,
  questionType,
  updateComponent,
  updateSettings,
}) => {
  return (
    <div className="p-4">
      {!isEditing ? (
        <QuestionViewer question={question} questionType={questionType} />
      ) : (
        <QuestionEditor
          editedQuestion={editedQuestion}
          questionType={questionType}
          updateComponent={updateComponent}
          updateSettings={updateSettings}
        />
      )}
    </div>
  );
};

export default QuestionBody;
