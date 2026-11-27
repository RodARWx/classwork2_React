import { useEffect, useState } from 'react';

/**
 * Delays updating the returned value until `delay` ms have passed
 * without `value` changing.
 *
 * @template T
 * @param {T} value - Input value to debounce.
 * @param {number} [delay=3000] - Debounce delay in milliseconds.
 * @returns {T} Debounced value.
 */
export function useDebounce(value, delay = 3000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
