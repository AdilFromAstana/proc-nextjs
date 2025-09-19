// components/SectionWrapper.tsx
import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SectionWrapperProps {
  icon: IconDefinition;
  title: string;
  hint: string;
  children: React.ReactNode;
  className?: string;
  showSection?: boolean;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  icon,
  title,
  hint,
  children,
  className = "",
  showSection = true,
}) => {
  if (!showSection) return null;

  return (
    <div
      className={`result-data-item bg-white rounded-lg shadow ${className} border-t-1 border-[#ddd] rounded-none m-0`}
    >
      <div className="result-data-header flex items-center p-4">
        <div
          className={`result-data-icon w-8 h-8 rounded-full  flex items-center justify-center mr-3`}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="result-data-label">
          <div className="result-data-title font-semibold">{title}</div>
          <div className="result-data-hint text-sm text-gray-500">{hint}</div>
        </div>
      </div>
      <div className="result-data-content flex justify-center w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] shadow-[0_0_5px_0_rgba(0,0,0,0.7)] z-10"></div>
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;
