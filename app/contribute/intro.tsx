import Flex, { MotionFlex } from "@/components/ui/flex"
import Text from "@/components/ui/text"

export default function Intro() {
  return (
    <MotionFlex col grow id="intro">
      <Flex
        col
        grow
        gap={16}
        height="auto"
        className="max-w-screen-md self-center px-4 py-16"
      >
        <FadeIn>
          <Text size="lg" weight="medium" color="dimmer" multiline>
            <strong className="text-foreground">
              You can&apos;t out-accelerate AI
            </strong>
            . There are <strong className="text-foreground">millions</strong> of
            Large Language Models across the internet, more springing up every
            second.
          </Text>
          <Text size="lg" color="dimmer" multiline>
            Whether open source or closed source, they all flex their{" "}
            <strong className="text-foreground">context length</strong>,{" "}
            <strong className="text-foreground">performance benchmarks</strong>,
            and{" "}
            <strong className="text-foreground">other public statistics</strong>
            .
          </Text>
          <Text size="lg" weight="medium" color="dimmer" multiline>
            We are all familliar with the significant time and effort it takes
            one to collect the right information for just{" "}
            <strong className="text-foreground">one</strong> of these LLMs.
          </Text>
          <Text size="lg" weight="medium" color="dimmer" multiline>
            And then it is forgotten.
          </Text>
        </FadeIn>
        <hr />
        <FadeIn>
          <Text size="lg" weight="medium" color="dimmer" multiline>
            I thought long and hard on how{" "}
            <strong className="text-foreground">LLM Arena</strong> could fix
            this problem and benefit others.
          </Text>
          <Text size="lg" weight="medium" color="dimmer" multiline>
            The answer was an open{" "}
            <strong className="text-foreground">Contribution System</strong>.
          </Text>
        </FadeIn>
      </Flex>
    </MotionFlex>
  )
}

const FadeIn = ({ children }: { children: React.ReactNode }) => {
  return (
    <MotionFlex
      col
      gap={4}
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
      }}
      viewport={{ margin: "0px 0px 200px 0px", amount: 0.5 }}
    >
      {children}
    </MotionFlex>
  )
}
