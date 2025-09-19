// types/assignment/results.ts

export interface Assessment {
  id: number;
  assignment_id: number;
  student_id: number;
  assessment_id: number;
  assessment_type: string;
  assessment_name: string;
}

export interface AssignmentComponent {
  id: number;
  quiz_id?: number;
  lesson_id?: number;
  component_type: string;
}

export interface AssignmentResult {
  id: number;
  assessment_id: number;
  component_id: number;
  result: number;
  points: number | null;
  getClassName: () => string;
}

export interface AssignmentAttempt {
  id: number;
}

export interface AssignmentReviewer {
  id: number;
  getFullName: () => string;
}

export interface Assignment {
  id: number;
  reviewers: {
    length: number;
    models: AssignmentReviewer[];
  };
  // isPointSystemEnabled: () => boolean;
  // pointSystemMethodIsNaN: () => boolean;
  // pointSystemMethodIsAvg: () => boolean;
  // pointSystemMethodIsSum: () => boolean;
  // isQuizType: () => boolean;
  // isLessonType: () => boolean;
  // getAssessments: () => { each: (callback: (assessment: any) => void) => void };
}

export interface Student {
  id: number;
  getFullName: () => string;
  getReviewerResult: (result: any, reviewerId?: number) => any;
  getSumResultsPoints: (
    reviewerId: number | null,
    attemptId: number | null
  ) => number;
  getAvgResultPoints: (resultId: number, attemptId: number | null) => number;
  getAvgResultsPoints: (
    reviewerId: number | null,
    attemptId: number | null
  ) => number;
  getSumResultPoints: (resultId: number, attemptId: number | null) => number;
}

export interface AssignmentComponentList {
  find: (
    cb: (c: AssignmentComponent) => boolean
  ) => AssignmentComponent | undefined;
  models: AssignmentComponent[];
  length: number;
}
