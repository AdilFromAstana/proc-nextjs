// VideoModalViewerComponentWithMock.tsx
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AssignmentViolationsComponent from "./ViolationsComponent";

// Mock VideoPlayerComponent
const VideoPlayerComponent = ({
  source,
  onReady,
  onEnded,
}: {
  source: string | null;
  onReady?: () => void;
  onEnded?: () => void;
}) => {
  useEffect(() => {
    // Имитируем готовность плеера
    if (onReady) {
      setTimeout(onReady, 500);
    }
  }, [onReady]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-2xl mb-4">Видеоплеер</div>
        <div className="text-sm opacity-75">
          Источник: {source || "Нет видео"}
        </div>
        <button
          onClick={onEnded}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Имитировать конец видео
        </button>
      </div>
    </div>
  );
};

// Интерфейсы для типов данных
interface WebinarSession {
  id: number;
  record: {
    video_url: string;
    thumb_url: string;
    video_duration: number;
  } | null;
  created_at: string;
  isConvertedState: () => boolean;
  isRecordingType: () => boolean;
  isStreamingType: () => boolean;
  getThumbImage: () => string;
  getVideoUrl: () => string;
  getVideoMediaSource: () => any;
  getDuration: (formatted: boolean) => number | string;
  isFinishedStatus: () => boolean;
  isStartedStatus: () => boolean;
  getDurationTermType: () => string;
}

interface SessionList {
  models: WebinarSession[];
  length: number;
  getFirstConvertedSession: () => WebinarSession;
  find: (
    predicate: (item: WebinarSession) => boolean
  ) => WebinarSession | undefined;
  filterByState: (state: string) => { models: WebinarSession[] };
  indexOf: (session: WebinarSession) => number;
}

interface Violation {
  id: number;
  webinar_session_id: number;
  created_at: string;
  action_type: string;
  screenshot: string;
  is_warning: boolean;
}

interface Assignment {
  id: number;
}

interface Student {
  id: number;
}

