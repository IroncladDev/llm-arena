"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import * as React from "react"
import { styled } from "react-tailwind-variants"
import { Button } from "./button"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = styled(DialogPrimitive.Overlay, {
  base: `fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 outline-none`,
})

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContentBase>,
  React.ComponentPropsWithoutRef<typeof DialogContentBase>
>(({ children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogContentBase ref={ref} {...props}>
      {children}
      <DialogClose asChild>
        <Button size="icon">
          <XIcon className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </Button>
      </DialogClose>
    </DialogContentBase>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogContentBase = styled(DialogPrimitive.Content, {
  base: `fixed left-[50%] top-[50%] z-50 flex flex-col gap-4 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border border-outline-dimmer bg-default p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg`,
})

const DialogClose = styled(DialogPrimitive.Close, {
  base: "absolute right-4 top-4",
})

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
}
