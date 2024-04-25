"use client"

import { Container } from "@/components/container"
import Navbar from "@/components/navbar"
import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import LLMOverlay, {
  ChangeRequestWithVote,
} from "../llms/components/LLMOverlay"
import { getChangeRequests } from "./actions/get-change-requests"
import ChangeRequestItem from "./components/ChangeRequestItem"

export default function ChangesPage({
  initialRequests,
}: {
  initialRequests: ChangeRequestWithVote[]
}) {
  const [changeRequests, setChangeRequests] =
    useState<ChangeRequestWithVote[]>(initialRequests)

  const refetch = async () => {
    setChangeRequests(await getChangeRequests())
  }

  return (
    <Container>
      <Navbar />
      <Content>
        <Header>
          <Text size="h2" weight="bold">
            Change Requests
          </Text>
        </Header>
        <Flex col gap={2}>
          {changeRequests.map(r => (
            <ChangeRequestItem key={r.id} request={r} refetch={refetch} />
          ))}
        </Flex>
      </Content>
      <LLMOverlay />
    </Container>
  )
}

const { Content, Header } = {
  Content: styled("div", {
    base: "flex flex-col gap-4 max-w-2xl self-center min-h-screen h-full w-full p-4",
  }),
  Header: styled("div", {
    base: "flex items-center gap-4 justify-between pb-4 border-b-2 border-outline-dimmest",
  }),
}
