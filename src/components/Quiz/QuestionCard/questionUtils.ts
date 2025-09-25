// src/components/Quiz/QuestionCard/questionUtils.ts
import {
  OpenQuestionIcon,
  FreeQuestionIcon,
  FillBlanksIcon,
  DragDropIcon,
} from "@/app/icons/Quiz";

const ICON_MAP = {
  test: OpenQuestionIcon,
  free: FreeQuestionIcon,
  "fill-blanks": FillBlanksIcon,
  "drag-drop": DragDropIcon,
} as const;

export const getQuestionIcon = (questionType: string) => {
  return ICON_MAP[questionType as keyof typeof ICON_MAP] || OpenQuestionIcon;
};

// Если нужно, можно добавить другие утилиты, например, для определения типа вопроса
