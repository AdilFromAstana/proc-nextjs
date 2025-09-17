import React from "react";
import {
  Assignment,
  Student,
  AssignmentAttempt,
  AssignmentComponentList,
  AssignmentResult,
} from "@/types/assignment/results";
import {
  getAssessmentComponent,
  getAssessmentResults,
} from "@/utils/quizResultHelpers";
import { isPointSystemEnabled } from "@/utils/assignmentHelpers";
import { getStudentFullName } from "@/utils/studentResultUtils";
import QuizResultItem from "./QuizResultItem";

interface OwnerResultListProps {
  assignment: Assignment;
  assessment: any;
  components: AssignmentComponentList;
  results: AssignmentResult[];
  attempt: AssignmentAttempt | null;
  student: Student;
  onClickResult: (result: any) => void;
}

const OwnerResultList: React.FC<OwnerResultListProps> = ({
  assignment,
  assessment,
  components,
  results,
  attempt,
  student,
  onClickResult,
}) => {
  const assessmentResults = getAssessmentResults(results, assessment);

  return (
    <div
      className={`quiz-label-results ${
        assignment?.reviewers?.length > 0 ? "labeled" : ""
      }`}
    >
      {assignment?.reviewers?.length > 0 && (
        <div className="quiz-label-name">{getStudentFullName(student)}</div>
      )}
      <div className="quiz-result-list">
        {assessmentResults.map((result, i) => {
          const component = getAssessmentComponent(
            components,
            assignment,
            assessment,
            result
          );
          if (!component) return null;

          return (
            <QuizResultItem
              key={`quiz-result-${result.id}`}
              onClick={() => onClickResult(result)}
              result={result}
              component={component}
              index={i}
              isPointSystemEnabled={isPointSystemEnabled(assessment)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OwnerResultList;
