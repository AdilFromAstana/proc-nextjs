import React, { useState, useEffect, useRef } from "react";
import DonutSections from "./DonutSection";

// Utils
const defaultColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF6384",
  "#C9CBCF",
];

const placement = {
  TOP: "TOP",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

const sectionValidator = (section: any) => {
  return section && typeof section.value === "number" && section.value >= 0;
};

interface DonutSection {
  label?: string;
  value: number;
  color?: string;
  count?: number;
  [key: string]: any;
}

interface DonutChartProps {
  size?: number;
  unit?: string;
  thickness?: number;
  calcFontSize?: boolean;
  text?: string;
  background?: string;
  foreground?: string;
  sections?: DonutSection[];
  total?: number;
  hasLegend?: boolean;
  legendPlacement?: string;
  startAngle?: number;
  onSectionClick?: (section: DonutSection) => void;
  children?: React.ReactNode;
}

const DonutChart: React.FC<DonutChartProps> = ({
  size = 250,
  unit = "px",
  thickness = 20,
  calcFontSize = false,
  text = null,
  background = "#ffffff",
  foreground = "#eeeeee",
  sections = [],
  total = 100,
  hasLegend = false,
  legendPlacement = placement.BOTTOM,
  startAngle = 0,
  onSectionClick,
  children,
}) => {
  const donutRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState("1em");
  const resizeListenerRef = useRef<() => void>(() => {});

  // Compute donut sections
  const donutSections = (() => {
    const valueTotal = sections.reduce((a, c) => a + c.value, 0);

    if (Math.round(valueTotal) > total) {
      const err = `Sum of all the sections' values (${valueTotal}) should not exceed \`total\` (${total})`;
      throw new Error(err);
    }

    const degreesInACircle = 360;
    const degreesInASection = 180;

    let consumedDegrees = 0;
    let currentDefaultColorIdx = 0;

    const resultSections: any[] = [];

    sections.forEach((section) => {
      const valToDeg = degreesInACircle * (section.value / total);

      let degreeArr = [valToDeg];

      if (valToDeg > degreesInASection) {
        degreeArr = [degreesInASection, valToDeg - degreesInASection];
      }

      const color = section.color || defaultColors[currentDefaultColorIdx++];

      degreeArr.forEach((degree) => {
        const consumedWithCurrent = consumedDegrees + degree;
        if (consumedWithCurrent > degreesInASection) {
          const remainingDegreesInCurrentSection =
            degreesInASection - consumedDegrees;

          resultSections.push(
            { ...section, degree: remainingDegreesInCurrentSection, color },
            {
              ...section,
              degree: degree - remainingDegreesInCurrentSection,
              color,
            }
          );
        } else {
          resultSections.push({ ...section, degree, color });
        }

        consumedDegrees += degree;

        if (consumedDegrees >= degreesInASection) {
          consumedDegrees -= degreesInASection;
        }
      });
    });

    return resultSections;
  })();

  // Compute legend
  const legend = hasLegend
    ? (() => {
        let currentDefaultColorIdx = 0;
        return sections.map((section, idx) => ({
          label: section.label || `Section ${idx + 1}`,
          percent: `${section.value} (${(section.value / total) * 100}%)`,
          count: section.count || null,
          styles: {
            background:
              section.color || defaultColors[currentDefaultColorIdx++],
          },
        }));
      })()
    : null;

  const donutStyles: React.CSSProperties = {
    width: `${size}${unit}`,
    paddingBottom: `${size}${unit}`,
    backgroundColor: foreground,
  };

  const overlayStyles: React.CSSProperties = {
    height: `${100 - thickness}%`,
    width: `${100 - thickness}%`,
    top: `calc(50% - ${(100 - thickness) / 2}%)`,
    left: `calc(50% - ${(100 - thickness) / 2}%)`,
    backgroundColor: background,
  };

  const donutTextStyles: React.CSSProperties = { fontSize };

  // Recalculate font size
  const recalcFontSize = () => {
    const scaleDownBy = 0.08;
    let widthInPx = size;

    if (unit !== "px" && donutRef.current) {
      widthInPx = donutRef.current.clientWidth;
    }

    setFontSize(
      widthInPx ? `${(widthInPx * scaleDownBy).toFixed(2)}px` : "1em"
    );
  };

  // Effects
  useEffect(() => {
    if (calcFontSize) {
      recalcFontSize();
      resizeListenerRef.current = recalcFontSize;
      window.addEventListener("resize", recalcFontSize);
    }

    return () => {
      if (calcFontSize) {
        window.removeEventListener("resize", recalcFontSize);
      }
    };
  }, [calcFontSize, size, unit]);

  useEffect(() => {
    if (calcFontSize) {
      recalcFontSize();
    }
  }, [size, unit, calcFontSize]);

  const emitSectionClick = (section: DonutSection) => {
    if (onSectionClick) {
      onSectionClick(section);
    }
  };

  // Исправленная часть с типизацией placementStyles
  const placementStyles: Record<
    string,
    { container?: React.CSSProperties; legend?: React.CSSProperties }
  > = {
    [placement.TOP]: {
      container: { flexDirection: "column" as const },
      legend: { marginBottom: "1em" },
    },
    [placement.BOTTOM]: {
      container: { flexDirection: "column" as const },
      legend: { marginTop: "1em" },
    },
    [placement.LEFT]: {
      container: { flexDirection: "row" as const },
      legend: { marginRight: "1em" },
    },
    [placement.RIGHT]: {
      container: { flexDirection: "row" as const },
      legend: { marginLeft: "1em" },
    },
  };

  // Исправленная часть с вычислением placementStylesObj
  const placementStylesObj = hasLegend
    ? placementStyles[legendPlacement] || placementStyles[placement.BOTTOM]
    : {};

  return (
    <div
      className="cdc-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(placementStylesObj.container || {}),
      }}
    >
      <div
        ref={donutRef}
        className="cdc"
        style={{
          height: "auto",
          borderRadius: "50%",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
          ...donutStyles,
        }}
      >
        <DonutSections
          sections={donutSections}
          startAngle={startAngle}
          onSectionClick={emitSectionClick}
        />
        <div
          className="cdc-overlay"
          style={{
            opacity: 1,
            position: "absolute",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            zIndex: 9,
            ...overlayStyles,
          }}
        >
          <div
            className="cdc-text"
            style={{
              textAlign: "center",
              ...donutTextStyles,
            }}
          >
            {children || text}
          </div>
        </div>
      </div>

      {hasLegend && legend && (
        <div
          className="cdc-legend"
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            ...(placementStylesObj.legend || {}),
          }}
        >
          {legend.map((item, idx) => (
            <div
              key={idx}
              className="cdc-legend-item"
              title={item.percent}
              style={{
                display: "inline-flex",
                alignItems: "center",
                margin: "0.5em",
              }}
            >
              <div
                className="cdc-legend-item-color"
                style={{
                  height: "1.25em",
                  width: "1.25em",
                  lineHeight: "1.15em",
                  borderRadius: "2px",
                  marginRight: "0.5em",
                  background: item.styles.background,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.count !== null && (
                  <span
                    className="cdc-legend-item-count"
                    style={{
                      color: "#333",
                      fontSize: "0.8em",
                      fontWeight: 600,
                      opacity: 0.5,
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </div>
              <div className="cdc-legend-item-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonutChart;
