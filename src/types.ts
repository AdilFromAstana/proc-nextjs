import { Assignment } from "./types/assignment/list";
import { Student } from "./types/students";

// types.ts
export type AssignmentModel = {
  id: number;
  owner_id: number;
  certificate_id?: number;
  reviewers: Reviewer[];
  isPointSystemEnabled(): boolean;
  isExternalType(): boolean;
  isLessonType(): boolean;
  isQuizType(): boolean;
  isWebinarType(): boolean;
  isHideUsersEnabled(): boolean;
  isCompletedStatus(): boolean;
  isCertificate(): boolean;
  isProctoringEnabled(): boolean;
  pointSystemMethod(): string;
  getAssessments(): {
    each: (callback: (item: any) => void) => void;
  };
};

export type Reviewer = {
  id: number;
};

export type StudentModel = {
  id: number;
  points: number;
  credibility: number;
  results: {
    models: ResultModel[];
  };
  attempts: {
    length: number;
    models: AttemptModel[];
  };
  user: {
    id: number;
    firstname: string;
    lastname: string;
    photo: string;
    color: string;
    is_online: boolean;
    getFullName(): string;
    getFirstName(): string;
  };
  getReviewerResult(result: ResultModel): ReviewerResultModel;
  getActiveAttempt(): AttemptModel | null;
  getScore(): number;
  getPoints(method: string, attemptId: number | null): number;
};

export type AttemptModel = {
  id: number;
  status: string;
  points: number;
  results: {
    models: ResultModel[];
  };
  variant: any;
};

export type ResultModel = {
  id: number;
  points: number | null;
  getClassName(): string;
};
export type Result = {
  id: number;
  points: number | null;
  getClassName(): string;
};

export type ReviewerResultModel = {
  id: number;
  points: number | null;
  getClassName(): string;
};

export type ReviewerScoreList = {
  getScore: () => number;
  findScore: () => any;
};

export type UserCertificateModel = {
  id: number;
  certificate_id: number;
  [key: string]: any;
};

export type UserModel = {
  group: string;
  id: number;
  [key: string]: any;
};

// Props types
export type AssignmentStudentListProps = {
  assignment: AssignmentModel | null;
  student: StudentModel | null;
  progress?: { total: number };
  fetchResults?: boolean;
  fetchScores?: boolean;
  disabled?: boolean;
  viewer?: "owner" | "reviewer" | "proctor";
  onAttemptSelected?: (student: StudentModel, attempt: AttemptModel) => void;
  onAttemptUpdated?: (
    student: StudentModel,
    component: any,
    result: any
  ) => void;
};

export type Attempt = {
  id: number;
  status: string;
  points: number;
  results: {
    models: Result[];
  };
  variant: any;
};

export type ReviewerResult = {
  id: number;
  points: number | null;
  getClassName(): string;
};

export type StudentResultToolbarProps = {
  student: Student;
  assignment: AssignmentModel;
  isReviewer: boolean;
  viewer: "owner" | "reviewer" | "proctor" | null;
};

/////////////////////////

export type AssignmentStudentListComponent = {
  assignment: AssignmentModel;
  selected: Student | null;
  page: number;
  viewer: "owner" | "reviewer" | "proctor" | null;
  isOwner: boolean;
  isReviewer: boolean;
  isProctor: boolean;
  isManager: boolean;
  onStudentSelected: (student: Student) => void;
  onSetStudentListPage: (page: number) => void;
  onStudentAttemptSelected: (student: Student, attempt: Attempt) => void;
  onStudentAttemptUpdated: (student: Student) => void;
  showStudentSettings: (student: Student) => void;
  copyReportUrl: (student: Student) => void;
  renderStudentResults: (student: Student) => React.ReactNode;
  renderAdditional: (student: Student) => React.ReactNode;
};

export type AssignmentStudentListComponentNotReqProps =
  Partial<AssignmentStudentListComponent>;

export type StudentListProps = {
  assignment?: Assignment; // Задание
  isReviewer?: boolean; // Является ли пользователь рецензентом
  isOwner?: boolean; // Является ли пользователь владельцем
  onCopyReportUrl?: (student: Student) => void; // Обработчик копирования URL отчета
  onShowSettings?: (student: Student) => void; // Обработчик показа настроек
  entities: any[];
  selectable: boolean;
  multiple: boolean;
  pagination: boolean;
  page: number;
  loadingPlaceholderCount: number;
  onPaged: (page: number) => void;
  onItemClicked: (item: any) => void;
  renderData: (item: any) => React.ReactNode;
  renderAdditional?: (item: any) => React.ReactNode;
  className?: string;
  extendedStudentId?: string | number;
  onSelected: (value: any) => void;
  totalPages: number;
  renderMeta: any;
};

export type StudentListNotReqProps = Partial<StudentListProps>;

export type StudentListRef = {
  showLoader: () => void;
  hideLoader: () => void;
};
