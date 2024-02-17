import { styled } from "react-tailwind-variants"

const Button = styled("button", {
  base: "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default:
        "bg-default text-foreground border-2 border-outline-dimmest hover:bg-higher hover:border-outline-dimmer",
      elevated:
        "bg-higher text-foreground border-2 border-outline-dimmer hover:bg-highest hover:border-outline",
      highlight:
        "bg-default text-foreground border-2 border-outline-dimmest hover:bg-red-900/50 hover:border-accent-dimmest",
      highlightElevated:
        "bg-higher text-foreground border-2 border-outline-dimmer hover:bg-red-900/75 hover:border-accent-dimmer",
      ghost: "bg-default text-foreground border-0 hover:bg-higher",
      ghostElevated: "bg-higher text-foreground border-0 hover:bg-highest",

      outline:
        "border-2 border-outline-dimmest hover:border-outline-dimmer text-foreground-dimmer",
      outlineHighlight:
        "border-2 border-outline-dimmest hover:border-red-900/50 hover:border-accent-dimmest"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-2 py-1 text-xs",
      lg: "h-11 rounded-md px-8",
      icon: "h-8 w-8"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})

export { Button }
