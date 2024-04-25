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
import { name, title } from "../metadata"
import LLMContainer from "./llms"
import Sidebar from "./sidebar"
import { LLMWithMetadata, ModeEnum } from "./types"
import { useURLState } from "./use-url-state"

export default function Content({
  initialLLMs,
}: {
  initialLLMs: Array<LLMWithMetadata>
}) {
  const { mode, set } = useURLState()

  const [llms, setLLMs] = useState(initialLLMs)
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
          llms={llms}
          setLLMs={items => {
            set({
              llms: items.map(x => x.id).join(","),
            })
            setLLMs(items)
          }}
        />
      )}
      <ContentContainer>
        <LLMContainer llms={llms} ref={containerRef} rect={containerRect} />
        {mode === ModeEnum.view && (
          <Footer>
            <Button
              size="sm"
              onClick={() => {
                set({ mode: ModeEnum.edit })
                setSidebarOpen(true)
              }}
            >
              Edit <PencilIcon className="w-4 h-4" />
            </Button>
            <Flex col center asChild>
              <Link href="/">
                <Text size="base" weight="bold">
                  {name}
                </Text>
                <Text color="dimmer" size="xs" multiline center>
                  {title}
                </Text>
              </Link>
            </Flex>
            <Button size="sm" asChild>
              <Link href="/">
                Make your own <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </Footer>
        )}
        {mode === ModeEnum.edit && !sidebarOpen && (
          <SidebarButton
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Sidebar"
          >
            <MenuIcon className="w-4 h-4" />
          </SidebarButton>
        )}
      </ContentContainer>
    </Container>
  )
}

const { ContentContainer, SidebarButton, Footer } = {
  ContentContainer: styled("div", {
    base: "flex flex-col gap-4 grow relative",
  }),
  SidebarButton: styled(Button, {
    base: "absolute top-2 left-2 md:hidden",
  }),
  Footer: styled("footer", {
    base: "flex items-center justify-between p-4 gap-2 bg-gradient-to-b from-root/0 via-root to-root absolute bottom-0 left-0 right-0",
  }),
}