interface VideoModalViewerComponentProps {
  violationsApiUrl?: string;
  assignment?: Assignment;
  student?: Student;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoModalViewerComponent: React.FC<VideoModalViewerComponentProps> = ({
  violationsApiUrl = null,
  assignment = null,
  student = null,
  isOpen,
  onOpenChange,
}) => {
  // Refs
  const videoPlayerRef = useRef({
    setTimePosition: (seconds: number) => {
      console.log(`Установка позиции видео: ${seconds} секунд`);
    },
  });

  // State
  const [session, setSession] = useState<WebinarSession | null>(null);
  const [sessions, setSessions] = useState<SessionList | null>(null);
  const [currentSession, setCurrentSession] = useState<WebinarSession | null>(
    null
  );
  const [playerReadyState, setPlayerReadyState] = useState(false);
  const [violation, setViolation] = useState<Violation | null>(null);
  const [violations, setViolations] = useState<any[]>([]);

  // Константы
  const TIME_PADDING = 4;

  // Computed values
  const sessionIds = sessions?.models.map((session) => session.id) || [];

  const currentVideoSource = currentSession?.getVideoUrl() || null;
  const currentVideoMediaSource =
    currentSession && currentSession.isRecordingType()
      ? currentSession.getVideoMediaSource()
      : null;
  const currentVideoCover = currentSession?.getThumbImage() || null;

  const currentVideoDuration =
    (currentSession?.getDuration(false) as number) || null;

  const violationsApiParams = {
    student_id: student?.id,
    webinar_session_id: sessionIds,
    is_warning: true,
  };

  const violationTimestamp = session
    ? (() => {
        const sessionTime = new Date(session.created_at);
        const violationTime = new Date(violation?.created_at || "");
        const padding = (session as any).is_should_analyze ? 0 : TIME_PADDING;
        return (
          (violationTime.getTime() - sessionTime.getTime()) / 1000 - padding
        );
      })()
    : null;

  // Watch effect для violation
  useEffect(() => {
    if (violation && playerReadyState && videoPlayerRef.current) {
      videoPlayerRef.current.setTimePosition(violationTimestamp || 0);
    }
  }, [violation, playerReadyState, violationTimestamp]);

  // Methods
  const open = (
    sessionsData: SessionList,
    violationData: Violation | null = null
  ) => {
    return new Promise<void>((resolve) => {
      setPlayerReadyState(false);
      setViolations([]);
      setViolation(null);
      setSessions(sessionsData);

      if (sessionsData && sessionsData.length > 0) {
        setCurrentSession(sessionsData.getFirstConvertedSession());
      }

      if (violationData) {
        onViolationItemSelected(violationData);
      }

      fetchViolations();
      onOpenChange(true);

      setTimeout(() => {
        resolve();
      }, 0);
    });
  };

  const close = () => {
    return new Promise<void>((resolve) => {
      onOpenChange(false);
      setSessions(null);
      setViolation(null);
      resolve();
    });
  };

  const fetchViolations = () => {
    console.log("Fetching violations...");
  };

  const selectSession = (session: WebinarSession) => {
    if (
      (!session.isConvertedState() && session.isStreamingType()) ||
      (!session.record && session.isRecordingType())
    ) {
      return;
    }

    setViolation(null);

    if (videoPlayerRef.current) {
      videoPlayerRef.current.setTimePosition(0);
    }

    setCurrentSession(null);

    setTimeout(() => {
      setCurrentSession(session);
    }, 0);
  };

  const onViolationItemSelected = (violationData: Violation) => {
    setViolation(violationData);

    if (violationData && violationData.webinar_session_id && sessions) {
      const session = sessions.find(
        (item) => item.id === violationData.webinar_session_id
      );

      if (session) {
        setCurrentSession(session);
        if (playerReadyState && videoPlayerRef.current) {
          videoPlayerRef.current.setTimePosition(violationTimestamp || 0);
        }
      }
    }
  };

  const onVideoEnded = () => {
    if (!currentSession || !sessions || sessions.length <= 1) {
      return;
    }

    const converted = sessions.filterByState("converted");
    const index = converted.models.indexOf(currentSession);

    if (index + 1 > converted.models.length - 1) {
      return;
    }

    setViolation(null);

    if (videoPlayerRef.current) {
      videoPlayerRef.current.setTimePosition(0);
    }

    setCurrentSession(converted.models[index + 1]);
  };

  const onVideoPlayerReady = () => {
    setPlayerReadyState(true);

    if (violation && videoPlayerRef.current) {
      videoPlayerRef.current.setTimePosition(violationTimestamp || 0);
    }
  };

  // Mock данные для примера
  const createMockSession = (
    id: number,
    type: "main-camera" | "screen" | "second-camera" = "main-camera"
  ): WebinarSession => ({
    id,
    record: {
      video_url: `https://example.com/video-${id}.mp4`,
      thumb_url: `https://placehold.co/120x90/333333/FFFFFF?text=Video+${id}`,
      video_duration: 1800,
    },
    created_at: new Date(Date.now() - id * 3600000).toISOString(),
    isConvertedState: () => true,
    isRecordingType: () => true,
    isStreamingType: () => false,
    getThumbImage: () =>
      `https://placehold.co/120x90/333333/FFFFFF?text=Video+${id}`,
    getVideoUrl: () => `https://example.com/video-${id}.mp4`,
    getVideoMediaSource: () => ({}),
    getDuration: (formatted: boolean) => (formatted ? "30:00" : 1800),
    isFinishedStatus: () => true,
    isStartedStatus: () => false,
    getDurationTermType: () => "minutes",
  });

  const mockSessions: SessionList = {
    models: [
      createMockSession(1, "main-camera"),
      createMockSession(2, "screen"),
      createMockSession(3, "second-camera"),
    ],
    length: 3,
    getFirstConvertedSession: function () {
      return this.models[0];
    },
    find: function (predicate) {
      return this.models.find(predicate);
    },
    filterByState: function (state) {
      return { models: this.models.filter(() => state === "converted") };
    },
    indexOf: function (session) {
      return this.models.indexOf(session);
    },
  };

  const mockViolation: Violation = {
    id: 1,
    webinar_session_id: 1,
    created_at: new Date().toISOString(),
    action_type: "camera_off",
    screenshot: "https://placehold.co/200x150/FF0000/FFFFFF?text=Violation",
    is_warning: true,
  };

  const mockAssignment: Assignment = { id: 123 };
  const mockStudent: Student = { id: 456 };

  // Компонент для тестирования с управлением через state
  const TestVideoModalViewer = () => {
    const [open, setOpen] = useState(false);
    const [viewerInstance, setViewerInstance] = useState<any>(null);

    // Создаем инстанс компонента с методами open/close
    useEffect(() => {
      const instance = {
        open: (
          sessionsData: SessionList = mockSessions,
          violationData: Violation | null = null
        ) => {
          setViewerInstance({ sessionsData, violationData });
          setOpen(true);
        },
        close: () => {
          setOpen(false);
          setViewerInstance(null);
        },
      };
      setViewerInstance(instance);
    }, []);

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Тест VideoModalViewerComponent
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => viewerInstance?.open?.(mockSessions, mockViolation)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Открыть видео модальное окно с нарушением
          </button>

          <button
            onClick={() => viewerInstance?.open?.(mockSessions)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Открыть видео модальное окно без нарушения
          </button>

          <div className="text-sm text-gray-600">
            <p>
              <strong>Что тестируем:</strong>
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Открытие модального окна с видео</li>
              <li>Переключение между сессиями</li>
              <li>Имитация воспроизведения видео</li>
              <li>Обработка нарушений</li>
              <li>Переключение между видео при завершении</li>
            </ul>
          </div>
        </div>

        <VideoModalViewerComponent
          isOpen={open}
          onOpenChange={setOpen}
          assignment={mockAssignment}
          student={mockStudent}
          violationsApiUrl="/api/violations"
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="video-modal-viewer max-w-[80%] h-[600px] p-0 overflow-hidden"
        style={{ maxWidth: "80%", height: "600px" }}
      >
        <div className="video-viewer-wrap w-full h-full flex flex-row justify-start items-stretch">
          {/* LEFTSIDE */}
          <div className="video-viewer-leftside flex-[0_0_70%] max-w-[70%] h-full flex flex-col justify-stretch items-stretch">
            {/* VIDEO PLAYER */}
            <div className="video-player-wrap flex-1">
              {currentSession && (
                <VideoPlayerComponent
                  source={currentVideoSource}
                  onReady={onVideoPlayerReady}
                  onEnded={onVideoEnded}
                />
              )}
            </div>

            {/* SESSION LIST */}
            {sessions && sessions.length > 1 && (
              <div className="video-record-list p-5 bg-gray-900 text-left whitespace-nowrap overflow-auto">
                {sessions.models.map((session, index) => {
                  if (
                    session.isConvertedState() ||
                    (session.isRecordingType() && session.record)
                  ) {
                    return (
                      <div
                        key={`session-item-${index}`}
                        className={`video-record-item inline-block relative overflow-hidden rounded cursor-pointer w-30 h-22.5 bg-cover bg-no-repeat shadow-md ml-5 ${
                          currentSession && currentSession.id === session.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        style={{
                          backgroundImage: `url(${session.getThumbImage()})`,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          selectSession(session);
                        }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                          <div className="video-record-icon text-gray-300 text-xl font-bold block text-center">
                            <i className="fas fa-play"></i>
                          </div>
                          <div className="video-record-duration text-gray-300 font-normal text-xs mt-4">
                            {session.isRecordingType() &&
                            !session.isFinishedStatus() ? (
                              <span>Запись вебинара</span>
                            ) : session.isFinishedStatus() ? (
                              <>
                                <span>{session.getDuration(true)}</span>
                                <span>
                                  {" "}
                                  {session.getDurationTermType()}-мин
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>

          {/* RIGHTSIDE */}
          <div className="video-viewer-rightside flex-[0_0_30%] max-w-[30%] h-full bg-gray-100 relative overflow-auto">
            {violations.length > 0 ? (
              <AssignmentViolationsComponent
                className="assignment-violation-list"
                apiUrl={violationsApiUrl || undefined}
                assignment={assignment}
                student={student}
                params={violationsApiParams}
                durationAtTime={session ? session.created_at : undefined}
                fetching={false}
                refreshing={false}
                onViolationSelected={onViolationItemSelected}
              />
            ) : (
              <div className="empty-violation-list text-gray-400 text-lg font-semibold text-center absolute top-1/2 left-0 transform -translate-y-1/2 w-full">
                Нет нарушений
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModalViewerComponent;
