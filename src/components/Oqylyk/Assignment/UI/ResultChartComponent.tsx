"use client";
import DonutChart from "@/components/Chunks/Donut/Donut";
import React from "react";

interface AssignmentResult {
  result: number;
  [key: string]: any;
}

interface AssignmentResultList {
  data: AssignmentResult[];
  length: number;
  getPoints: () => number;
  map: (callback: (item: AssignmentResult) => void) => void;
}

interface AssignmentResultChartComponentProps {
  results: AssignmentResultList;
  points?: number | null;
  showPoints?: boolean;
}

const ResultChartComponent: React.FC<AssignmentResultChartComponentProps> = ({
  results,
  points = null,
  showPoints = true,
}) => {
  const isDesktop = window.innerWidth > 768;
  const isMobile = window.innerWidth <= 768;

  // Computed values
  const donutSize = isDesktop ? 200 : 150;
  const legendPlacement = isMobile ? "bottom" : "right";

  const $points = (() => {
    if (points) {
      return points;
    }

    const pointsValue = results.getPoints();
    return pointsValue < 0 ? 0 : pointsValue;
  })();

  const chartResult = (() => {
    const resultsArray: number[] = [0, 0, 0, 0];

    results.map((result) => {
      let key = 0;

      if (result.result === 1) {
        key = 1;
      } else if (result.result === 2) {
        key = 2;
      } else if (result.result === 3) {
        key = 3;
      }

      resultsArray[key] = resultsArray[key] + 1;
    });

    return resultsArray;
  })();

  const sections = (() => {
    const percent = 100 / results.length;

    return [
      {
        label: "Правильно",
        count: chartResult[3],
        value: percent * chartResult[3],
        color: "#bfe05c",
      },
      {
        label: "Неправильно",
        count: chartResult[2],
        value: percent * chartResult[2],
        color: "#e05c67",
      },
      {
        label: "На проверке",
        count: chartResult[1],
        value: percent * chartResult[1],
        color: "#ebcf34",
      },
      {
        label: "Не отвечен",
        count: chartResult[0],
        value: percent * chartResult[0],
        color: "#eeeeee",
      },
    ];
  })();

  return (
    <div className="assignment-result-chart-component">
      <DonutChart
        sections={sections}
        size={donutSize}
        unit="px"
        thickness={30}
        hasLegend={true}
        legendPlacement={legendPlacement}
        startAngle={0}
      >
        {showPoints && (
          <div
            className="assignment-result-points"
            style={{ textAlign: "center" }}
          >
            <div
              className="result-points-value"
              style={{
                color: "#333",
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              {$points}
            </div>
            <div
              className="result-points-label"
              style={{
                color: "#999",
                fontSize: "0.8rem",
                marginTop: "10px",
              }}
            >
              балла (-ов)
            </div>
          </div>
        )}
      </DonutChart>
    </div>
  );
};

export default ResultChartComponent;
