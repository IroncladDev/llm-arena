"use client"

import { removeContributor } from "@/app/admin/actions/remove-contributor"
import { removeLLM } from "@/app/admin/actions/remove-llm"
import { LLMWithRelations } from "@/app/api/search/types"
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
import FieldTable from "../FieldTable"
import ErrorState from "./Error"
import Header from "./Header"
import Loading from "./Loading"
import VoteSection from "./VoteSection"
import Votes from "./Votes"
import Flex from "@/components/ui/flex"

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
          <Flex col gap={4} height="auto">
            <Header>
              <Text
                size="lg"
                weight="semibold"
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
                        const reason = prompt(
                          "Please provide a reason why you are removing the LLM"
                        )

                        if (!reason) return

                        const res = await removeLLM({ llmId: llm.id, reason })

                        if (res.success) {
                          setIsOpen(false)
                          window.location.href = "/llms"
                        } else alert(res.message)
                      }}
                    >
                      Remove LLM
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={async () => {
                        const reason = prompt(
                          "Please provide a reason why you are removing the LLM and contributor"
                        )

                        if (!reason) return

                        const res1 = await removeLLM({ llmId: llm.id, reason })

                        if (res1.message) {
                          alert(res1.message)

                          return
                        }

                        const res2 = await removeContributor({
                          userId: llm.user.id,
                          reason
                        })

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

            <Flex col gap={2}>
              <Text weight="medium">Metadata Fields</Text>
              <FieldTable fields={llm.fields} />
            </Flex>

            <Flex col gap={2}>
              <Text weight="medium">Source Description</Text>
              <Text multiline markdown color="dimmer">
                {llm.sourceDescription}
              </Text>
            </Flex>

            <Flex col gap={2}>
              <Text color="dimmest" size="xs">
                Uploaded by{" "}
                <a
                  href={`https://github.com/${llm.user.handle}`}
                  target="_blank"
                  className="text-accent-dimmer border-b border-accent-dimmer"
                >
                  {llm.user.handle}
                  <ExternalLinkIcon className="w-3 h-3 inline-block ml-1 mb-1 align-middle" />
                </a>
              </Text>
            </Flex>

            <hr />

            <Flex col gap={2}>
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
            </Flex>
          </Flex>
        )}
      </SheetContent>
    </Sheet>
  )
}
