// components/Student/StudentResultsDisplay.tsx
import React from "react";

interface StudentResultsDisplayProps {
  results: any[] | undefined;
}

const StudentResultsDisplay: React.FC<StudentResultsDisplayProps> = ({
  results,
}) => {
  // Определение цвета по значению результата
  const getResultColor = (result: number) => {
    switch (result) {
      case 0: // UNDEFINED
        return "bg-gray-300"; // серый
      case 1: // ANSWERED
        return "bg-blue-400"; // синий (ответ дан, но не проверен)
      case 2: // FALSE
        return "bg-red-500"; // красный (неверно)
      case 3: // TRUE
        return "bg-green-500"; // зелёный (верно)
      default:
        return "bg-gray-300";
    }
  };

  // Определение класса для квадрата
  const getSquareClass = (result: number) => `
    w-[20px] h-[20px] rounded-sm ${getResultColor(result)}
    border border-gray-200
  `;
  if (!results) return null;

  return (
    <div className="flex flex-col space-y-2">
      {/* Верхняя строка: все вопросы */}
      <div className="flex space-x-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="w-[20px] h-[20px] rounded-sm bg-gray-300 border border-gray-200"
          />
        ))}
      </div>

      {/* Нижняя строка: результаты */}
      <div className="flex space-x-1">
        {results.map((result, index) => (
          <div
            key={`result-${index}`}
            className={getSquareClass(result.result)}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentResultsDisplay;
