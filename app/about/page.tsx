"use client"

import { Container } from "@/components/container"
import ScrollSection from "@/components/scroll-section"
import Conclusion from "./sections/conclusion"
import Header from "./sections/header"
import Inspiration from "./sections/inspiration"
import Intro from "./sections/intro"

export default function Page() {
  return (
    <Container>
      <ScrollSection height="200vh">
        {percentage => <Header percentage={percentage} />}
      </ScrollSection>
      <ScrollSection height="200vh">
        {percentage => <Intro percentage={percentage} />}
      </ScrollSection>
      <Inspiration />
      <Conclusion />
    </Container>
  )
}
