"use client"

import { MotionContainer } from "@/components/container"
import ScrollSection from "@/components/scroll-section"
import Cta from "./cta"
import Function from "./function"
import Header from "./header"
import Intro from "./intro"

export default function Contribute() {
  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ScrollSection height="200vh">
        {percentage => <Header percentage={percentage} />}
      </ScrollSection>
      <Intro />
      <ScrollSection height="400vh">
        {percentage => <Function percentage={percentage} />}
      </ScrollSection>
      <Cta />
    </MotionContainer>
  )
}
