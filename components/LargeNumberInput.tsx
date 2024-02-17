import { RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import { Input } from "./ui/input"
import Text from "./ui/text"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

const cycle = {
  "-": 1,
  K: 1000,
  M: 1000000,
  B: 1000000000,
  T: 1000000000000
}

const translation: Record<keyof typeof cycle, string> = {
  "-": "x1",
  K: "x1 Thousand",
  M: "x1 Million",
  B: "x1 Billion",
  T: "x1 Trillion"
}

export function formatNumber(input: number): {
  float: number
  unit: number
  symbol: string
} {
  if (input === 0) return { float: 0, unit: 0, symbol: "-" }

  let unitKeys = Object.keys(cycle) as Array<keyof typeof cycle>
  let unitIndex = 0
  let float = input

  for (let i = unitKeys.length - 1; i >= 0; i--) {
    if (input >= cycle[unitKeys[i]]) {
      float = input / cycle[unitKeys[i]]
      unitIndex = i
      break
    }
  }

  return { float, unit: unitIndex, symbol: unitKeys[unitIndex] }
}

export function roundFormatNumber(input: number): string {
  let { float, symbol } = formatNumber(input)
  return `${float % 1 === 0 ? float : float.toFixed(1)}${symbol === "-" ? "" : symbol}`
}

export default function LargeNumberInput({
  value,
  onChange,
  required,
  className
}: {
  value: number
  onChange: (value: number) => void
  required?: boolean
  className?: string
}) {
  const initialValue = formatNumber(value)

  const [inputValue, setInputValue] = useState(String(initialValue.float))
  const [unit, setUnit] = useState(initialValue.unit)

  const cycleKey = Object.keys(cycle)[unit] as keyof typeof cycle
  const cycleValue = cycle[cycleKey]

  useEffect(() => {
    onChange((Number(inputValue) || 0) * cycleValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, cycleValue])

  return (
    <Container>
      <Input
        type="number"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault()
            let updatedValue = formatNumber(
              (Number(inputValue) || 0) * cycleValue
            )
            setInputValue(String(updatedValue.float))
            setUnit(updatedValue.unit)
          }
        }}
        className={className}
        required={required}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <SwitchButton
            type="button"
            onClick={() => {
              setUnit((unit + 1) % Object.keys(cycle).length)
              onChange(Number(inputValue) * cycleValue)
            }}
          >
            <Text size="sm">{cycleKey}</Text>
            <RefreshCw size={12} className="text-foreground-dimmer" />
          </SwitchButton>
        </TooltipTrigger>
        <TooltipContent side="right">
          <Text size="sm">{translation[cycleKey]}</Text>
        </TooltipContent>
      </Tooltip>
    </Container>
  )
}

const Container = styled("div", {
  base: "flex basis-[33px] shrink-0 w-full grow relative items-center"
})

const SwitchButton = styled("button", {
  base: "absolute right-2 rounded-md text-foreground bg-higher hover:bg-highest cursor-pointer px-2 py-1 flex items-center gap-1"
})
