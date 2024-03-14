import Text from "@/components/ui/text"
import { InfoIcon } from "lucide-react"
import { styled } from "react-tailwind-variants"
import Header from "./Header"

export default function ErrorState({ error }: { error: string }) {
  return (
    <ContentContainer>
      <Header className="justify-end" />
      <ErrorContainer>
        <InfoIcon className="w-8 h-8 text-foreground-dimmest" />
        <Text size="lg" weight="medium">
          An Error Occurred
        </Text>
        <Text size="sm" color="dimmer">
          {error}
        </Text>
      </ErrorContainer>
    </ContentContainer>
  )
}

const { ErrorContainer, ContentContainer } = {
  ErrorContainer: styled("div", {
    base: "flex items-center justify-center grow w-full h-full flex-col gap-4"
  }),
  ContentContainer: styled("div", {
    base: "flex flex-col grow h-full"
  })
}
