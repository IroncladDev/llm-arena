import LargeNumberInput from "@/components/LargeNumberInput"
import { Button } from "@/components/ui/button"
import { Input as InputComponent } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import Text from "@/components/ui/text"
import { MetaProperty, MetaPropertyType } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useCombobox } from "downshift"
import { XIcon } from "lucide-react"
import { useMemo, useRef } from "react"
import { styled } from "react-tailwind-variants"
import { MetaField } from "../content"

export function MetaFieldRow({
  onChange,
  onDelete,
  metadata,
  field: { value, name, type, property }
}: {
  onChange: (args: Partial<MetaField>) => void
  onDelete: () => void
  metadata: Array<MetaField>
  field: MetaField
}) {
  const valueRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLButtonElement>(null)
  const selectValueRef = useRef<HTMLButtonElement>(null)

  const { data: results } = useQuery<Array<MetaProperty>>({
    queryKey: ["metadataProperties", name],
    queryFn: async () => {
      const res = await fetch(
        "/api/meta-search?query=" + encodeURIComponent(name)
      )
      return await res.json()
    }
  })

  const items = useMemo(() => {
    const customResult: MetaProperty = {
      id: 0,
      name,
      type,
      useCount: 0,
      createdAt: new Date()
    }

    const filteredResults = results?.filter(
      x => !metadata.some(y => y.property?.id === x.id)
    )

    if (filteredResults && name.length > 2) {
      if (filteredResults.some(r => r.name === name)) return filteredResults

      if (property?.name === name) {
        return filteredResults
      } else {
        return [...filteredResults, customResult]
      }
    } else if (filteredResults) {
      return filteredResults
    } else if (name.length > 2) {
      return [customResult]
    }
    return []
  }, [results, name, metadata, property, type])

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    items,
    defaultHighlightedIndex: 0,
    inputValue: name,
    onInputValueChange: ({ inputValue }) => {
      console.log(inputValue)
      onChange({
        name: (inputValue || "")
          .toLowerCase()
          .replace(/[\s-]+/g, "_")
          .replace(/[^\w_]|_/g, match => (match === "_" ? "_" : ""))
          .replace(/_+/g, "_")
      })
    },
    itemToString: item => (item ? item.name : ""),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        if (selectedItem.id === 0) {
          onChange({
            name,
            type: selectedItem.type,
            property: null
          })
          selectRef.current?.focus()
        } else {
          onChange({
            name: selectedItem.name,
            type: selectedItem.type,
            property: selectedItem
          })
          if (selectedItem.type === MetaPropertyType.Boolean) {
            selectValueRef.current?.focus()
          } else {
            valueRef.current?.focus()
          }
        }
      }
    }
  })

  return (
    <MetaFieldContainer>
      <Input
        {...getInputProps({ value: name })}
        placeholder="key_name"
        required
      />
      <DownshiftPopover hidden={!isOpen}>
        <ItemsContainer visible={items?.length > 0} {...getMenuProps()}>
          {items.map((item, index) => (
            <Item
              key={index}
              highlighted={highlightedIndex === index}
              {...getItemProps({ item, index })}
            >
              {item.id === 0 ? (
                <Text size="sm">Create &quot;{item.name}&quot;</Text>
              ) : (
                <>
                  <Text size="sm">{item.name}</Text>
                  <Text color="dimmer" size="sm">
                    {item.type}
                  </Text>
                  <Text color="dimmest" size="sm">
                    +{item.useCount}
                  </Text>
                </>
              )}
            </Item>
          ))}
        </ItemsContainer>

        <EmptyContainer visible={items?.length === 0}>
          <Text color="dimmer">No results.</Text>
        </EmptyContainer>
      </DownshiftPopover>
      <Select
        value={property ? property.type : type}
        disabled={!!property}
        onValueChange={(v: MetaPropertyType) => {
          if (property) return

          onChange({
            type: v,
            value:
              v === MetaPropertyType.Boolean
                ? Boolean(value)
                : v === MetaPropertyType.Number
                  ? Number(value) || 0
                  : String(value)
          })
        }}
      >
        <Trigger ref={selectRef}>
          <SelectValue placeholder="type" />
        </Trigger>
        <SelectContent>
          <SelectItem value={MetaPropertyType.String}>String</SelectItem>
          <SelectItem value={MetaPropertyType.Number}>Number</SelectItem>
          <SelectItem value={MetaPropertyType.Boolean}>Boolean</SelectItem>
        </SelectContent>
      </Select>
      {type === MetaPropertyType.Boolean ? (
        <Select
          value={value ? "true" : "false"}
          onValueChange={value =>
            onChange({ value: value === "true" ? true : false })
          }
          required
        >
          <Trigger ref={selectValueRef}>
            <SelectValue placeholder="true" />
          </Trigger>
          <SelectContent>
            <SelectItem value="true">true</SelectItem>
            <SelectItem value="false">false</SelectItem>
          </SelectContent>
        </Select>
      ) : type === MetaPropertyType.String ? (
        <Input
          value={String(value)}
          ref={valueRef}
          onChange={e =>
            onChange({
              value: e.target.value
            })
          }
          placeholder="value"
          required
        />
      ) : (
        <LargeNumberInput
          value={Number(value)}
          onChange={v => onChange({ value: v })}
          required
          className="border rounded-none grow shrink-0 basis-0 w-full"
        />
      )}
      <Button
        className="border border-outline-dimmest rounded-none h-full"
        size="icon"
        type="button"
        onClick={onDelete}
      >
        <XIcon className="w-4 h-4 text-foreground-dimmer" />
      </Button>
    </MetaFieldContainer>
  )
}

const MetaFieldContainer = styled("div", {
  base: "flex items-center w-full relative"
})

const Trigger = styled(SelectTrigger, {
  base: "grow shrink-0 basis-0 rounded-none border"
})

const Input = styled(InputComponent, {
  base: "grow shrink-0 basis-0 rounded-none border"
})

const DownshiftPopover = styled("div", {
  base: "w-full max-w-xs rounded-lg border-2 border-outline-dimmer absolute top-12 left-0 bg-default z-10 shadow-lg"
})

const EmptyContainer = styled("div", {
  base: "gap-2 p-2 items-center justify-center hidden",
  variants: {
    visible: {
      true: "flex"
    }
  }
})

const ItemsContainer = styled("ul", {
  base: "flex-col hidden",
  variants: {
    visible: {
      true: "flex"
    }
  }
})

const Item = styled("li", {
  base: "flex gap-2 justify-between px-2 py-1 first:rounded-t-md last:rounded-b-md",
  variants: {
    highlighted: {
      true: "bg-higher"
    }
  }
})
