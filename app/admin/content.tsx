"use client";

import { MotionContainer } from "@/components/container";
import { User, VoteStatus } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { updatePendingContributor } from "./actions/update-pending-contributor";
import Text from "@/components/ui/text";
import { ExternalLink, GithubIcon } from "lucide-react";
import { styled } from "react-tailwind-variants";
import { Button } from "@/components/ui/button";

export default function AdminPage({ waitlist }: { waitlist: Array<User> }) {
  const [users, action] = useFormState(updatePendingContributor, waitlist);

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Content>
        <Text size="h2" weight="bold" center>
          Contributor Waitlist
        </Text>
        <Text multiline color="dimmer" center className="self-center max-w-md">
          Users who have signed up for to be a contributor. Approving or
          rejecting a user will send them an email.
        </Text>
        <UserContainer>
          {users.map((user, i) => (
            <UserRow key={i} user={user} action={action} />
          ))}
        </UserContainer>
      </Content>
    </MotionContainer>
  );
}

const UserRow = ({
  user,
  action,
}: {
  user: User;
  action: (payload: FormData) => void;
}) => {
  const [status, setStatus] = useState<VoteStatus | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status !== null) {
      formRef.current?.requestSubmit();
    }
  }, [status]);

  return (
    <form action={action} ref={formRef}>
      <input type="hidden" name="status" value={status || ""} />
      <input type="hidden" name="userId" value={user.id} />
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
        <Button
          onClick={() => setStatus(VoteStatus.approve)}
          variant="highlight"
        >
          Approve
        </Button>
        <Button
          type="button"
          onClick={() => setStatus(VoteStatus.reject)}
          variant="outline"
        >
          Reject
        </Button>
      </UserRowContainer>
    </form>
  );
};

const Content = styled("div", {
  base: "flex flex-col gap-2 max-w-2xl self-center h-full w-full py-2",
});

const UserRowContainer = styled("div", {
  base: "flex gap-2 items-center py-2",
});

const UserRowStart = styled("div", {
  base: "flex grow",
});

const UserContainer = styled("div", {
  base: "flex flex-col grow divide-y divide-outline-dimmest",
});
