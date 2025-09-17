// components/ViolationsSection.tsx
import React from "react";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import ViolationsComponent from "../ViolationsComponent";
import SectionWrapper from "../../UI/SectionWrapper";

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
  const shouldShow = isManager;
  // isManager ||
  // !assignment.isHideUsersEnabled?.() ||
  // assignment.isCompletedStatus?.();

  return (
    <SectionWrapper
      icon={faExclamationTriangle}
      title="Нарушения"
      hint="Подсказка по нарушениям"
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
