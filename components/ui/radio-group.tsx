"use client"

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import * as React from "react"
import { styled } from "react-tailwind-variants"

const RadioGroup = styled(RadioGroupPrimitive.Root, {
  base: `grid gap-2`,
})

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupItemBase>,
  React.ComponentPropsWithoutRef<typeof RadioGroupItemBase>
>((props, ref) => {
  return (
    <RadioGroupItemBase ref={ref} {...props}>
      <RadioGroupIndicatorBase>
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupIndicatorBase>
    </RadioGroupItemBase>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

const RadioGroupItemBase = styled(RadioGroupPrimitive.Item, {
  base: `aspect-square h-4 w-4 rounded-full border-2 border-outline-dimmer data-[state=checked]:border-accent-dimmest text-accent-dimmer disabled:cursor-not-allowed disabled:opacity-50 transition-colors`,
})

const RadioGroupIndicatorBase = styled(RadioGroupPrimitive.Indicator, {
  base: `flex items-center justify-center`,
})

export { RadioGroup, RadioGroupItem }
