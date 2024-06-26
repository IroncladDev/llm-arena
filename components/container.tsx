import { styled } from "react-tailwind-variants"
import { MotionDiv } from "./motion"

export const Container = styled("div", {
  base: "min-h-screen flex flex-col w-screen",
  variants: {
    center: {
      true: "items-center justify-center",
    },
  },
  defaultVariants: {
    center: false,
  },
})

export const MotionContainer = styled(MotionDiv, {
  base: "min-h-screen flex flex-col w-screen",
  variants: {
    center: {
      true: "items-center justify-center",
    },
  },
  defaultVariants: {
    center: false,
  },
})
