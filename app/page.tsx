"use client"

import { Container } from "@/components/container"
import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import Link from "next/link"
import { styled } from "react-tailwind-variants"
import Selector from "./home/selector"

export default function Page() {
  return (
    <Content
      style={{
        background: gr.merge(
          gr.radial(
            "circle at 75% 110%",
            tokens.colors.default,
            tokens.colors.default + " 25%",
            tokens.colors.transparent + " 70%",
            tokens.colors.transparent
          )
        )
      }}
    >
      <SelectorContainer>
        <Selector />
      </SelectorContainer>
      <Footer
        style={{
          backgroundImage: gr.radial(
            "ellipse at 50% 110%",
            tokens.colors.red[500] + "45",
            tokens.colors.red[500] + "15 30%",
            tokens.colors.transparent + " 70%",
            tokens.colors.transparent
          )
        }}
      >
        <FooterLinks>
          <FooterLink size="base" asChild>
            <Link href="/about">About</Link>
          </FooterLink>
          <FooterLink color="dimmest" size="base" asChild>
            <Link href="/contribute">Contribute</Link>
          </FooterLink>
          <FooterLink color="dimmest" size="base" asChild>
            <Link href="/login">Login</Link>
          </FooterLink>
          <FooterLink color="dimmest" size="base" asChild>
            <a href="https://github.com/IroncladDev/ai-to-ai" target="_blank">
              Github
            </a>
          </FooterLink>
        </FooterLinks>
        <Text color="dimmest">
          Made by{" "}
          <AuthorLink href="https://connerow.dev" target="_blank">
            IroncladDev
          </AuthorLink>{" "}
          &copy;{" "}
          {new Date().getFullYear() === 2024
            ? 2024
            : `2024 - ${new Date().getFullYear()}`}
        </Text>
      </Footer>
    </Content>
  )
}

const {
  Content,
  SelectorContainer,
  Footer,
  FooterLink,
  FooterLinks,
  AuthorLink
} = {
  Content: styled(Container, {
    base: "flex flex-col h-screen"
  }),
  SelectorContainer: styled("div", {
    base: "flex flex-col items-center justify-center grow p-4"
  }),
  Footer: styled("footer", {
    base: "flex flex-col gap-6 items-center w-full p-8"
  }),
  FooterLinks: styled("div", {
    base: "flex gap-8 items-center justify-center w-full"
  }),
  FooterLink: styled(Text, {
    base: "text-accent-dimmer hover:text-accent transition-colors"
  }),
  AuthorLink: styled("a", {
    base: "text-accent-dimmer hover:text-accent transition-colors"
  })
}
