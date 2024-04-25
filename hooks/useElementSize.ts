import { RefObject, useCallback, useEffect, useRef, useState } from "react"

const useClientRect = <T extends HTMLElement = HTMLElement>(): [
  RefObject<T>,
  DOMRect | undefined,
] => {
  const elementRef = useRef<T | null>(null)
  const [box, setBox] = useState<DOMRect>()

  const updateSize = useCallback(() => {
    if (elementRef.current) {
      setBox(elementRef.current.getBoundingClientRect())
    }
  }, [])

  useEffect(() => {
    const element = elementRef.current

    if (!element) return

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [updateSize])

  return [elementRef, box]
}

export default useClientRect
