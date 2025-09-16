// components/Assignment/VideoSessionListComponent.tsx

import React, { useState, useEffect } from "react";
import { Camera, Monitor, Smartphone } from "lucide-react";
import { useWebinarSessions } from "@/hooks/useWebinarSessions";
import { Student } from "@/types/students";
import {
  WebinarSession,
  WebinarSessionGroup,
} from "@/types/assignment/webinar";

interface Assignment {
  id: number;
}

interface VideoSessionListComponentProps {
  assignment: Assignment;
  student: Student;
  endpoint?: string;
  onSelected?: (group: WebinarSessionGroup) => void;
}

// Вспомогательные функции для работы с сессиями
const createWebinarSessionGroup = (
  sessions: WebinarSession[]
): WebinarSessionGroup => {
  return {
    models: sessions,
    first: function () {
      return this.models[0];
    },
    getFirstConvertedSession: function () {
      return (
        this.models.find((session) => session.state === "converted") ||
        this.models[0]
      );
    },
    isVideoExists: function () {
      return this.models.some(
        (session) => session.state === "converted" && session.record
      );
    },
    getTotalDuration: function () {
      const session = this.getFirstConvertedSession();
      return session.record?.video_duration || 0;
    },
    getTotalDurationTermType: function () {
      return "мин";
    },
  };
};

const groupSessionsByTypes = (
  sessions: WebinarSession[]
): WebinarSessionGroup[] => {
  // Группируем по session_type: main-camera, second-camera
  const grouped: Record<string, WebinarSession[]> = {};

  sessions.forEach((session) => {
    const type = session.session_type;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(session);
  });

  // Преобразуем в группы и сортируем по дате создания
  return Object.values(grouped).map((sessions) => {
    const sortedSessions = sessions.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return createWebinarSessionGroup(sortedSessions);
  });
};

const VideoSessionListComponent: React.FC<VideoSessionListComponentProps> = ({
  assignment,
  student,
  onSelected,
}) => {
  const {
    data: sessionsData,
    isLoading,
    isError,
  } = useWebinarSessions(assignment.id, student.id);

  const [groups, setGroups] = useState<WebinarSessionGroup[] | null>(null);

  // Группируем сессии при получении данных
  useEffect(() => {
    if (sessionsData) {
      const groupedSessions = groupSessionsByTypes(sessionsData.entities.data);
      setGroups(groupedSessions);
    }
  }, [sessionsData]);

  const onGroupSelected = (group: WebinarSessionGroup) => {
    if (onSelected && group.isVideoExists()) {
      onSelected(group);
    }
  };

  const getIconForSession = (session: WebinarSession) => {
    if (session.session_type === "main-camera")
      return (
        <Camera className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />
      );
    if (session.session_type === "screen")
      return (
        <Monitor className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />
      );
    if (session.session_type === "second-camera")
      return (
        <Smartphone className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />
      );
    return (
      <Camera className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />
    );
  };

  const getDurationText = (group: WebinarSessionGroup) => {
    const session = group.getFirstConvertedSession();

    if (session.session_type === "recording" && session.status !== "finished") {
      return "Запись вебинара";
    } else if (session.session_type === "streaming") {
      return `${group.getTotalDuration()} ${group.getTotalDurationTermType()}`;
    } else if (session.status === "started") {
      return "Запись вебинара";
    } else if (session.status === "finished") {
      return "Вебинар завершен";
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
        <span>Загрузка записей...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded">
        Ошибка загрузки записей
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="empty-session-list text-gray-500 text-base text-center">
        Нет записей вебинара
      </div>
    );
  }

  return (
    <div className="video-session-list max-h-[250px] ml-[-20px] mr-[-20px] mb-[-15px] text-center whitespace-nowrap overflow-auto">
      {groups.map((group, index) => {
        const session = group.isVideoExists()
          ? group.getFirstConvertedSession()
          : group.first();

        return (
          <div
            key={`session-collection-${index}`}
            className="video-session-item w-[120px] h-auto inline-block align-top ml-[10px] mr-[10px] mb-[15px]"
          >
            {group.isVideoExists() ? (
              <div
                className={`video-record-item ${
                  group.isVideoExists() ? "cursor-pointer" : ""
                }`}
                onClick={() => group.isVideoExists() && onGroupSelected(group)}
              >
                <div className="video-record-thumb w-full h-[90px] rounded-[3px] block overflow-hidden relative">
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  {getIconForSession(session)}
                  {session.record?.thumb_url && (
                    <img
                      src={session.record.thumb_url}
                      className="w-full h-full rounded-[inherit] border-none block object-cover"
                      alt="Session thumbnail"
                    />
                  )}
                </div>
                <div className="video-record-duration text-gray-500 font-normal text-xs mt-2 text-center">
                  {session.session_type === "streaming" ? (
                    <>
                      <span>{group.getTotalDuration()}</span>
                      <span> {group.getTotalDurationTermType()}</span>
                    </>
                  ) : (
                    <span>
                      {session.status === "started"
                        ? "Запись вебинара"
                        : session.status === "finished"
                        ? "Вебинар завершен"
                        : "Запись вебинара"}
                    </span>
                  )}
                </div>
              </div>
            ) : group.models.length > 0 ? (
              <div className="video-record-item">
                <div className="video-record-thumb w-full h-[90px] rounded-[3px] block overflow-hidden relative">
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  {getIconForSession(group.first())}
                </div>
                <div className="video-record-duration text-gray-500 font-normal text-xs mt-2 text-center">
                  <span>
                    {group.first().status === "started"
                      ? "Запись вебинара"
                      : group.first().status === "finished"
                      ? "Вебинар завершен"
                      : "Запись вебинара"}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <style jsx>{`
        .video-session-list {
          max-height: 250px;
          margin-left: -20px;
          margin-right: -20px;
          margin-bottom: -15px;
          text-align: center;
          white-space: nowrap;
          overflow: auto;
        }

        .video-session-item {
          width: 120px;
          height: auto;
          display: inline-block;
          vertical-align: top;
          margin-left: 10px;
          margin-right: 10px;
          margin-bottom: 15px;
        }

        .video-record-item {
          cursor: pointer;
        }

        .video-record-thumb {
          width: 100%;
          height: 90px;
          border-radius: 3px;
          display: block;
          overflow: hidden;
          position: relative;
        }

        .video-record-thumb:before {
          content: "";
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          position: absolute;
          top: 0;
          left: 0;
        }

        .video-record-thumb img {
          width: 100%;
          height: 100%;
          border-radius: inherit;
          border: none;
          display: block;
          object-fit: cover;
        }

        .video-record-duration {
          color: #999;
          font-weight: 400;
          font-size: 0.75rem;
          margin-top: 8px;
          text-align: center;
        }

        .video-record-duration span:first-child {
          margin-right: 2px;
        }

        .empty-session-list {
          color: #999;
          font-size: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default VideoSessionListComponent;
