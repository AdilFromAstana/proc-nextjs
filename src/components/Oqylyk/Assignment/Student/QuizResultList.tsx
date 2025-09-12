import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import QuizResultItem from "./QuizResultItem";

interface Assignment {
  id: number;
  reviewers: { length: number; models: Reviewer[] };
  isPointSystemEnabled: () => boolean;
  pointSystemMethodIsNaN: () => boolean;
  pointSystemMethodIsAvg: () => boolean;
  pointSystemMethodIsSum: () => boolean;
  isQuizType: () => boolean;
  isLessonType: () => boolean;
  getAssessments: () => { each: (callback: (assessment: any) => void) => void };
}

interface Student {
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

interface Reviewer {
  id: number;
  getFullName: () => string;
}
interface Assessment {
  assessment_id: number;
  assessment_name: string;
}
interface Component {
  id: number;
  quiz_id?: number;
  lesson_id?: number;
  component_type: string;
}
interface Result {
  id: number;
  assessment_id: number;
  component_id: number;
  result: number;
  points: number | null;
  getClassName: () => string;
}
interface AssignmentAttempt {
  id: number;
}
interface AssignmentComponentList {
  find: (cb: (c: Component) => boolean) => Component | undefined;
  models: Component[];
  length: number;
}
interface AssignmentResultList {
  models: Result[];
  length: number;
}

const mockUser = {
  id: 1,
  group: "owner",
};

const mockAssignment: Assignment = {
  id: 123,
  reviewers: {
    length: 2,
    models: [
      {
        id: 101,
        getFullName: () => "Иван Петров",
      },
      {
        id: 102,
        getFullName: () => "Мария Сидорова",
      },
    ],
  },
  isPointSystemEnabled: () => true,
  pointSystemMethodIsNaN: () => false,
  pointSystemMethodIsAvg: () => true,
  pointSystemMethodIsSum: () => false,
  isQuizType: () => true,
  isLessonType: () => false,
  getAssessments: () => ({
    each: (callback: (assessment: any) => void) => {
      callback({
        id: 1,
        name: "Тест по математике",
      });
      callback({
        id: 2,
        name: "Тест по физике",
      });
    },
  }),
};

const mockStudent: Student = {
  id: 201,
  getFullName: () => "Алексей Иванов",
  getReviewerResult: (result: any, reviewerId?: number) => {
    // Возвращаем модифицированный результат для рецензента
    return {
      ...result,
      points: reviewerId ? result.points + 1 : result.points,
      getClassName: () => {
        if (result.result === 3) return "true";
        if (result.result === 2) return "false";
        return "answered";
      },
    };
  },
  getSumResultsPoints: (
    reviewerId: number | null,
    attemptId: number | null
  ) => {
    return reviewerId === 101 ? 85 : 82;
  },
  getAvgResultPoints: (resultId: number, attemptId: number | null) => {
    return Math.floor(Math.random() * 10) + 5;
  },
  getAvgResultsPoints: (
    reviewerId: number | null,
    attemptId: number | null
  ) => {
    return 87;
  },
  getSumResultPoints: (resultId: number, attemptId: number | null) => {
    return Math.floor(Math.random() * 15) + 10;
  },
};

const mockAssessments: Assessment[] = [
  {
    assessment_id: 1,
    assessment_name: "Тест по математике",
  },
  {
    assessment_id: 2,
    assessment_name: "Тест по физике",
  },
];

const mockAttempt: AssignmentAttempt = {
  id: 301,
};

const mockComponents: AssignmentComponentList = {
  models: [
    { id: 1, quiz_id: 1, component_type: "FreeQuestionComponent" },
    { id: 2, quiz_id: 1, component_type: "PollComponent" },
    { id: 3, quiz_id: 1, component_type: "OpenQuestionComponent" },
    { id: 4, quiz_id: 2, component_type: "FillSpaceQuestionComponent" },
    { id: 5, quiz_id: 2, component_type: "DragAndDropQuestionComponent" },
  ],
  length: 5,
  find: function (cb: (c: Component) => boolean) {
    return this.models.find(cb);
  },
};

const mockResults: AssignmentResultList = {
  models: [
    {
      id: 1,
      assessment_id: 1,
      component_id: 1,
      result: 3, // правильно
      points: 10,
      getClassName: () => "true",
    },
    {
      id: 2,
      assessment_id: 1,
      component_id: 2,
      result: 2, // неправильно
      points: 0,
      getClassName: () => "false",
    },
    {
      id: 3,
      assessment_id: 1,
      component_id: 3,
      result: 1, // на проверке
      points: 5,
      getClassName: () => "answered",
    },
    {
      id: 4,
      assessment_id: 2,
      component_id: 4,
      result: 3, // правильно
      points: 15,
      getClassName: () => "true",
    },
    {
      id: 5,
      assessment_id: 2,
      component_id: 5,
      result: 2, // неправильно
      points: 0,
      getClassName: () => "false",
    },
  ],
  length: 5,
};

// Разные сценарии использования:

// 1. Владелец (owner) с рецензентами
const mockOwnerDataWithReviewers = {
  assignment: mockAssignment,
  student: mockStudent,
  assessments: mockAssessments,
  attempt: mockAttempt,
  components: mockComponents,
  results: mockResults,
  disabled: false,
  viewer: "owner",
};

interface QuizResultListComponentProps {
  assignment?: Assignment;
  student?: Student;
  assessments?: Assessment[] | null;
  attempt?: AssignmentAttempt | null;
  components?: AssignmentComponentList;
  results?: AssignmentResultList;
  disabled?: boolean;
  viewer?: string;
  onAttemptUpdated?: (
    student: Student,
    component: Component | undefined,
    result: any
  ) => void;
}

const QuizResultListComponent: React.FC<QuizResultListComponentProps> = ({
  assignment = mockOwnerDataWithReviewers.assignment,
  student = mockOwnerDataWithReviewers.student,
  assessments = mockOwnerDataWithReviewers.assessments,
  attempt = mockOwnerDataWithReviewers.attempt,
  components = mockOwnerDataWithReviewers.components,
  results = mockOwnerDataWithReviewers.results,
  disabled = mockOwnerDataWithReviewers.disabled,
  viewer = mockOwnerDataWithReviewers.viewer,
  onAttemptUpdated,
}) => {
  const user = { id: 1, group: "owner" };
  const isManager = user.group === "manager";
  const isOwner = viewer === "owner" || isManager;
  const isReviewer = viewer === "reviewer";

  const assessmentList =
    assessments && assessments.length > 0
      ? assessments
      : (() => {
          const list: Assessment[] = [];
          assignment
            .getAssessments()
            .each((a: any) =>
              list.push({ assessment_id: a.id, assessment_name: a.name })
            );
          return list;
        })();

  const getAssessmentResults = (a: Assessment) =>
    results.models.filter((r) => r.assessment_id === a.assessment_id);
  const getAssessmentComponent = (a: Assessment, r: Result) => {
    if (assignment.isQuizType()) {
      return components.find(
        (c) => c.id === r.component_id && c.quiz_id === a.assessment_id
      );
    }
    if (assignment.isLessonType()) {
      return components.find(
        (c) => c.id === r.component_id && c.lesson_id === a.assessment_id
      );
    }
    return undefined;
  };

  if (results.length <= 0 || components.length <= 0) return null;

  return (
    <div className="w-full space-y-4 p-0 m-0 gap-4 flex flex-col">
      {assessmentList.map((assessment, index) => (
        <Card key={assessment.assessment_id} className="shadow-sm m-0 p-0">
          <CardContent className="p-4 space-y-4">
            <Badge variant="secondary" className="text-sm font-semibold">
              {assessment.assessment_name}
            </Badge>

            {isReviewer && (
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2">
                  {getAssessmentResults(assessment).map((result, i) => {
                    const component = getAssessmentComponent(
                      assessment,
                      result
                    );
                    if (!component) return null;
                    return (
                      <QuizResultItem
                        key={result.id}
                        index={i}
                        result={student.getReviewerResult(result)}
                        component={component}
                        isPointSystemEnabled={assignment.isPointSystemEnabled()}
                        onClick={() => {}}
                      />
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            {isOwner && (
              <div className="space-y-3">
                {/* Основные результаты */}
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-2">
                    {getAssessmentResults(assessment).map((result, i) => {
                      const component = getAssessmentComponent(
                        assessment,
                        result
                      );
                      return (
                        <QuizResultItem
                          key={result.id}
                          index={i}
                          result={result}
                          component={component || { component_type: "" }}
                          isPointSystemEnabled={assignment.isPointSystemEnabled()}
                          onClick={() => {}}
                        />
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuizResultListComponent;
