"use client";

import { MotionContainer } from "@/components/container";
import { MotionDiv } from "@/components/motion";
import gr from "@/lib/gradients";
import { colors, tokens } from "@/tailwind.config";
import { useAnimate, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect } from "react";
import Text from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { joinAsContributor } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { styled } from "react-tailwind-variants";

export default function Contribute() {
  const [scope, animate] = useAnimate();
  const [waitlistStatus, action] = useFormState(joinAsContributor, null);

  const gradient = useCallback((p: number) => {
    const pFactor = (1 - p) * 100;

    return gr.merge(
      gr.radial(
        `circle at ${-pFactor}% ${100 + pFactor}%`,
        tokens.colors.red[600] + "88",
        tokens.colors.red[600] + "44 30%",
        "transparent 70%",
        "transparent",
      ),
      gr.radial(
        `circle at ${p * 100 - 50}% ${100 - p * 50}%`,
        tokens.colors.red[600] + "44",
        tokens.colors.red[600] + "22 50%",
        "transparent 70%",
        "transparent",
      ),
      gr.rRadial(
        "circle at 0% 100%",
        ...gr.stack(
          ["transparent", `calc(${60 - 40 * p}% - 2px)`],
          [colors.outline.dimmest, `calc(${60 - 40 * p}%)`],
        ),
      ),
      gr.radial(
        `circle at 50% ${50 * p}%`,
        ...gr.stack(
          [colors.clear, "calc(60% - 2px)"],
          [colors.outline.dimmest, "calc(60%)"],
          [colors.clear, "100%"],
        ),
      ),
    );
  }, []);

  const initialBackground = useMotionValue(gradient(0));
  const background = useSpring(initialBackground, { damping: 25 });

  useEffect(() => {
    if (background && scope.current) {
      background.set(gradient(1));
      animate(scope.current, { opacity: 1, translateY: 0 }, { duration: 1 });
    }
  }, [background, gradient, animate, scope]);

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background }}
      center
    >
      {waitlistStatus?.success ? (
        <Content>
          <Text size="xl" weight="semibold">
            You&apos;re on the waitlist!
          </Text>

          <Text color="dimmer" multiline>
            You are #{waitlistStatus.waitlistNumber} on the waitlist.
            You&apos;ll receive an email when you can start contributing.
          </Text>

          <Button variant="highlightElevated" className="grow" asChild>
            <Link href="/compare">Start Exploring</Link>
          </Button>
        </Content>
      ) : (
        <Content initial={{ opacity: 0, translateY: 25 }} ref={scope}>
          <Text size="xl" weight="semibold">
            Contribute
          </Text>
          <Text color="dimmer" multiline>
            All comparable LLMs / AI Models on the platform are added manually
            by contributors. Would you like to be a part of it?
          </Text>
          <form action={action} className="w-full flex">
            <JoinAsContributorButton />
          </form>
          <Button variant="outline" className="grow" asChild>
            <Link href="/compare">No thanks</Link>
          </Button>
        </Content>
      )}
    </MotionContainer>
  );
}

function JoinAsContributorButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="highlightElevated" className="grow">
      {pending ? (
        <Loader2 className="w-4 h-4" />
      ) : (
        <UserPlusIcon className="w-4 h-4" />
      )}
      <Text>Count me in</Text>
    </Button>
  );
}

const Content = styled(MotionDiv, {
  base: "border-2 border-outline-dimmer bg-gradient-to-b from-higher to-root rounded-xl p-6 flex flex-col gap-3 shadow-lg shadow-black/50 max-w-sm",
});
