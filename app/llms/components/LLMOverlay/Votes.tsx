import { removeContributor } from "@/app/admin/actions/remove-contributor"
import { removeVote } from "@/app/admin/actions/remove-vote"
import { LLMWithRelations } from "@/app/api/search/types"
import { MotionDiv } from "@/components/motion"
import { useCurrentUser } from "@/components/providers/CurrentUserProvider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Text from "@/components/ui/text"
import determineConsensus from "@/lib/consensus"
import { User, Vote, VoteStatus } from "@prisma/client"
import { MoreVerticalIcon, ThumbsDown, ThumbsUp } from "lucide-react"
import { styled } from "react-tailwind-variants"

export default function Votes({
  llm,
  refetch
}: {
  llm: LLMWithRelations<Vote & { user: User }>
  refetch: () => void
}) {
  const { status, approvals, rejections, ...consensus } = determineConsensus(
    llm.votes
  )

  const comments = llm.votes.filter(x => x.comment)

  const approvePercent = Math.round((approvals / llm.votes.length) * 100)
  const rejectPercent = Math.round((rejections / llm.votes.length) * 100)

  return (
    <Container>
      <VoteStats status={status}>
        {llm.votes.length > 0 ? (
          <>
            <VoteStat>
              <Text
                color={status === "approved" ? "default" : "dimmer"}
                weight={status === "approved" ? "bold" : "default"}
              >
                {status === "approved" ? "Approved" : "Approvals"} ({approvals})
              </Text>
              <Indicator>
                <IndicatorBar
                  status="approve"
                  animate={{
                    width: `${approvePercent}%`
                  }}
                  initial={{
                    width: `0%`
                  }}
                />
              </Indicator>
              <Text color="dimmer">{approvePercent}%</Text>
            </VoteStat>
            <VoteStat>
              <Text
                color={status === "rejected" ? "default" : "dimmer"}
                weight={status === "rejected" ? "bold" : "default"}
              >
                {status === "rejected" ? "Rejected" : "Rejections"} (
                {rejections})
              </Text>
              <Indicator>
                <IndicatorBar
                  status="reject"
                  animate={{
                    width: `${rejectPercent}%`
                  }}
                  initial={{
                    width: `0%`
                  }}
                />
              </Indicator>
              <Text color="dimmer">{rejectPercent}%</Text>
            </VoteStat>
            {status === "pending" && "remainingApprovals" in consensus && (
              <VoteStat className="border-t border-outline-dimmest pt-2">
                <Text color="dimmer" size="sm">
                  {llm.votes.length < 4
                    ? "Four votes required until approved/rejected"
                    : approvals >= rejections
                      ? `${consensus.remainingApprovals} more approvals required`
                      : `${consensus.remainingRejections} more rejections required`}
                </Text>
                <PendingBadge>Pending</PendingBadge>
              </VoteStat>
            )}
          </>
        ) : (
          <Text className="text-center" color="dimmer">
            No votes yet
          </Text>
        )}
      </VoteStats>

      {comments.length > 0 && (
        <>
          <Text weight="bold" color="dimmer">
            Comments
          </Text>

          <Container>
            {comments.map((vote, i) => (
              <VoteComment
                key={i}
                vote={vote}
                status={vote.status}
                refetch={refetch}
              />
            ))}
          </Container>
        </>
      )}
    </Container>
  )
}

function VoteComment({
  vote,
  status,
  refetch
}: {
  vote: Vote & { user: User }
  status: VoteStatus
  refetch: () => void
}) {
  const user = useCurrentUser()

  return (
    <VoteContainer status={status}>
      <div className="grow pt-0.5">
        <Text weight="bold">
          {status === VoteStatus.approve ? (
            <ThumbsUp
              size={16}
              className="inline-block align-middle mr-2 text-emerald-500 pt-0.5"
            />
          ) : (
            <ThumbsDown
              size={16}
              className="inline-block align-middle mr-2 text-rose-500 pt-0.5"
            />
          )}
          {vote.user.handle}:{" "}
        </Text>
        <Text color="dimmer" multiline markdown>
          {vote.comment}
        </Text>
      </div>
      {user?.role === "admin" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="shrink-0" variant="ghostElevated">
              <MoreVerticalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={async () => {
                const reason = prompt(
                  "Please provide a reason why you are removing the vote"
                )

                if (!reason) return

                const res = await removeVote({ voteId: vote.id, reason })

                if (res.success) {
                  refetch()
                } else {
                  alert(res.message)
                }
              }}
            >
              Remove Vote
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={async () => {
                const reason = prompt(
                  "Please provide a reason why you are removing the vote and contributor"
                )

                if (!reason) return

                const res = await removeVote({ voteId: vote.id, reason })

                if (!res.success) {
                  return alert(res.message)
                }

                const revokeRes = await removeContributor({
                  userId: vote.userId,
                  reason
                })

                if (!revokeRes.success) {
                  return alert(revokeRes.message)
                }

                refetch()
              }}
            >
              Remove & Revoke Contributor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </VoteContainer>
  )
}

const {
  Container,
  VoteStats,
  VoteStat,
  Indicator,
  IndicatorBar,
  VoteContainer,
  PendingBadge
} = {
  Container: styled("div", {
    base: "flex flex-col gap-2 min-h-[160px]"
  }),
  VoteStats: styled("div", {
    base: "flex flex-col gap-2 p-2 rounded-lg border-2",
    variants: {
      status: {
        approved: "border-emerald-500/30",
        rejected: "border-rose-500/30",
        pending: "border-outline-dimmest"
      }
    }
  }),
  VoteStat: styled("div", {
    base: "flex items-center gap-2 justify-between"
  }),
  Indicator: styled("div", {
    base: "grow rounded-lg h-2 max-w-[240px] bg-higher"
  }),
  IndicatorBar: styled(MotionDiv, {
    base: "h-2 rounded-lg",
    variants: {
      status: {
        approve: "bg-emerald-500",
        reject: "bg-rose-500"
      }
    }
  }),
  VoteContainer: styled("div", {
    base: "flex gap-2 px-2 pt-1 pb-2 rounded-lg border-2 bg-higher",
    variants: {
      status: {
        approve: "border-emerald-500/30",
        reject: "border-rose-500/30"
      }
    }
  }),
  PendingBadge: styled("div", {
    base: "rounded-md px-1.5 py-0.5 text-xs bg-amber-500/25 text-amber-300/75"
  })
}
