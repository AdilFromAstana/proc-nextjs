export type QuestionType =
  | "test"
  | "free"
  | "fill-blanks"
  | "drag-drop"
  | "import"
  | "library";

export interface TestQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TestQuestionContent {
  text: string;
  allowMultipleAnswers: boolean;
  options: TestQuestionOption[];
}

export interface FreeQuestionContent {
  text: string;
  answer: string;
  hint?: string;
  feedback?: string;
}

export interface FillBlanksContent {
  text: string;
  userHint?: string;
  callbackText?: string;
  difficulty?: string;
  points?: number;
  penaltyPoints?: number;
  variant?: number;
}

export interface DragDropElement {
  id: string;
  type: "text" | "image";
  content: string;
  x: number;
  y: number;
}

export interface DragDropContent {
  text: string;
  backgroundImage: string | null;
  elements: DragDropElement[];
}

export interface ImportContent {
  filename: string;
  size: number;
}

export interface LibraryContent {
  selectedQuestionId: string;
}

export type QuestionContent =
  | TestQuestionContent
  | FreeQuestionContent
  | FillBlanksContent
  | DragDropContent
  | ImportContent
  | LibraryContent
  | {};

export interface QuestionSettings {
  group?: string;
  variant?: string;
  score_penalty?: string;
  score_encouragement?: string;
  attachments?: boolean;
  antiplagiarism?: boolean;
  [key: string]: any;
}

export interface Question {
  id: string;
  type: QuestionType;
  content: QuestionContent;
  settings?: QuestionSettings;
  position?: number;
}

// Типы для API
export interface ApiQuestionComponent {
  id: number;
  quiz_id: number;
  component_id: number;
  component_type: string;
  data: any[];
  position: number;
  settings: QuestionSettings;
  component: {
    id: number;
    owner_id: number;
    component_type: string;
    question: string;
    answer?: string;
    hint?: string;
    feedback?: string;
    options?: Array<{
      id: number;
      free_question_id?: number;
      type?: string;
      answer: string;
      feedback?: string;
      percent?: number;
      is_true?: number;
      settings: any[];
    }>;
    settings: QuestionSettings;
    created_at: string;
    updated_at: string;
  };
}

export interface ApiQuizResponse {
  status: string;
  status_code: string;
  entity: {
    id: number;
    owner_id: number;
    name: string;
    description: string;
    settings: any[];
    components: ApiQuestionComponent[];
  };
}
