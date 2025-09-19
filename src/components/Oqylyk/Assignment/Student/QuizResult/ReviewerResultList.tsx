import React from "react";
import {
  Assignment,
  AssignmentAttempt,
  AssignmentComponentList,
  AssignmentResult,
} from "@/types/assignment/results";
import {
  getAssessmentComponent,
  getAssessmentResults,
} from "@/utils/quizResultHelpers";
import {
  isPointSystemEnabled,
  pointSystemMethodIsNaN,
} from "@/utils/assignmentHelpers";
import {
  getReviewerResult,
  getReviewerFullName,
  getSumResultsPoints,
} from "@/utils/studentResultUtils";
import QuizResultItem from "./QuizResultItem";

interface ReviewerResultListProps {
  assignment: Assignment;
  assessment: any;
  components: AssignmentComponentList;
  results: AssignmentResult[];
  attempt: AssignmentAttempt | null;
  reviewer: any;
  user: any;
  onClickResult: (result: any) => void;
}

const ReviewerResultList: React.FC<ReviewerResultListProps> = ({
  assignment,
  assessment,
  components,
  results,
  attempt,
  reviewer,
  user,
  onClickResult,
}) => {
  const assessmentResults = getAssessmentResults(results, assessment);

  return (
    <div
      key={`reviewer-${reviewer.id}`}
      className="quiz-label-results labeled margin-2x"
    >
      <div className="quiz-label-name">{getReviewerFullName(reviewer)}</div>
      <div
        className={`quiz-result-list ${
          !pointSystemMethodIsNaN(assignment) ? "calculated" : ""
        }`}
      >
        {assessmentResults.map((result, i) => {
          const component = getAssessmentComponent(
            components,
            assignment,
            assessment,
            result
          );
          if (!component) return null;

          return (
            <div
              key={`reviewer-result-${reviewer.id}-${result.id}`}
              className="quiz-result-item"
              onClick={() =>
                onClickResult(getReviewerResult(results, result, reviewer.id))
              }
            >
              <QuizResultItem
                result={result}
                component={component}
                index={i}
                isPointSystemEnabled={isPointSystemEnabled(assessment)}
              />
            </div>
          );
        })}

        {/* TOTAL SUM */}
        {isPointSystemEnabled(assignment) &&
          !pointSystemMethodIsNaN(assignment) && (
            <div
              className="quiz-result-item cursor-default hover:bg-gray-100
"
            >
              <div className="component-index">SUM</div>
              <div className="component-result">
                {(() => {
                  const points = getSumResultsPoints(
                    results,
                    reviewer.id,
                    attempt ? attempt.id : null
                  );
                  return (
                    <div className={`result-wrap ${points > 0 ? "info" : ""}`}>
                      {points > 0 ? (
                        <div className="result-points">{points}</div>
                      ) : (
                        <div className="result-icon">ℹ️</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ReviewerResultList;
