"use client"

import { MotionContainer } from "@/components/container"
import ScrollSection from "@/components/scroll-section"
import About from "./about"
import Header from "./sections/header"

export default function Content() {
  return (
    <MotionContainer>
      <ScrollSection height="200vh">
        {percentage => <Header percentage={percentage} />}
      </ScrollSection>
      <ScrollSection height="400vh">
        {percentage => <About percentage={percentage} />}
      </ScrollSection>
    </MotionContainer>
  )
}
