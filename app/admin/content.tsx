"use client"

import { Container } from "@/components/container"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import { User, VoteStatus } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, GithubIcon } from "lucide-react"
import { useState } from "react"
import { updatePendingContributor } from "./actions/update-pending-contributor"
import Flex from "@/components/ui/flex"

export default function AdminPage({ waitlist }: { waitlist: Array<User> }) {
  const [users, setUsers] = useState(waitlist)

  return (
    <Container>
      <Navbar />
      <Flex
        col
        gap={2}
        width="full"
        height="full"
        className="max-w-2xl self-center py-8"
      >
        <Text size="h2" weight="bold" center>
          Contributor Waitlist
        </Text>
        <Text multiline color="dimmer" center className="self-center max-w-md">
          Users who have signed up for to be a contributor. Approving or
          rejecting a user will send them an email. Avoid rejecting users unless
          they have malicious projects on their Github account.
        </Text>
        <Flex col grow className="divide-y divide-outline-dimmest">
          {users.map((user, i) => (
            <UserRow key={i} user={user} setUsers={setUsers} />
          ))}
        </Flex>
      </Flex>
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
    <Flex gap={2} align="center" className="py-2">
      <Flex grow gap={2} align="center">
        <Button asChild variant="highlight" size="sm">
          <a href={"https://github.com/" + user.handle} target="_blank">
            <GithubIcon size={16} />
            <Text>{user.handle}</Text>
            <ExternalLink size={16} />
          </a>
        </Button>
        <Text color="dimmest">
          Updated {formatDistanceToNow(user.updatedAt)} ago
        </Text>
      </Flex>
      <Button
        onClick={() => submit(VoteStatus.approve)}
        variant="highlight"
        size="sm"
      >
        Approve
      </Button>
      <Button
        type="button"
        onClick={() => submit(VoteStatus.reject)}
        variant="outline"
        size="sm"
      >
        Reject
      </Button>
    </Flex>
  )
}
