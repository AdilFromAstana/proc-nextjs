export const numericToBoolean = (
  value: number | boolean | null | undefined
): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "boolean") {
    return value;
  }

  // Для чисел: 0 = false, 1 = true, все остальные числа = true
  return value !== 0;
};
