// src/types/assignment/actions.ts

export interface ActionUser {
  id: number;
  firstname: string;
  lastname: string;
  photo?: string;
}

export interface AssignmentAction {
  id: number;
  assignment_id: number;
  student_id: number;
  action_type: string;
  description: string | null;
  screenshot: string | null;
  is_warning: 0 | 1;
  created_at: string;
  user: ActionUser;
  is_archived: boolean;
  initiator_id: boolean;
}

export interface AssignmentActionsPagination {
  current_page: number;
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
}

export interface AssignmentActionsResponse {
  status: "success" | string;
  status_code: string;
  entities: {
    data: AssignmentAction[];
  } & AssignmentActionsPagination;
}
