import React, { useState, useEffect, useRef } from "react";
import VideoSessionList from "./VideoSessionList";
import ViolationsComponent from "./ViolationsComponent";
import IdentificationList from "./IdentificationList";
import AssignmentVideoViewerModalComponent from "./VideoModalViewerComponent";
import AssignmentActionsComponent from "./ActionsComponent";
import QuizResultListComponent from "./QuizResultList";
import OverlayLoaderComponent from "@/components/Chunks/OverlayLoaderComponent";
import ResultChartComponent from "../UI/ResultChartComponent";
import AttemptViewerModalComponent from "./AttemptViewerModalComponent";
import CreateViolationModal from "./CreateViolationModal";
import ConfirmModalComponent from "@/components/Chunks/ConfirmModalComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faExclamationTriangle,
  faVideo,
  faTasks,
  faClipboardList,
  faStarHalfAlt,
  faCertificate,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import CertificateComponent from "./CertificateComponent";
import TimeStatesComponent from "./TimeStatesComponent";

// Интерфейсы для типизации
interface AssignmentModel {
  id: number;
  certificate_id?: number;
  isPointSystemEnabled(): boolean;
  isExternalType(): boolean;
  isLessonType(): boolean;
  isQuizType(): boolean;
  isWebinarType(): boolean;
  isHideUsersEnabled(): boolean;
  isCompletedStatus(): boolean;
  isCertificate(): boolean;
  pointSystemMethod(): string;
  isCommentsEnabled(): boolean; // <- ДОБАВИТЬ ЭТУ СТРОКУ
  getAssessments(): {
    each: (callback: (item: any) => void) => void;
  };
}

interface StudentModel {
  id: number;
  attempts: {
    length: number;
    models: Attempt[];
    each: (callback: (attempt: Attempt) => void) => void;
  };
  results: any[];
  scores: {
    getScore: () => number;
    findScore: () => any;
    push: (score: any) => void;
    replace: (scores: any[]) => void;
  };
  reviewer_scores: {
    getScore: () => number;
    findScore: () => any;
  };
  getPoints: (method: string, attemptId: number | null) => number;
}

interface Attempt {
  id: number;
  status: "active" | "closed";
  results: any[];
}

interface AssignmentActionList {
  replace: (data: any[]) => void;
  length?: number;
  models?: any[];
  fetch?: (params: any) => Promise<void>;
}

interface AssignmentComponentList {
  length: number;
  models: any[];
}

interface ScoreList {
  getScore(): number;
  findScore(): any;
  push(score: any): void;
  replace(scores: any[]): void;
}

interface ReviewerScoreList {
  getScore(): number;
  findScore(): any;
}

interface UserCertificateModel {
  id: number;
  // другие поля сертификата
}

interface UserModel {
  group: string;
}

// Mock данные для типов
const mockAssignment: AssignmentModel = {
  id: 123,
  certificate_id: 456,
  isPointSystemEnabled: () => true,
  isExternalType: () => false,
  isLessonType: () => false,
  isQuizType: () => true,
  isWebinarType: () => false,
  isHideUsersEnabled: () => false,
  isCompletedStatus: () => true,
  isCertificate: () => true,
  pointSystemMethod: () => "sum",
  isCommentsEnabled: () => true,
  getAssessments: () => ({
    each: (callback: (item: any) => void) => {
      callback({ id: 1, name: "Тест 1" });
      callback({ id: 2, name: "Тест 2" });
    },
  }),
};

const mockStudent: StudentModel = {
  id: 789,
  attempts: {
    length: 2,
    models: [
      { id: 1, status: "active", results: [] },
      { id: 2, status: "closed", results: [] },
    ],
    each: function (callback: (attempt: Attempt) => void) {
      this.models.forEach(callback);
    },
  },
  results: [],
  scores: {
    getScore: () => 85,
    findScore: () => ({ points: 85 }),
    push: (score: any) => {},
    replace: (scores: any[]) => {},
  },
  reviewer_scores: {
    getScore: () => 90,
    findScore: () => ({ points: 90 }),
  },
  getPoints: (method: string, attemptId: number | null) => 85,
};

const mockUser: UserModel = {
  group: "owner",
};

