/**
 * @fileoverview Custom React hook for debouncing rapidly changing values (such as search inputs).
 * Prevents excessive API requests while the user is actively typing.
 */

import { useEffect, useState } from 'react';

/**
 * Delays propagating updates to `value` until `delay` milliseconds have elapsed
 * since the last change.
 *
 * Whenever `value` or `delay` changes before the timer fires, the previous timeout
 * is cleared via `clearTimeout` in the `useEffect` cleanup function.
 *
 * @template T
 * @param {T} value - The reactive value to debounce.
 * @param {number} [delay=3000] - Debounce wait time in milliseconds.
 * @returns {T} The latest debounced value.
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
