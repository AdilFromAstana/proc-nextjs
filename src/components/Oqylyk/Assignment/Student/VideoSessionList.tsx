import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  Monitor,
  Smartphone,
  Video,
  VideoOff,
  MonitorPlay,
} from "lucide-react";

interface Assignment {
  id: number;
}

interface Student {
  id: number;
}

interface WebinarSession {
  id: number;
  type: string;
  status: string;
  state: string;
  session_type: string;
  record: {
    thumb_url: string;
    video_duration: number;
  } | null;
  created_at: string;
  isMainCamera: () => boolean;
  isScreen: () => boolean;
  isSecondCamera: () => boolean;
  isRecordingType: () => boolean;
  isStreamingType: () => boolean;
  isStartedStatus: () => boolean;
  isFinishedStatus: () => boolean;
  getThumbImage: () => string;
}

interface WebinarSessionGroup {
  models: WebinarSession[];
  first: () => WebinarSession;
  getFirstConvertedSession: () => WebinarSession;
  isVideoExists: () => boolean;
  getTotalDuration: () => number;
  getTotalDurationTermType: () => string;
}

interface WebinarSessionList {
  fetch: (params: any) => Promise<any>;
  groupByTypes: (types: string[]) => WebinarSessionGroup[];
  length: number;
}

interface VideoSessionListComponentProps {
  assignment: Assignment;
  student: Student;
  endpoint?: string;
  onSelected?: (group: WebinarSessionGroup) => void;
}

const VideoSessionListComponent: React.FC<VideoSessionListComponentProps> = ({
  assignment,
  student,
  endpoint = "/api/webinar-sessions",
  onSelected,
}) => {
  const [sessions, setSessions] = useState<WebinarSessionList>(
    {} as WebinarSessionList
  );
  const [groups, setGroups] = useState<WebinarSessionGroup[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock WebinarSessionList для демонстрации
  const mockSessions: WebinarSessionList = {
    length: 3,
    fetch: async (params: any) => {
      // Имитация API вызова
      setLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          setLoading(false);
          resolve({});
        }, 1000);
      });
    },
    groupByTypes: (types: string[]) => {
      // Mock группы сессий
      return [
        {
          models: [
            {
              id: 1,
              type: "main-camera",
              status: "converted",
              state: "active",
              session_type: "recording",
              record: {
                thumb_url: "https://example.com/thumb1.jpg",
                video_duration: 120,
              },
              created_at: "2023-01-01T10:00:00Z",
              isMainCamera: () => true,
              isScreen: () => false,
              isSecondCamera: () => false,
              isRecordingType: () => true,
              isStreamingType: () => false,
              isStartedStatus: () => false,
              isFinishedStatus: () => true,
              getThumbImage: () => "https://example.com/thumb1.jpg",
            },
          ],
          first: function () {
            return this.models[0];
          },
          getFirstConvertedSession: function () {
            return this.models[0];
          },
          isVideoExists: () => true,
          getTotalDuration: () => 120,
          getTotalDurationTermType: () => "minutes",
        },
      ];
    },
  };

  const fetchSessions = async () => {
    try {
      await mockSessions.fetch({
        url: endpoint,
        headers: {
          "X-Requested-Fields": [
            "id",
            "webinar_id",
            "user_id",
            "type",
            "status",
            "state",
            "session_type",
            "record",
            "created_at",
          ].join(","),
        },
        params: {
          assignment_id: assignment.id,
          student_id: student.id,
          limit: 99,
        },
      });

      const groupedSessions = mockSessions.groupByTypes([
        "main-camera",
        "second-camera",
        "screen",
      ]);
      setGroups(groupedSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [assignment.id, student.id, endpoint]);

  const onGroupSelected = (group: WebinarSessionGroup) => {
    if (onSelected) {
      onSelected(group);
    }
  };

  const getIconForSession = (session: WebinarSession) => {
    if (session.isMainCamera())
      return <Camera className="w-8 h-8 text-white" />;
    if (session.isScreen()) return <Monitor className="w-8 h-8 text-white" />;
    if (session.isSecondCamera())
      return <Smartphone className="w-8 h-8 text-white" />;
    return <Video className="w-8 h-8 text-white" />;
  };

  const getDurationText = (
    group: WebinarSessionGroup,
    session: WebinarSession
  ) => {
    if (session.isRecordingType() && !session.isFinishedStatus()) {
      return "Запись вебинара";
    } else if (session.isStreamingType()) {
      return `${group.getTotalDuration()} ${group.getTotalDurationTermType()}-мин`;
    } else if (session.isStartedStatus()) {
      return "Запись вебинара";
    } else if (session.isFinishedStatus()) {
      return "Вебинар завершен";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-muted-foreground">Нет записей вебинара</p>
      </Card>
    );
  }

  return (
    <div className="max-h-[250px] overflow-auto">
      <div className="flex flex-wrap gap-4 justify-center">
        {groups.map((group, index) => {
          const session = group.isVideoExists()
            ? group.getFirstConvertedSession()
            : group.first();

          return (
            <Card
              key={`session-collection-${index}`}
              className={`w-32 cursor-pointer hover:shadow-md transition-shadow ${
                group.isVideoExists() ? "" : "opacity-70"
              }`}
              onClick={() => group.isVideoExists() && onGroupSelected(group)}
            >
              <CardContent className="p-3">
                <div className="relative w-full h-24 rounded-md overflow-hidden mb-2">
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    {getIconForSession(session)}
                  </div>
                  {session.record?.thumb_url && (
                    <img
                      src={session.record.thumb_url}
                      alt="Session thumbnail"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  {getDurationText(group, session)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VideoSessionListComponent;
