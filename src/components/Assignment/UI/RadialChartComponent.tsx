import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AssignmentRadialChartComponentProps {
  width?: number;
  progress?: number;
}

const AssignmentRadialChartComponent: React.FC<
  AssignmentRadialChartComponentProps
> = ({ width = 100, progress = 0 }) => {
  const getColorByProgress = (progressValue: number) => {
    if (progressValue >= 80) return "#bfe05c";
    if (progressValue >= 60) return "#e7f04a";
    if (progressValue >= 40) return "#ebcf34";
    if (progressValue >= 20) return "#d17d41";
    return "#d14141";
  };

  const data = [
    { name: "Progress", value: progress },
    { name: "Remaining", value: 100 - progress },
  ];

  const color = getColorByProgress(progress);

  return (
    <div
      className="assignment-radial-chart-component relative"
      style={{ width, height: width }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={width / 2 - 8}
            outerRadius={width / 2}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            cornerRadius={4}
          >
            <Cell key={`cell-0`} fill={color} />
            <Cell key={`cell-1`} fill="#f0f0f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div
        className="absolute inset-0 flex items-center justify-center label-progress"
        style={{ color }}
      >
        <span className="text-xs font-bold">{progress}</span>
      </div>
    </div>
  );
};

export default AssignmentRadialChartComponent;
