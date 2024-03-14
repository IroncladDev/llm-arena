"use client"

import { Container } from "@/components/container"
import ScrollSection from "@/components/scroll-section"
import Cta from "./cta"
import Function from "./function"
import Header from "./header"
import Intro from "./intro"

export default function Page() {
  return (
    <Container>
      <ScrollSection height="200vh">
        {percentage => <Header percentage={percentage} />}
      </ScrollSection>
      <Intro />
      <ScrollSection height="400vh">
        {percentage => <Function percentage={percentage} />}
      </ScrollSection>
      <Cta />
    </Container>
  )
}
