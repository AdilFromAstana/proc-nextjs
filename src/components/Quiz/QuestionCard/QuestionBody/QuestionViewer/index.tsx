// src/components/Quiz/QuestionCard/QuestionViewer.tsx
import React from "react";
import { QuizQuestionItem } from "@/types/quiz/quiz";
import { TestQuestionCard } from "@/components/Quiz/QuestionForms/TestQuestionCard";
import { OpenQuestionCard } from "@/components/Quiz/QuestionForms/OpenQuestionCard";
import { FillSpaceQuestionCard } from "@/components/Quiz/QuestionForms/FillSpaceQuestionCard";
import { DragDropQuestionCard } from "@/components/Quiz/QuestionForms/DragDropQuestionCard";

interface QuestionViewerProps {
  question: QuizQuestionItem;
  questionType: string;
}

const QuestionViewer: React.FC<QuestionViewerProps> = ({
  question,
  questionType,
}) => {
  const isTestQuestion = questionType === "test";
  const isOpenQuestion = questionType === "free";
  const isFillBlanks = questionType === "fill-blanks";
  const isDragDrop = questionType === "drag-drop";

  if (isTestQuestion) return <TestQuestionCard question={question} />;
  if (isOpenQuestion) return <OpenQuestionCard question={question} />;
  if (isFillBlanks) return <FillSpaceQuestionCard question={question} />;
  if (isDragDrop) return <DragDropQuestionCard question={question} />;
  return null;
};

export default QuestionViewer;
