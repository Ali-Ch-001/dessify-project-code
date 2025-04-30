import { RefObject, useEffect } from "react";

export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    function handleClick(event: MouseEvent | TouchEvent) {
      const el = ref.current;
      // if no ref or click is inside, do nothing
      if (!el || el.contains(event.target as Node)) return;
      callback(event);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [ref, callback]);
}
