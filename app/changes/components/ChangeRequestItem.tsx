import { ChangeRequestWithVote } from "@/app/llms/components/LLMOverlay"
import { Table } from "@/app/llms/components/LLMOverlay/Fields"
import { useCurrentUser } from "@/components/providers/CurrentUserProvider"
import { Button } from "@/components/ui/button"
import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"
import determineConsensus from "@/lib/consensus"
import { abbrNumber } from "@/lib/numbers"
import { ChangeRequestType, MetaPropertyType, VoteStatus } from "@prisma/client"
import {
  GitPullRequestIcon,
  PlusIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TrashIcon,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { styled } from "react-tailwind-variants"
import { castVote } from "./actions/cast-vote"

export default function ChangeRequestItem({
  refetch,
  request,
  isOnLLM = false,
}: {
  request: ChangeRequestWithVote
  refetch: () => void
  isOnLLM?: boolean
}) {
  const user = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()

  const { approvals, rejections } = determineConsensus(request.votes)

  const userVote = request.votes.find(x => x.user.id === user?.id)
  const hasUserVoted = Boolean(userVote)

  const requestValue = request.newValue ?? request.field?.value
  const requestNote = request.newNote ?? request.field?.note

  const handleCastVote = async (action: VoteStatus) => {
    const res = await castVote({
      changeRequestId: request.id,
      action,
    })

    if (!res.success) {
      alert(res.message)

      return
    }

    refetch()
  }

  return (
    <Container>
      <Flex gap={2} align="center">
        <TypeIndicator status={request.type}>
          {request.type === ChangeRequestType.add ? (
            <PlusIcon />
          ) : request.type === ChangeRequestType.edit ? (
            <GitPullRequestIcon />
          ) : (
            <TrashIcon />
          )}
        </TypeIndicator>
        <Text color="dimmer" className="grow">
          <a
            href={`https://github.com/${request.user.handle}`}
            target="_blank"
            className="underline text-accent"
          >
            {request.user.handle}
          </a>{" "}
          requested to {request.type} <code>{request.metaProperty.name}</code>{" "}
          {isOnLLM ? null : (
            <>
              on{" "}
              <a
                className="underline text-accent cursor-pointer"
                onClick={() =>
                  router.push(pathname + "?llm=" + request.llm.id, {
                    scroll: false,
                  })
                }
              >
                {request.llm.name}
              </a>
            </>
          )}
        </Text>
        <VoteButton
          size="sm"
          variant="elevated"
          status={
            hasUserVoted
              ? userVote?.status === VoteStatus.approve
                ? "approved"
                : "deselected"
              : "default"
          }
          disabled={hasUserVoted}
          onClick={() => handleCastVote("approve")}
        >
          <ThumbsUpIcon className="w-3 h-3" />
          <Text size="xs">{approvals}</Text>
        </VoteButton>
        <VoteButton
          size="sm"
          variant="elevated"
          status={
            hasUserVoted
              ? userVote?.status === VoteStatus.reject
                ? "rejected"
                : "deselected"
              : "default"
          }
          disabled={hasUserVoted}
          onClick={() => handleCastVote("reject")}
        >
          <ThumbsDownIcon className="w-3 h-3" />
          <Text size="xs">{rejections}</Text>
        </VoteButton>
      </Flex>
      <Flex col>
        <Table.Container>
          {request.type === "edit" && request.field && (
            <Table.Row>
              <Table.Cell
                variant={
                  requestNote !== request.field?.note ? "delete" : "default"
                }
              >
                <Table.CellContent>
                  <Text weight="medium" color="dimmer" size="sm">
                    {request.metaProperty.name}
                  </Text>
                  {request.field.note && (
                    <Text size="xs" color="dimmest">
                      {request.field.note}
                    </Text>
                  )}
                </Table.CellContent>
              </Table.Cell>
              <Table.Cell>
                <Table.CellContent>
                  <Text weight="medium" color="dimmer">
                    {request.metaProperty.type}
                  </Text>
                </Table.CellContent>
              </Table.Cell>
              <Table.Cell
                variant={
                  requestValue !== request.field?.value ? "delete" : "default"
                }
              >
                <Table.CellContent>
                  <Text color="dimmer" multiline>
                    {request.metaProperty.type === MetaPropertyType.Number
                      ? abbrNumber(Number(request.field.value))
                      : request.field.value}
                  </Text>
                </Table.CellContent>
              </Table.Cell>
            </Table.Row>
          )}
          <Table.Row>
            <Table.Cell
              variant={
                request.type !== "edit"
                  ? request.type
                  : requestNote !== request.field?.note
                    ? "add"
                    : "default"
              }
            >
              <Table.CellContent>
                <Text weight="medium" color="dimmer" size="sm">
                  {request.metaProperty.name}
                </Text>
                {requestNote && (
                  <Text size="xs" color="dimmest">
                    {requestNote}
                  </Text>
                )}
              </Table.CellContent>
            </Table.Cell>
            <Table.Cell
              variant={request.type !== "edit" ? request.type : "default"}
            >
              <Table.CellContent>
                <Text weight="medium" color="dimmer">
                  {request.metaProperty.type}
                </Text>
              </Table.CellContent>
            </Table.Cell>
            <Table.Cell
              variant={
                request.type !== "edit"
                  ? request.type
                  : requestValue !== request.field?.value
                    ? "add"
                    : "default"
              }
            >
              <Table.CellContent>
                <Text color="dimmer" multiline>
                  {request.metaProperty.type === MetaPropertyType.Number
                    ? abbrNumber(Number(requestValue))
                    : requestValue}
                </Text>
              </Table.CellContent>
            </Table.Cell>
          </Table.Row>
        </Table.Container>
      </Flex>
      <Text multiline color="dimmer" markdown>
        {request.sourceDescription}
      </Text>
    </Container>
  )
}

const { Container, VoteButton, TypeIndicator } = {
  Container: styled("div", {
    base: "flex flex-col gap-2 rounded-lg bg-higher p-2",
  }),
  VoteButton: styled(Button, {
    base: "gap-1",
    variants: {
      status: {
        approved:
          "border-emerald-500 focus:border-emerald-500 text-emerald-500",
        rejected: "border-rose-500 focus:border-rose-500 text-rose-500",
        default: "",
        deselected: "opacity-50",
      },
    },
  }),
  TypeIndicator: styled("div", {
    base: "rounded-full p-1.5 w-7 h-7 flex items-center justify-center",
    variants: {
      status: {
        [ChangeRequestType.add]: "bg-emerald-500/15 text-emerald-500",
        [ChangeRequestType.edit]: "bg-yellow-500/15 text-yellow-500",
        [ChangeRequestType.delete]: "bg-rose-500/15 text-rose-500",
      },
    },
  }),
}
