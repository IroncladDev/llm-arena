"use client"

import { removeContributor } from "@/app/admin/actions/remove-contributor"
import { removeLLM } from "@/app/admin/actions/remove-llm"
import { LLMWithRelations } from "@/app/api/search/types"
import { formatNumber } from "@/components/LargeNumberInput"
import { useCurrentUser } from "@/components/providers/CurrentUserProvider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Text from "@/components/ui/text"
import { User, Vote } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ExternalLinkIcon, MoreVerticalIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import { FieldItem, FieldRow, FieldRows } from "../LLMItem"
import ErrorState from "./Error"
import Header from "./Header"
import Loading from "./Loading"
import VoteSection from "./VoteSection"
import Votes from "./Votes"

export default function LLMOverlay() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = useCurrentUser()

  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<"votes" | "vote">("votes")

  const llmId = params.get("llm")

  const {
    data: llm,
    isLoading,
    error,
    refetch
  } = useQuery<LLMWithRelations<Vote & { user: User }>>({
    queryKey: ["llmSheet", llmId],
    queryFn: async () => {
      try {
        const res = await fetch(`/llms/llm?id=${llmId}`).then(res => res.json())

        if (res.success) {
          return res.data
        } else {
          throw new Error(res.message)
        }
      } catch (err) {
        throw err
      }
    },
    retry: false
  })

  useEffect(() => {
    if (Boolean(llmId && !isNaN(Number(llmId)))) {
      setIsOpen(true)
    }
  }, [llmId])

  return (
    <Sheet
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          setIsOpen(false)
          router.push(pathname, { scroll: false })
        }
      }}
    >
      <SheetContent>
        {error && <ErrorState error={error.message} />}
        {isLoading && <Loading />}
        {llm && (
          <ContentContainer>
            <Header>
              <Text
                size="lg"
                weight="medium"
                multiline
                maxLines={2}
                className="grow"
              >
                {llm.name}
              </Text>

              {currentUser?.role === "admin" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreVerticalIcon className="w-4 h-4 text-foreground-dimmer" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={async () => {
                        const res = await removeLLM({ llmId: llm.id })
                        if (res.success) {
                          setIsOpen(false)
                          window.location.href = "/llms"
                        } else alert(res.message)
                      }}
                    >
                      Remove
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={async () => {
                        const res1 = await removeContributor({
                          userId: llm.user.id
                        })

                        if (res1.message) {
                          alert(res1.message)
                          return
                        }

                        const res2 = await removeLLM({ llmId: llm.id })

                        if (res2.message) {
                          alert(res2.message)
                          return
                        }

                        window.location.href = "/llms"
                      }}
                    >
                      Remove & Revoke Contributor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Header>

            <ContentSection>
              <Text weight="medium">Metadata Fields</Text>
              <FieldRows>
                {llm.fields.map((field, i) => (
                  <FieldRow key={i}>
                    <FieldItem>
                      <Text color="dimmer">{field.metaProperty.name}</Text>
                    </FieldItem>
                    <FieldItem>
                      <Text>
                        {field.metaProperty.type === "Number" &&
                        Number(field.value) >= 1000000
                          ? formatNumber(Number(field.value)).float.toFixed(1) +
                            formatNumber(Number(field.value)).symbol
                          : field.value}
                      </Text>
                    </FieldItem>
                  </FieldRow>
                ))}
              </FieldRows>
            </ContentSection>

            <ContentSection>
              <Text weight="medium">Source Description</Text>
              <Text multiline color="dimmer">
                {llm.sourceDescription}
              </Text>
            </ContentSection>

            <ContentSection>
              <Text color="dimmest" size="xs">
                Uploaded by{" "}
                <a
                  href={`https://github.com/${llm.user.handle}`}
                  className="text-accent-dimmer border-b border-accent-dimmer"
                >
                  {llm.user.handle}
                  <ExternalLinkIcon className="w-3 h-3 inline-block ml-1 mb-1 align-middle" />
                </a>
              </Text>
            </ContentSection>

            <hr />

            <ContentSection>
              <Tabs
                value={tab}
                onValueChange={t => setTab(t as "votes" | "vote")}
              >
                <TabsList>
                  <TabsTrigger value="votes">
                    Votes ({llm.votes.length})
                  </TabsTrigger>
                  <TabsTrigger value="vote">Add a Vote</TabsTrigger>
                </TabsList>
                <TabsContent value="votes">
                  <Votes llm={llm} refetch={refetch} />
                </TabsContent>
                <TabsContent value="vote">
                  <VoteSection llm={llm} setTab={setTab} refetch={refetch} />
                </TabsContent>
              </Tabs>
            </ContentSection>
          </ContentContainer>
        )}
      </SheetContent>
    </Sheet>
  )
}

const ContentSection = styled("div", {
  base: "flex flex-col gap-2"
})

export const ContentContainer = styled("div", {
  base: "flex flex-col gap-4 h-full"
})
