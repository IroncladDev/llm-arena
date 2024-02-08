"use client";

import { RemoveVoteInput, removeVote } from "./actions/remove-vote";
import { RemoveLLMInput, removeLLM } from "./actions/remove-llm";
import {
  RemoveContributorInput,
  removeContributor,
} from "./actions/remove-contributor";

export function useAdminActions() {
  return {
    removeVote: (args: RemoveVoteInput) => removeVote(args),
    removeLLM: (args: RemoveLLMInput) => removeLLM(args),
    removeContributor: (args: RemoveContributorInput) =>
      removeContributor(args),
  };
}
