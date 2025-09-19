"use client";

import React from "react";

interface SumResultsProps {
  getSumResultPoints: () => number;
  getSumResultsPoints: () => number[];
}

const SumResults: React.FC<SumResultsProps> = ({
  getSumResultPoints,
  getSumResultsPoints,
}) => {
  const total = getSumResultPoints();
  const results = getSumResultsPoints();

  return (
    <div>
      <h3>Суммарные результаты</h3>
      <p>
        <strong>Общая сумма:</strong> {total}
      </p>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            Результат {i + 1}: {r}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SumResults;
