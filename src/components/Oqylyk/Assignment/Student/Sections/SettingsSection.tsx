// components/SettingsSection.tsx
import React from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import TimeStatesComponent from "../TimeStatesComponent";
import SectionWrapper from "../../UI/SectionWrapper";

interface SettingsSectionProps {
  assignment: any;
  student: any;
  available_time: any;
  is_started?: boolean;
  is_finished?: boolean;
  onSettingsChange: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  assignment,
  student,
  available_time,
  is_started,
  is_finished,
  onSettingsChange,
}) => {
  return (
    <SectionWrapper
      icon={faCog}
      title="Настройки"
      hint="Подсказка по настройкам"
    >
      <TimeStatesComponent
        assignment={assignment}
        student={student}
        available_time={available_time}
        is_started={is_started || false}
        is_finished={is_finished || false}
        onChanged={onSettingsChange}
      />
    </SectionWrapper>
  );
};

export default SettingsSection;
