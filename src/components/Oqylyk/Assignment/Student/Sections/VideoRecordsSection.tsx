// components/VideoRecordsSection.tsx
import React from "react";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import VideoSessionList from "../VideoSessionList";
import SectionWrapper from "../../UI/SectionWrapper";

interface VideoRecordsSectionProps {
  assignment: any;
  student: any;
  isManager: boolean;
  webinarSessionsApiUrl: string;
  onSessionSelected: (sessions: any, violation: any) => void;
}

const VideoRecordsSection: React.FC<VideoRecordsSectionProps> = ({
  assignment,
  student,
  isManager,
  webinarSessionsApiUrl,
  onSessionSelected,
}) => {
  const shouldShow =
    isManager ||
    !assignment.isHideUsersEnabled?.() ||
    assignment.isCompletedStatus?.();

  return (
    <SectionWrapper
      icon={faVideo}
      iconColor="purple"
      title="Видео записи"
      hint="Подсказка по записям"
      showSection={shouldShow}
    >
      <VideoSessionList
        assignment={assignment}
        student={student}
        endpoint={webinarSessionsApiUrl}
        onSelected={onSessionSelected}
      />
    </SectionWrapper>
  );
};

export default VideoRecordsSection;
