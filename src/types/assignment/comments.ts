// src/types/assignment/comments.ts

export interface CommentUser {
  id: number;
  firstname: string;
  lastname: string;
  photo: string | null;
}

export interface AssignmentComment {
  id: number;
  assignment_id: number;
  assignment_result_id: number | null;
  user_id: number;
  component_id: number | null;
  component_type: string | null;
  message: string;
  user: CommentUser;
  created_at: string;
  updated_at: string;
}

export interface AssignmentCommentsResponse {
  status: "success" | string;
  status_code: string;
  entities: AssignmentComment[];
}
