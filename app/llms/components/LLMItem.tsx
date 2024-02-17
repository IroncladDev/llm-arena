import { LLMWithRelations } from "@/app/api/search/types"
import { formatNumber } from "@/components/LargeNumberInput"
import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import { VoteStatus } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { Fragment } from "react"
import { styled } from "react-tailwind-variants"

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
          <FieldRows>
            {llm.fields.slice(0, 4).map((field, i) => (
              <FieldRow key={i}>
                <FieldItem>
                  <Text color="dimmer">
                    {searchNodes(field.metaProperty.name).map(
                      ({ text, highlighted }, i) =>
                        highlighted ? (
                          <span key={i} className="text-foreground">
                            {text}
                          </span>
                        ) : (
                          <Fragment key={i}>{text}</Fragment>
                        )
                    )}
                  </Text>
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
            {llm.fields.length > 4 && (
              <FieldRow>
                <FieldItem className="flex justify-center">
                  <Text center color="dimmer">
                    {llm.fields.length - 4} more
                  </Text>
                </FieldItem>
              </FieldRow>
            )}
          </FieldRows>
        </ContentSection>
        <ContentSection style={{ maxHeight: box?.height || "unset" }}>
          <Text weight="medium">Source Description</Text>
          <Text multiline color="dimmer" markdown>
            {searchNodes(llm.sourceDescription).map(
              ({ text, highlighted }, i) =>
                highlighted ? (
                  <span key={i} className="text-foreground">
                    {text}
                  </span>
                ) : (
                  <Fragment key={i}>{text}</Fragment>
                )
            )}
          </Text>
        </ContentSection>
        <ContentOverlay />
      </Content>
    </Container>
  )
}

const Container = styled("div", {
  base: "flex flex-col gap-2 p-2 rounded-lg border-2 border-outline-dimmest bg-default hover:border-accent-dimmer cursor-pointer transition-colors"
})

const Header = styled("div", {
  base: "flex gap-2 items-center"
})

const StatusBadge = styled("div", {
  base: "rounded-md px-1.5 py-0.5 text-xs",
  variants: {
    status: {
      pending: "bg-amber-500/25 text-amber-300/75",
      approved: "bg-emerald-500/25 text-emerald-300/75",
      rejected: "bg-rose-500/25 text-rose-300/75"
    }
  }
})

export const StatusBar = styled("div", {
  base: "rounded-full h-1.5 w-[120px] bg-higher flex"
})

export const StatusVote = styled("div", {
  base: "grow basis-0 h-full first:rounded-l-full last:rounded-r-full shadow-[2px_0_0_2px,-2px_0_0_2px]",
  variants: {
    status: {
      approve: "bg-emerald-600 shadow-emerald-600/10",
      reject: "bg-rose-600 shadow-rose-600/10"
    }
  }
})

const Content = styled("div", {
  base: "flex gap-2 items-start w-full overflow-hidden relative max-h-[200px]"
})

const ContentOverlay = styled("div", {
  base: `absolute inset-0 bg-gradient-to-t from-default via-transparent via-transparent to-transparent flex flex-col justify-end max-h-[200px]`
})

const ContentSection = styled("div", {
  base: "flex flex-col gap-2 grow basis-0"
})

export const FieldRows = styled("div", {
  base: "flex flex-col"
})

export const FieldRow = styled("div", {
  base: "flex items-center border-t-2 last:border-b-2 border-outline-dimmest"
})

export const FieldItem = styled("div", {
  base: "grow basis-0 p-1 border-l-2 last:border-r-2 border-outline-dimmest"
})
