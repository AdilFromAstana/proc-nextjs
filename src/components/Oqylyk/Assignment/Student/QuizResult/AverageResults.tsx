import React from "react";
import {
  Assignment,
  AssignmentAttempt,
  AssignmentComponentList,
  AssignmentResult,
} from "@/types/assignment/results";
import { getAssessmentResults } from "@/utils/quizResultHelpers";
import {
  getAvgResultPoints,
  getAvgResultsPoints,
} from "@/utils/studentResultUtils";

interface AverageResultsProps {
  assignment: Assignment;
  assessment: any;
  components: AssignmentComponentList;
  results: AssignmentResult[];
  attempt: AssignmentAttempt | null;
}

const AverageResults: React.FC<AverageResultsProps> = ({
  assignment,
  assessment,
  results,
  attempt,
}) => {
  const assessmentResults = getAssessmentResults(results, assessment);

  return (
    <div className="quiz-label-results labeled margin-2x">
      <div className="quiz-label-name">Средние результаты</div>
      <div className="quiz-result-list calculated">
        {assessmentResults.map((result, i) => (
          <div key={`average-result-${i}`} className="quiz-result-item">
            <div className="component-index">В{i + 1}</div>
            <div className="component-result">
              {(() => {
                const points = getAvgResultPoints(
                  results,
                  result.id,
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
        ))}

        {/* TOTAL AVG */}
        <div className="quiz-result-item cursor-default hover:bg-gray-100">
          <div className="component-index">AVG</div>
          <div className="component-result">
            {(() => {
              const points = getAvgResultsPoints(
                results,
                null,
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
      </div>
    </div>
  );
};

export default AverageResults;
