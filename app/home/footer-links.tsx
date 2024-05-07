"use client"

import { useCurrentUser } from "@/components/providers/CurrentUserProvider"
import Link from "next/link"
import { styled } from "react-tailwind-variants"
import Text from "@/components/ui/text"

export async function FooterLinks() {
  const user = useCurrentUser()

  return (
    <Container>
      <FooterLink size="base" asChild>
        <Link href="/about">About</Link>
      </FooterLink>
      {(!user || user.role === "user") && (
        <FooterLink color="dimmest" size="base" asChild>
          <Link href="/contribute">Contribute</Link>
        </FooterLink>
      )}
      {user?.role === "pending" && (
        <FooterLink color="dimmest" size="base" asChild>
          <Link href="/contribute/waitlist">Waitlist</Link>
        </FooterLink>
      )}
      {!user && (
        <FooterLink color="dimmest" size="base" asChild>
          <Link href="/login">Login</Link>
        </FooterLink>
      )}
      <FooterLink color="dimmest" size="base" asChild>
        <a href="https://github.com/IroncladDev/llm-arena" target="_blank">
          Github
        </a>
      </FooterLink>
      {user?.role === "contributor" && (
        <FooterLink color="dimmest" size="base" asChild>
          <Link href="/llms">LLMs</Link>
        </FooterLink>
      )}
      {user?.role === "admin" && (
        <FooterLink color="dimmest" size="base" asChild>
          <Link href="/admin">Admin</Link>
        </FooterLink>
      )}
      {(user?.role === "contributor" || user?.role === "admin") && (
        <FooterLink color="dimmest" size="base" asChild>
          <Link href="/submit">Submit an LLM</Link>
        </FooterLink>
      )}
    </Container>
  )
}

const { FooterLink, Container } = {
  Container: styled("div", {
    base: "flex gap-8 items-center justify-center w-full",
  }),
  FooterLink: styled(Text, {
    base: "text-accent-dimmer hover:text-accent transition-colors",
  }),
}
