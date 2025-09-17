import {
  Assessment,
  Assignment,
  AssignmentAttempt,
  AssignmentComponent,
  AssignmentComponentList,
  Student,
  AssignmentResult,
} from "@/types/assignment/results";
import { useState } from "react";
import OwnerResultList from "./OwnerResultList";
import ReviewerResultList from "./ReviewerResultList";
import AverageResults from "./AverageResults";
import {
  getAssessments,
  isPointSystemEnabled,
  pointSystemMethodIsAvg,
} from "@/utils/assignmentHelpers";

interface QuizResultListComponentProps {
  assignment: Assignment;
  student: Student;
  assessments: Assessment[] | null;
  attempt: AssignmentAttempt | null;
  components: AssignmentComponentList;
  results: AssignmentResult[];
  disabled?: boolean;
  viewer?: string;
  onAttemptUpdated?: (
    student: Student,
    component: AssignmentComponent | undefined,
    result: any
  ) => void;
}

const createAssessmentList = (
  assessments: Assessment[] | null,
  assignment: Assignment
): Assessment[] => {
  if (assessments && assessments.length > 0) {
    return assessments;
  }

  const list: any[] = [];
  getAssessments(assignment).forEach((a: any) => {
    list.push({ assessment_id: a.id, assessment_name: a.name });
  });

  return list;
};

const QuizResultListComponent: React.FC<QuizResultListComponentProps> = ({
  assignment,
  student,
  assessments,
  attempt,
  components,
  results,
  viewer = "owner",
}) => {
  const [currentContext, setCurrentContext] = useState(viewer);
  const user = { id: 1, group: "owner" };
  const isManager = user.group === "manager";
  const isOwner = viewer === "owner" || isManager;
  const isReviewer = viewer === "reviewer";

  if (results.length <= 0 || components.length <= 0) return null;

  const assessmentList = createAssessmentList(assessments, assignment);

  return (
    <div className="block-inline whitespace-nowrap overflow-x-auto rounded-md shadow-sm">
      {assessmentList.map((assessment) => {
        return (
          <div
            key={`assessment-${assessment.assessment_id}`}
            className="p-4 border-t border-gray-300 relative"
          >
            <div className="text-gray-500 text-sm font-semibold px-3 py-2 bg-white rounded-b shadow-sm relative -top-4 inline-block">
              {assessment.assessment_name}
            </div>
            <div className="quiz-assessment-content">
              {isOwner && (
                <>
                  <OwnerResultList
                    assignment={assignment}
                    assessment={assessment}
                    components={components}
                    results={results}
                    attempt={attempt}
                    onClickResult={(r) => setCurrentContext("owner")}
                    student={student}
                  />

                  {assignment?.reviewers?.models?.map((reviewer) => (
                    <ReviewerResultList
                      key={reviewer.id}
                      assignment={assignment}
                      assessment={assessment}
                      components={components}
                      results={results}
                      attempt={attempt}
                      onClickResult={(r) => setCurrentContext("reviewer")}
                      reviewer={reviewer}
                      user={user}
                    />
                  ))}

                  {isPointSystemEnabled(assignment) &&
                    pointSystemMethodIsAvg(assignment) && (
                      <AverageResults
                        assignment={assignment}
                        assessment={assessment}
                        components={components}
                        results={results}
                        attempt={attempt}
                      />
                    )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizResultListComponent;
