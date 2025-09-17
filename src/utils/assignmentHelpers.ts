// helpers/assignmentHelpers.ts
import { DEF_SETTINGS } from "./assignmentConstants";
import { AssignmentSettings, ProctoringSettings } from "@/types/assignment";
import moment from "moment";
import "moment-duration-format";

// Утилиты для работы с assignment
export const assignmentHelpers = {
  getName: (assignment: any) => {
    return (
      assignment.name ||
      assignment.lesson?.name ||
      assignment.quiz?.name ||
      "Без названия"
    );
  },

  getClassName: (assignment: any) => {
    return assignment.class?.name || "";
  },

  isPrepaidAccessType: (assignment: any) => {
    // Предполагаем, что есть поле access_type или подобное
    return (
      assignment.access_type === "prepaid" || assignment.type === "prepaid"
    );
  },
};

// Type checking helpers
export const isQuizType = (assignment: any): boolean =>
  assignment.type === "quiz";
export const isLessonType = (assignment: any): boolean =>
  assignment.type === "lesson";
export const isWebinarType = (assignment: any): boolean =>
  assignment.type === "webinar";
export const isExternalType = (assignment: any): boolean =>
  assignment.type === "external";

// Status checking helpers
export const isCompletedStatus = (assignment: any): boolean =>
  assignment.status === "completed";
export const isRemainingStatus = (assignment: any): boolean =>
  assignment.status === "remaining";
export const isSuspendedStatus = (assignment: any): boolean =>
  assignment.status === "suspended";
export const isProcessStatus = (assignment: any): boolean =>
  assignment.status === "process";

// Feature checking helpers
export const isPointSystemEnabled = (assignment: any): boolean =>
  assignment.is_points_method;
export const isProctoringEnabled = (assignment: any): boolean =>
  assignment.is_proctoring;
export const isWebinarEnabled = (assignment: any): boolean =>
  assignment.is_webinar;
export const isHideUsersEnabled = (assignment: any): boolean =>
  assignment.is_hide_users;
export const isCommentsEnabled = (assignment: any): boolean =>
  assignment.is_comments;

// Name and description helpers
export const getName = (assignment: any): string | null => {
  let name = assignment.name;

  if (
    isLessonType(assignment) &&
    assignment.lessons &&
    assignment.lessons.length > 0
  ) {
    name = assignment.lessons
      .map((entity: any) => entity.name)
      .filter((name: string | null) => Boolean(name))
      .join(", ");
  }

  if (
    isQuizType(assignment) &&
    assignment.quizzes &&
    assignment.quizzes.length > 0
  ) {
    name = assignment.quizzes
      .map((entity: any) => entity.name)
      .filter((name: string | null) => Boolean(name))
      .join(", ");
  }

  return name;
};

export const getDescription = (assignment: any): string | null => {
  let description = assignment.description;

  if (
    isLessonType(assignment) &&
    assignment.lessons &&
    assignment.lessons.length > 0
  ) {
    description = assignment.lessons
      .map((entity: any) => entity.description)
      .filter((desc: string | null) => Boolean(desc))
      .join(", ");
  }

  if (
    isQuizType(assignment) &&
    assignment.quizzes &&
    assignment.quizzes.length > 0
  ) {
    description = assignment.quizzes
      .map((entity: any) => entity.description)
      .filter((desc: string | null) => Boolean(desc))
      .join(", ");
  }

  return description;
};

// Date helpers
export const getCreatedAtDate = (
  assignment: any,
  format: string | null = null
): string => {
  if (format) {
    return moment(assignment.created_at).format(format);
  }
  return moment(assignment.created_at).calendar();
};

export const getStartingAtDate = (
  assignment: any,
  format: string | null = null
): string => {
  if (format) {
    return moment(assignment.starting_at).format(format);
  }
  return moment(assignment.starting_at).calendar();
};

export const getEndingAtDate = (
  assignment: any,
  format: string | null = null
): string => {
  if (format) {
    return moment(assignment.ending_at).format(format);
  }
  return moment(assignment.ending_at).calendar();
};

// Assessment helpers
export const getAssessments = (assignment: any): any[] => {
  if (isQuizType(assignment)) {
    return assignment.quizzes || [];
  }

  if (isLessonType(assignment)) {
    return assignment.lessons || [];
  }

  return [];
};

// Point system helpers
export const pointSystemMethod = (assignment: any): "avg" | "sum" | "nan" => {
  if (assignment.points_method_type === "avg") {
    return "avg";
  }

  if (assignment.points_method_type === "sum") {
    return "sum";
  }

  return "nan";
};

export const pointSystemMethodIsNaN = (assignment: any): boolean =>
  assignment.points_method_type === "nan";
