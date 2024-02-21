"use client"

import * as SheetPrimitive from "@radix-ui/react-dialog"
import * as React from "react"
import { styled } from "react-tailwind-variants"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = styled(SheetPrimitive.Overlay, {
  base: `fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 outline-none`
})

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetContentBase>,
  React.ComponentPropsWithoutRef<typeof SheetContentBase>
>(({ children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetContentBase ref={ref} {...props}>
      {children}
    </SheetContentBase>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetContentBase = styled(SheetPrimitive.Content, {
  base: `fixed z-50 flex flex-col gap-4 overflow-y-auto bg-default p-4 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 border-outline-dimmer outline-none`,
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      bottom:
        "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      left: "inset-y-0 left-0 h-full w-full sm:w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-2xl",
      right:
        "inset-y-0 right-0 h-full w-full sm:w-3/4 sm:border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-2xl"
    }
  },
  defaultVariants: {
    side: "right"
  }
})

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  SheetTrigger
}
