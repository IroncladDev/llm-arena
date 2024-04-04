import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Flex from "@/components/ui/flex"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack
} from "@/components/ui/slider"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { toPng } from "html-to-image"
import {
  ArrowDownToLineIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  EyeIcon,
  Link2Icon,
  PencilIcon,
  ShareIcon,
  XIcon,
  icons
} from "lucide-react"
import { createElement, useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import { useURLState } from "./state"
import {
  FilterEnum,
  ModeEnum,
  ThemeEnum,
  ViewEnum,
  filterData,
  themeData,
  viewData
} from "./types"

export default function Sidebar({
  onOpenChange,
  containerRef,
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarContainer> & {
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  containerRef: React.RefObject<HTMLDivElement>
}) {
  const {
    view,
    filters,
    set,
    setFilterValue,
    theme,
    padding,
    spacing,
    ommitted,
    setOmmittedField
  } = useURLState()

  const [hasActed, setHasActed] = useState(false)

  useEffect(() => {
    if (hasActed) {
      setTimeout(() => setHasActed(false), 3000)
    }
  }, [hasActed])

  const handleCopy = async () => {
    if (!containerRef.current) return

    try {
      const dataUrl = await toPng(containerRef.current)

      const response = await fetch(dataUrl)
      const blob = await response.blob()

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob
        })
      ])

      setHasActed(true)
    } catch (error) {
      console.log(error)
      alert("Failed to copy image to clipboard")
    }
  }

  const handleDownload = async () => {
    if (!containerRef.current) return

    try {
      const dataUrl = await toPng(containerRef.current)
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = "image.png"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setHasActed(true)
    } catch (error) {
      console.log(error)
      alert("Failed to save image")
    }
  }

  return (
    <SidebarContainer {...props}>
      <Flex gap={4} align="center" justify="between">
        <Text weight="medium" size="lg">
          Edit
        </Text>
        <Flex gap={2} align="center">
          <Button
            onClick={() => set({ mode: ModeEnum.view })}
            variant="elevated"
            size="sm"
          >
            Enter View Mode
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => onOpenChange(false)}
            className="md:hidden"
            variant="elevated"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </Flex>
      </Flex>
      <Flex col gap={1}>
        <Text asChild weight="medium" color="dimmer">
          <label>View</label>
        </Text>
        <Select value={view} onValueChange={v => set({ view: v as ViewEnum })}>
          <SelectTrigger
            id="view-select-trigger"
            elevated
            aria-label="Select View type"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent elevated>
            {Object.entries(viewData).map(([key, option]) => (
              <SelectItem key={key} value={key}>
                <Flex gap={2} align="center">
                  {createElement(icons[option.icon], {
                    className: "w-4 h-4"
                  })}
                  <Text>{option.label}</Text>
                </Flex>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Flex>
      <Flex col gap={1}>
        <Text asChild weight="medium" color="dimmer">
          <label>Filter</label>
        </Text>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Filter"
              className="justify-between w-full"
              variant="elevated"
            >
              <Text>
                {filters.length === 0
                  ? "No filters"
                  : filters.length === 1
                    ? filterData[filters[0]].label
                    : `${filters.length} filters`}
              </Text>
              <ChevronDownIcon className="w-4 h-4 text-foreground-dimmer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent elevated side="bottom" align="start">
            {Object.entries(filterData).map(([key, option], i) => (
              <DropdownMenuCheckboxItem
                checked={filters.includes(key as FilterEnum)}
                onSelect={() =>
                  setFilterValue(
                    key as FilterEnum,
                    !filters.includes(key as FilterEnum)
                  )
                }
                key={i}
                inset
              >
                <Text>{option.label}</Text>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
      <Flex col gap={1}>
        <Text asChild weight="medium" color="dimmer">
          <label htmlFor="theme-select-trigger">Theme</label>
        </Text>
        <Select
          value={theme}
          onValueChange={v => set({ theme: v as ThemeEnum })}
        >
          <SelectTrigger
            id="theme-select-trigger"
            elevated
            aria-label="Select theme"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent elevated>
            {Object.entries(themeData).map(([key, option]) => (
              <SelectItem key={key} value={key}>
                <Flex gap={2} align="center">
                  <ThemeColor
                    style={{ background: gr.linear(0, ...option.foreground) }}
                  />
                  <Text>{option.label}</Text>
                </Flex>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Flex>
      <Flex col gap={1}>
        <Flex gap={2} align="center">
          <Text weight="medium" color="dimmer">
            Padding
          </Text>
          <Text color="dimmest" size="xs" className="shrink-0">
            {padding}
          </Text>
        </Flex>
        <Flex gap={2} align="center">
          <Text color="dimmest" size="xs" className="shrink-0">
            8
          </Text>
          <Slider
            defaultValue={[Number(padding)]}
            max={128}
            min={8}
            step={1}
            onValueChange={value => set({ padding: String(value[0]) }, true)}
          >
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb aria-label="Adjust padding" />
          </Slider>
          <Text color="dimmest" size="xs" className="shrink-0">
            128
          </Text>
        </Flex>
      </Flex>
      <Flex col gap={1}>
        <Flex gap={2} align="center">
          <Text weight="medium" color="dimmer">
            Spacing
          </Text>
          <Text color="dimmest" size="xs" className="shrink-0">
            {spacing}
          </Text>
        </Flex>
        <Flex gap={2} align="center">
          <Text color="dimmest" size="xs" className="shrink-0">
            8
          </Text>
          <Slider
            defaultValue={[Number(spacing)]}
            max={64}
            min={8}
            step={1}
            onValueChange={value => set({ spacing: String(value[0]) }, true)}
          >
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb aria-label="Adjust spacing" />
          </Slider>
          <Text color="dimmest" size="xs" className="shrink-0">
            64
          </Text>
        </Flex>
      </Flex>
      {ommitted.length > 0 && (
        <Flex col gap={1}>
          <Text weight="medium" color="dimmer">
            Ommitted Fields
          </Text>
          <Flex gap={2} wrap>
            {ommitted.map(name => (
              <OmmittedField
                key={name}
                onClick={() => setOmmittedField(name, false)}
              >
                <Text size="xs" color="dimmer">
                  {name}
                </Text>
                <XIcon className="w-4 h-4 text-inherit" />
              </OmmittedField>
            ))}
          </Flex>
        </Flex>
      )}
      <Flex col grow gap={4} justify="end">
        <Flex col gap={2}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="elevated">
                <Text>Share</Text>
                {hasActed ? (
                  <CheckIcon className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ShareIcon className="w-4 h-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent elevated side="top" collisionPadding={8}>
              <ShareOption onClick={handleDownload}>
                <ArrowDownToLineIcon className="w-4 h-4" />
                <Text color="inherit">Download Image</Text>
              </ShareOption>
              <ShareOption onSelect={handleCopy}>
                <CopyIcon className="w-4 h-4" />
                <Text color="inherit">Copy Image</Text>
              </ShareOption>
              <ShareOption
                onSelect={() => {
                  const url = new URL(window.location.href)

                  url.searchParams.set("mode", ModeEnum.view)

                  navigator.clipboard.writeText(url.toString()).then(() => {
                    setHasActed(true)
                  })
                }}
              >
                <Link2Icon className="w-4 h-4" />
                <Text color="inherit">Copy Link</Text>
              </ShareOption>
              <ShareOption
                onSelect={() => {
                  const url = new URL(window.location.href)

                  url.searchParams.set("mode", ModeEnum.edit)

                  navigator.clipboard.writeText(url.toString()).then(() => {
                    setHasActed(true)
                  })
                }}
              >
                <PencilIcon className="w-4 h-4" />
                <Text color="inherit">Copy Link to Edit</Text>
              </ShareOption>
            </DropdownMenuContent>
          </DropdownMenu>
        </Flex>
      </Flex>
    </SidebarContainer>
  )
}

const { SidebarContainer, ThemeColor, ShareOption, OmmittedField } = {
  SidebarContainer: styled("div", {
    base: "flex flex-col gap-4 p-4 bg-default border-r-2 border-outline-dimmer max-md:border-r-0 md:max-w-[320px] max-w-screen max-md:absolute max-md:inset-0 h-screen grow z-10",
    variants: {
      open: {
        true: "",
        false: "max-md:hidden"
      }
    }
  }),
  ThemeColor: styled("div", {
    base: "w-4 h-4 rounded-full shrink-0"
  }),
  ShareOption: styled(DropdownMenuItem, {
    base: "flex gap-2 items-center pl-2"
  }),
  OmmittedField: styled("button", {
    base: "flex gap-1 items-center border border-outline-dimmer rounded-md px-2 py-1 hover:border-accent-dimmer transition-colors text-foreground-dimmer hover:text-accent"
  })
}
