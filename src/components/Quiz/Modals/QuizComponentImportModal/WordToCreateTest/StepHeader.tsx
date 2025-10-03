"use client";
import React from "react";
import StepIcon from "./StepIcon";
import { Button } from "@/components/ui/button";
import { ParseError } from "./WordToCreateTest";

interface Props {
  step: number;
  parseErrors: ParseError[];
  showErrorSidebar: boolean;
  setShowErrorSidebar: (v: boolean) => void;
  showConfirm: boolean;
}

const StepHeader: React.FC<Props> = ({
  step,
  parseErrors,
  showErrorSidebar,
  setShowErrorSidebar,
  showConfirm,
}) => {
  return (
    <div className="flex justify-between items-center p-6 border-b">
      <div className="flex items-center space-x-2">
        <StepIcon number={1} isActive={step === 1} isComplete={step > 1} />
        <span>Загрузка</span>
      </div>

      <div
        className={`flex-1 h-0.5 mx-4 ${
          step > 1 ? "bg-blue-500" : "bg-gray-300"
        }`}
      />

      <div className="flex items-center space-x-2">
        <StepIcon number={2} isActive={step === 2} isComplete={false} />
        <span>Проверка</span>
      </div>

      {step === 2 && parseErrors.length > 0 && (
        <div className="ml-auto relative">
          <Button
            onClick={() => setShowErrorSidebar(!showErrorSidebar)}
            className={`ml-4 text-sm ${
              showErrorSidebar
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }`}
          >
            {showErrorSidebar ? "Скрыть ошибки" : "Показать ошибки"}
          </Button>

          {!showErrorSidebar && showConfirm && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-md border bg-white shadow-lg z-50">
              <div className="p-3 text-sm text-gray-700 text-center">
                ⚠️ Обнаружены ошибки при парсинге.
                <div className="mt-2 text-xs text-gray-500">
                  Нажмите, чтобы открыть список
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepHeader;
