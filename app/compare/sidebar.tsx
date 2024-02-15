import { styled } from "react-tailwind-variants";
import Text from "@/components/ui/text";
import { ExternalLink, Hexagon, PlusIcon, XIcon } from "lucide-react";
import LLMSearch from "./search";
import OverflowScroll from "@/components/overflow";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { llmsAtom, sidebarAtom } from "./state";

export default function Sidebar() {
  const [llms, setLLMs] = useAtom(llmsAtom);
  const [open, setOpen] = useAtom(sidebarAtom);

  return (
    <Container>
      <Content>
        <Header>
          <LLMSearch
            llms={llms}
            setLLMs={setLLMs}
            placeholder="Find an LLM..."
            id="llm-sidebar-search"
          />
          {open && (
            <Button
              size="icon"
              onClick={() => setOpen(false)}
              variant="ghost"
              className="bg-root"
            >
              <XIcon className="text-foreground-dimmer w-4 h-4" />
            </Button>
          )}
        </Header>

        <OverflowScroll>
          {llms.length > 0 ? (
            <SelectedLLMs>
              {llms.map((llm) => (
                <SelectedLLM key={llm.id}>
                  <SelectedLLMName>
                    <Hexagon className="w-4 h-4 text-foreground-dimmest" />
                    <Text color="dimmer">{llm.name}</Text>
                  </SelectedLLMName>
                  <RemoveSelectedLLMButton
                    onClick={() => {
                      setLLMs(llms.filter((l) => l.id !== llm.id));
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                  </RemoveSelectedLLMButton>
                </SelectedLLM>
              ))}
              <Button asChild className="mt-2">
                <label htmlFor="llm-sidebar-search">
                  <PlusIcon />
                  <Text>Add another LLM</Text>
                </label>
              </Button>
            </SelectedLLMs>
          ) : (
            <EmptyContainer>
              <Text color="dimmest">No LLMs selected</Text>
              <Button asChild>
                <label htmlFor="llm-sidebar-search">
                  <PlusIcon className="w-4 h-4" />
                  <Text color="dimmer">Find an LLM</Text>
                </label>
              </Button>
            </EmptyContainer>
          )}
        </OverflowScroll>
      </Content>
      <Footer>
        <FooterSection>
          <Text weight="bold" size="lg">
            AI to AI
          </Text>
          <Text multiline color="dimmer">
            Beautiful side-by-side LLM comparisons
          </Text>
        </FooterSection>
        <FooterSection>
          <FooterLinks>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contribute">Contribute</FooterLink>
            <FooterLink href="/github" target="_blank">
              Github
            </FooterLink>
          </FooterLinks>
        </FooterSection>
        <FooterSection>
          <Text color="dimmest">
            &copy;{" "}
            <a
              href="https://connerow.dev"
              target="_blank"
              className="text-accent-dimmer"
            >
              IroncladDev
            </a>{" "}
            2024
            {new Date().getFullYear() > 2024
              ? "-" + new Date().getFullYear()
              : ""}
          </Text>
        </FooterSection>
      </Footer>
    </Container>
  );
}

const Header = styled("div", {
  base: "flex items-center gap-2",
});

const Content = styled("div", {
  base: "flex flex-col gap-4 p-4 grow",
});

const Footer = styled("footer", {
  base: "flex flex-col divide-y divide-outline-dimmer px-4 bg-default/50 border-t-2 border-outline-dimmest",
});

const FooterSection = styled("div", {
  base: "flex flex-col gap-2 py-4",
});

const FooterLinks = styled("div", {
  base: "flex flex-wrap gap-2 items-center justify-center w-full",
});

const FooterLink = styled(Link, {
  base: "text-accent-dimmer text-sm",
});

const Container = styled("div", {
  base: "flex flex-col grow",
});

const SelectedLLMs = styled("div", {
  base: "flex flex-col gap-2",
});

const SelectedLLM = styled("div", {
  base: "flex gap-2 items-center border-2 bg-default/50 border-outline-dimmest/50 rounded-md text-foreground-dimmer",
});

const SelectedLLMName = styled("div", {
  base: "flex gap-2 items-center p-2 grow h-full",
});

const RemoveSelectedLLMButton = styled("button", {
  base: "p-2 h-full",
});

const EmptyContainer = styled("div", {
  base: "flex flex-col gap-4 p-4 items-center justify-center grow w-full border-2 border-dashed border-outline-dimmest rounded-lg",
});
