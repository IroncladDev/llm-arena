"use client"

import { MotionDiv } from "@/components/motion"
import { MotionFlex } from "@/components/ui/flex"
import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import { toMutualMetadata } from "@/lib/comparison"
import gr from "@/lib/gradients"
import { MetaPropertyType } from "@prisma/client"
import { useMotionValue, useSpring } from "framer-motion"
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
        <DisplayContainer
          style={{
            background: gr.radial(...background),
            width: containerWidth,
            borderColor: fg2
          }}
          ref={ref}
        >
          <DragHandle
            drag="x"
            position="left"
            dragMomentum={false}
            style={{ width: springPadding }}
            onDrag={(_, info) => {
              if (!box) return

              let newWidth = Math.round(
                (box.left + box.width / 2 - info.point.x) * 2 + padding
              )

              containerWidth.set(newWidth)
              set({ width: String(newWidth) })
            }}
            className="noTransform"
          >
            <DragHandleBar />
          </DragHandle>
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
          <DragHandle
            drag="x"
            position="right"
            dragMomentum={false}
            style={{ width: springPadding }}
            onDrag={(_, info) => {
              if (!box) return

              const newWidth = Math.round(
                (info.point.x - (box.left + box.width / 2)) * 2 + padding
              )

              containerWidth.set(newWidth)
              set({ width: String(newWidth) })
            }}
            className="noTransform"
          >
            <DragHandleBar />
          </DragHandle>
        </DisplayContainer>
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
  DragHandle,
  DragHandleBar
} = {
  Container: styled(MotionDiv, {
    base: "relative grow basis-0"
  }),
  Overflow: styled("div", {
    base: "absolute left-0 top-1/2 -translate-y-1/2 overflow-y-auto max-h-full w-full flex justify-center px-4 py-8 pb-[96px]"
  }),
  DisplayContainer: styled(MotionDiv, {
    base: "flex flex-col border-2 rounded-xl max-w-[1600px] min-w-[360px] h-full bg-root relative group/outer"
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
    base: "flex items-center justify-center md:opacity-0 group-hover/outer:opacity-100 cursor-ew-resize z-10 absolute top-0 bottom-0 h-full transition-opacity",
    variants: {
      position: {
        left: "left-0",
        right: "right-0"
      }
    }
  }),
  DragHandleBar: styled("div", {
    base: "bg-white/10 rounded-full w-[4px] h-24 cursor-ew-resize active:bg-white/5 transition-colors"
  })
}

export default LLMContainer
