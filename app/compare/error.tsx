"use client"

import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import Link from "next/link"
import { styled } from "react-tailwind-variants"

export default function Error({
  error: { message },
}: {
  error: Error & { digest?: string }
}) {
  return (
    <Container
      center
      style={{
        backgroundImage: gr.radial(
          "circle at 75% 110%",
          tokens.colors.default,
          tokens.colors.default + " 25%",
          tokens.colors.transparent + " 70%",
          tokens.colors.transparent,
        ),
      }}
    >
      <Content>
        <Text size="h2" weight="bold">
          Error
        </Text>
        <Text color="dimmer" multiline>
          {message}
        </Text>
        <Button asChild className="w-full">
          <Link href="/">Return Home</Link>
        </Button>
      </Content>
    </Container>
  )
}

const { Content } = {
  Content: styled("div", {
    base: "flex flex-col gap-4 p-6 border-2 rounded-xl border-outline-dimmest bg-root/50 shadow-xl max-w-[360px] w-full items-center",
  }),
}
