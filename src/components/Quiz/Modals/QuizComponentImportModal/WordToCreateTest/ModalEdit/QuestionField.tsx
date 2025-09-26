"use client";
import React from "react";
import FormulaEditor from "./FormulaEditor";
import { processTextWithRichContent } from "../../parseDocxLogic/processRichText";

export default function QuestionField({
  value,
  isRaw,
  onChange,
}: {
  value: string;
  isRaw: boolean;
  onChange: (v: string) => void;
}) {
  if (isRaw) {
    return (
      <textarea
        className="w-full p-2 border rounded-md"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    );
  }

  if (value.startsWith("[FORMULA:")) {
    return (
      <FormulaEditor
        value={value.replace("[FORMULA:", "").replace("]", "")}
        onChange={(newLatex) => onChange(`[FORMULA:${newLatex}]`)}
      />
    );
  }

  return (
    <div className="p-2 border rounded-md bg-gray-50">
      {processTextWithRichContent(value)}
    </div>
  );
}
