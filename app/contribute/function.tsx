import { MotionDiv } from "@/components/motion"
import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import { MotionValue, useSpring, useTransform } from "framer-motion"
import { styled } from "react-tailwind-variants"

export default function Function({
  percentage,
}: {
  percentage: MotionValue<number>
}) {
  const [ref, box] = useClientRect<HTMLDivElement>()
  const smoothPercentage = useSpring(percentage, { mass: 0.05 })

  const translateX = useTransform(
    smoothPercentage,
    [0, 1],
    ["calc(0px - 0%)", `calc(${box?.width || 768}px - 100%)`],
  )

  return (
    <Flex col grow>
      <Content col grow width="full" gap={8}>
        <Text size="h1" weight="semibold">
          How it works
        </Text>
        <StepContainer ref={ref}>
          <Steps style={{ translateX }}>
            <Step>
              <Text size="h2" weight="semibold">
                1. Fill out Information
              </Text>
              <Text size="lg" color="dimmer" multiline paragraph>
                Provide the model name and metadata in the submission form.
              </Text>
              <Preview
                style={{
                  backgroundImage: gr.merge(
                    gr.linear(0, tokens.colors.root + "85", "transparent"),
                    "url(/images/1-data.png)",
                  ),
                  backgroundColor: tokens.colors.default,
                }}
              />
            </Step>
            <Step>
              <Text size="h2" weight="semibold">
                2. Provide a Source
              </Text>
              <Text size="lg" color="dimmer" multiline paragraph>
                Provide one or more sources so reviewers can verify that the
                information you provided is accurate.
              </Text>
              <Preview
                style={{
                  backgroundImage: gr.merge(
                    gr.linear(0, tokens.colors.root + "85", "transparent"),
                    "url(/images/2-src.png)",
                  ),
                  backgroundColor: tokens.colors.default,
                }}
              />
            </Step>
            <Step>
              <Text size="h2" weight="semibold">
                3. Wait for Approval
              </Text>
              <Text size="lg" color="dimmer" multiline paragraph>
                Other contributors will approve or reject the pending LLM.
              </Text>
              <Preview
                style={{
                  backgroundImage: gr.merge(
                    gr.linear(0, tokens.colors.root + "85", "transparent"),
                    "url(/images/3-approval.png)",
                  ),
                  backgroundColor: tokens.colors.default,
                }}
              />
            </Step>
            <Step>
              <Text size="h2" weight="semibold">
                4. Available for Use
              </Text>
              <Text size="lg" color="dimmer" multiline paragraph>
                Once approved, the model will be available for everyone to use
                for comparison.
              </Text>
              <Preview
                style={{
                  backgroundImage: gr.merge(
                    gr.linear(0, tokens.colors.root + "85", "transparent"),
                    "url(/images/4-comparison.png)",
                  ),
                  backgroundColor: tokens.colors.root,
                }}
              />
            </Step>
          </Steps>
        </StepContainer>
      </Content>
    </Flex>
  )
}

const { Content, StepContainer, Steps, Step, Preview } = {
  Content: styled(Flex, {
    base: "max-w-screen-md self-center py-16 px-4",
  }),
  StepContainer: styled("div", {
    base: "grow relative",
  }),
  Steps: styled(MotionDiv, {
    base: "absolute top-0 left-0 w-auto h-full flex gap-4",
  }),
  Step: styled("div", {
    base: "h-full border-2 border-outline-dimmest rounded-xl p-8 grow min-w-[360px] w-[60vw] max-w-[600px] flex flex-col gap-4",
  }),
  Preview: styled("div", {
    base: "grow bg-center bg-cover bg-contain bg-no-repeat rounded-xl p-2 rounded-lg border border-outline-dimmest",
  }),
}
