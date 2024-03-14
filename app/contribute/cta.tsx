import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import Link from "next/link"
import { styled } from "react-tailwind-variants"

export default function Cta() {
  return (
    <Container
      style={{
        backgroundImage: gr.merge(
          gr.radial(
            `circle at 50% 100%`,
            tokens.colors.red[500] + "35",
            "transparent"
          ),
          gr.rRadial(
            "circle at 50% 110%",
            ...gr.stack(
              ["transparent", 300],
              [tokens.colors.outline.dimmest + "85", 302]
            )
          )
        )
      }}
    >
      <Content>
        <Text size="h1" weight="bold" multiline center>
          Join as a Contributor
        </Text>
        <Text size="lg" color="dimmer" multiline paragraph center>
          Help contribute to the ever-accelerating AI hype by reviewing and
          adding LLMs
        </Text>
        <Button variant="highlight" asChild>
          <Link href="/contribute/join">Apply as a Contributor</Link>
        </Button>
      </Content>
    </Container>
  )
}

const { Container, Content } = {
  Container: styled(MotionDiv, {
    base: "flex flex-col grow min-h-screen"
  }),
  Content: styled("div", {
    base: "flex flex-col grow max-w-screen-md w-full max-md:max-w-screen max-md:px-4 self-center py-16 justify-center items-center gap-8"
  })
}