interface AssignmentStudentResultViewerProps {
  viewer?: "owner" | "reviewer" | "proctor";
  assignment?: AssignmentModel | null;
  student?: StudentModel | null;
  progress?: { total: number };
  fetchResults?: boolean;
  fetchScores?: boolean;
  disabled?: boolean;
  onAttemptSelected?: (student: StudentModel, attempt: Attempt) => void;
  onAttemptUpdated?: (
    student: StudentModel,
    component: any,
    result: any
  ) => void;
}

const ResultViewerComponent: React.FC<AssignmentStudentResultViewerProps> = ({
  viewer = "owner",
  assignment = mockAssignment,
  student = mockStudent,
  progress = { total: 0 },
  fetchResults = false,
  fetchScores = false,
  disabled = false,
  onAttemptSelected,
  onAttemptUpdated,
}) => {
  // Refs
  const videoModalRef = useRef<any>(null);
  const confirmModalRef = useRef<any>(null);

  // State с правильными типами
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const [progressStudent, setProgressStudent] = useState(progress);
  const [currentContext, setCurrentContext] = useState("owner");

  const [components, setComponents] = useState<AssignmentComponentList>({
    length: 0,
    models: [],
  });

  const [violations, setViolations] = useState<AssignmentActionList>({
    replace: (data: any[]) => {
      console.log("Replacing violations:", data);
    },
    length: 0,
    models: [],
  });

  const [identities, setIdentities] = useState<AssignmentActionList>({
    replace: (data: any[]) => {
      console.log("Replacing identities:", data);
    },
    length: 0,
    models: [],
  });

  const [actions, setActions] = useState<AssignmentActionList>({
    replace: (data: any[]) => {
      console.log("Replacing actions:", data);
    },
    length: 0,
    models: [],
  });

  const [studentResults, setStudentResults] = useState<any[]>([]);

  const [studentScores, setStudentScores] = useState<ScoreList>({
    getScore: () => 0,
    findScore: () => null,
    push: (score: any) => {},
    replace: (scores: any[]) => {},
  });

  const [assessments, setAssessments] = useState<any[]>([]);
  const [certificate, setCertificate] = useState<UserCertificateModel | null>(
    null
  );
  const [fetchedData, setFetchedData] = useState<any>({});
  const [resultsChart, setResultsChart] = useState<any[]>([]);
  const [available_time, setAvailableTime] = useState<any>(null);
  const [credibility, setCredibility] = useState<number>(-1);
  const [is_started, setIsStarted] = useState<boolean | null>(null);
  const [is_finished, setIsFinished] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Computed values
  const webinarSessionsApiUrl = "/api/webinar-sessions";
  const isManager = true;
  const isOwner = true;
  const isReviewer = viewer === "reviewer";

  const totalApiUrl = assignment ? `/api/assignments/${assignment.id}` : "";
  const totalApiParams = {
    ...(student ? { context: student.id } : {}),
    ...(currentAttempt ? { assignment_attempt_id: currentAttempt.id } : {}),
  };

  const currentScore = (() => {
    return student?.scores.getScore() || 0;
  })();

  // Computed proxy values
  const results = fetchResults
    ? studentResults
    : currentAttempt
    ? currentAttempt.results
    : student?.results || [];

  const scores = fetchScores
    ? studentScores
    : student?.scores || {
        getScore: () => 0,
        findScore: () => null,
        push: () => {},
        replace: () => {},
      };

  const reviewerScores = student?.reviewer_scores || {
    getScore: () => 0,
    findScore: () => null,
  };

  // Effects
  useEffect(() => {
    if (student?.attempts) {
      student.attempts.each((attempt) => {
        if (attempt.status === "active") {
          setCurrentAttempt(attempt);
        }
      });
    }

    fetchTotal();

    // Watch currentAttempt changes
    const interval = setInterval(() => {
      // TODO: реализовать watch через useEffect с зависимостями
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [student]);

  // Methods
  const onSessionGroupSelected = (sessions: any, violation: any = null) => {
    console.log("Session group selected:", sessions, violation);
  };

  const handleAttemptSelected = (attempt: Attempt) => {
    setCurrentAttempt(attempt);
    if (onAttemptSelected && student) {
      onAttemptSelected(student, attempt);
    }
  };

  const onAttemptResultUpdated = (component: any, result: any) => {
    if (onAttemptUpdated && student) {
      onAttemptUpdated(student, component, result);
    }
  };

  const onViolationItemSelected = (violation: any) => {
    console.log("Violation selected:", violation);
  };

  const fetchTotal = async () => {
    if (!assignment) return;

    let fields = [
      "student_assessments",
      "attempts",
      "actions",
      "violations",
      "identities",
      "credibility",
      "results_chart",
      "is_started",
      "is_finished",
    ];

    if (!assignment.isExternalType()) {
      fields = fields.concat(["available_time", "progress", "quiz_components"]);
    }

    if (assignment.certificate_id) {
      fields = fields.concat("student_certificate");
    }

    if (fetchResults) {
      fields.push("results");
    }

    if (fetchScores) {
      fields.push("scores");
    }

    try {
      // Мокаем данные для демонстрации
      const mockData = {
        entity: {
          quiz_components: {
            length: 2,
            models: [
              { id: 1, component_type: "FreeQuestionComponent" },
              { id: 2, component_type: "PollComponent" },
            ],
          },
          student_assessments: [],
          student_certificate: { id: 1, certificate_id: 123 },
          actions: {
            replace: (data: any[]) => console.log("Replacing actions:", data),
            length: 0,
            models: [],
          },
          violations: {
            replace: (data: any[]) =>
              console.log("Replacing violations:", data),
            length: 0,
            models: [],
          },
          identities: {
            replace: (data: any[]) =>
              console.log("Replacing identities:", data),
            models: [
              {
                id: 1,
                screenshot:
                  "https://placehold.co/200x150/3b82f6/FFFFFF?text=Фото+1",
                getTime: () => "10:30:15",
              },
              {
                id: 2,
                screenshots: [
                  "https://placehold.co/200x150/ef4444/FFFFFF?text=Серия+1",
                  "https://placehold.co/200x150/10b981/FFFFFF?text=Серия+2",
                  "https://placehold.co/200x150/f59e0b/FFFFFF?text=Серия+3",
                ],
                getTime: () => "11:45:30",
              },
            ],
            length: 2,
          },
          progress: { total: 100 },
          results: [],
          results_chart: [
            { id: 1, result: 3, points: 10 },
            { id: 2, result: 2, points: 0 },
            { id: 3, result: 1, points: 5 },
          ],
          scores: {
            getScore: () => 85,
            findScore: () => ({ points: 85 }),
            push: () => {},
            replace: () => {},
          },
          available_time: 3600,
          credibility: 85,
          is_started: true,
          is_finished: false,
        },
      };

      const data = mockData.entity;

      setFetchedData(data);

      if (data.quiz_components) {
        setComponents(data.quiz_components);
      }

      if (data.student_assessments) {
        setAssessments(data.student_assessments);
      }

      if (data.student_certificate) {
        setCertificate(data.student_certificate);
      }

      if (data.actions) {
        setActions(data.actions);
      }

      if (data.violations) {
        setViolations(data.violations);
      }

      if (data.identities) {
        setIdentities(data.identities);
      }

      if (data.progress) {
        setProgressStudent(data.progress);
      }

      if (data.results) {
        setStudentResults(data.results);
      }

      if (data.results_chart) {
        setResultsChart(data.results_chart);
      }

      if (data.scores) {
        setStudentScores(data.scores);
      }

      if (data.available_time) {
        setAvailableTime(data.available_time);
      }

      if (data.credibility) {
        setCredibility(data.credibility);
      }

      if (data.is_started) {
        setIsStarted(data.is_started);
      }

      if (data.is_finished) {
        setIsFinished(data.is_finished);
      }
    } catch (error) {
      console.error("Error fetching total data:", error);
    }
  };

  const updateScore = async (value: number) => {
    if (disabled) return;
    console.log("Update score:", value);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleResultUpdated = (component: any, result: any) => {
    console.log("Result updated:", component, result);
  };

  // Render
  if (!assignment || !student) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет данных для отображения
      </div>
    );
  }

  return (
    <div className="student-result-component space-y-6">
      <OverlayLoaderComponent />

      {/* ATTEMPT LIST */}
      {student.attempts.length > 1 && (
        <div className="student-attempt-list flex gap-2 p-2 bg-gray-100 rounded">
          {student.attempts.models.map((attempt, index) => (
            <button
              key={`student-attempt-${attempt.id}`}
              className={`student-attempt-item px-3 py-2 rounded ${
                currentAttempt && currentAttempt.id === attempt.id
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-300"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleAttemptSelected(attempt);
              }}
            >
              №{index + 1}
            </button>
          ))}
        </div>
      )}

      {/* IDENTIFICATION LIST */}
      {(isManager ||
        !assignment.isHideUsersEnabled() ||
        assignment.isCompletedStatus()) && (
        <div className="result-data-item bg-white rounded-lg shadow p-4">
          <div className="result-data-header flex items-center mb-4">
            <div className="result-data-icon w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faCamera} className="text-blue-600" />
            </div>
            <div className="result-data-label">
              <div className="result-data-title font-semibold">
                Фото идентификации
              </div>
              <div className="result-data-hint text-sm text-gray-500">
                Подсказка по фото
              </div>
            </div>
          </div>
          <div className="result-data-content">
            {identities && identities.models && identities.models.length > 0 ? (
              <IdentificationList
                identities={{
                  models: identities.models,
                }}
              />
            ) : (
              <div className="empty-result-list text-gray-500 italic">
                Нет фото идентификации
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIOLATION LIST */}
      {(isManager ||
        !assignment.isHideUsersEnabled() ||
        assignment.isCompletedStatus()) && (
        <div className="result-data-item bg-white rounded-lg shadow p-4">
          <div className="result-data-header flex items-center mb-4">
            <div className="result-data-icon w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-yellow-600"
              />
            </div>
            <div className="result-data-label">
              <div className="result-data-title font-semibold">Нарушения</div>
              <div className="result-data-hint text-sm text-gray-500">
                Подсказка по нарушениям
              </div>
            </div>
          </div>
          <div className="result-data-content">
            {violations && violations.models && violations.models.length > 0 ? (
              <ViolationsComponent />
            ) : (
              <div className="empty-result-list text-gray-500 italic">
                Нет нарушений
              </div>
            )}
          </div>
        </div>
      )}

      {/* RECORD LIST */}
      {(isManager ||
        !assignment.isHideUsersEnabled() ||
        assignment.isCompletedStatus()) && (
        <div className="result-data-item bg-white rounded-lg shadow p-4">
          <div className="result-data-header flex items-center mb-4">
            <div className="result-data-icon w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faVideo} className="text-purple-600" />
            </div>
            <div className="result-data-label">
              <div className="result-data-title font-semibold">
                Видео записи
              </div>
              <div className="result-data-hint text-sm text-gray-500">
                Подсказка по записям
              </div>
            </div>
          </div>
          <div className="result-data-content">
            <VideoSessionList
              assignment={assignment}
              student={student}
              endpoint={webinarSessionsApiUrl}
              onSelected={onSessionGroupSelected}
            />
          </div>
        </div>
      )}

      {/* RESULT LIST */}
      {results.length > 0 && (isOwner || isReviewer) && (
        <div className="result-data-item bg-white rounded-lg shadow p-4">
          <div className="result-data-header flex items-center mb-4">
            <div className="result-data-icon w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faTasks} className="text-green-600" />
            </div>
            <div className="result-data-label">
              <div className="result-data-title font-semibold">Результаты</div>
              <div className="result-data-hint text-sm text-gray-500">
                Подсказка по результатам
              </div>
            </div>
          </div>
          <div className="result-data-content">
            {components.length <= 0 ? (
              <div className="empty-result-list text-gray-500 italic">
                Нет результатов
              </div>
            ) : (
              <div className="space-y-6">
                <QuizResultListComponent />

                {resultsChart && resultsChart.length > 0 && (
                  <div className="quiz-result-chart">
                    <ResultChartComponent
                      results={{
                        data: resultsChart,
                        length: resultsChart.length,
                        getPoints: () =>
                          resultsChart.reduce(
                            (sum: number, item: any) =>
                              sum + (item.points || 0),
                            0
                          ),
                        map: function (callback: (item: any) => void) {
                          this.data.forEach(callback);
                        },
                      }}
                      points={resultsChart.reduce(
                        (sum: number, item: any) => sum + (item.points || 0),
                        0
                      )}
                      showPoints={true}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTION LIST */}
      <div className="result-data-item bg-white rounded-lg shadow p-4">
        <div className="result-data-header flex items-center mb-4">
          <div className="result-data-icon w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-indigo-600"
            />
          </div>
          <div className="result-data-label">
            <div className="result-data-title font-semibold">
              Действия пользователя
            </div>
            <div className="result-data-hint text-sm text-gray-500">
              Подсказка по действиям
            </div>
          </div>
        </div>
        <div className="result-data-content">
          <AssignmentActionsComponent />
        </div>
      </div>

      {/* POINTS */}
      {isOwner &&
        assignment.isPointSystemEnabled() &&
        !assignment.isExternalType() && (
          <div className="result-data-item bg-white rounded-lg shadow p-4">
            <div className="result-data-header flex items-center mb-4">
              <div className="result-data-icon w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <FontAwesomeIcon
                  icon={faStarHalfAlt}
                  className="text-yellow-600"
                />
              </div>
              <div className="result-data-label">
                <div className="result-data-title font-semibold">Баллы</div>
                <div className="result-data-hint text-sm text-gray-500">
                  {disabled ? "Баллы отключены" : "Подсказка по баллам"}
                </div>
              </div>
            </div>
            <div className="result-data-content">
              <div className="total-points flex items-center">
                <span className="points text-2xl font-bold text-blue-600">
                  {student.getPoints(
                    assignment.pointSystemMethod(),
                    currentAttempt ? currentAttempt.id : null
                  )}
                </span>
                <span className="label text-gray-600 ml-2">баллов</span>
              </div>
            </div>
          </div>
        )}

      {/* SCORES */}
      {isOwner && !assignment.isPointSystemEnabled() && (
        <div className="result-data-item bg-white rounded-lg shadow p-4">
          <div className="result-data-header flex items-center mb-4">
            <div className="result-data-icon w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon
                icon={faStarHalfAlt}
                className="text-orange-600"
              />
            </div>
            <div className="result-data-label">
              <div className="result-data-title font-semibold">Оценка</div>
              <div className="result-data-hint text-sm text-gray-500">
                {disabled ? "Оценка отключена" : "Подсказка по оценке"}
              </div>
            </div>
          </div>
          <div className="result-data-content">
            <div className="score-list flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  className={`score-item w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    disabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : currentScore === score
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!disabled) updateScore(score);
                  }}
                  disabled={disabled}
                >
                  <div className="score-label">{score}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATE */}
      {!disabled && assignment.isCertificate() && (
        <div className="result-data-item bg-white rounded-lg shadow p-4">
          <div className="result-data-header flex items-center mb-4">
            <div className="result-data-icon w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faCertificate} className="text-pink-600" />
            </div>
            <div className="result-data-label">
              <div className="result-data-title font-semibold">Сертификат</div>
              <div className="result-data-hint text-sm text-gray-500">
                Подсказка по сертификату
              </div>
            </div>
          </div>
          <div className="result-data-content">
            <CertificateComponent />
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {!disabled && (
        <div className="result-data-item bg-white rounded-lg shadow p-4">
          <div className="result-data-header flex items-center mb-4">
            <div className="result-data-icon w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faCog} className="text-gray-600" />
            </div>
            <div className="result-data-label">
              <div className="result-data-title font-semibold">Настройки</div>
              <div className="result-data-hint text-sm text-gray-500">
                Подсказка по настройкам
              </div>
            </div>
          </div>
          <div className="result-data-content">
            <TimeStatesComponent
              assignment={assignment}
              student={student}
              available_time={available_time}
              is_started={is_started || false}
              is_finished={is_finished || false}
              onChanged={() => fetchTotal()}
            />
          </div>
        </div>
      )}

      {/* MODALS */}
      <AttemptViewerModalComponent
        viewer={viewer}
        assignment={assignment}
        student={student}
        disabled={disabled}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        onResultUpdated={handleResultUpdated}
      />
      {/* 
      <AssignmentVideoViewerModalComponent
        ref={videoModalRef}
        assignment={assignment}
        student={student}
      />

      <CreateViolationModal assignment={assignment} student={student} />

      <ConfirmModalComponent ref={confirmModalRef} /> */}
    </div>
  );
};

// Mock данные для примера использования:
const mockProps = {
  viewer: "owner" as const,
  assignment: mockAssignment,
  student: mockStudent,
  disabled: false,
  onAttemptSelected: (student: StudentModel, attempt: Attempt) => {
    console.log("Attempt selected:", student.id, attempt.id);
  },
  onAttemptUpdated: (student: StudentModel, component: any, result: any) => {
    console.log("Attempt updated:", student.id, component, result);
  },
};

export default ResultViewerComponent;
export { mockProps, mockAssignment, mockStudent };
