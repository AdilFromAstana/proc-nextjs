// types/assignment/violations.ts

export interface AssignmentViolation {
  id: number;
  assignment_id: number;
  assignment_attempt_id: number;
  student_id: number;
  action_type: string;
  description: string | null;
  extra: Record<string, any> | null;
  created_at: string;
  initiator_id: number | null;
  is_archived: boolean | null;
  is_warning: 0 | 1;
  screenshot: string | null;
  screenshot_storage_id: number | null;
  screenshots: string[];
  webinar_session_id: number | null;
}

export interface AssignmentViolationResponse {
  entities: {
    data: AssignmentViolation[];
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
  };
}

export interface AssignmentViolationType {
  id: string;
  name: string;
}
