// Базовые типы
export interface ApiResponse<T> {
  status: string;
  status_code: string;
  entity?: T;
  entities?: T;
}

export interface UserShort {
  id: number;
  firstname: string;
  lastname: string;
}

export interface User extends UserShort {
  photo?: string;
  color?: string;
  photo_thumb?: {
    big: string | null;
    medium: string | null;
    small: string | null;
  };
  last_activity_date: string | null;
  is_online: boolean;
}

export interface Progress {
  components: number;
  chapters: number;
  total: number;
}

export interface CertificateSettings {
  issue_type: string;
  show_report: boolean;
}

export interface ScoreSettings {
  scores: any[];
}

export interface ScenarioSettings {
  conditions: any[];
}

export interface ComponentSettings {
  all: {
    shuffle: boolean;
    conditions: any[];
    per_student: number;
    variant_split: boolean;
  };
}

export interface ObjectDetectCategories {
  [key: string]: {
    count: number;
    score: number;
    action: string;
  };
}

export interface FaceLandmarkerCategories {
  [key: string]: {
    score: number;
    action: string;
  };
}

export interface ProctoringSettings {
  check_env: boolean;
  hdcp_check: number;
  browser_type: string;
  head_tracking: string;
  object_detect: number;
  displays_check: number;
  focus_detector: number;
  noise_detector: number;
  read_clipboard: number;
  content_protect: number;
  face_landmarker: number;
  fullscreen_mode: number;
  id_verification: boolean;
  speech_detector: number;
  mute_frames_count: number;
  noise_sensitivity: string;
  extension_detector: number;
  head_x_sensitivity: string;
  head_y_sensitivity: string;
  main_camera_record: boolean;
  main_camera_upload: boolean;
  quite_frames_count: number;
  photo_head_identity: number;
  screen_share_record: boolean;
  screen_share_upload: boolean;
  video_head_identity: number;
  head_tracking_client: boolean;
  head_tracking_server: boolean;
  second_camera_record: boolean;
  second_camera_upload: boolean;
  head_compare_interval: string;
  main_camera_blackhole: boolean;
  speech_pre_pad_frames: number;
  facemodel_init_timeout: string;
  head_depth_sensitivity: string;
  head_position_interval: number;
  head_tolerance_seconds: string;
  noise_tolerance_frames: string;
  object_detect_interval: number;
  rtc_connection_timeout: string;
  screen_share_blackhole: boolean;
  focus_tolerance_seconds: string;
  head_center_area_size_x: number;
  head_center_area_size_y: number;
  head_recognize_interval: string;
  noise_tolerance_seconds: string;
  object_detect_threshold: number;
  second_camera_blackhole: boolean;
  second_microphone_label: string;
  speech_min_frames_count: number;
  face_landmarker_interval: number;
  head_position_confidence: number;
  object_detect_categories: ObjectDetectCategories;
  second_microphone_record: boolean;
  second_microphone_upload: boolean;
  silent_tolerance_seconds: number;
  speech_tolerance_seconds: number;
  face_landmarker_threshold: number;
  head_position_probability: number;
  head_tracking_server_post: boolean;
  proctoring_fallback_allow: number;
  speech_positive_threshold: number;
  face_landmarker_categories: FaceLandmarkerCategories;
  proctoring_mobile_restrict: number;
  second_microphone_blackhole: boolean;
  head_tracking_server_realtime: boolean;
  head_compare_euclidean_distance: number;
}

export interface Settings {
  certificate: CertificateSettings;
  score_settings: ScoreSettings;
  webinar_settings: any[];
  scenario_settings: ScenarioSettings;
  component_settings: ComponentSettings;
  proctoring_settings: ProctoringSettings;
}

export interface Class {
  id: number;
  name: string;
  description?: string | null;
}

export interface Chat {
  id: number;
  owner_id: number;
  status: string;
  type: string;
  image: string | null;
  color: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebinarShort {
  id: number;
}

export interface IceServer {
  id: number;
  type: string;
  server: string;
  urls: string;
  username: string | null;
  credential: string | null;
}

export interface Server {
  id: number;
  provider: string;
  host: string;
  options: {
    alternate_server: string | null;
  };
  is_active: number;
}

export interface WebinarFull {
  id: number;
  status: string;
  name: string;
  description: string | null;
  room: string;
  token: string;
  is_moderator: number;
  server: Server;
  class: Class;
  ice_servers: IceServer[];
}

export interface AssignmentProctoring {
  id: number;
  owner_id: number;
  class_id: number;
  quiz_id: number | null;
  lesson_id: number | null;
  webinar_id: number | null;
  type: string;
  status: string;
  name: string;
  progress: Progress;
  settings: Settings;
  class: Class;
  quiz: any | null;
  lesson: any | null;
  chat: Chat;
  webinars: WebinarShort[];
  webinar: WebinarFull;
}

export interface AssignmentAction {
  id: number;
  assignment_id: number;
  student_id: number;
  action_type: string;
  description: string | null;
  screenshot: string | null;
  is_warning: number;
  created_at: string;
  user: UserShort;
}

export interface Student {
  id: number;
  user_id: number;
  user: User;
}

// Пагинационные типы
export interface PaginationMeta {
  current_page: number;
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
}

export interface AssignmentActionsData {
  current_page: number;
  data: AssignmentAction[];
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
}

export interface StudentsData {
  current_page: number;
  data: Student[];
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
}

// Финальные типы ответов API
export type AssignmentProctoringResponse = ApiResponse<AssignmentProctoring>;
export type AssignmentActionsResponse = ApiResponse<AssignmentActionsData>;
export type ProctoringStudentsResponse = ApiResponse<StudentsData>;
