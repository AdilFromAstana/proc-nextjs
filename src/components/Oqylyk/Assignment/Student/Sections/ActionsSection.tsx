// components/ActionsSection.tsx
import React from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import AssignmentActionsComponent from "../ActionsComponent";
import SectionWrapper from "../../UI/SectionWrapper";

interface ActionsSectionProps {
  assignment: any;
  currentAttempt: any;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  assignment,
  currentAttempt,
}) => {
  return (
    <SectionWrapper
      icon={faClipboardList}
      iconColor="indigo"
      title="Лог"
      hint="Список действий пользователя"
    >
      <AssignmentActionsComponent
        assignmentId={assignment.id}
        attemptId={currentAttempt?.id}
      />
    </SectionWrapper>
  );
};

export default ActionsSection;
