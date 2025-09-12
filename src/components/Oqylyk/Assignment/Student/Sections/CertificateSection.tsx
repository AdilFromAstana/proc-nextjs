// components/CertificateSection.tsx
import React from "react";
import { faCertificate } from "@fortawesome/free-solid-svg-icons";
import CertificateComponent from "../CertificateComponent";
import SectionWrapper from "../../UI/SectionWrapper";

interface CertificateSectionProps {
  assignment: any;
  student: any;
  certificate: any;
  disabled: boolean;
  isFinished: boolean | null;
  onCertificateChange: () => void;
}

const CertificateSection: React.FC<CertificateSectionProps> = ({
  assignment,
  student,
  certificate,
  disabled,
  isFinished,
  onCertificateChange,
}) => {
  if (disabled) return null;

  return (
    <SectionWrapper
      icon={faCertificate}
      iconColor="pink"
      title="Сертификат"
      hint="Подсказка по сертификату"
    >
      <CertificateComponent />
    </SectionWrapper>
  );
};

export default CertificateSection;
