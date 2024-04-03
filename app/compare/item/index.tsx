import { MotionDiv } from "@/components/motion"
import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import { ComparableFieldGroup } from "@/lib/comparison"
import { snakeToTitleCase } from "@/lib/utils"
import { MetaPropertyType } from "@prisma/client"
import { MoveHorizontalIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { useURLState } from "../state"
import { ModeEnum, themeData } from "../types"
import BooleanTable from "./boolean-table"
import NumericChart from "./numeric-chart"
import StringTable from "./string-table"

export default function CompareItem({
  field,
  rect
}: {
  field: ComparableFieldGroup
  rect?: DOMRect
}) {
  const [customWidth, setCustomWidth] = useState<number | null>(null)
  const [ref, box] = useClientRect<HTMLDivElement>()

  const { view, theme, setOmmittedField, mode, padding } = useURLState()

  const {
    foreground: [, fg2]
  } = themeData[theme]

  console.log(rect)

  return (
    <Container
      variant={view}
      style={{
        maxWidth: rect ? rect.width - padding * 2 : undefined,
        borderColor: fg2 + "65",
        ...(typeof customWidth === "number"
          ? {
              flexGrow: 0,
              flexShrink: 0,
              width: customWidth,
              flexBasis: customWidth
            }
          : {})
      }}
      ref={ref}
    >
      <Text size="base" weight="semibold">
        {snakeToTitleCase(field.name)}
      </Text>
      {field.type === MetaPropertyType.String ? (
        <StringTable field={field} />
      ) : field.type === MetaPropertyType.Number ? (
        <NumericChart field={field} />
      ) : (
        <BooleanTable field={field} />
      )}
      {mode === ModeEnum.edit && (
        <OptionButton onClick={() => setOmmittedField(field.name, true)}>
          <XIcon className="w-4 h-4 text-foreground-dimmest" />
        </OptionButton>
      )}
      {mode === ModeEnum.edit && typeof customWidth === "number" && (
        <OptionButton onClick={() => setCustomWidth(null)} className="right-8">
          <MoveHorizontalIcon className="w-4 h-4 text-foreground-dimmest" />
        </OptionButton>
      )}
      <DragHandle
        drag="x"
        className="noTransform"
        dragMomentum={false}
        onDrag={(_, info) => {
          if (!box) return

          setCustomWidth(Math.round(info.point.x - box.left))
        }}
      >
        <DragHandleBar />
      </DragHandle>
    </Container>
  )
}

const { Container, OptionButton, DragHandle, DragHandleBar } = {
  Container: styled("div", {
    base: "flex flex-col gap-2 p-4 bg-root/50 rounded-lg border-2 min-w-[300px] w-full grow basis-0 shadow-xl relative group/item",
    variants: {
      variant: {
        grid: "",
        list: "self-center"
      }
    }
  }),
  OptionButton: styled("button", {
    base: "absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity"
  }),
  DragHandle: styled(MotionDiv, {
    base: "flex items-center justify-center w-2 h-full absolute top-0 bottom-0 opacity-0 group-hover/item:opacity-100 transition-opacity right-0"
  }),
  DragHandleBar: styled("div", {
    base: "bg-foreground-dimmest/50 rounded-full w-[2px] h-12 cursor-ew-resize active:bg-foreground-dimmest/25"
  })
}
