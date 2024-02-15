import { styled } from "react-tailwind-variants";
import { LLMWithMetadata } from "./state";
import { useCombobox } from "downshift";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import Text from "@/components/ui/text";

export default function LLMSearch({
  llms,
  setLLMs,
  onSelectedItemChange = () => {},
  ...props
}: {
  llms: Array<LLMWithMetadata>;
  setLLMs: (llms: Array<LLMWithMetadata>) => void;
  onSelectedItemChange?: (item: LLMWithMetadata) => void;
} & Omit<React.ComponentProps<typeof Input>, "size">) {
  const [search, setSearch] = useState("");

  const { data: results } = useQuery<Array<LLMWithMetadata>>({
    queryKey: ["llmCompareSearch", search],
    queryFn: async () => {
      const res = await fetch(
        "/compare/search?query=" + encodeURIComponent(search),
      );
      return await res.json();
    },
  });

  const items = results?.filter((x) => !llms.some((l) => l.id === x.id)) || [];

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    setInputValue,
    reset,
  } = useCombobox({
    items,
    defaultHighlightedIndex: 0,
    onInputValueChange: ({ inputValue }) => {
      if (typeof inputValue === "string") setSearch(inputValue);
    },
    itemToString: (item) => (item ? item.name : ""),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onSelectedItemChange(selectedItem);
        setLLMs([...llms, selectedItem]);
        setInputValue("");
        reset();
      }
    },
  });

  return (
    <Search>
      <Input {...getInputProps(props)} />
      <DownshiftPopover hidden={!isOpen}>
        <ItemsContainer visible={items.length > 0} {...getMenuProps()}>
          {items.map((item, index) => (
            <Item
              key={index}
              highlighted={highlightedIndex === index}
              {...getItemProps({ item, index })}
            >
              <Text color="dimmer">{item.name}</Text>
            </Item>
          ))}
        </ItemsContainer>

        {items.length === 0 && (
          <EmptyState>
            <Text color="dimmer">No results</Text>
          </EmptyState>
        )}
      </DownshiftPopover>
    </Search>
  );
}

const Search = styled("div", {
  base: "flex relative basis-0 w-full min-w-0 grow",
});

const DownshiftPopover = styled("div", {
  base: "w-full max-w-xs rounded-lg border-2 border-outline-dimmer/75 absolute top-12 left-0 bg-default z-10 shadow-lg",
});

const ItemsContainer = styled("ul", {
  base: "flex-col hidden",
  variants: {
    visible: {
      true: "flex",
    },
  },
});

const Item = styled("li", {
  base: "flex gap-2 justify-between px-2 py-1 first:rounded-t-md last:rounded-b-md",
  variants: {
    highlighted: {
      true: "bg-higher",
    },
  },
});

const EmptyState = styled("div", {
  base: "flex justify-center items-center p-4",
});
