import Text from "@/components/ui/text"
import { ComparableField } from "@/lib/comparison"
import { useAtom } from "jotai"
import { styled } from "react-tailwind-variants"
import { optionsAtom } from "../state"

export default function StringTable({ field }: { field: ComparableField }) {
  const [{ filter, sort }] = useAtom(optionsAtom)

  const fields = (
    filter.includes("nullFields")
      ? field.values
      : field.values.filter(([, v]) => v !== null)
  ).toSorted((a, b) => {
    switch (sort) {
      case "value-asc":
        return String(a[1]).localeCompare(String(b[1]))
      case "value-desc":
        return String(b[1]).localeCompare(String(a[1]))
      case "alpha-asc":
        return a[0].localeCompare(b[0])
      case "alpha-desc":
        return b[0].localeCompare(a[0])
      default:
        return 0
    }
  })

  return (
    <Container>
      {fields.map(([key, value], i) => (
        <div className="table-row" key={i}>
          <Td>
            <Text color="dimmer">{key}</Text>
          </Td>
          <Td>
            <Text
              color={value === null ? "dimmest" : "dimmer"}
              size={value === null ? "xs" : "sm"}
            >
              {value === null ? "N/A" : value}
            </Text>
          </Td>
        </div>
      ))}
    </Container>
  )
}

const Container = styled("div", {
  base: "w-full table"
})

const Td = styled("div", {
  base: "align-middle h-6 px-2 first:pl-0 last:pr-0 last:w-full relative last:border-l-2 last:border-outline-dimmest table-cell"
})
