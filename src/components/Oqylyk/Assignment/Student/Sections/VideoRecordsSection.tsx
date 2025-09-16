// components/ViolationsSection.tsx
import React from "react";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import SectionWrapper from "../../UI/SectionWrapper";
import VideoSessionListComponent from "../VideoSessionList";

interface VideoRecordsSectionProps {
  assignment: any;
  isManager: boolean;
  onViolationSelected: (violation: any) => void;
  student: any;
}

const VideoRecordsSection: React.FC<VideoRecordsSectionProps> = ({
  assignment,
  isManager,
  onViolationSelected,
  student,
}) => {
  const shouldShow = isManager;
  // isManager ||
  // !assignment.isHideUsersEnabled?.() ||
  // assignment.isCompletedStatus?.();

  return (
    <SectionWrapper
      icon={faExclamationTriangle}
      title="Видео"
      hint="Видеозапись прохождения задания"
      showSection={shouldShow}
    >
      <VideoSessionListComponent assignment={assignment} student={student} />
    </SectionWrapper>
  );
};

export default VideoRecordsSection;
