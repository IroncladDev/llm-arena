import { MotionDiv } from "@/components/motion"
import Text from "@/components/ui/text"
import { styled } from "react-tailwind-variants"

export default function Intro() {
  return (
    <Container id="intro">
      <Content>
        <FadeIn>
          <Text
            size="display"
            color="dimmest"
            weight="semibold"
            multiline
            className="leading-tight"
          >
            Collecting information is{" "}
            <strong className="text-foreground-dimmer">Hard</strong>
          </Text>
        </FadeIn>
        <FadeIn>
          <Text size="h2" color="dimmest" weight="medium" multiline>
            And at the rate AI is accelerating,
          </Text>
        </FadeIn>
        <FadeIn>
          <Text size="h1" color="dimmer" weight="bold" multiline>
            You can&apos;t catch &apos;em all.
          </Text>
        </FadeIn>
        <hr />
        <FadeIn>
          <Text size="lg" weight="medium" color="dimmest" multiline>
            <strong className="text-foreground-dimmer">
              You can&apos;t out-accelerate AI
            </strong>
            . There are{" "}
            <strong className="text-foreground-dimmer">millions</strong> of
            Large Language Models across the internet, more springing up every
            second.
          </Text>
          <Text size="lg" color="dimmest" multiline>
            Whether open source or closed source, they all flex their{" "}
            <strong className="text-foreground-dimmer">context length</strong>,{" "}
            <strong className="text-foreground-dimmer">
              performance benchmarks
            </strong>
            , and{" "}
            <strong className="text-foreground-dimmer">
              other public statistics
            </strong>
            .
          </Text>
          <Text size="lg" weight="medium" color="dimmest" multiline>
            The time and effort it takes one to collect the right information
            for just <strong className="text-foreground-dimmer">one</strong> of
            these LLMs.
          </Text>
          <Text size="lg" weight="medium" color="dimmest" multiline>
            And then it is forgotten.
          </Text>
        </FadeIn>
        <hr />
        <FadeIn>
          <Text size="lg" weight="medium" color="dimmest" multiline>
            I thought long and hard on how{" "}
            <strong className="text-foreground-dimmer">AI to AI</strong> could
            fix this problem and benefit others.
          </Text>
          <Text size="lg" weight="medium" color="dimmest" multiline>
            The answer was an open{" "}
            <strong className="text-foreground-dimmer">
              Contribution System
            </strong>
            .
          </Text>
        </FadeIn>
      </Content>
    </Container>
  )
}

const FadeIn = ({ children }: { children: React.ReactNode }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1
      }}
      viewport={{ margin: "0px 0px 200px 0px", amount: 0.5 }}
      className="flex flex-col gap-4"
    >
      {children}
    </MotionDiv>
  )
}

const Container = styled(MotionDiv, {
  base: "flex flex-col grow"
})

const Content = styled("div", {
  base: "grow max-w-screen-md w-full self-center flex flex-col gap-16 px-4 h-auto py-16"
})
