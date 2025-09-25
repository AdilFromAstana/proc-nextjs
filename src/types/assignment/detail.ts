// src/types/assignment/detail.ts

import { QuizDetailEntity, QuizQuestionItem } from "../quiz/quiz";

// Владелец задания
export interface Owner {
  id: number;
  school_id: number;
  external_id: string | null;
  group: string;
  firstname: string;
  lastname: string;
  patronymic: string | null;
  username: string | null;
  email: string;
  phone: string | null;
  photo: string | null;
  photo_thumb: {
    big: string | null;
    medium: string | null;
    small: string | null;
  };
  color: string | null;
  description: string | null;
  is_need_complete_challenge: boolean;
  is_online: boolean;
}

// Класс
export interface Class {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  color: string;
}

// // Викторина
// export interface Quiz {
//   id: number;
//   name: string;
//   description: string | null;
//   image: string | null;
//   color: string;
//   components: QuizQuestionItem;
// }

// Прогресс
export interface Progress {
  components: number;
  chapters: number;
  total: number;
}

// Настройки прокторинга
export interface ProctoringSettings {
  check_env: boolean;
  browser_type: string;
  head_tracking: string;
  object_detect: number;
  displays_check: number;
  focus_detector: boolean;
  noise_detector: boolean;
  read_clipboard: number;
  content_protect: number;
  face_landmarker: boolean;
  fullscreen_mode: boolean;
  id_verification: boolean;
  speech_detector: boolean;
  mute_frames_count: number;
  noise_sensitivity: number;
  extension_detector: boolean;
  head_x_sensitivity: number;
  head_y_sensitivity: number;
  main_camera_record: boolean;
  main_camera_upload: boolean;
  quite_frames_count: number;
  photo_head_identity: boolean;
  screen_share_record: boolean;
  screen_share_upload: boolean;
  video_head_identity: boolean;
  head_tracking_client: boolean;
  head_tracking_server: boolean;
  second_camera_record: boolean;
  second_camera_upload: boolean;
  head_compare_interval: number;
  main_camera_blackhole: boolean;
  speech_pre_pad_frames: number;
  head_depth_sensitivity: number;
  head_position_interval: number;
  head_tolerance_seconds: number;
  noise_tolerance_frames: number;
  object_detect_interval: number;
  screen_share_blackhole: boolean;
  focus_tolerance_seconds: number;
  head_center_area_size_x: number;
  head_center_area_size_y: number;
  noise_tolerance_seconds: number;
  object_detect_threshold: number;
  second_camera_blackhole: boolean;
  second_microphone_label: string;
  speech_min_frames_count: number;
  face_landmarker_interval: number;
  head_position_confidence: number;
  head_tracking_server_post: boolean;
  speech_positive_threshold: number;
  face_landmarker_categories: {
    [key: string]: {
      score: number;
      action: string;
    };
  };
  second_microphone_record: boolean;
  second_microphone_upload: boolean;
  silent_tolerance_seconds: number;
  speech_tolerance_seconds: number;
  face_landmarker_threshold: number;
  head_position_probability: number;
  head_tracking_server_realtime: boolean;
  head_compare_euclidean_distance: number;
}

// Настройки сертификата
export type CertificateIssueType = "auto-all" | "auto-conditions" | "manual";

export interface CertificateSettings {
  issue_type: CertificateIssueType;
  show_report: boolean;
}

// Настройки оценок
export interface ScoreSettings {
  scores: any[];
}

// Настройки сценария
export interface ScenarioSettings {
  conditions: any[];
}

// Настройки компонентов
export interface ComponentSetting {
  shuffle: number;
  conditions: any[];
  per_student: number;
  variant_split: boolean;
}

export interface ComponentSettings {
  // Множественное число
  [key: string]: ComponentSetting; // Ключ - это тип ('all', 'quiz_123' и т.д.), значение - настройки для этого типа
  // Примеры конкретных ключей (опционально, если они заранее известны):
  // all?: ComponentSetting;
  // quiz_1?: ComponentSetting;
  // lesson_5?: ComponentSetting;
}

