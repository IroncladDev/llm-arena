"use client"

import { MotionContainer } from "@/components/container"
import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { colors, tokens } from "@/tailwind.config"
import { useAnimate, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import { useCallback, useEffect } from "react"
import { styled } from "react-tailwind-variants"

export default function WaitlistPage({ position }: { position: number }) {
  const [scope, animate] = useAnimate()

  const gradient = useCallback((p: number) => {
    const pFactor = (1 - p) * 100

    return gr.merge(
      gr.radial(
        `circle at ${-pFactor}% ${100 + pFactor}%`,
        tokens.colors.red[600] + "88",
        tokens.colors.red[600] + "44 30%",
        "transparent 70%",
        "transparent",
      ),
      gr.radial(
        `circle at ${p * 100 - 50}% ${100 - p * 50}%`,
        tokens.colors.red[600] + "44",
        tokens.colors.red[600] + "22 50%",
        "transparent 70%",
        "transparent",
      ),
      gr.rRadial(
        "circle at 0% 100%",
        ...gr.stack(
          ["transparent", `calc(${60 - 40 * p}% - 2px)`],
          [colors.outline.dimmest, `calc(${60 - 40 * p}%)`],
        ),
      ),
      gr.radial(
        `circle at 50% ${50 * p}%`,
        ...gr.stack(
          [colors.clear, "calc(60% - 2px)"],
          [colors.outline.dimmest, "calc(60%)"],
          [colors.clear, "100%"],
        ),
      ),
    )
  }, [])

  const initialBackground = useMotionValue(gradient(0))
  const background = useSpring(initialBackground, { damping: 25 })

  useEffect(() => {
    if (background && scope.current) {
      background.set(gradient(1))
      animate(scope.current, { opacity: 1, translateY: 0 }, { duration: 1 })
    }
  }, [background, gradient, animate, scope])

  return (
    <MotionContainer
      center
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background,
      }}
    >
      <Content>
        <Text size="xl" weight="semibold">
          You&apos;re on the waitlist!
        </Text>

        <Text color="dimmer" multiline>
          You are #{position} on the waitlist. You&apos;ll receive an email when
          you can start contributing.
        </Text>

        <Button variant="highlightElevated" className="grow" asChild>
          <Link href="/">Home</Link>
        </Button>
      </Content>
    </MotionContainer>
  )
}

const Content = styled(MotionDiv, {
  base: "border-2 border-outline-dimmer bg-gradient-to-b from-higher to-root rounded-xl p-6 flex flex-col gap-3 shadow-lg shadow-black/50 max-w-sm",
})
