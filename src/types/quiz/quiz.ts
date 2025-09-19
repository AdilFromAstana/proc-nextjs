// types/quiz/index.ts
export type QuestionType =
  | "test"
  | "free"
  | "fill-blanks"
  | "drag-drop"
  | "library"
  | "import";

export interface QuizListResponse {
  status: string;
  status_code: string;
  entities: {
    current_page: number;
    data: QuizItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface QuizItem {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  color: string;
}

export interface QuizComponentsResponse {
  status: string;
  status_code: string;
  entities: {
    current_page: number;
    data: QuizQuestionComponent[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface QuizQuestionItem {
  id: number;
  quiz_id: number;
  component_id: number;
  component_type: string;
  data: any[];
  position: number;
  settings: QuizQuestionSettings;
  component: QuizQuestionComponent;
}

export interface QuizQuestionComponent {
  _attempts_showed: false;
  _answers_showed: false;
  id: number;
  owner_id: number;
  component_type: string;
  question: string;
  answer?: string;
  hint: string;
  feedback: string;
  description: string;
  is_multiple: number;
  options?: [];
  attempts: number | null;
  settings: QuizQuestionSettings;
  created_at: string;
  updated_at: string;
}

export interface FreeQuestionOptions {
  id: number;
  free_question_id: number;
  type: string | null;
  answer: string;
  feedback: string | null;
  percent: number;
  is_true: number;
  settings: any[];
}

export interface QuizQuestionSettings {
  group: string;
  variant: string;
  attachments: number;
  score_penalty: string;
  antiplagiarism: number;
  score_encouragement: string;
}

export interface QuizDetailEntity {
  id: number;
  owner_id: number;
  name: string;
  description: string | null;
  settings: any[];
  components: QuizQuestionItem[];
}

export interface QuizDetailResponse {
  status: string;
  status_code: string;
  entity: QuizDetailEntity;
}

export interface FetchQuizListParams {
  page?: number;
  per_page?: number;
  query?: string;
  type?: any;
}
