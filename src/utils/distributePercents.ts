export function distributePercents(options: any[]) {
  const correctOptions = options.filter((o) => o.isCorrect);
  const count = correctOptions.length;

  if (count === 0) {
    return options.map((opt) => ({ ...opt, percent: 0 }));
  }

  const percent = Math.round(100 / count);

  return options.map((opt) =>
    opt.isCorrect ? { ...opt, percent } : { ...opt, percent: 0 }
  );
}
