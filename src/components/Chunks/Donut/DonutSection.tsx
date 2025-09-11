import React from "react";

interface Section {
  label?: string;
  degree: number;
  color?: string;
  value: number;
  [key: string]: any;
}

interface DonutSection {
  label?: string;
  fillerStyles: React.CSSProperties;
  sectionStyles: React.CSSProperties;
}

interface DonutSectionsProps {
  startAngle?: number;
  sections: Section[];
  onSectionClick?: (section: Section) => void;
}

const defaultColor = "#dodgerblue";

const DonutSections: React.FC<DonutSectionsProps> = ({
  startAngle = 0,
  sections = [],
  onSectionClick,
}) => {
  // Container styles
  const containerStyles: React.CSSProperties = {
    transform: `rotate(${startAngle}deg)`,
    position: "absolute",
    height: "100%",
    width: "100%",
    borderRadius: "50%",
  };

  // Compute dSections - ПРОСТАЯ И РАБОЧАЯ ЛОГИКА
  let cumulativeAngle = 0;

  const dSections: DonutSection[] = sections.map((section) => {
    const sectionStyles: React.CSSProperties = {
      position: "absolute",
      height: "100%",
      width: "50%",
      overflow: "hidden",
      backgroundColor: "transparent",
      transformOrigin: "100% 50%",
      transform: `rotate(${cumulativeAngle}deg)`,
      pointerEvents: "none",
      left: "50%",
    };

    const fillerStyles: React.CSSProperties = {
      position: "absolute",
      height: "100%",
      width: "100%",
      transformOrigin: "0% 50%",
      transform: `rotate(${section.degree}deg)`,
      background: section.color || defaultColor,
      pointerEvents: "all",
    };

    const result = {
      label: section.label,
      fillerStyles,
      sectionStyles,
    };

    cumulativeAngle += section.degree;

    return result;
  });

  const emitClick = (section: Section) => {
    if (onSectionClick) {
      onSectionClick(section);
    }
  };

  return (
    <div className="cdc-sections" style={containerStyles}>
      {dSections.map((section, idx) => (
        <div
          key={idx}
          className="cdc-section"
          style={section.sectionStyles}
          onClick={() => emitClick(sections[idx])}
        >
          <div
            className="cdc-filler"
            style={section.fillerStyles}
            title={section.label}
          />
        </div>
      ))}
    </div>
  );
};

export default DonutSections;
