import { Question } from "@/types/quizQuestion";
import React from "react";

type Props = {
  onAdd: (question: Omit<Question, "id">) => void;
  onCancel: () => void;
};

export default function ImportFromFileForm({}: Props) {
  return <div>ImportFromFileForm</div>;
}
