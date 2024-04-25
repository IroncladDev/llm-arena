import { Hexagon } from "lucide-react"
import { styled } from "react-tailwind-variants"

const LLMIcon = styled(Hexagon, {
  base: "text-accent-dimmer",
  variants: {
    color: {
      accent: "text-accent-dimmer",
      default: "text-foreground",
      dimmer: "text-foreground-dimmer",
      dimmest: "text-foreground-dimmest",
    },
    size: {
      sm: "w-4 h-4",
      default: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    },
  },
  defaultVariants: {
    color: "accent",
    size: "default",
  },
})

export default LLMIcon
