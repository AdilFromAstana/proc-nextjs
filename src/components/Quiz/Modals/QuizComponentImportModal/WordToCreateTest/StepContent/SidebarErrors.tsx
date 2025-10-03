"use client";
import React from "react";
import { ParseError } from "../WordToCreateTest";

interface Props {
  show: boolean;
  errors: ParseError[];
  onClickError: (id: number) => void;
}

const SidebarErrors: React.FC<Props> = ({ show, errors, onClickError }) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        show ? "w-76 opacity-100" : "w-0 opacity-0"
      }`}
    >
      <div className="h-full bg-white rounded-lg shadow-lg overflow-y-auto">
        <ul className="space-y-3">
          {errors.map((err, i) => (
            <li
              key={i}
              className="p-3 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => err.questionId && onClickError(err.questionId)}
            >
              <p className="text-sm">
                {err.questionId && (
                  <span className="font-medium">Вопрос {err.questionId}: </span>
                )}
                {err.reason}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarErrors;
