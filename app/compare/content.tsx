"use client"

import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import Flex from "@/components/ui/flex"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  MenuIcon,
  PencilIcon,
  XIcon,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import FieldTable from "../llms/components/FieldTable"
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
  const [selectedLLM, setSelectedLLM] = useState<LLMWithMetadata | null>(null)

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
          setSelectedLLM={setSelectedLLM}
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
      <Sheet
        open={Boolean(selectedLLM)}
        onOpenChange={open => setSelectedLLM(open ? selectedLLM : null)}
      >
        <SheetContent>
          <Flex gap={2} align="center" justify="between">
            <Text size="lg" weight="semibold" className="grow">
              {selectedLLM?.name}
            </Text>
            <Button
              variant="outline"
              onClick={() => setSelectedLLM(null)}
              size="icon"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </Flex>
          <Flex col gap={2}>
            <Text weight="medium">Metadata Fields</Text>
            <FieldTable fields={selectedLLM?.fields || []} />
          </Flex>
          <Flex col gap={2}>
            <Text weight="medium">Source Description</Text>
            <Text multiline markdown color="dimmer">
              {selectedLLM?.sourceDescription}
            </Text>
          </Flex>
          <Flex col gap={2}>
            <Text color="dimmest" size="xs">
              Uploaded by{" "}
              <a
                href={`https://github.com/${selectedLLM?.user.handle}`}
                target="_blank"
                className="text-accent-dimmer border-b border-accent-dimmer"
              >
                {selectedLLM?.user.handle}
                <ExternalLinkIcon className="w-3 h-3 inline-block ml-1 mb-1 align-middle" />
              </a>
            </Text>
          </Flex>
        </SheetContent>
      </Sheet>
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
