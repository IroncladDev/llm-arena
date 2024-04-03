"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, Circle } from "lucide-react"
import * as React from "react"
import { extractVariantsConfig, styled } from "react-tailwind-variants"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuContent = styled(DropdownMenuPrimitive.Content, {
  base: `relative z-50 min-w-[8rem] overflow-hidden rounded-lg border-2 text-foreground shadow-md min-w-[200px] p-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`,
  variants: {
    elevated: {
      true: "border-accent-dimmer bg-higher",
      false: "border-accent-dimmest bg-default"
    }
  }
})

const DropdownMenuItem = styled(DropdownMenuPrimitive.Item, {
  base: `relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none text-foreground-dimmer focus:bg-highest focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors`,
  variants: {
    inset: {
      true: "pl-8"
    }
  }
})

const DropdownMenuCheckboxItemBase = styled(
  DropdownMenuPrimitive.CheckboxItem,
  extractVariantsConfig(DropdownMenuItem)
)

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuCheckboxItemBase>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItemBase>
>(({ children, ...props }, ref) => (
  <DropdownMenuCheckboxItemBase ref={ref} {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuCheckboxItemBase>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItemBase = styled(
  DropdownMenuPrimitive.RadioItem,
  extractVariantsConfig(DropdownMenuItem)
)

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuRadioItemBase>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItemBase>
>(({ children, ...props }, ref) => (
  <DropdownMenuRadioItemBase ref={ref} {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuRadioItemBase>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSub,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem
}
