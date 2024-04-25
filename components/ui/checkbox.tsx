"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import * as React from "react"
import { styled } from "react-tailwind-variants"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxBase>,
  React.ComponentPropsWithoutRef<typeof CheckboxBase>
>(({ ...props }, ref) => (
  <CheckboxBase ref={ref} {...props}>
    <CheckboxIndicator>
      <Check className="h-4 w-4" />
    </CheckboxIndicator>
  </CheckboxBase>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const CheckboxBase = styled(CheckboxPrimitive.Root, {
  base: `peer h-5 w-5 shrink-0 rounded border-2 border-outline-dimmer bg-highest disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent-dimmest data-[state=checked]:text-foreground data-[state=checked]:border-accent-dimmer transition-colors`,
})

const CheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  base: `flex items-center justify-center text-current`,
})

export { Checkbox }
