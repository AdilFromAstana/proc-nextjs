// utils/quizResultHelpers.ts

import {
  Assignment,
  Student,
  Assessment,
  AssignmentResult,
  AssignmentComponentList,
  AssignmentComponent,
} from "@/types/assignment/results";
import { isLessonType, isQuizType } from "./assignmentHelpers";

export const getAssessmentResults = (
  results: AssignmentResult[],
  assessment: Assessment
) => {
  // console.log("---------------------------------");
  // console.log("assessment: ", assessment);
  // console.log("results: ", results);
  return results.filter(
    (item) => item.assessment_id === assessment.assessment_id
  );
};

export const getAssessmentComponent = (
  components: AssignmentComponentList,
  assignment: any,
  assessment: Assessment,
  result: AssignmentResult
) => {
  if (isQuizType(assignment)) {
    return components.find(
      (c) =>
        c.id === result.component_id && c.quiz_id === assessment.assessment_id
    );
  }

  if (isLessonType(assignment)) {
    return components.find(
      (c) =>
        c.id === result.component_id && c.lesson_id === assessment.assessment_id
    );
  }

  return undefined;
};
