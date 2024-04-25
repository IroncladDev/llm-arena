"use client"

import * as SwitchPrimitives from "@radix-ui/react-switch"
import * as React from "react"
import { styled } from "react-tailwind-variants"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchBase>,
  React.ComponentPropsWithoutRef<typeof SwitchBase>
>((props, ref) => (
  <SwitchBase {...props} ref={ref}>
    <SwitchThumb />
  </SwitchBase>
))
Switch.displayName = SwitchPrimitives.Root.displayName

const SwitchBase = styled(SwitchPrimitives.Root, {
  base: `peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent-dimmest data-[state=unchecked]:bg-higher`,
})

const SwitchThumb = styled(SwitchPrimitives.Thumb, {
  base: `pointer-events-none block h-5 w-5 rounded-full bg-foreground shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0`,
})

export { Switch }
