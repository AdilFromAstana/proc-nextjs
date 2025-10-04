import { useState } from "react";
import { distributePercents } from "../utils/distributePercents";

export function useQuestionOptions(initialOptions: any[]) {
  const [options, setOptions] = useState(initialOptions);

  const toggleCorrect = (id: string, isEditing: boolean) => {
    if (!isEditing) return;

    setOptions((prev) => {
      const updated = prev.map((opt) =>
        opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
      return distributePercents(updated);
    });
  };

  const updatePercent = (id: string, percent: number) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, percent } : opt))
    );
  };

  const updateOptionAnswer = (id: string, value: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, answer: value } : opt))
    );
  };

  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  const addOption = () => {
    const newId = `opt-${options.length + 1}-${Date.now()}`;
    setOptions((prev) => [
      ...prev,
      { id: newId, answer: "", isCorrect: false, percent: 0, isEditing: true },
    ]);
  };

  return {
    options,
    setOptions,
    toggleCorrect,
    updatePercent,
    updateOptionAnswer, // 👈 добавили
    removeOption,
    addOption,
  };
}
