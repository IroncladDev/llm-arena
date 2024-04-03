"use client"

import { MotionDiv } from "@/components/motion"
import { MotionFlex } from "@/components/ui/flex"
import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import { toMutualMetadata } from "@/lib/comparison"
import gr from "@/lib/gradients"
import { MetaPropertyType } from "@prisma/client"
import { useMotionValue, useSpring } from "framer-motion"
import { GripVerticalIcon } from "lucide-react"
import { Fragment, forwardRef, useEffect } from "react"
import { styled } from "react-tailwind-variants"
import CompareItem from "./item"
import { useURLState } from "./state"
import { FilterEnum, LLMWithMetadata, themeData } from "./types"

const LLMContainer = forwardRef<
  HTMLDivElement,
  { llms: Array<LLMWithMetadata>; rect?: DOMRect }
>(({ llms, rect }, ref) => {
  const { view, filter, theme, padding, spacing, ommitted, width, set } =
    useURLState()

  const [container, box] = useClientRect<HTMLDivElement>()

  const allItems = toMutualMetadata(llms)

  const containerWidth = useMotionValue(Number(width))

  const springPadding = useSpring(padding, {
    mass: 0.05
  })

  const {
    background,
    foreground: [, fg2]
  } = themeData[theme]

  const items = allItems
    .filter(l =>
      filter.includes(FilterEnum.standalone) ? true : l.nonNullCount > 1
    )
    .filter(l =>
      filter.includes(FilterEnum.number)
        ? true
        : l.type !== MetaPropertyType.Number
    )
    .filter(l =>
      filter.includes(FilterEnum.string)
        ? true
        : l.type !== MetaPropertyType.String
    )
    .filter(l =>
      filter.includes(FilterEnum.boolean)
        ? true
        : l.type !== MetaPropertyType.Boolean
    )
    .filter(l =>
      filter.includes(FilterEnum.nullFields) ? true : l.nonNullCount > 0
    )
    .filter(l => !ommitted.includes(l.name))

  useEffect(() => {
    springPadding.set(padding)
  }, [padding, springPadding])

  return (
    <Container ref={container}>
      <Overflow>
        <DragHandle
          drag="x"
          dragMomentum={false}
          onDrag={(_, info) => {
            if (!box) return

            let newWidth = Math.round(
              (box.left + box.width / 2 - info.point.x) * 2
            )

            containerWidth.set(newWidth)
            set({ width: String(newWidth) })
          }}
          className="noTransform"
        >
          <GripVerticalIcon className="w-2 h-2" />
        </DragHandle>
        <DisplayContainer
          style={{
            background: gr.radial(...background),
            width: containerWidth,
            borderColor: fg2
          }}
          ref={ref}
        >
          <MotionFlex
            style={{
              paddingTop: springPadding,
              paddingLeft: springPadding,
              paddingRight: springPadding,
              // not animating since it would cause issues with animating the gap
              paddingBottom: spacing
            }}
          >
            <HeaderWidget
              style={{
                borderColor: fg2 + "65"
              }}
            >
              <Text size="lg" weight="bold" center multiline asChild>
                <h1>
                  {llms.map((x, i) => (
                    <Fragment key={x.id}>
                      {x.name}
                      {i < llms.length - 1 ? (
                        <span className="text-foreground-dimmer font-medium">
                          {" vs "}
                        </span>
                      ) : null}
                    </Fragment>
                  ))}
                </h1>
              </Text>
            </HeaderWidget>
          </MotionFlex>
          <ItemsContainer
            view={view}
            style={{
              paddingLeft: springPadding,
              paddingRight: springPadding,
              paddingBottom: springPadding,
              // gap can't be animated, using the direct state value
              gap: spacing
            }}
          >
            {items.map((x, i) => (
              <CompareItem key={i} field={x} rect={rect} />
            ))}
          </ItemsContainer>
        </DisplayContainer>
        <DragHandle
          drag="x"
          dragMomentum={false}
          onDrag={(_, info) => {
            if (!box) return

            const newWidth = Math.round(
              (info.point.x - (box.left + box.width / 2)) * 2
            )

            containerWidth.set(newWidth)
            set({ width: String(newWidth) })
          }}
          className="noTransform"
        >
          <GripVerticalIcon className="w-2 h-2" />
        </DragHandle>
      </Overflow>
    </Container>
  )
})
LLMContainer.displayName = "LLMContainer"

const {
  Container,
  ItemsContainer,
  Overflow,
  DisplayContainer,
  HeaderWidget,
  DragHandle
} = {
  Container: styled(MotionDiv, {
    base: "relative grow basis-0"
  }),
  Overflow: styled("div", {
    base: "absolute left-0 top-1/2 -translate-y-1/2 overflow-y-auto max-h-full w-full flex justify-center p-4 group/outer"
  }),
  DisplayContainer: styled(MotionDiv, {
    base: "flex flex-col border-2 rounded-xl max-w-[1600px] min-w-[360px] h-full bg-root"
  }),
  HeaderWidget: styled("div", {
    base: "flex flex-col gap-2 border-2 rounded-lg bg-root/50 w-full p-4"
  }),
  ItemsContainer: styled(MotionDiv, {
    base: "flex rounded-xl w-full h-full",
    variants: {
      view: {
        grid: "flex-row flex-wrap",
        list: "flex-col"
      }
    }
  }),
  DragHandle: styled(MotionDiv, {
    base: "flex items-center w-2 bg-higher md:opacity-0 transition-all group-hover/outer:opacity-100 text-foreground-dimmest cursor-ew-resize hover:bg-highest z-10 self-stretch shrink-0"
  })
}

export default LLMContainer
