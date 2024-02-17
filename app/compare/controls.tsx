import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Text from "@/components/ui/text"
import { useAtom } from "jotai"
import { GridIcon, ListIcon, MenuIcon } from "lucide-react"
import { styled } from "react-tailwind-variants"
import { FieldSort, optionsAtom, sidebarAtom } from "./state"

const sortLabels: Record<FieldSort, string> = {
  "alpha-asc": "Alphabetical (A-Z)",
  "alpha-desc": "Alphabetical (Z-A)",
  "value-asc": "Value (Low-High)",
  "value-desc": "Value (High-Low)",
  default: "Unsorted"
}

export default function Controls() {
  const [open, setOpen] = useAtom(sidebarAtom)
  const [{ view, sort, showNullFields }, setOptions] = useAtom(optionsAtom)

  return (
    <ControlsContainer>
      <SidebarButton size="icon" onClick={() => setOpen(!open)}>
        <MenuIcon className="w-4 h-4 text-foreground-dimmer" />
      </SidebarButton>
      <ControlItem>
        <Text weight="medium" color="dimmest">
          View
        </Text>
        <OptionsContainer>
          <OptionButton
            selected={view === "grid"}
            onClick={() => setOptions(op => ({ ...op, view: "grid" }))}
          >
            <GridIcon size={16} />
            <Text size="xs" color="inherit">
              Grid
            </Text>
          </OptionButton>
          <OptionButton
            selected={view === "list"}
            onClick={() => setOptions(op => ({ ...op, view: "list" }))}
          >
            <ListIcon size={16} />
            <Text size="xs" color="inherit">
              List
            </Text>
          </OptionButton>
        </OptionsContainer>
      </ControlItem>
      <ControlItem>
        <Text weight="medium" color="dimmest">
          Show null fields
        </Text>
        <Switch
          checked={showNullFields}
          onCheckedChange={checked =>
            setOptions(op => ({ ...op, showNullFields: checked }))
          }
        />
      </ControlItem>
      <ControlItem>
        <Text weight="medium" color="dimmest">
          Sort
        </Text>
        <Select
          value={sort}
          onValueChange={value =>
            setOptions(op => ({ ...op, sort: value as FieldSort }))
          }
        >
          <SelectTrigger small>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sortLabels).map(([key, label], i) => (
              <SelectItem value={key} key={i}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ControlItem>
    </ControlsContainer>
  )
}

const ControlsContainer = styled("div", {
  base: "flex gap-8 max-sm:gap-4 p-4 max-sm:overflow-x-auto max-w-screen max-sm:w-screen bg-root/50 border-b-2 border-outline-dimmest sm:justify-center"
})

const SidebarButton = styled(Button, {
  base: "md:hidden shrink-0 self-center"
})

const ControlItem = styled("div", {
  base: "flex flex-col gap-1 h-full justify-between"
})

const OptionsContainer = styled("div", {
  base: "flex gap-2"
})

const OptionButton = styled("button", {
  base: "py-1.5 px-2 rounded-md hover:bg-highest flex gap-1 items-center",
  variants: {
    selected: {
      true: "bg-higher text-foreground",
      false: "text-foreground-dimmer"
    }
  }
})
