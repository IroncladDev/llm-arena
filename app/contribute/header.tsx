import { Button } from "@/components/ui/button"
import Flex, { MotionFlex } from "@/components/ui/flex"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import { MotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { useCallback } from "react"
import { styled } from "react-tailwind-variants"

export default function Header({
  percentage,
}: {
  percentage: MotionValue<number>
}) {
  const backgroundImage = useCallback((p: number) => {
    const rotateFactor = p * 60
    const sizeFactor = p * 200
    const lightY = p * 100

    return gr.merge(
      gr.linear(0, tokens.colors.root, "transparent"),
      gr.radial(
        `circle at 50% ${lightY}%`,
        tokens.colors.red[500] + "35",
        "transparent",
      ),
      gr.rLinear(
        -5 + rotateFactor,
        ...gr.stack(
          ["transparent", 200 + sizeFactor],
          [tokens.colors.outline.dimmest, 202 + sizeFactor],
        ),
      ),
      gr.rLinear(
        -95 + rotateFactor,
        ...gr.stack(
          ["transparent", 200 + sizeFactor],
          [tokens.colors.outline.dimmest, 202 + sizeFactor],
        ),
      ),
    )
  }, [])

  const smoothPercentage = useSpring(percentage, {
    mass: 0.05,
  })

  const background = useTransform(
    smoothPercentage,
    [0, 1],
    [backgroundImage(0), backgroundImage(1)],
  )
  const translateY = useTransform(smoothPercentage, [0, 1], ["0%", "-100%"])

  return (
    <MotionFlex col grow style={{ background }}>
      <Content col grow width="full">
        <MotionFlex col grow gap={4} center style={{ translateY }}>
          <Text
            size="display"
            weight="bold"
            className="leading-tight"
            center
            multiline
          >
            Contributing
          </Text>
          <Text color="dimmer" size="lg" center multiline>
            All comparable LLMs are added by contributors like you
          </Text>
          <DownButton variant="highlight" asChild className="mt-8">
            <a href="#intro" aria-label="Go down">
              <ArrowDown className="text-foreground-dimmest w-8 h-8" />
            </a>
          </DownButton>
        </MotionFlex>
      </Content>
    </MotionFlex>
  )
}

const { Content, DownButton } = {
  Content: styled(Flex, {
    base: "max-w-screen-md max-md:max-w-screen max-md:p-4 self-center",
  }),
  DownButton: styled(Button, {
    base: "h-16 w-16 rounded-full",
  }),
}
