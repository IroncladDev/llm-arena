"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import { styled } from "react-tailwind-variants"

const Tabs = TabsPrimitive.Root

const TabsList = styled(TabsPrimitive.List, {
  base: `inline-flex w-full h-8 items-center justify-center p-0 text-foreground-dimmest`,
})

const TabsTrigger = styled(TabsPrimitive.Trigger, {
  base: `grow inline-flex items-center justify-center whitespace-nowrap rounded-t-xl h-8 px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent border-b-2 border-outline-dimmest data-[state=active]:border-accent-dimmer basis-0`,
})

const TabsContent = styled(TabsPrimitive.Content, {
  base: `mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,
})

export { Tabs, TabsContent, TabsList, TabsTrigger }
