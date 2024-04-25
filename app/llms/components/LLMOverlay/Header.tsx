import { Button } from "@/components/ui/button"
import Flex from "@/components/ui/flex"
import { SheetClose } from "@/components/ui/sheet"
import { XIcon } from "lucide-react"

export default function Header({
  children = null,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Flex align="center" gap={4} className={className}>
      {children}
      <SheetClose asChild>
        <Button size="icon" className="outline-none shrink-0">
          <XIcon className="w-4 h-4" />
        </Button>
      </SheetClose>
    </Flex>
  )
}
