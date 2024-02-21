"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as React from "react"
import { styled } from "react-tailwind-variants"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverContentBase>,
  React.ComponentPropsWithoutRef<typeof PopoverContentBase>
>(({ align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverContentBase
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const PopoverContentBase = styled(PopoverPrimitive.Content, {
  base: `z-50 max-w-xs rounded-md border border-outline-dimmer bg-higher p-2 text-foreground text-sm shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`
})

export { Popover, PopoverContent, PopoverTrigger }
