"use client"

import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import { User, VoteStatus } from "@prisma/client"
import { ExternalLink, GithubIcon } from "lucide-react"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { updatePendingContributor } from "./actions/update-pending-contributor"

export default function AdminPage({ waitlist }: { waitlist: Array<User> }) {
  const [users, setUsers] = useState(waitlist)

  return (
    <Container>
      <Content>
        <Text size="h2" weight="bold" center>
          Contributor Waitlist
        </Text>
        <Text multiline color="dimmer" center className="self-center max-w-md">
          Users who have signed up for to be a contributor. Approving or
          rejecting a user will send them an email. Avoid rejecting users unless
          they have malicious projects on their Github account.
        </Text>
        <UserContainer>
          {users.map((user, i) => (
            <UserRow key={i} user={user} setUsers={setUsers} />
          ))}
        </UserContainer>
      </Content>
    </Container>
  )
}

const UserRow = ({
  user,
  setUsers
}: {
  user: User
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}) => {
  const submit = async (status: VoteStatus) => {
    const res = await updatePendingContributor({
      status,
      userId: user.id
    })

    if (res.success) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } else {
      alert(res.message)
    }
  }

  return (
    <UserRowContainer>
      <UserRowStart>
        <Button asChild variant="highlight">
          <a href={"https://github.com/" + user.handle} target="_blank">
            <GithubIcon size={16} />
            <Text>{user.handle}</Text>
            <ExternalLink size={16} />
          </a>
        </Button>
      </UserRowStart>
      <Button onClick={() => submit(VoteStatus.approve)} variant="highlight">
        Approve
      </Button>
      <Button
        type="button"
        onClick={() => submit(VoteStatus.reject)}
        variant="outline"
      >
        Reject
      </Button>
    </UserRowContainer>
  )
}

const Content = styled("div", {
  base: "flex flex-col gap-2 max-w-2xl self-center h-full w-full py-2"
})

const UserRowContainer = styled("div", {
  base: "flex gap-2 items-center py-2"
})

const UserRowStart = styled("div", {
  base: "flex grow"
})

const UserContainer = styled("div", {
  base: "flex flex-col grow divide-y divide-outline-dimmest"
})
