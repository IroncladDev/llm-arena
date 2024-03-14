import { LLMWithRelations } from "@/app/api/search/types"
import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import { VoteStatus } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { Fragment } from "react"
import { styled } from "react-tailwind-variants"
import FieldTable from "./FieldTable"

export default function LLMItem({
  query,
  llm
}: {
  query: string
  llm: LLMWithRelations
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [ref, box] = useClientRect<HTMLDivElement>()

  const searchNodes = (string: string) => {
    if (query.length === 0) return [{ text: string, highlighted: false }]
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig")
    const splitText = string.split(regex)
    const matches = string.match(regex)

    return splitText.reduce(
      (acc, node, i) => {
        acc.push({
          text: node,
          highlighted: false
        })

        if (i < splitText.length - 1 && matches) {
          acc.push({ text: matches[i], highlighted: true })
        }

        return acc
      },
      [] as Array<{ text: string; highlighted: boolean }>
    )
  }

  return (
    <Container
      onClick={() => {
        router.push(pathname + "?llm=" + llm.id, { scroll: false })
      }}
    >
      <Header>
        <Text weight="medium" size="lg" className="grow" color="dimmer">
          {searchNodes(llm.name).map(({ text, highlighted }, i) =>
            highlighted ? (
              <span key={i} className="text-foreground">
                {text}
              </span>
            ) : (
              <Fragment key={i}>{text}</Fragment>
            )
          )}
        </Text>
        <Text color="dimmer" size="sm">
          {llm.votes.length} votes
        </Text>
        <StatusBar>
          {llm.votes
            .sort(
              (a, b) =>
                Number(b.status === VoteStatus.approve) -
                Number(a.status === VoteStatus.approve)
            )
            .map((vote, i) => (
              <StatusVote key={i} status={vote.status} />
            ))}
        </StatusBar>
        <StatusBadge status={llm.status}>
          {llm.status === "pending"
            ? "Pending"
            : llm.status === "approved"
              ? "Approved"
              : "Rejected"}
        </StatusBadge>
      </Header>

      <Content>
        <ContentSection ref={ref}>
          <Text weight="medium">Metadata Fields</Text>
          <FieldTable fields={llm.fields} capLength={3} />
        </ContentSection>
        <ContentSection style={{ maxHeight: box?.height || "unset" }}>
          <Text weight="medium">Source Description</Text>
          <Text multiline="clamp-4" color="dimmer">
            {searchNodes(llm.sourceDescription).map(
              ({ text, highlighted }, i) =>
                highlighted ? (
                  <span key={i} className="text-foreground">
                    {text}
                  </span>
                ) : (
                  text
                )
            )}
          </Text>
        </ContentSection>
        <ContentOverlay />
      </Content>
    </Container>
  )
}

const {
  Container,
  Header,
  Content,
  ContentOverlay,
  ContentSection,
  StatusBadge,
  StatusBar,
  StatusVote
} = {
  Container: styled("div", {
    base: "flex flex-col gap-2 p-2 rounded-lg border-2 border-outline-dimmest bg-default hover:border-accent-dimmer cursor-pointer transition-colors"
  }),
  Header: styled("div", {
    base: "flex gap-2 items-center"
  }),
  Content: styled("div", {
    base: "flex gap-2 items-start w-full overflow-hidden relative max-h-[200px]"
  }),
  ContentOverlay: styled("div", {
    base: `absolute inset-0 bg-gradient-to-t from-default via-transparent via-transparent to-transparent flex flex-col justify-end max-h-[200px]`
  }),
  ContentSection: styled("div", {
    base: "flex flex-col gap-2 grow basis-0"
  }),
  StatusBadge: styled("div", {
    base: "rounded-md px-1.5 py-0.5 text-xs",
    variants: {
      status: {
        pending: "bg-amber-500/25 text-amber-300/75",
        approved: "bg-emerald-500/25 text-emerald-300/75",
        rejected: "bg-rose-500/25 text-rose-300/75"
      }
    }
  }),
  StatusBar: styled("div", {
    base: "rounded-full h-1.5 w-[120px] bg-higher flex"
  }),
  StatusVote: styled("div", {
    base: "grow basis-0 h-full first:rounded-l-full last:rounded-r-full shadow-[2px_0_0_2px,-2px_0_0_2px]",
    variants: {
      status: {
        approve: "bg-emerald-600 shadow-emerald-600/10",
        reject: "bg-rose-600 shadow-rose-600/10"
      }
    }
  })
}
