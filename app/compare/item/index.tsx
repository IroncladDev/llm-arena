import Text from "@/components/ui/text";
import { ComparableField } from "@/lib/comparison";
import { snakeToTitleCase } from "@/lib/utils";
import { MetaPropertyType } from "@prisma/client";
import { styled } from "react-tailwind-variants";
import StringTable from "./string-table";
import NumericChart from "./numeric-chart";
import BooleanTable from "./boolean-table";
import { useAtom } from "jotai";
import { optionsAtom } from "../state";

export default function CompareItem({ field }: { field: ComparableField }) {
  const [{ view }] = useAtom(optionsAtom);
  return (
    <Container variant={view}>
      <Text size="lg" weight="bold">
        {snakeToTitleCase(field.name)}
      </Text>
      {field.type === MetaPropertyType.String ? (
        <StringTable field={field} />
      ) : field.type === MetaPropertyType.Number ? (
        <NumericChart field={field} />
      ) : (
        <BooleanTable field={field} />
      )}
    </Container>
  );
}

const Container = styled("div", {
  base: "flex flex-col gap-4 p-6 bg-root/50 rounded-lg border-2 border-outline-dimmest/50 min-w-[360px] w-full max-w-[540px] shadow-xl",
  variants: {
    variant: {
      grid: "",
      list: "self-center",
    },
  },
});
