"use client"

import { Container } from "@/components/container"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import { styled } from "react-tailwind-variants"
import Comparison from "./compare/comparison"
import Sidebar from "./compare/sidebar"
import { useCompareState } from "./compare/state"

export default function Content() {
  const sidebar = useCompareState(state => state.sidebar)

  return (
    <Container
      className="flex flex-row h-screen"
      style={{
        background: gr.merge(
          gr.radial(
            "circle at 75% 110%",
            tokens.colors.default,
            tokens.colors.default + " 25%",
            tokens.colors.transparent + " 70%",
            tokens.colors.transparent
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
    </Container>
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
