import { MotionDiv } from "@/components/motion"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import { MotionValue, useSpring, useTransform } from "framer-motion"
import { useCallback } from "react"
import { styled } from "react-tailwind-variants"

const toHex = (num: number): string => num.toString(16).padStart(2, "0")

export default function Header({
  percentage
}: {
  percentage: MotionValue<number>
}) {
  const backgroundImage = useCallback((p: number) => {
    return gr.merge(
      gr.linear(
        0,
        tokens.colors.root + `${toHex(100 + p * 100)}`,
        tokens.colors.root + `${toHex(50 + p * 100)} ${10 + p * 10}%`,
        `transparent ${20 + p * 20}%`
      ),
      gr.radial(
        `circle at 50% ${100 - 90 * p}%`,
        tokens.colors.red[500] + "55",
        tokens.colors.red[500] + "25 30%",
        "transparent 70%",
        "transparent"
      ),
      gr.rRadial(
        `circle at 50% ${150 - 90 * p}%`,
        ...gr.stack(
          ["transparent", 400 - 150 * p],
          [tokens.colors.outline.dimmest + "25", 404 - 150 * p]
        )
      )
    )
  }, [])

  const smoothPercentage = useSpring(percentage, {
    mass: 0.05
  })

  const background = useTransform(
    smoothPercentage,
    [0, 1],
    [backgroundImage(0), backgroundImage(1)]
  )

  const translateY = useTransform(smoothPercentage, [0, 1], ["0%", "-50%"])

  return (
    <Container style={{ background }}>
      <Content>
        <HeaderContent style={{ translateY }}>
          <Text
            size="display"
            weight="bold"
            className="bg-gradient-to-r from-neutral-500 via-neutral-700 to-neutral-500 bg-clip-text text-transparent"
          >
            AI to AI
          </Text>
          <Text size="lg" color="dimmer">
            Create beautiful side-by-side LLM Comparisons
          </Text>
        </HeaderContent>
      </Content>
    </Container>
  )
}

const Container = styled(MotionDiv, {
  base: "flex flex-col grow"
})

const Content = styled("div", {
  base: "flex flex-col grow max-w-screen-md w-full self-center"
})

const HeaderContent = styled(MotionDiv, {
  base: "flex flex-col gap-4 grow items-center justify-center"
})
