import { LLMWithRelations } from "@/app/api/search/types"
import { useCurrentUser } from "@/components/providers/CurrentUserProvider"
import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { User, Vote, VoteStatus } from "@prisma/client"
import { InfoIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { styled } from "react-tailwind-variants"
import { castVoteAction } from "../../actions"

export default function VoteSection({
  llm,
  setTab,
  refetch
}: {
  llm: LLMWithRelations<Vote & { user: User }>
  setTab: Dispatch<SetStateAction<"votes" | "vote">>
  refetch: () => void
}) {
  const [state, castVote] = useFormState(castVoteAction, null)
  const [comment, setComment] = useState("")
  const [action, setAction] = useState<VoteStatus>(VoteStatus.approve)

  const user = useCurrentUser()

  const hasVoted = llm.votes.some(vote => vote.userId === user?.id)
  const isOwner = llm.user.id === user?.id
  const isConsensusAchieved = llm.status !== "pending"

  const isDisabled = hasVoted || isOwner

  useEffect(() => {
    if (state?.success) {
      setTab("votes")
      refetch()
    }
  }, [state, setTab, refetch])

  return (
    <Container>
      <Text weight="medium" color={hasVoted ? "dimmest" : "default"}>
        <label htmlFor="comment">
          Comment{action === VoteStatus.approve ? " (Optional)" : ""}
        </label>
      </Text>
      <form action={castVote}>
        <input
          type="hidden"
          name="llmId"
          value={llm.id}
          disabled={isDisabled}
        />
        <input
          type="hidden"
          name="action"
          value={action}
          disabled={isDisabled}
        />
        <Textarea
          name="comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder={
            action === VoteStatus.approve
              ? "The metadata provided is accurate and complete"
              : "The metadata provided is inaccurate/incomplete: ..."
          }
          rows={4}
          disabled={isDisabled}
        />

        <SubmitOptions>
          <StatusButtons action={action}>
            <ApproveButton
              onClick={() => setAction(VoteStatus.approve)}
              active={action === VoteStatus.approve}
              size="sm"
              type="button"
              disabled={isDisabled}
            >
              <ThumbsUp active={action === VoteStatus.approve} />
              Approve
            </ApproveButton>
            <RejectButton
              onClick={() => setAction(VoteStatus.reject)}
              active={action === VoteStatus.reject}
              size="sm"
              type="button"
              disabled={isDisabled}
            >
              <ThumbsDown active={action === VoteStatus.reject} />
              Reject
            </RejectButton>
          </StatusButtons>
          <Button type="submit" variant="elevated" disabled={isDisabled}>
            Submit
          </Button>
        </SubmitOptions>
      </form>

      {state?.message && (
        <ErrorContainer>
          <InfoIcon className="text-rose-600 w-4 h-4" />
          <Text className="text-rose-600 w-full" multiline>
            <em>{state.message}</em>
          </Text>
        </ErrorContainer>
      )}

      {isDisabled ? (
        <DisabledOverlay>
          <Text weight="medium" color="dimmer">
            {hasVoted
              ? "You have already voted on this LLM"
              : "You cannot vote on your own LLM"}
          </Text>
        </DisabledOverlay>
      ) : isConsensusAchieved ? (
        <DisabledOverlay>
          <Text weight="medium" color="dimmer">
            This LLM has been {llm.status}
          </Text>
        </DisabledOverlay>
      ) : null}
    </Container>
  )
}

const {
  Container,
  DisabledOverlay,
  SubmitOptions,
  StatusButtons,
  ApproveButton,
  RejectButton,
  ThumbsUp,
  ThumbsDown,
  ErrorContainer
} = {
  Container: styled("div", {
    base: "flex flex-col gap-2 relative"
  }),
  DisabledOverlay: styled("div", {
    base: "absolute inset-0 bg-overlay flex flex-col items-center justify-center"
  }),
  SubmitOptions: styled("div", {
    base: "flex gap-2 justify-between items-center"
  }),
  StatusButtons: styled("div", {
    base: "flex gap-1 border-2 p-1 rounded-xl",
    variants: {
      action: {
        approve: "border-emerald-500/30",
        reject: "border-rose-500/30"
      }
    }
  }),
  ApproveButton: styled(Button, {
    base: "bg-transparent border-transparent opacity-50 hover:opacity-100 hover:border-transparent transition-opacity rounded-lg",
    variants: {
      active: {
        true: "opacity-100 bg-higher"
      }
    }
  }),
  RejectButton: styled(Button, {
    base: "bg-transparent border-transparent opacity-50 hover:opacity-100 hover:border-transparent transition-opacity rounded-lg",
    variants: {
      active: {
        true: "opacity-100 bg-higher"
      }
    }
  }),
  ThumbsUp: styled(ThumbsUpIcon, {
    base: "w-4 h-4 text-foreground-dimmest",
    variants: {
      active: {
        true: "text-emerald-500"
      }
    }
  }),
  ThumbsDown: styled(ThumbsDownIcon, {
    base: "w-4 h-4 text-foreground-dimmest",
    variants: {
      active: {
        true: "text-rose-500"
      }
    }
  }),
  ErrorContainer: styled("div", {
    base: "flex gap-2 items-center px-2 py-1 bg-rose-500/10 border-2 border-rose-500/30 rounded-lg"
  })
}
