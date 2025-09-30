export interface FreeQuestionsPostRequest {
  id: null;
  owner_id: null;
  question: string;
  hint: string;
  description: null;
  is_multiple: number;
  options: FreeQuestionOption[];
  attempts: [];
  difficult?: null;
  score?: null;
  settings: QuestionSettings;
  _attempts_showed?: boolean;
  _answers_showed?: boolean;
  component_type?: string;
  feedback?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FreeQuestionOption {
  id: null;
  free_question_id: null;
  answer: string;
  feedback: string;
  is_true: true;
  percent: number;
  settings: {};
  selected?: false;
}

export interface OpenQuestionsPostRequest {
  id: null;
  owner_id: null;
  question: string;
  answer: string;
  hint: string;
  description: null;
  attempt: {
    REQUEST_CONTINUE: number;
    REQUEST_REDUNDANT: number;
    REQUEST_SKIP: number;
    id: null;
    question_id: null;
    student_id: null;
    assignment_attempt_id: null;
    antiplagiarism_task_id: null;
    answer: null;
    result: null;
    antiplagiarism_task: {
      REQUEST_CONTINUE: number;
      REQUEST_REDUNDANT: number;
      REQUEST_SKIP: number;
      id: null;
      antiplagiarism_service_id: null;
      author_id: null;
      state: null;
      uid: null;
      text: null;
      file_url: null;
      file_name: null;
      file_size: null;
      mime_type: null;
      name: null;
      description: null;
      unique: null;
      references: [];
      report_url: null;
      failure_state_code: null;
      failure_state_message: null;
    };
    attachments: [];
  };
  difficult: null;
  score: null;
  settings: QuestionSettings;
  _attempts_showed?: boolean;
  _answers_showed?: boolean;
  component_type?: string;
  feedback?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionSettings {
  attachments?: number;
  antiplagiarism?: number;
  group: string;
  variant: string;
  score_encouragement: string;
  score_penalty: string;
}

interface BaseQuestion {
  id: null;
  owner_id: null;
  question: string;
  hint: string;
  description: null;
  difficult: null;
  score: null;
  settings: QuestionSettings;
  _attempts_showed?: boolean;
  _answers_showed?: boolean;
  component_type?: string;
  feedback?: string;
  created_at?: string;
  updated_at?: string;
}
