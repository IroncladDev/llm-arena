import { Vote, VoteStatus } from "@prisma/client"

type DetermineConsensusResult =
  | {
      status: "approved"
      approvals: number
      rejections: number
    }
  | {
      status: "rejected"
      approvals: number
      rejections: number
    }
  | {
      status: "pending"
      remainingApprovals: number
      remainingRejections: number
      approvals: number
      rejections: number
    }

export default function determineConsensus<T extends Vote>(
  votes: Array<T>
): DetermineConsensusResult {
  const totalVotes = votes.length
  const approvals = votes.filter(
    vote => vote.status === VoteStatus.approve
  ).length
  const rejections = totalVotes - approvals

  // Uses the BFT algorithm to determine the maximum number of faults
  const maxFaults = (totalVotes - 1) / 3

  const isApproved = rejections <= maxFaults
  const isRejected = approvals <= maxFaults

  if (totalVotes >= 4 && (isApproved || isRejected)) {
    return {
      status: isApproved ? "approved" : "rejected",
      approvals,
      rejections
    }
  } else {
    // Calculate the number of remaining approvals/rejections needed to turn the vote around
    const remainingApprovals = Math.max(2 * rejections + 1 - approvals, 1)
    const remainingRejections = Math.max(2 * approvals + 1 - rejections, 1)

    return {
      status: "pending",
      remainingApprovals,
      remainingRejections,
      approvals,
      rejections
    }
  }
}
