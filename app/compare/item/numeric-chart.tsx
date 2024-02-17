import { roundFormatNumber } from "@/components/LargeNumberInput"
import Text from "@/components/ui/text"
import { ComparableField } from "@/lib/comparison"
import { useAtom } from "jotai"
import { styled } from "react-tailwind-variants"
import { optionsAtom } from "../state"

export default function NumericChart({ field }: { field: ComparableField }) {
  const [{ showNullFields, sort }] = useAtom(optionsAtom)

  const rows = (
    showNullFields ? field.values : field.values.filter(([, v]) => v !== null)
  ).toSorted((a, b) => {
    switch (sort) {
      case "value-asc":
        return Number(a[1]) - Number(b[1])
      case "value-desc":
        return Number(b[1]) - Number(a[1])
      case "alpha-asc":
        return a[0].localeCompare(b[0])
      case "alpha-desc":
        return b[0].localeCompare(a[0])
      default:
        return 0
    }
  })

  const greatestValue = Math.max(...rows.map(([, value]) => Number(value)))

  return (
    <div className="w-full table">
      {rows.map(([key, value], i) => (
        <div className="table-row" key={i}>
          <Td className="table-cell">
            <Text color="dimmer">{key}</Text>
          </Td>
          <Td className="table-cell">
            <BarContainer>
              <Bar
                key={i}
                style={{
                  width: value ? `${(Number(value) / greatestValue) * 100}%` : 8
                }}
                isNullValue={value === null}
              />
              <Text size="xs" color="dimmest" multiline>
                {typeof value === "number"
                  ? roundFormatNumber(value)
                  : value === null
                    ? "N/A"
                    : value}
              </Text>
            </BarContainer>
          </Td>
        </div>
      ))}
    </div>
  )
}

const Td = styled("div", {
  base: "align-middle h-6 px-2 first:pl-0 last:pr-0 last:w-full relative last:border-l-2 last:border-outline-dimmest"
})

const Bar = styled("div", {
  base: "h-4 rounded-r-lg my-0.5",
  variants: {
    isNullValue: {
      true: "bg-gradient-to-r from-higher/0 to-higher border-2 border-l-0 border-outline-dimmer rounded-r-md",
      false:
        "bg-gradient-to-r from-accent-dimmest/0 to-accent-dimmest border-accent-dimmer border-2 border-l-0"
    }
  }
})

const BarContainer = styled("div", {
  base: "flex gap-2 items-center w-full absolute top-1/2 transform -translate-y-1/2"
})
