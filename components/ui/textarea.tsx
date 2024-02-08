import { styled } from "react-tailwind-variants";

export const Textarea = styled("textarea", {
  base: "rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus:border-accent-dimmer outline-none w-full placeholder:text-foreground-dimmest",
  variants: {
    variant: {
      default: "bg-default text-foreground border-2 border-outline-dimmest",
      elevated: "bg-higher text-foreground border-2 border-outline-dimmer",
    },
    size: {
      default: "px-4 py-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
