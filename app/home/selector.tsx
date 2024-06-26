"use client"

import LLMIcon from "@/components/llm-icon"
import { Button } from "@/components/ui/button"
import Flex from "@/components/ui/flex"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import Text from "@/components/ui/text"
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  HexagonIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { styled } from "react-tailwind-variants"
import LLMSearch from "../compare/search"
import { LLMWithMetadata } from "../compare/types"
import FieldTable from "../llms/components/FieldTable"
import { name } from "../metadata"

export default function Selector() {
  const [llms, setLLMs] = useState<Array<LLMWithMetadata>>([])
  const [selectedLLM, setSelectedLLM] = useState<LLMWithMetadata | null>(null)

  const router = useRouter()
  const scrollEndRef = useRef<HTMLLabelElement>(null)
  const llmSearchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView()
  }, [llms.length, scrollEndRef])

  return (
    <Flex
      col
      width="full"
      gap={4}
      p={6}
      align="center"
      className="max-w-[600px]"
    >
      <Flex col align="center" gap={2}>
        <Text size="xl" weight="medium">
          {name}
        </Text>
        <Text color="dimmer">
          Select 2-10 LLMs to see a side-by-side comparison
        </Text>
      </Flex>
      <LLMSearch
        llms={llms}
        setLLMs={setLLMs}
        placeholder={
          llms.length === 0
            ? "Add an LLM"
            : llms.length < 10
              ? "Add another LLM"
              : "Max 10 LLMs"
        }
        size="lg"
        id="llm-search-input"
        ref={llmSearchRef}
      />
      <Flex
        wrap
        center
        width="full"
        gap={2}
        className="max-h-[400px] overflow-y-auto"
      >
        {llms.length > 0
          ? llms.map(llm => (
              <LLMItem
                key={llm.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedLLM(llm)}
              >
                <IconContainer>
                  <LLMIcon size="md" />
                  <CloseButton>
                    <XIcon
                      className="w-4 h-4 text-foreground-dimmest"
                      onClick={e => {
                        e.stopPropagation()
                        setLLMs(llms.filter(x => x.id !== llm.id))
                      }}
                    />
                  </CloseButton>
                </IconContainer>
                <SpecsContainer>
                  <Text color="dimmer" multiline center>
                    {llm.name}
                  </Text>
                  <Text color="dimmest" size="xs">
                    {llm.fields.length} fields
                  </Text>
                </SpecsContainer>
              </LLMItem>
            ))
          : new Array(3).fill(0).map((_, i) => (
              <PlaceholderLLM key={i} htmlFor="llm-search-input">
                <HexagonIcon className="w-8 h-8" />
              </PlaceholderLLM>
            ))}
        {llms.length > 0 && (
          <PlaceholderLLM htmlFor="llm-search-input" ref={scrollEndRef}>
            <PlusIcon className="w-8 h-8" />
            <Text color="dimmest" weight="medium">
              Add another LLM
            </Text>
          </PlaceholderLLM>
        )}
      </Flex>
      <Button
        variant="highlight"
        size="lg"
        disabled={llms.length < 2}
        onClick={() => {
          router.push(
            `/compare?llms=${llms.map(x => x.id).join(",")}&mode=edit`,
          )
        }}
      >
        See Comparison
        <ArrowRightIcon className="w-6 h-6" />
      </Button>
      <Flex>
        <Text color="dimmer">
          Can&apos;t find an LLM?{" "}
          <Link className="text-accent-dimmer" href="/contribute/join">
            Add it
          </Link>
        </Text>
      </Flex>
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
    </Flex>
  )
}

const { LLMItem, IconContainer, SpecsContainer, CloseButton, PlaceholderLLM } =
  {
    LLMItem: styled("div", {
      base: "flex flex-col rounded-xl border-2 border-outline-dimmer bg-default grow basis-0 max-w-[320px] min-w-[160px] shadow-md cursor-pointer hover:border-accent-dimmest transition-colors",
    }),
    IconContainer: styled("div", {
      base: "flex items-center justify-center py-4 bg-root rounded-t-xl relative",
    }),
    SpecsContainer: styled("div", {
      base: "flex flex-col gap-1 items-center w-full rounded-b-lg px-4 py-2",
    }),
    CloseButton: styled("button", {
      base: "absolute top-2 right-2 w-4 h-4",
    }),
    PlaceholderLLM: styled("label", {
      base: "flex flex-col gap-2 rounded-xl max-w-[320px] min-w-[160px] items-center align-self-stretch justify-center min-h-[124px] grow basis-0 border-2 border-dashed border-outline-dimmest text-outline-dimmer hover:text-foreground-dimmest hover:border-outline-dimmer transition-colors cursor-pointer",
    }),
  }
