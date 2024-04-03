import { styled } from "react-tailwind-variants"

export const Input = styled("input", {
  base: "rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus:border-accent-dimmer outline-none w-full placeholder:text-foreground-dimmest",
  variants: {
    variant: {
      default: "bg-default text-foreground border-2 border-outline-dimmest",
      elevated: "bg-higher text-foreground border-2 border-outline-dimmer"
    },
    size: {
      default: "h-10 px-4 py-2",
      lg: "h-12 rounded-xl px-4 text-base"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})
