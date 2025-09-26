"use client";
import React, { useRef } from "react";
import { addStyles, EditableMathField, MathField } from "react-mathquill";

addStyles();

export default function FormulaEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const mathFieldRef = useRef<MathField | null>(null);

  return (
    <EditableMathField
      latex={value}
      onChange={(mf) => {
        mathFieldRef.current = mf;
        onChange(mf.latex());
      }}
      className="border p-2 rounded-md bg-white w-full"
    />
  );
}
