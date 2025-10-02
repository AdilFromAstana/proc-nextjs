// components/ViolationsSection.tsx
import React from "react";
import {
  faExclamationTriangle,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import SectionWrapper from "../../UI/SectionWrapper";
import VideoSessionListComponent from "../VideoSessionList";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const shouldShow = isManager;
  // isManager ||
  // !assignment.isHideUsersEnabled?.() ||
  // assignment.isCompletedStatus?.();

  return (
    <SectionWrapper
      icon={faVideoCamera}
      title={t("label-assignment-records")}
      hint={t("hint-assignment-records")}
      showSection={shouldShow}
    >
      <VideoSessionListComponent assignment={assignment} student={student} />
    </SectionWrapper>
  );
};

export default VideoRecordsSection;
