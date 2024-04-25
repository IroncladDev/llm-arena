"use client"

import { UserRole } from "@prisma/client"
import {
  ExternalLink,
  GitPullRequestIcon,
  HexagonIcon,
  HomeIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { styled } from "react-tailwind-variants"
import { useCurrentUser } from "./providers/CurrentUserProvider"

export default function Navbar() {
  const user = useCurrentUser()
  const pathname = usePathname()

  return (
    user?.role === "contributor" ||
    (user?.role === "admin" && (
      <Container>
        <Content>
          <NavLink asChild>
            <Link href="/">
              <HomeIcon className="w-4 h-4" />
              Home
            </Link>
          </NavLink>

          <NavLink asChild highlighted={pathname === "/llms"}>
            <Link href="/llms">
              <HexagonIcon className="w-4 h-4" />
              LLMs
            </Link>
          </NavLink>

          <NavLink asChild highlighted={pathname === "/changes"}>
            <Link href="/changes">
              <GitPullRequestIcon className="w-4 h-4" />
              Change Requests
            </Link>
          </NavLink>

          {user.role === UserRole.admin && (
            <NavLink asChild highlighted={pathname === "/admin"}>
              <Link href="/admin">
                <SettingsIcon className="w-4 h-4" />
                Admin
              </Link>
            </NavLink>
          )}

          <NavLink
            href="https://github.com/IroncladDev/llm-arena/blob/main/docs/contributor-guide.md"
            target="_blank"
          >
            Contributor Guide
            <ExternalLink className="w-4 h-4" />
          </NavLink>
          {user.role === UserRole.admin && (
            <NavLink
              href="https://github.com/IroncladDev/llm-arena/blob/main/docs/admin-guide.md"
              target="_blank"
            >
              Admin Guide
              <ExternalLink className="w-4 h-4" />
            </NavLink>
          )}

          <NavLink asChild highlighted={pathname === "/submit"}>
            <Link href="/submit">
              <PlusIcon className="w-4 h-4" />
              Submit an LLM
            </Link>
          </NavLink>
        </Content>
      </Container>
    ))
  )
}

const { Container, Content, NavLink } = {
  Container: styled("div", {
    base: "flex items-center justify-center p-4 w-full border-b-2 border-b-higher bg-default",
  }),
  Content: styled("div", {
    base: "max-w-[1024px] flex flex-wrap justify-center items-center divide-x-2 divide-higher gap-y-2",
  }),
  NavLink: styled("a", {
    base: "text-foreground-dimmer text-xs hover:text-accent-dimmer transition-colors px-4 inline-flex items-center gap-1",
    variants: {
      highlighted: {
        true: "text-accent",
      },
    },
  }),
}
