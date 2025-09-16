// types/webinar.ts

export interface WebinarSessionRecord {
  id: number;
  storage_id: number;
  webinar_session_id: number;
  storage: any;
  type: string;
  thumb_url: string;
  video_url: string;
  video_duration: number;
  video_size: number;
  actions: any[];
  transcoded_at: string;
}

export interface WebinarSession {
  id: number;
  webinar_id: number;
  user_id: number;
  type: string; // 'streaming'
  status: string; // 'finished'
  state: string; // 'converted'
  session_type: string; // 'main-camera', 'second-camera'
  record: WebinarSessionRecord | null;
  created_at: string;
}

export interface WebinarSessionGroup {
  models: WebinarSession[];
  first: () => WebinarSession;
  getFirstConvertedSession: () => WebinarSession;
  isVideoExists: () => boolean;
  getTotalDuration: () => number;
  getTotalDurationTermType: () => string;
}

export interface WebinarSessionsResponse {
  status: string;
  status_code: string;
  entities: {
    current_page: number;
    data: WebinarSession[];
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
