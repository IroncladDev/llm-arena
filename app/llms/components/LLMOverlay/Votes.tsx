import { removeContributor } from "@/app/admin/actions/remove-contributor"
import { removeVote } from "@/app/admin/actions/remove-vote"
import { MotionDiv } from "@/components/motion"
import { useCurrentUser } from "@/components/providers/CurrentUserProvider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Flex from "@/components/ui/flex"
import { Input } from "@/components/ui/input"
import Text from "@/components/ui/text"
import determineConsensus from "@/lib/consensus"
import { User, Vote, VoteStatus } from "@prisma/client"
import { MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { OverlayLLM, StatusBadge } from "."
import { castVote } from "../../actions"

export default function Votes({
  llm,
  refetch,
}: {
  llm: OverlayLLM
  refetch: () => void
}) {
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null)
  const [comment, setComment] = useState("")

  const user = useCurrentUser()

  const { status, approvals, rejections, ...consensus } = determineConsensus(
    llm.votes,
  )

  const userVote = llm.votes.find(x => x.user.id === user?.id)
  const hasUserVoted = Boolean(userVote)

  const comments = llm.votes.filter(x => x.comment)

  const approvePercent = Math.round((approvals / llm.votes.length) * 100)
  const rejectPercent = Math.round((rejections / llm.votes.length) * 100)

  const handleSubmitVote = async () => {
    if (!voteStatus) return

    const res = await castVote({
      llmId: llm.id,
      action: voteStatus,
      comment,
    })

    if (res.success) {
      refetch()
    } else {
      alert(res.message)
    }
  }

  return (
    <Flex col gap={2}>
      {status === "pending" ? (
        <VoteStats>
          <Flex col>
            <Flex align="center" gap={2}>
              <VoteButton
                size="sm"
                variant="elevated"
                status={
                  hasUserVoted
                    ? userVote?.status === VoteStatus.approve
                      ? "approved"
                      : "default"
                    : voteStatus === VoteStatus.approve
                      ? "approved"
                      : voteStatus === VoteStatus.reject
                        ? "deselected"
                        : "default"
                }
                disabled={hasUserVoted}
                onClick={() => setVoteStatus(VoteStatus.approve)}
              >
                <ThumbsUpIcon className="w-4 h-4" />
                <Text>{approvals}</Text>
              </VoteButton>
              <VoteButton
                size="sm"
                variant="elevated"
                status={
                  hasUserVoted
                    ? userVote?.status === VoteStatus.reject
                      ? "rejected"
                      : "default"
                    : voteStatus === VoteStatus.reject
                      ? "rejected"
                      : voteStatus === VoteStatus.approve
                        ? "deselected"
                        : "default"
                }
                disabled={hasUserVoted}
                onClick={() => setVoteStatus(VoteStatus.reject)}
              >
                <ThumbsDownIcon className="w-4 h-4" />
                <Text>{rejections}</Text>
              </VoteButton>
              <Indicator>
                {approvePercent > 0 && (
                  <IndicatorBar
                    status="approve"
                    animate={{
                      width: `${approvePercent}%`,
                    }}
                    initial={{
                      width: `0%`,
                    }}
                  />
                )}
                {rejectPercent > 0 && (
                  <IndicatorBar
                    status="reject"
                    animate={{
                      width: `${rejectPercent}%`,
                    }}
                    initial={{
                      width: `0%`,
                    }}
                  />
                )}
              </Indicator>
            </Flex>
          </Flex>
          {voteStatus && !hasUserVoted && (
            <Flex col gap={1}>
              <Text className="pl-2" color="dimmer">
                Add a comment (
                {voteStatus === VoteStatus.approve ? "optional" : "required"})
              </Text>
              <Flex align="center" gap={2}>
                <Input
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder={
                    voteStatus === VoteStatus.approve
                      ? "The info provided is accurate..."
                      : "The info provided is inaccurate..."
                  }
                  variant="elevated"
                />
                <Button variant="elevated" onClick={handleSubmitVote}>
                  Submit
                </Button>
              </Flex>
            </Flex>
          )}
          {status === "pending" && "remainingApprovals" in consensus && (
            <Flex
              gap={2}
              align="center"
              justify="between"
              className="border-t border-outline-dimmest pt-2"
            >
              <Text color="dimmer" size="sm">
                {llm.votes.length < 4
                  ? "Minimum four votes required"
                  : approvals >= rejections
                    ? `${consensus.remainingApprovals} more approvals required`
                    : `${consensus.remainingRejections} more rejections required`}
              </Text>
              <PendingBadge>Pending</PendingBadge>
            </Flex>
          )}
        </VoteStats>
      ) : (
        <Flex row gap={2} center p={2}>
          <StatusBadge status={status}>{status}</StatusBadge>
          <Text center color="dimmer">
            • {approvals} Approvals • {rejections} Rejections
          </Text>
        </Flex>
      )}

      {comments.length > 0 && (
        <Flex col gap={2}>
          <Text weight="medium" color="dimmer">
            Votes with Comments
          </Text>

          <Flex col gap={4} className="min-h=[160px]">
            {comments.map((vote, i) => (
              <VoteComment key={i} vote={vote} refetch={refetch} />
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

function VoteComment({
  vote,
  refetch,
}: {
  vote: Vote & { user: User }
  refetch: () => void
}) {
  const user = useCurrentUser()

  const handleRemoveVote = async () => {
    const reason = prompt(
      "Please provide a reason why you are removing the vote",
    )

    if (!reason) return

    const res = await removeVote({ voteId: vote.id, reason })

    if (res.success) {
      refetch()
    } else {
      alert(res.message)
    }
  }

  const handleRemoveVoteAndContributor = async () => {
    const reason = prompt(
      "Please provide a reason why you are removing the vote and contributor",
    )

    if (!reason) return

    const res = await removeVote({ voteId: vote.id, reason })

    if (!res.success) {
      return alert(res.message)
    }

    const revokeRes = await removeContributor({
      userId: vote.userId,
      reason,
    })

    if (!revokeRes.success) {
      return alert(revokeRes.message)
    }

    refetch()
  }

  return (
    <Flex col gap={1}>
      <VoteCommentContent>
        <Flex align="center" gap={2}>
          <StatusIndicator status={vote.status}>
            {vote.status === VoteStatus.approve ? (
              <ThumbsUpIcon />
            ) : (
              <ThumbsDownIcon />
            )}
          </StatusIndicator>
          <Text>
            <a
              href={`https://github.com/${vote.user.handle}`}
              target="_blank"
              className="underline text-accent"
            >
              {vote.user.handle}
            </a>
          </Text>
          {user?.role === "admin" && (
            <Flex grow justify="end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-higher shrink-0 w-4 h-4 hover:bg-higher text-foreground-dimmer hover:text-foreground"
                    variant="ghost"
                  >
                    <MoreVerticalIcon size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={handleRemoveVote}>
                    Remove Vote
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleRemoveVoteAndContributor}>
                    Remove & Revoke Contributor
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Flex>
          )}
        </Flex>
        <Text multiline markdown color="dimmer">
          {vote.comment}
        </Text>
      </VoteCommentContent>
    </Flex>
  )
}

const {
  VoteStats,
  Indicator,
  IndicatorBar,
  PendingBadge,
  VoteCommentContent,
  VoteButton,
  StatusIndicator,
} = {
  VoteCommentContent: styled("div", {
    base: "p-2 bg-higher rounded-lg",
  }),
  VoteStats: styled("div", {
    base: "flex flex-col gap-2 p-2 rounded-lg border-2 border-outline-dimmer",
  }),
  Indicator: styled("div", {
    base: "grow flex rounded-lg h-2 bg-higher",
  }),
  IndicatorBar: styled(MotionDiv, {
    base: "h-2 first:rounded-l-lg last:rounded-r-lg grow-0 shrink-0",
    variants: {
      status: {
        approve: "bg-emerald-500",
        reject: "bg-rose-500",
      },
    },
  }),
  PendingBadge: styled("div", {
    base: "rounded-md px-1.5 py-0.5 text-xs bg-amber-500/25 text-amber-300/75",
  }),
  VoteButton: styled(Button, {
    base: "min-w-[64px]",
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
  StatusIndicator: styled("div", {
    base: "rounded-full p-1.5 w-7 h-7 flex items-center justify-center",
    variants: {
      status: {
        [VoteStatus.approve]: "bg-emerald-500/15 text-emerald-500",
        [VoteStatus.reject]: "bg-rose-500/15 text-rose-500",
      },
    },
  }),
}
