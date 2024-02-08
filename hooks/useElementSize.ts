import { useState, useEffect, useCallback, useRef, RefObject } from "react";

const useClientRect = <T extends HTMLElement = HTMLElement>(): [
  RefObject<T>,
  DOMRect | undefined,
] => {
  const elementRef = useRef<T | null>(null);
  const [box, setBox] = useState<DOMRect>();

  const updateSize = useCallback(() => {
    if (elementRef.current) {
      setBox(elementRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  return [elementRef, box];
};

export default useClientRect;
