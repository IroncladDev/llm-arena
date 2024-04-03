"use client"

import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import { ArrowRightIcon, MenuIcon, PencilIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import LLMContainer from "./llms"
import Sidebar from "./sidebar"
import { useURLState } from "./state"
import { LLMWithMetadata, ModeEnum } from "./types"

export default function Content({ llms }: { llms: Array<LLMWithMetadata> }) {
  const { mode, set } = useURLState()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [containerRef, containerRect] = useClientRect<HTMLDivElement>()

  useEffect(() => {
    if (mode === ModeEnum.edit) {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Container className="flex-row">
      {mode === ModeEnum.edit && (
        <Sidebar
          open={sidebarOpen}
          onOpenChange={open => {
            setSidebarOpen(open)
          }}
          containerRef={containerRef}
        />
      )}
      <ContentContainer>
        <LLMContainer llms={llms} ref={containerRef} rect={containerRect} />
        {mode === ModeEnum.view && (
          <Flex align="center" justify="between" asChild p={4} gap={2}>
            <footer>
              <Button
                size="sm"
                onClick={() => {
                  set({ mode: ModeEnum.edit })
                  setSidebarOpen(true)
                }}
              >
                Edit <PencilIcon className="w-4 h-4" />
              </Button>
              <Flex col center>
                <Text size="base" weight="bold">
                  AI to AI
                </Text>
                <Text color="dimmer" size="xs" multiline center>
                  Create side-by-side LLM comparisons
                </Text>
              </Flex>
              <Button size="sm" asChild>
                <Link href="/">
                  Try it out <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </Button>
            </footer>
          </Flex>
        )}
        {mode === ModeEnum.edit && !sidebarOpen && (
          <SidebarButton size="icon" onClick={() => setSidebarOpen(true)}>
            <MenuIcon className="w-4 h-4" />
          </SidebarButton>
        )}
      </ContentContainer>
    </Container>
  )
}

const { ContentContainer, SidebarButton } = {
  ContentContainer: styled("div", {
    base: "flex flex-col gap-4 grow relative"
  }),
  SidebarButton: styled(Button, {
    base: "absolute top-2 left-2 md:hidden"
  })
}
