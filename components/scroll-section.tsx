import {
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "framer-motion"
import { useRef } from "react"

export default function ScrollSection({
  height,
  children,
}: {
  height: string
  children: (percentage: MotionValue<number>) => React.ReactNode
}) {
  const initialHeightRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  const percentage = useMotionValue(0)

  useMotionValueEvent(scrollY, "change", () => {
    if (!initialHeightRef.current) return

    const heightSpacer = initialHeightRef.current.getBoundingClientRect()

    if (heightSpacer.top > window.innerHeight) {
      return
    }

    const heightValue =
      1 -
      (heightSpacer.height - window.innerHeight + heightSpacer.top) /
        (heightSpacer.height - window.innerHeight)

    if (heightValue >= 0 && heightValue <= 1) {
      percentage.set(heightValue)
    }
  })

  return (
    <div className="flex w-screen">
      <div className="w-[1px]" style={{ height }} ref={initialHeightRef} />
      <div
        className="grow flex flex-col sticky top-0 overflow-hidden"
        style={{ height: "100vh" }}
      >
        {children(percentage)}
      </div>
    </div>
  )
}