export const pointSystemMethodIsSum = (assignment: any): boolean =>
  assignment.points_method_type === "sum";
export const pointSystemMethodIsAvg = (assignment: any): boolean =>
  assignment.points_method_type === "avg";

// Certificate helpers
export const isCertificate = (assignment: any): boolean =>
  assignment.is_certificate;

export const isAutoAllIssueCertificate = (assignment: any): boolean => {
  const settings: any | undefined = assignment.settings?.certificate;
  return settings !== undefined && settings.issue_type === "auto-all";
};

export const isAutoConditionsIssueCertificate = (assignment: any): boolean => {
  const settings: any | undefined = assignment.settings?.certificate;
  return settings !== undefined && settings.issue_type === "auto-conditions";
};

export const isManualIssueCertificate = (assignment: any): boolean => {
  const settings: any | undefined = assignment.settings?.certificate;
  return settings !== undefined && settings.issue_type === "manual";
};

// Proctoring helpers
export const isContentProtectEnabled = (assignment: any): boolean => {
  const settings: ProctoringSettings | undefined =
    assignment.settings?.proctoring_settings;
  return settings !== undefined && settings.content_protect;
};

export const isDisplaysCheckEnabled = (assignment: any): boolean => {
  const settings: ProctoringSettings | undefined =
    assignment.settings?.proctoring_settings;
  return settings !== undefined && settings.displays_check;
};

// Student helpers
export const isAvailableTime = (assignment: any): boolean => {
  return (
    assignment.available_time !== null &&
    assignment.available_time !== undefined &&
    assignment.available_time > 0
  );
};

export const getAvailableTime = (assignment: any): string => {
  if (
    assignment.available_time === null ||
    assignment.available_time === undefined
  ) {
    return "00:00:00";
  }
  // Используем as.Duration для правильной типизации
  const duration = moment.duration(assignment.available_time, "seconds");
  // Форматируем вручную или используем moment-duration-format
  const hours = Math.floor(duration.asHours()).toString().padStart(2, "0");
  const minutes = duration.minutes().toString().padStart(2, "0");
  const seconds = duration.seconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export const getAvailableTermTime = (
  assignment: any
): "seconds" | "minutes" | "hours" => {
  if (
    assignment.available_time === null ||
    assignment.available_time === undefined
  ) {
    return "seconds";
  }

  let term: "seconds" | "minutes" | "hours" = "seconds";

  if (assignment.available_time <= 60) {
    term = "seconds";
  } else if (assignment.available_time <= 3600) {
    term = "minutes";
  } else {
    term = "hours";
  }

  return term;
};

export const isStarted = (assignment: any): boolean => assignment.is_started;
export const isFinished = (assignment: any): boolean => assignment.is_finished;
export const isRegistered = (assignment: any): boolean =>
  assignment.is_registered;

export const getMaxAttempts = (assignment: any): number | null =>
  assignment.max_attempts;
export const getCompleteTime = (assignment: any): number | null =>
  assignment.complete_time;

// Component helpers
export const getComponentById = (
  assignment: any,
  componentId: number,
  assessmentId: number
): any | null => {
  if (isLessonType(assignment) && assignment.lessons) {
    const lesson = assignment.lessons.find((l: any) => l.id === assessmentId);
    if (lesson && lesson.components) {
      return lesson.components.find((c: any) => c.id === componentId) || null;
    }
  }

  if (isQuizType(assignment) && assignment.quizzes) {
    const quiz = assignment.quizzes.find((q: any) => q.id === assessmentId);
    if (quiz && quiz.components) {
      return quiz.components.find((c: any) => c.id === componentId) || null;
    }
  }

  return null;
};

// Reviewer result helpers
export const getReviewerResult = (
  assignment: any,
  result: any,
  reviewerId: number | null = null
): any => {
  if (!assignment.reviewer_results) {
    return {
      assignment_id: result.assignment_id,
      assignment_result_id: result.id,
      student_id: result.student_id,
      component_id: result.component_id,
      component_type: result.component_type,
    };
  }

  // Find reviewer result by result id
  let found = assignment.reviewer_results.find(
    (rr: any) =>
      rr.assignment_result_id === result.id &&
      (!reviewerId || rr.reviewer_id === reviewerId)
  );

  if (!found) {
    // Create new reviewer result object
    found = {
      assignment_id: result.assignment_id,
      assignment_result_id: result.id,
      student_id: result.student_id,
      component_id: result.component_id,
      component_type: result.component_type,
    };
  }

  return found;
};

// Settings helpers
export const getSettings = (assignment: any): AssignmentSettings => {
  return { ...DEF_SETTINGS, ...assignment.settings };
};
