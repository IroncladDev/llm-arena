"use client"

import { extractVariantsConfig, styled } from "react-tailwind-variants"
import { MotionDiv } from "../motion"

const Flex = styled("div", {
  base: "flex flex-row",
  variants: {
    align: {
      unset: "",
      start: "items-start",
      end: "items-end",
      center: "items-center"
    },
    justify: {
      unset: "",
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between"
    },
    gap: {
      unset: "",
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
      16: "gap-16"
    },
    p: {
      unset: "",
      0: "p-0",
      1: "p-1",
      2: "p-2",
      4: "p-4",
      6: "p-6",
      8: "p-8",
      16: "p-16"
    },
    center: {
      true: "justify-center items-center"
    },
    row: {
      true: "flex-row"
    },
    col: {
      true: "flex-col"
    },
    grow: {
      true: "flex-grow"
    },
    wrap: {
      true: "flex-wrap"
    },
    noBasis: {
      true: "basis-0"
    },
    shrink: {
      unset: "",
      true: "flex-shrink",
      false: "flex-shrink-0"
    },
    width: {
      unset: "",
      full: "w-full",
      auto: "w-auto"
    },
    height: {
      unset: "",
      full: "h-full",
      auto: "h-auto"
    }
  },
  defaultVariants: {
    align: "unset",
    justify: "unset",
    shrink: "unset",
    gap: 0,
    center: false,
    row: false,
    col: false,
    grow: false,
    wrap: false,
    width: "unset",
    height: "unset",
    p: "unset",
    noBasis: false
  }
})

export const MotionFlex = styled(MotionDiv, extractVariantsConfig(Flex))

export default Flex
