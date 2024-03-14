import CompareItem from "@/app/compare/item"
import { MotionDiv } from "@/components/motion"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import { MetaPropertyType } from "@prisma/client"
import { MotionValue, useSpring, useTransform } from "framer-motion"
import { styled } from "react-tailwind-variants"

export default function Intro({
  percentage
}: {
  percentage: MotionValue<number>
}) {
  const smoothPercentage = useSpring(percentage, {
    mass: 0.05
  })

  const slideWidgetsX = useTransform(smoothPercentage, [0, 1], ["0", "-100%"])

  return (
    <Container
      style={{
        backgroundImage: gr.radial(
          "circle at 80% 110%",
          tokens.colors.default + "ac",
          tokens.colors.default + "87 20%",
          tokens.colors.root + " 85%",
          tokens.colors.root
        )
      }}
    >
      <Content>
        <AboutContainer>
          <Text size="h1" weight="bold" center>
            About
          </Text>
          <Text multiline paragraph color="dimmer" size="lg">
            <strong className="text-foreground">AI to AI</strong> is a simple
            project that allows you to compare LLMs, side-by-side.
          </Text>
          <Text multiline paragraph color="dimmer" size="lg">
            <strong className="text-foreground">Mutual metadata</strong> shared
            between two or more selected models get displayed together in{" "}
            <strong className="text-foreground">widgets</strong>.
          </Text>
        </AboutContainer>
        <WidgetGutter>
          <WidgetContainer
            style={{
              translateX: slideWidgetsX
            }}
          >
            <CompareItem
              field={{
                type: MetaPropertyType.Number,
                name: "Humaneval Benchmark",
                nonNullCount: 5,
                values: [
                  [
                    "code-llama",
                    { value: 0.288, type: MetaPropertyType.Number }
                  ],
                  [
                    "mistral-7b",
                    { value: 0.305, type: MetaPropertyType.Number }
                  ],
                  [
                    "gemini pro",
                    { value: 0.677, type: MetaPropertyType.Number }
                  ],
                  ["PaLM 8b", { value: 0.036, type: MetaPropertyType.Number }],
                  [
                    "code-davinci-002",
                    { value: 0.658, type: MetaPropertyType.Number }
                  ]
                ]
              }}
            />
            <CompareItem
              field={{
                type: MetaPropertyType.Number,
                name: "Context Window Tokens",
                nonNullCount: 5,
                values: [
                  ["gpt-4", { value: 8192, type: MetaPropertyType.Number }],
                  [
                    "gpt-3.5-turbo",
                    { value: 4096, type: MetaPropertyType.Number }
                  ],
                  [
                    "gpt-4-turbo-preview",
                    { value: 128000, type: MetaPropertyType.Number }
                  ],
                  [
                    "replit-code-v1-3b",
                    { value: 32000, type: MetaPropertyType.Number }
                  ],
                  ["llama-2-7b", { value: 4000, type: MetaPropertyType.Number }]
                ]
              }}
            />
            <CompareItem
              field={{
                type: MetaPropertyType.String,
                name: "Use Case",
                nonNullCount: 5,
                values: [
                  [
                    "gpt-4",
                    {
                      value: "text generation, image generation/recognition",
                      type: MetaPropertyType.String
                    }
                  ],
                  [
                    "dalle-2",
                    { value: "text-to-image", type: MetaPropertyType.String }
                  ],
                  [
                    "sora",
                    { value: "text-to-video", type: MetaPropertyType.String }
                  ],
                  [
                    "CodeLlama-70b-hf",
                    {
                      value: "code generation",
                      type: MetaPropertyType.String
                    }
                  ],
                  [
                    "musicgen-small",
                    { value: "text-to-music", type: MetaPropertyType.String }
                  ]
                ]
              }}
            />
          </WidgetContainer>
        </WidgetGutter>
      </Content>
    </Container>
  )
}

const { Container, Content, AboutContainer, WidgetGutter, WidgetContainer } = {
  Container: styled("div", {
    base: "flex flex-col grow justify-center items-center border-t-2 border-default"
  }),
  Content: styled("div", {
    base: "flex flex-col gap-8 p-4 items-center"
  }),
  AboutContainer: styled("div", {
    base: "flex flex-col gap-2 grow"
  }),
  WidgetGutter: styled("div", {
    base: "w-full px-4 h-[256px] relative"
  }),
  WidgetContainer: styled(MotionDiv, {
    base: "absolute top-0 left-0 flex gap-4 items-center justify-between *:shrink-0"
  })
}
