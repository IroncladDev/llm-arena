"use client"

import { MotionContainer } from "@/components/container"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import { styled } from "react-tailwind-variants"
import Comparison from "./comparison"
import Sidebar from "./sidebar"
import { useCompareState } from "./state"

export default function Content() {
  const sidebar = useCompareState(state => state.sidebar)

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-row h-screen"
      style={{
        background: gr.merge(
          gr.radial(
            "circle at 75% 110%",
            tokens.colors.red[500] + "57",
            tokens.colors.red[500] + "32 25%",
            tokens.colors.transparent + " 70%",
            tokens.colors.transparent
          ),
          gr.rRadial(
            "circle at 100% 100%",
            ...gr.stack(
              ["transparent", 400],
              [tokens.colors.accent.dimmest + "15", 402]
            )
          )
        )
      }}
    >
      <SidebarContainer open={sidebar}>
        <Sidebar />
      </SidebarContainer>
      <ContentContainer>
        <Comparison />
      </ContentContainer>
    </MotionContainer>
  )
}

const SidebarContainer = styled("div", {
  base: "flex flex-col bg-root/50 border-r-2 border-outline-dimmest h-screen min-w-[320px]",
  variants: {
    open: {
      true: "max-md:absolute max-md:top-0 max-md:left-0 max-md:z-10 bg-root max-sm:w-full",
      false: "max-md:hidden"
    }
  },
  defaultVariants: {
    open: true
  }
})

const ContentContainer = styled("div", {
  base: "grow flex flex-col h-screen"
})
