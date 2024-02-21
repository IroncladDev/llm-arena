import { MotionDiv } from "@/components/motion"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import { MetaPropertyType } from "@prisma/client"
import { MotionValue, useSpring, useTransform } from "framer-motion"
import Link from "next/link"
import { styled } from "react-tailwind-variants"
import CompareItem from "../compare/item"

export default function About({
  percentage
}: {
  percentage: MotionValue<number>
}) {
  const smoothPercentage = useSpring(percentage, { mass: 0.05 })
  const sheet0X = useTransform(smoothPercentage, [0, 0.33], ["0vw", "-100vw"], {
    clamp: true
  })
  const sheet1X = useTransform(smoothPercentage, [0, 0.33], ["100vw", "0vw"], {
    clamp: true
  })
  const sheet1Y = useTransform(
    smoothPercentage,
    [0.33, 0.66],
    ["0vh", "100vh"],
    {
      clamp: true
    }
  )
  const sheet2X = useTransform(smoothPercentage, [0.67, 1], ["0vw", "100vw"], {
    clamp: true
  })
  const sheet2Y = useTransform(
    smoothPercentage,
    [0.33, 0.66],
    ["-100vh", "0vh"],
    {
      clamp: true
    }
  )
  const sheet3Y = useTransform(smoothPercentage, [0.67, 1], ["-100vw", "0vw"], {
    clamp: true
  })
  const slideWidgetsX = useTransform(
    smoothPercentage,
    [0, 0.33],
    ["0", "-100%"],
    { clamp: false }
  )

  return (
    <Container>
      <Sheet
        style={{
          translateX: sheet0X,
          backgroundImage: gr.linear(
            0,
            tokens.colors.red[500] + "25",
            tokens.colors.red[500] + "15 20%",
            "transparent 70%",
            "transparent"
          )
        }}
        className="outline-t-0"
      >
        <Content>
          <Text size="h1" weight="bold" color="dimmer" center>
            About
          </Text>
          <Text multiline paragraph color="dimmest" size="lg">
            <strong className="text-foreground-dimmer">AI to AI</strong> is a
            simple project that allows you to compare LLMs, side-by-side.
          </Text>
          <Text multiline paragraph color="dimmest" size="lg">
            <strong className="text-foreground-dimmer">Mutual metadata</strong>{" "}
            shared between two or more selected models get displayed together in{" "}
            <strong className="text-foreground-dimmer">widgets</strong>.
          </Text>
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
                    [
                      "PaLM 8b",
                      { value: 0.036, type: MetaPropertyType.Number }
                    ],
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
                    [
                      "llama-2-7b",
                      { value: 4000, type: MetaPropertyType.Number }
                    ]
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
      </Sheet>
      <Sheet
        style={{
          translateX: sheet1X,
          translateY: sheet1Y,
          backgroundImage: gr.linear(
            -90,
            tokens.colors.red[500] + "25",
            tokens.colors.red[500] + "15 20%",
            "transparent 70%",
            "transparent"
          )
        }}
      >
        <Content>
          <Text
            size="h1"
            weight="bold"
            color="dimmer"
            center
            className="leading-tight"
          >
            Origin
          </Text>
          <Text multiline paragraph color="dimmest" size="lg">
            On{" "}
            <strong className="text-foreground-dimmer">
              December 11th, 2023
            </strong>
            ,{" "}
            <a
              href="https://x.com/amasad"
              target="_blank"
              className="text-accent-dimmer"
            >
              Amjad Masad
            </a>{" "}
            asked me to build an app to compare LLMs, somewhat like AKC&apos;s{" "}
            <a
              href="https://www.akc.org/compare-breeds/"
              target="_blank"
              className="text-accent-dimmer"
            >
              dog breed comparison
            </a>{" "}
            tool.
          </Text>
          <Text multiline paragraph color="dimmest" size="lg">
            I decided to do something similar to{" "}
            <a
              href="https://x.com/CommunityNotes"
              target="_blank"
              className="text-accent-dimmer"
            >
              Community Notes
            </a>{" "}
            where sources and approvals were required to upload an LLM.
          </Text>
          <Text multiline paragraph color="dimmest" size="lg">
            It was time to build.
          </Text>
        </Content>
      </Sheet>
      <Sheet
        style={{
          translateY: sheet2Y,
          translateX: sheet2X,
          backgroundImage: gr.linear(
            180,
            tokens.colors.red[500] + "25",
            tokens.colors.red[500] + "15 20%",
            "transparent 70%",
            "transparent"
          )
        }}
      >
        <Content>
          <Text
            size="h1"
            weight="bold"
            color="dimmer"
            center
            className="leading-tight"
          >
            Challenges
          </Text>
          <Text multiline paragraph color="dimmest" size="base">
            I spent countless hours brainstorming and two months of 64-hour work
            weeks getting this project across the line.
          </Text>
          <Text multiline paragraph color="dimmest" size="base">
            My newfound knowledge in Next.js Server Actions and Hydration errors
            is priceless.
          </Text>
          <Text multiline paragraph color="dimmest" size="base">
            The project consisted of two major parts: The{" "}
            <strong className="text-foreground-dimmer">
              contribution system
            </strong>{" "}
            and the{" "}
            <strong className="text-foreground-dimmer">
              comparison system
            </strong>
            .
          </Text>
          <Text multiline paragraph color="dimmest" size="base">
            Designing and implementing the comparison system was the biggest
            challenge. A text-generation and text-to-video model wouldn&apos;t
            have much in common.
          </Text>
          <Text multiline paragraph color="dimmest" size="base">
            The contribution/voting system was tedious to build, but wasn&apos;t
            nearly as difficult.
          </Text>
        </Content>
      </Sheet>
      <Sheet
        style={{
          translateX: sheet3Y,
          backgroundImage: gr.linear(
            90,
            tokens.colors.red[500] + "25",
            tokens.colors.red[500] + "15 20%",
            "transparent 70%",
            "transparent"
          )
        }}
      >
        <Content>
          <Text
            size="h1"
            weight="bold"
            color="dimmer"
            center
            className="leading-tight"
          >
            Final Notes
          </Text>
          <Text multiline paragraph color="dimmest" size="lg">
            Thank you for taking your time to read about my project. If
            you&apos;d like to contribute and upload LLMs to this website, check
            out the{" "}
            <Link href="/contribute" className="text-accent-dimmer">
              Contribution Page
            </Link>{" "}
            and apply to join.
          </Text>
          <Text multiline paragraph color="dimmest" size="lg">
            Should you have any questions or feedback, hit me up at{" "}
            <a href="mailto:conner@connerow.dev" className="text-accent-dimmer">
              conner@connerow.dev
            </a>{" "}
            or send me a message on{" "}
            <a
              href="https://x.com/IroncladDev"
              target="_blank"
              className="text-accent-dimmer"
            >
              X/Twitter
            </a>
            .
          </Text>
        </Content>
      </Sheet>
    </Container>
  )
}

const WidgetGutter = styled("div", {
  base: "w-screen overflow-hidden h-[256px] relative"
})

const WidgetContainer = styled(MotionDiv, {
  base: "absolute top-0 left-0 flex gap-4 items-center justify-between *:shrink-0 px-8"
})

const Container = styled(MotionDiv, {
  base: "flex flex-col grow relative"
})

const Content = styled("div", {
  base: "flex flex-col gap-4 grow max-w-screen-md w-full self-center py-8 px-4 items-center justify-center"
})

const Sheet = styled(MotionDiv, {
  base: "flex flex-col gap-4 w-screen h-screen absolute bg-root outline outline-2 outline-outline-dimmest"
})
