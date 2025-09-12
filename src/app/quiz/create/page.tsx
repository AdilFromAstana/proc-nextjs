"use client";
import CreateQuizComponent from "@/components/Quiz/CreateQuizComponent";
import React from "react";

type Props = {};

export default function QuizCreatePage({}: Props) {
  return (
    <div className="w-full m-8">
      <CreateQuizComponent />
    </div>
  );
}
