import { parseAbbrNumber } from "@/lib/numbers"
import { AlertTriangleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function NumberInput({
  value,
  onChange,
  required,
  className
}: {
  value: string
  onChange: (value: { abbr: string; value: number }) => void
  required?: boolean
  className?: string
}) {
  const [inputValue, setInputValue] = useState(value)

  const isValid = parseAbbrNumber(inputValue).success

  useEffect(() => {
    if (isValid) {
      const { value } = parseAbbrNumber(inputValue) as {
        success: true
        value: number
      }

      onChange({ abbr: inputValue, value })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, inputValue])

  return (
    <Container>
      <Input
        type="string"
        value={inputValue}
        onChange={e =>
          setInputValue(e.target.value.replace(/[^0-9.KMBT%]/g, ""))
        }
        className={className}
        required={required}
      />

      {!isValid && (
        <Popover>
          <PopoverTrigger asChild>
            <AlertButton>
              <AlertTriangleIcon className="w-4 h-4" />
            </AlertButton>
          </PopoverTrigger>
          <PopoverContent align="start">
            Invalid abbreviated number value
          </PopoverContent>
        </Popover>
      )}
    </Container>
  )
}

const Container = styled("div", {
  base: "flex basis-[33px] shrink-0 w-full grow relative items-center"
})

const AlertButton = styled("button", {
  base: "absolute right-2 text-amber-500 bg-amber-500/15 hover:bg-amber-500/25 hover:text-amber-400 p-1 rounded-md"
})
