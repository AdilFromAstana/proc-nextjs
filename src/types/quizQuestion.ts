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
// types/quiz.ts

export interface QuizListItem {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  color: string;
}

export interface QuizListResponse {
  status: string;
  status_code: string;
  entities: {
    current_page: number;
    data: QuizListItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface ApiQuestionOption {
  id: number;
  free_question_id: number;
  type: string | null;
  answer: string;
  feedback: string | null;
  percent: number;
  is_true: number | null;
  settings: any[];
}

export interface ApiQuestionComponentEntity {
  _attempts_showed: boolean;
  _answers_showed: boolean;
  id: number;
  owner_id: number;
  component_type: string;
  question: string;
  hint: string | null;
  feedback: string | null;
  description: string | null;
  is_multiple: number | null;
  created_at: string;
  options?: ApiQuestionOption[];
  attempts?: any;
  settings: {
    group: string;
    variant: string;
    score_penalty: string;
    score_encouragement: string;
    attachments?: boolean;
    antiplagiarism?: boolean;
  };
  updated_at: string;
}

export interface ApiQuestionComponent {
  id: number;
  quiz_id: number;
  component_id: number;
  component_type: string;
  data: any[];
  position: number;
  settings: {
    group: string;
    variant: string;
    score_penalty: string;
    score_encouragement: string;
    attachments?: boolean;
    antiplagiarism?: boolean;
  };
  component: ApiQuestionComponentEntity;
}

export interface ApiQuizEntity {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  settings: any[];
  components: ApiQuestionComponent[];
}

export interface ApiQuizResponse {
  status: string;
  status_code: string;
  entity: ApiQuizEntity;
}