// Основные настройки задания
export interface Settings {
  certificate: CertificateSettings;
  score_settings: ScoreSettings;
  webinar_settings: any[];
  scenario_settings: ScenarioSettings;
  component_settings: ComponentSettings;
  proctoring_settings: ProctoringSettings;
}

// Детали задания
export interface AssignmentDetail {
  id: number;
  quiz_id: number | null;
  lesson_id: number | null;
  status: "process" | "completed" | "remaining" | string;
  type: "quiz" | "lesson" | string;
  name: string;
  description: string | null;
  external_url: string | null;
  settings: Settings;
  complete_time: number | string;
  max_attempts: number | string;
  starting_at_type: string;
  external_id: string | null;
  ending_at: string;
  class_id: number;
  owner_id: number;
  webinar_id: number | null;
  chat_id: number;
  starting_at: string;
  invite_code_id: number | null;
  product_id: number | null;
  certificate_id: number | null;
  access_type: "free" | "paid" | string;
  points_method_type: string;
  ending_at_type: string;
  observer: any | null;
  application: "browser" | "desktop" | string;
  is_points_method: number;
  is_straight_answer: number;
  is_show_answers_after_finished: number;
  is_show_results_after_finished: number;
  is_hide_users: number;
  is_comments: number;
  is_chat: number;
  is_invite_code: number;
  is_certificate: boolean;
  is_proctoring: number;
  is_webinar: number;
  is_public: number;
  is_unlisted: number;
  is_random_assessment: number;
  progress: Progress;
  owner: Owner;
  invite_code: any | null;
  class: Class;
  quizzes: QuizDetailEntity[];
  lessons: any[];
  reviewers: any[];
  rooms: any[];
  product: any | null;
}

// Ответ API
export interface AssignmentDetailResponse {
  status: "success" | string;
  status_code: string;
  entity: AssignmentDetail;
}

// На странице прокторинга
export interface ProctoringAssignmentResponse {
  status: "success";
  status_code: "0000";
  entity: AssignmentEntity;
}

// На странице прокторинга
export interface AssignmentEntity {
  id: number;
  quiz_id: number;
  lesson_id: number;
  status: string;
  type: string;
  name: string;
  description: string;
  external_url: string;
  settings: {};
  complete_time: number;
  max_attempts: number;
  starting_at: string;
  starting_at_type: string;
  ending_at: string;
  ending_at_type: string;
  is_straight_answer: number;
  is_show_results_after_finished: number;
  is_show_answers_after_finished: number;
  is_points_method: number;
  is_comments: number;
  is_chat: number;
  is_certificate: false;
  is_proctoring: number;
  is_webinar: number;
  is_started: true;
  is_finished: false;
  is_registered: true;
  application: string;
  proctoring_policy_agree: false;
  head_identity_manual_disabled: false;
  head_tracking_manual_disabled: false;
  main_camera_manual_disabled: false;
  second_camera_manual_disabled: false;
  screen_share_manual_disabled: false;
  fullscreen_mode_manual_disabled: false;
  displays_check_manual_disabled: false;
  read_clipboard_manual_disabled: false;
  focus_detector_manual_disabled: false;
  extension_detector_manual_disabled: false;
  noise_detector_manual_disabled: false;
  head_identity_manual_enabled: false;
  head_tracking_manual_enabled: false;
  main_camera_manual_enabled: false;
  second_camera_manual_enabled: false;
  screen_share_manual_enabled: false;
  fullscreen_mode_manual_enabled: false;
  displays_check_manual_enabled: false;
  read_clipboard_manual_enabled: false;
  focus_detector_manual_enabled: false;
  extension_detector_manual_enabled: false;
  noise_detector_manual_enabled: false;
  attempt_id: number;
  available_time: null;
  student_assessments: [];
  attempts: [];
  results: null;
  points: number;
  quizzes: QuizDetailEntity[];
  lessons: [];
  webinar: {};
  chat_id: number;
}
