"use client"

import { removeContributor } from "@/app/admin/actions/remove-contributor"
import { removeLLM } from "@/app/admin/actions/remove-llm"
import { LLMWithRelations } from "@/app/api/search/types"
import ChangeRequestItem from "@/app/changes/components/ChangeRequestItem"
import { useCurrentUser } from "@/components/providers/CurrentUserProvider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Flex from "@/components/ui/flex"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Text from "@/components/ui/text"
import {
  ChangeRequest,
  ChangeRequestVote,
  Field,
  LLM,
  MetaProperty,
  User,
  Vote,
} from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ExternalLinkIcon, MoreVerticalIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import ErrorState from "./Error"
import Fields from "./Fields"
import Header from "./Header"
import Loading from "./Loading"
import Votes from "./Votes"

export type ChangeRequestWithVote = ChangeRequest & {
  user: User
  votes: Array<ChangeRequestVote & { user: User }>
  field?: Field | null
  metaProperty: MetaProperty
  llm: LLM
}

export type OverlayLLM = LLMWithRelations<Vote & { user: User }> & {
  changeRequests: Array<ChangeRequestWithVote>
}

export default function LLMOverlay() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = useCurrentUser()

  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<"status" | "changes">("status")

  const llmId = params.get("llm")

  const {
    data: llm,
    isLoading,
    error,
    refetch,
  } = useQuery<OverlayLLM>({
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
    retry: false,
  })

  const handleAdminRemoveLLM = async () => {
    if (!llm) return

    const reason = prompt(
      "Please provide a reason why you are removing the LLM",
    )

    if (!reason) return

    const res = await removeLLM({ llmId: llm.id, reason })

    if (res.success) {
      setIsOpen(false)
      window.location.href = "/llms"
    } else alert(res.message)
  }

  const handleAdminRemoveLLMAndContributor = async () => {
    if (!llm) return

    const reason = prompt(
      "Please provide a reason why you are removing the LLM and contributor",
    )

    if (!reason) return

    const res1 = await removeLLM({ llmId: llm.id, reason })

    if (res1.message) {
      alert(res1.message)

      return
    }

    const res2 = await removeContributor({
      userId: llm.user.id,
      reason,
    })

    if (res2.message) {
      alert(res2.message)

      return
    }

    window.location.href = "/llms"
  }

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
              <Flex grow align="center" gap={2}>
                <Text size="lg" weight="semibold" multiline maxLines={2}>
                  {llm.name}
                </Text>
                <StatusBadge status={llm.status}>{llm.status}</StatusBadge>
              </Flex>

              {currentUser?.role === "admin" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreVerticalIcon className="w-4 h-4 text-foreground-dimmer" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={handleAdminRemoveLLM}>
                      Remove LLM
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={handleAdminRemoveLLMAndContributor}
                    >
                      Remove & Revoke Contributor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Header>

            <Flex col gap={2}>
              <Text weight="medium">Metadata Fields</Text>
              <Fields llm={llm} refetch={refetch} />
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

            {llm.changeRequests.length > 0 ? (
              <Flex col gap={2}>
                <Tabs
                  value={tab}
                  onValueChange={t => setTab(t as "status" | "changes")}
                >
                  <TabsList>
                    <TabsTrigger value="status">Votes</TabsTrigger>
                    <TabsTrigger value="changes">
                      Change Requests ({llm.changeRequests.length})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="status">
                    <Flex col gap={1}>
                      <Votes llm={llm} refetch={refetch} />
                    </Flex>
                  </TabsContent>
                  <TabsContent value="changes">
                    <Flex col gap={1}>
                      {llm.changeRequests.map(r => (
                        <ChangeRequestItem
                          isOnLLM
                          key={r.id}
                          request={r}
                          refetch={refetch}
                        />
                      ))}
                    </Flex>
                  </TabsContent>
                </Tabs>
              </Flex>
            ) : (
              <Votes llm={llm} refetch={refetch} />
            )}
          </Flex>
        )}
      </SheetContent>
    </Sheet>
  )
}

export const StatusBadge = styled("div", {
  base: "rounded-md px-1.5 py-0.5 text-xs",
  variants: {
    status: {
      pending: "bg-amber-500/25 text-amber-300/75",
      approved: "bg-emerald-500/25 text-emerald-300/75",
      rejected: "bg-rose-500/25 text-rose-300/75",
    },
  },
})
