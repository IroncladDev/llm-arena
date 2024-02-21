"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from "react"
import { styled } from "react-tailwind-variants"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContentBase>,
  React.ComponentPropsWithoutRef<typeof TooltipContentBase>
>(({ sideOffset = 4, ...props }, ref) => (
  <TooltipContentBase ref={ref} sideOffset={sideOffset} {...props} />
))

TooltipContent.displayName = TooltipPrimitive.Content.displayName

const TooltipContentBase = styled(TooltipPrimitive.Content, {
  base: `z-50 overflow-hidden rounded-md border border-outline-dimmer bg-higher px-3 py-1.5 text-sm text-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`
})

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
