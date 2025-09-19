// hooks/useDebounce.ts
import { useState, useEffect } from "react";

/**
 * Хук для получения значения с задержкой (debounce).
 * Возвращает значение только после истечения заданного времени
 * без изменений входного значения.
 *
 * @param value Значение для debounce
 * @param delay Задержка в миллисекундах (по умолчанию 500ms)
 * @returns Debounced значение
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер для обновления значения
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при изменении значения или размонтировании
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Перезапускаем таймер при изменении value или delay

  return debouncedValue;
}
