// types/lessonTypes.ts

export type ComponentType =
  | "TextComponent"
  | "MediaComponent"
  | "IFrameComponent"
  | "YoutubeComponent"
  | "PollComponent"
  | "FreeQuestionComponent"
  | "OpenQuestionComponent"
  | "DragAndDropQuestionComponent";

export interface BaseComponent {
  id: number;
  lesson_id: number;
  chapter_id: number;
  component_id: number | null;
  component_type: ComponentType;
  data: any;
  position: number;
  settings: any[];
  component: any;
}

export interface TextComponent extends BaseComponent {
  component_type: "TextComponent";
  data: {
    content: string;
  };
}

export interface MediaComponentData {
  id: number;
  owner_id: number;
  storage_id: number;
  parent_id: number | null;
  status: string;
  type: "image" | "video" | "audio";
  name: string;
  description: string | null;
  file_name: string;
  file_size: number;
  mime_type: string;
  duration: string | null;
  path: string;
  src: string;
  preview_src: string | null;
  created_at: string;
  preview: string;
  thumbs: {
    big: string;
    medium: string;
    small: string;
    tiny: string;
    pixel: string;
  };
}

export interface MediaComponent extends BaseComponent {
  component_type: "MediaComponent";
  component: MediaComponentData;
}

export interface IFrameComponent extends BaseComponent {
  component_type: "IFrameComponent";
  data: {
    url: string;
    settings: {
      height: string;
    };
  };
}

export interface YoutubeComponent extends BaseComponent {
  component_type: "YoutubeComponent";
  data: {
    url: string;
    title: string | null;
    start_time: string | null;
    end_time: string | null;
  };
}

export interface PollOption {
  id: number;
  external_id: number | null;
  poll_id: number;
  answer: string;
  settings: any[];
}

export interface PollComponentData {
  id: number;
  owner_id: number;
  component_type: "PollComponent";
  question: string;
  description: string | null;
  is_multiple: boolean | null;
  created_at: string;
  options: PollOption[];
  attempts: any;
  settings: any;
  updated_at: string;
}

export interface PollComponent extends BaseComponent {
  component_type: "PollComponent";
  component: PollComponentData;
}

export interface FreeQuestionOption {
  id: number;
  free_question_id: number;
  type: string | null;
  answer: string;
  feedback: string | null;
  percent: number;
  is_true: number | null;
  settings: any[];
}

export interface FreeQuestionComponentData {
  id: number;
  owner_id: number;
  component_type: "FreeQuestionComponent";
  question: string;
  hint: string | null;
  feedback: string | null;
  description: string | null;
  is_multiple: boolean | null;
  created_at: string;
  options: FreeQuestionOption[];
  attempts: any;
  settings: any[];
  updated_at: string;
}

export interface FreeQuestionComponent extends BaseComponent {
  component_type: "FreeQuestionComponent";
  component: FreeQuestionComponentData;
}

export interface OpenQuestionComponentData {
  id: number;
  owner_id: number;
  component_type: "OpenQuestionComponent";
  question: string;
  answer: string;
  hint: string | null;
  feedback: string | null;
  description: string | null;
  attempt: any;
  settings: {
    attachments: boolean;
    antiplagiarism: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface OpenQuestionComponent extends BaseComponent {
  component_type: "OpenQuestionComponent";
  component: OpenQuestionComponentData;
}

export interface DragAndDropOption {
  id: number;
  drag_and_drop_question_id: number;
  generated_id: string;
  type: "text" | "image";
  image: string | null;
  text: string;
  styles: any[];
  feedback: string | null;
  percent: number | null;
  settings: any[];
  is_active: number;
}

export interface DragAndDropZone {
  id: number;
  drag_and_drop_question_id: number;
  generated_id: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  answer_id: number;
  feedback: string | null;
  percent: number | null;
  settings: any[];
}

export interface DragAndDropComponentData {
  id: number;
  owner_id: number;
  component_type: "DragAndDropQuestionComponent";
  type: "image";
  question: string;
  image: string;
  styles: {
    width: string;
    height: string;
  };
  hint: string | null;
  feedback: string | null;
  description: string | null;
  created_at: string;
  options: DragAndDropOption[];
  zones: DragAndDropZone[];
  attempts: any;
  settings: any[];
  updated_at: string;
}

export interface DragAndDropComponent extends BaseComponent {
  component_type: "DragAndDropQuestionComponent";
  component: DragAndDropComponentData;
}

export type ChapterComponent =
  | TextComponent
  | MediaComponent
  | IFrameComponent
  | YoutubeComponent
  | PollComponent
  | FreeQuestionComponent
  | OpenQuestionComponent
  | DragAndDropComponent;

export interface Chapter {
  id: number;
  name: string;
  description: string | null;
  position: number;
  components: ChapterComponent[];
}

export interface LessonEntity {
  id: number;
  owner_id: number;
  status: string;
  name: string;
  description: string;
  settings: any[];
  chapters: Chapter[];
}

export interface LessonDetailResponse {
  status: string;
  status_code: string;
  entity: LessonEntity;
}
