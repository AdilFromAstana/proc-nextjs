"use client";
import React from "react";

const StepIcon = ({
  number,
  isActive,
  isComplete,
}: {
  number: number;
  isActive: boolean;
  isComplete: boolean;
}) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300
        ${
          isComplete ? "bg-blue-600" : isActive ? "bg-blue-500" : "bg-gray-400"
        }`}
  >
    {number}
  </div>
);

export default StepIcon;
