// components/ActionsSection.tsx
import React from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import AssignmentActionsComponent from "../ActionsComponent";
import SectionWrapper from "../../UI/SectionWrapper";

interface ActionsSectionProps {
  assignment: any;
  student: any;
  currentAttempt: any;
  actions: any;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  assignment,
  student,
  currentAttempt,
  actions,
}) => {
  return (
    <SectionWrapper
      icon={faClipboardList}
      iconColor="indigo"
      title="Лог"
      hint="Список действий пользователя"
    >
      <AssignmentActionsComponent />
    </SectionWrapper>
  );
};

export default ActionsSection;
