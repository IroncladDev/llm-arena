import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"
import { InfoIcon } from "lucide-react"
import Header from "./Header"

export default function ErrorState({ error }: { error: string }) {
  return (
    <Flex col grow height="full">
      <Header className="justify-end" />
      <Flex col center grow width="full" height="full" gap={4}>
        <InfoIcon className="w-8 h-8 text-foreground-dimmest" />
        <Text size="lg" weight="medium">
          An Error Occurred
        </Text>
        <Text size="sm" color="dimmer">
          {error}
        </Text>
      </Flex>
    </Flex>
  )
}
