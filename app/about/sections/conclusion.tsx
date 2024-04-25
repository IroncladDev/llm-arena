import { Container } from "@/components/container"
import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import Link from "next/link"

export default function Conclusion() {
  return (
    <Container
      style={{
        backgroundImage: gr.radial(
          "circle at 50% 110%",
          tokens.colors.accent.dimmer + "75",
          tokens.colors.accent.dimmer + "25 30%",
          tokens.colors.transparent + " 50%",
          tokens.colors.transparent,
        ),
      }}
      center
      className="border-t-2 border-default"
    >
      <Flex col gap={4} p={4}>
        <Text size="h1" weight="bold" center className="leading-tight">
          Final Notes
        </Text>
        <Text multiline paragraph color="dimmer" size="lg">
          Thank you for taking your time to read about my project. If you&apos;d
          like to contribute and upload LLMs to this website, check out the{" "}
          <Link href="/contribute" className="text-accent">
            Contribution Page
          </Link>{" "}
          and apply to join.
        </Text>
        <Text multiline paragraph color="dimmer" size="lg">
          Should you have any questions or feedback, hit me up at{" "}
          <a href="mailto:conner@connerow.dev" className="text-accent">
            conner@connerow.dev
          </a>{" "}
          or send me a message on{" "}
          <a
            href="https://x.com/IroncladDev"
            target="_blank"
            className="text-accent"
          >
            X
          </a>
          .
        </Text>
      </Flex>
    </Container>
  )
}
