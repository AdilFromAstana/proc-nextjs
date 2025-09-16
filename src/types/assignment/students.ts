// src/types/assignment/students.ts

import { AssignmentActionsPagination } from "./actions";

export interface StudentResult {
  id: number;
  assignment_id: number;
  assignment_attempt_id: number;
  student_id: number;
  assessment_id: number;
  assessment_type: string;
  component_id: number;
  component_type: string;
  result: number;
  points: number | null;
}

export interface StudentAttempt {
  id: number;
  status: "active" | "closed" | string;
  results: StudentResult[];
  variant: string | null;
  points: number;
}

export interface AssignmentStudent {
  id: number;
  user_id: number;
  points: number;
  results: StudentResult[];
  scores: any[];
  attempts: StudentAttempt[];
  user: {
    id: number;
    photo: string | null;
    color: string;
    firstname: string;
    lastname: string;
    is_online: boolean;
  };
  credibility: number;
}

export interface AssignmentStudentsResponse {
  status: "success" | string;
  status_code: string;
  entities: {
    data: AssignmentStudent[];
  } & AssignmentActionsPagination;
}
