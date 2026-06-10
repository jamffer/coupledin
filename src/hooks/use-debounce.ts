import { useState, useEffect } from "react";

/**
 * Debounces a value by a given delay.
 * Only emits the latest value after the user stops changing it for `delay` ms.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
