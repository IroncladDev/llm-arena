import Text from "@/components/ui/text"
import { styled } from "react-tailwind-variants"
import LLMSearch from "../compare/search"
import { useState } from "react"
import { LLMWithMetadata } from "../compare/state"
import { XIcon } from "lucide-react"
import LLMIcon from "@/components/llm-icon"

export default function Selector() {
  const [llms, setLLMs] = useState<Array<LLMWithMetadata>>([])

  return (
    <Container>
      <Header>
        <Text size="lg" weight="medium">
          Compare LLMs
        </Text>
        <Text color="dimmer">Select two or more LLMs to compare them</Text>
      </Header>
      <LLMSearch llms={llms} setLLMs={setLLMs} placeholder="Find an LLM" />
      <LLMContainer>
        {llms.map(llm => (
          <LLMItem key={llm.id}>
            <IconContainer>
              <LLMIcon llm={llm} />
              <CloseButton>
                <XIcon
                  className="w-4 h-4 text-foreground-dimmest"
                  onClick={() => setLLMs(llms.filter(x => x.id !== llm.id))}
                />
              </CloseButton>
            </IconContainer>
            <SpecsContainer>
              <Text color="dimmer">{llm.name}</Text>
              <Text color="dimmest" size="xs">
                {llm.fields.length} fields
              </Text>
            </SpecsContainer>
          </LLMItem>
        ))}
      </LLMContainer>
    </Container>
  )
}

const {
  Container,
  Header,
  LLMItem,
  LLMContainer,
  IconContainer,
  SpecsContainer,
  CloseButton
} = {
  Container: styled("div", {
    base: "flex flex-col items-center gap-4 p-6 rounded-lg border-2 border-outline-dimmest shadow-lg bg-root/50 max-w-[600px] w-full"
  }),
  Header: styled("div", {
    base: "flex flex-col items-center gap-2"
  }),
  LLMContainer: styled("div", {
    base: "flex flex-wrap items-center justify-center gap-2 w-full"
  }),
  LLMItem: styled("div", {
    base: "flex flex-col rounded-lg border-2 border-outline-dimmer bg-default grow basis-0"
  }),
  IconContainer: styled("div", {
    base: "flex items-center justify-center py-4 bg-root rounded-t-lg relative"
  }),
  SpecsContainer: styled("div", {
    base: "flex flex-col gap-1 items-center w-full rounded-b-lg px-4 py-2"
  }),
  CloseButton: styled("button", {
    base: "absolute top-2 right-2 w-4 h-4"
  })
}
