import { ComparableField } from "@/lib/comparison";
import { styled } from "react-tailwind-variants";
import Text from "@/components/ui/text";
import { optionsAtom } from "../state";
import { useAtom } from "jotai";

export default function StringTable({ field }: { field: ComparableField }) {
  const [{ showNullFields, sort }] = useAtom(optionsAtom);

  const fields = (
    showNullFields ? field.values : field.values.filter(([, v]) => v !== null)
  ).toSorted((a, b) => {
    switch (sort) {
      case "value-asc":
        return String(a[1]).localeCompare(String(b[1]));
      case "value-desc":
        return String(b[1]).localeCompare(String(a[1]));
      case "alpha-asc":
        return a[0].localeCompare(b[0]);
      case "alpha-desc":
        return b[0].localeCompare(a[0]);
      default:
        return 0;
    }
  });

  return (
    <Container>
      <colgroup>
        <col style={{ width: "auto" }} />
        <col style={{ width: "100%" }} />
      </colgroup>
      {fields.map(([key, value], i) => (
        <tr key={i}>
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
        </tr>
      ))}
    </Container>
  );
}

const Container = styled("table", {
  base: "w-full",
});

const Td = styled("td", {
  base: "align-middle h-6 px-2 first:pl-0 last:pr-0 relative last:border-l-2 last:border-outline-dimmest",
});
