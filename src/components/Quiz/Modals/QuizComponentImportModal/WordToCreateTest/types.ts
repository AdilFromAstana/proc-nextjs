export type Option = {
  text: string;
  isCorrect: boolean;
  id: string;
};

export type Question = {
  id: number;
  question: string;
  options: Option[];
};

export type ParseError = {
  line: string;
  reason: string;
  questionId?: number;
};
