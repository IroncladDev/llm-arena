"use client"

import { MotionContainer } from "@/components/container"
import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import gr from "@/lib/gradients"
import { colors, tokens } from "@/tailwind.config"
import { useMotionValue, useSpring } from "framer-motion"
import { GithubIcon, Loader2Icon } from "lucide-react"
import { signIn } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"

export default function LoginPage() {
  const [ref, box] = useClientRect<HTMLDivElement>()
  const [loading, setLoading] = useState(false)

  const gradient = useCallback(
    (p: number) => {
      const width = box?.width || 0
      const height = box?.height || 0

      const hw = (width / 2) * p
      const hh = (height / 2) * p

      return gr.merge(
        gr.radial(
          `circle at 50% ${110 + (1 - p) * 500}%`,
          tokens.colors.red[600] + "aa",
          tokens.colors.red[600] + "65 20%",
          "transparent 70%",
          "transparent"
        ),
        gr.rRadial(
          "circle at 50% 50%",
          ...gr.stack(
            [colors.clear, `${25 + (1 - p) * 25}vw`],
            [colors.outline.dimmest, `calc(${25 + (1 - p) * 25}vw + 2px)`]
          )
        ),
        gr.linear(
          90,
          ...gr.stack(
            [colors.clear, `calc(50% - ${hw}px)`],
            [colors.outline.dimmest, `calc(50% - ${hw - 2}px)`],
            [colors.clear, `calc(50% + ${hw}px)`],
            [colors.outline.dimmest, `calc(50% + ${hw + 2}px)`],
            [colors.clear, `calc(50% + ${hh + 2}px)`]
          )
        ),
        gr.linear(
          ...gr.stack(
            [colors.clear, `calc(50% - ${hh}px)`],
            [colors.outline.dimmest, `calc(50% - ${hh - 2}px)`],
            [colors.clear, `calc(50% + ${hh}px)`],
            [colors.outline.dimmest, `calc(50% + ${hh + 2}px)`],
            [colors.clear, `calc(50% + ${hh + 2}px)`]
          )
        ),
        gr.linear(135, colors.root, "#292524")
      )
    },
    [box]
  )

  const initialBackground = useMotionValue(gradient(0))
  const background = useSpring(initialBackground, {
    damping: 25
  })

  useEffect(() => {
    if (box && background) {
      background.set(gradient(1))
    }
  }, [gradient, background, box])

  return (
    <MotionContainer
      center
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background
      }}
    >
      <Content ref={ref}>
        <Text size="xl" weight="semibold">
          Cross the Threshold
        </Text>
        <Button
          onClick={async () => {
            setLoading(true)
            await signIn("github", {
              callbackUrl: "/contribute/join"
            })
          }}
          variant="highlightElevated"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <Loader2Icon className="w-6 h-6 animate-spin" />
          ) : (
            <GithubIcon className="w-6 h-6" />
          )}
          <span>Continue with Github</span>
        </Button>
      </Content>
    </MotionContainer>
  )
}

const Content = styled(MotionDiv, {
  base: "border-2 border-outline-dimmer bg-gradient-to-b from-higher to-root rounded-xl p-6 flex flex-col gap-3 shadow-lg shadow-black/50 max-w-sm min-w-[360px] justify-center items-center"
})
