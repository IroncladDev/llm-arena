import { ComparableField } from "@/lib/comparison";
import { styled } from "react-tailwind-variants";
import Text from "@/components/ui/text";
import { CheckIcon, XIcon } from "lucide-react";
import { optionsAtom } from "../state";
import { useAtom } from "jotai";

export default function BooleanTable({ field }: { field: ComparableField }) {
  const [{ showNullFields, sort }] = useAtom(optionsAtom);

  const fields = (
    showNullFields ? field.values : field.values.filter(([, v]) => v !== null)
  ).toSorted((a, b) => {
    switch (sort) {
      case "value-asc":
        return a[1] && !b[1] ? 1 : !a[1] && b[1] ? -1 : 0;
      case "value-desc":
        return a[1] && !b[1] ? -1 : !a[1] && b[1] ? 1 : 0;
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
            {value === null ? (
              <Text color="dimmest" size="xs">
                N/A
              </Text>
            ) : value ? (
              <CheckIcon className="w-4 h-4 text-accent-dimmer" />
            ) : (
              <XIcon className="w-4 h-4 text-foreground-dimmer" />
            )}
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
