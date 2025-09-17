// components/IdentitySection.tsx
import React from "react";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import IdentificationList from "../IdentificationList";
import SectionWrapper from "../../UI/SectionWrapper";

interface IdentitySectionProps {
  assignment: any;
  isManager: boolean;
  identities: any;
}

const IdentitySection: React.FC<IdentitySectionProps> = ({
  assignment,
  isManager,
  identities,
}) => {
  const shouldShow = isManager;
  // isManager ||
  // !assignment.isHideUsersEnabled?.() ||
  // assignment.isCompletedStatus?.();

  return (
    <SectionWrapper
      icon={faCamera}
      title="Идентификации"
      hint="Подсказка по фото"
      showSection={shouldShow}
    >
      {identities ? (
        <IdentificationList identities={identities} />
      ) : (
        <div className="empty-result-list text-gray-500 italic">
          Нет фото идентификации
        </div>
      )}
    </SectionWrapper>
  );
};

export default IdentitySection;
