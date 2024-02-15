import { styled } from "react-tailwind-variants";
import { toMutualMetadata } from "@/lib/comparison";
import CompareItem from "./item";
import Text from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import Controls from "./controls";
import { useAtom } from "jotai";
import { llmsAtom, optionsAtom, sidebarAtom } from "./state";

export default function Comparison() {
  const [llms] = useAtom(llmsAtom);
  const [, setOpen] = useAtom(sidebarAtom);
  const [{ view }] = useAtom(optionsAtom);

  return (
    <Container>
      <Controls />
      <ContainerOverflow>
        {llms.length > 1 ? (
          <ItemsContainer view={view}>
            {toMutualMetadata(llms).map((x, i) => (
              <CompareItem key={i} field={x} />
            ))}
          </ItemsContainer>
        ) : (
          <EmptyStateContainer>
            <Text size="lg" weight="medium" className="text-center">
              Compare LLMs
            </Text>
            <Text color="dimmer" multiline>
              Select two or more LLMs in the sidebar to compare them
            </Text>
            <Button
              asChild
              onClick={() => {
                setOpen(true);
              }}
            >
              <label htmlFor="llm-sidebar-search">Show me</label>
            </Button>
          </EmptyStateContainer>
        )}
      </ContainerOverflow>
    </Container>
  );
}

const EmptyStateContainer = styled("div", {
  base: "flex flex-col gap-4 p-6 bg-root/50 rounded-lg border-2 border-outline-dimmest/50 min-w-[320px] w-full max-w-[360px] shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
});
const Container = styled("div", {
  base: "grow h-full flex flex-col relative",
});
const ContainerOverflow = styled("div", {
  base: "grow h-full relative",
});

const ItemsContainer = styled("div", {
  base: "flex flex-col absolute inset-0 overflow-y-auto overflow-x-hidden gap-4 p-8 max-sm:p-2 max-sm:gap-2",
  variants: {
    view: {
      grid: "grid grid-cols-[repeat(auto-fit,_minmax(360px,_1fr))] justify-center justify-items-center",
      list: "flex flex-col gap-4 p-4",
    },
  },
});
