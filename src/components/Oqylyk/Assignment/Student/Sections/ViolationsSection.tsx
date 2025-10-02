// components/ViolationsSection.tsx
import React from "react";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import ViolationsComponent from "../ViolationsComponent";
import SectionWrapper from "../../UI/SectionWrapper";
import { useTranslations } from "next-intl";

interface ViolationsSectionProps {
  assignment: any;
  isManager: boolean;
  violations: any;
  onViolationSelected: (violation: any) => void;
}

const ViolationsSection: React.FC<ViolationsSectionProps> = ({
  assignment,
  isManager,
  violations,
  onViolationSelected,
}) => {
  const t = useTranslations();

  const shouldShow = isManager;
  // isManager ||
  // !assignment.isHideUsersEnabled?.() ||
  // assignment.isCompletedStatus?.();

  return (
    <SectionWrapper
      icon={faExclamationTriangle}
      title={t("label-assignment-violations")}
      hint={t("hint-assignment-violations")}
      showSection={shouldShow}
    >
      {violations && violations.length > 0 ? (
        <ViolationsComponent assignmentId={assignment.id} />
      ) : (
        <div className="empty--WSectionWrapperlist text-gray-500 italic">
          Нет нарушений
        </div>
      )}
    </SectionWrapper>
  );
};

export default ViolationsSection;
