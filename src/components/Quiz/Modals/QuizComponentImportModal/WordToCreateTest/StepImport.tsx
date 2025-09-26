"use client";
import React from "react";

const StepImport = ({ count }: { count: number }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Шаг 3: Импорт</h2>
      <p>Всего вопросов для импорта: {count}</p>
    </div>
  );
};

export default StepImport;
