import { roundFormatNumber } from "@/components/LargeNumberInput";
import Text from "@/components/ui/text";
import { ComparableField } from "@/lib/comparison";
import { styled } from "react-tailwind-variants";
import { optionsAtom } from "../state";
import { useAtom } from "jotai";

export default function NumericChart({ field }: { field: ComparableField }) {
  const [{ showNullFields, sort }] = useAtom(optionsAtom);

  const rows = (
    showNullFields ? field.values : field.values.filter(([, v]) => v !== null)
  ).toSorted((a, b) => {
    switch (sort) {
      case "value-asc":
        return Number(a[1]) - Number(b[1]);
      case "value-desc":
        return Number(b[1]) - Number(a[1]);
      case "alpha-asc":
        return a[0].localeCompare(b[0]);
      case "alpha-desc":
        return b[0].localeCompare(a[0]);
      default:
        return 0;
    }
  });

  const greatestValue = Math.max(...rows.map(([, value]) => Number(value)));

  return (
    <Container>
      <colgroup>
        <col style={{ width: "auto" }} />
        <col style={{ width: "100%" }} />
      </colgroup>
      {rows.map(([key, value], i) => (
        <tr key={i}>
          <Td>
            <Text color="dimmer">{key}</Text>
          </Td>
          <Td>
            <BarContainer>
              <Bar
                key={i}
                style={{
                  width: value
                    ? `${Math.max(8, (Number(value) / greatestValue) * 100 - 24)}%`
                    : 8,
                }}
                isNullValue={value === null}
              />
              <Text
                size="xs"
                color="dimmest"
                multiline
                className="w-[24px] overflow-hidden"
              >
                {typeof value === "number"
                  ? roundFormatNumber(value)
                  : value === null
                    ? "N/A"
                    : value}
              </Text>
            </BarContainer>
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

const Bar = styled("div", {
  base: "h-4 rounded-r-lg my-0.5",
  variants: {
    isNullValue: {
      true: "bg-gradient-to-r from-higher/0 to-higher border-2 border-l-0 border-outline-dimmer rounded-r-md",
      false:
        "bg-gradient-to-r from-accent-dimmest/0 to-accent-dimmest border-accent-dimmer border-2 border-l-0",
    },
  },
});

const BarContainer = styled("div", {
  base: "flex gap-2 items-center w-full absolute top-1/2 transform -translate-y-1/2",
});
