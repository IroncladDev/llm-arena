"use client";

import { MotionContainer } from "@/components/container";
import { MotionDiv } from "@/components/motion";
import { Button } from "@/components/ui/button";
import useClientRect from "@/hooks/useElementSize";
import gr from "@/lib/gradients";
import { colors, tokens } from "@/tailwind.config";
import { useAnimate, useMotionValue, useSpring } from "framer-motion";
import { GithubIcon, Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { styled } from "react-tailwind-variants";

export default function LoginPage() {
  const [ref, box] = useClientRect<HTMLDivElement>();
  const [scope, animate] = useAnimate();
  const [loading, setLoading] = useState(false);

  const gradient = useCallback(
    (p: number) => {
      const width = box?.width || 0;
      const height = box?.height || 0;

      const hw = (width / 2) * p;
      const hh = (height / 2) * p;

      return gr.merge(
        gr.radial(
          `circle at 50% ${110 + (1 - p) * 500}%`,
          tokens.colors.red[600] + "aa",
          tokens.colors.red[600] + "65 20%",
          "transparent 70%",
          "transparent",
        ),
        gr.rRadial(
          "circle at 50% 50%",
          ...gr.stack(
            [colors.clear, `${25 + (1 - p) * 25}vw`],
            [colors.outline.dimmest, `calc(${25 + (1 - p) * 25}vw + 2px)`],
          ),
        ),
        gr.linear(
          90,
          ...gr.stack(
            [colors.clear, `calc(50% - ${hw}px)`],
            [colors.outline.dimmest, `calc(50% - ${hw - 2}px)`],
            [colors.clear, `calc(50% + ${hw}px)`],
            [colors.outline.dimmest, `calc(50% + ${hw + 2}px)`],
            [colors.clear, `calc(50% + ${hh + 2}px)`],
          ),
        ),
        gr.linear(
          ...gr.stack(
            [colors.clear, `calc(50% - ${hh}px)`],
            [colors.outline.dimmest, `calc(50% - ${hh - 2}px)`],
            [colors.clear, `calc(50% + ${hh}px)`],
            [colors.outline.dimmest, `calc(50% + ${hh + 2}px)`],
            [colors.clear, `calc(50% + ${hh + 2}px)`],
          ),
        ),
        gr.linear(135, colors.root, "#292524"),
      );
    },
    [box],
  );

  const initialBackground = useMotionValue(gradient(0));
  const background = useSpring(initialBackground, {
    damping: 25,
  });

  useEffect(() => {
    if (box && background && scope.current) {
      background.set(gradient(1));
      animate(
        scope.current,
        {
          opacity: 1,
          translateY: 0,
        },
        { duration: 1 },
      );
    }
  }, [gradient, background, box, scope, animate]);

  return (
    <MotionContainer
      center
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background,
      }}
    >
      <ContentBackdrop initial={{ opacity: 0, translateY: 25 }} ref={scope}>
        <Content ref={ref}>
          <Header>Cross the Threshold</Header>
          <Button
            onClick={async () => {
              setLoading(true);
              await signIn("github", {
                callbackUrl: "/contribute",
              });
            }}
            variant="highlightElevated"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2Icon className="w-6 h-6 animate-spin" />
            ) : (
              <GithubIcon className="w-6 h-6" />
            )}
            <span>Continue with Github</span>
          </Button>
        </Content>
      </ContentBackdrop>
    </MotionContainer>
  );
}

const ContentBackdrop = styled(MotionDiv, {
  base: "min-w-[320px] p-1.5 flex gap-4 items-center rounded-xl bg-gradient-to-br from-accent-dimmer to-red-900/50 shadow-xl shadow-red-800/25",
});

const Content = styled("div", {
  base: "flex flex-col grow gap-4 p-6 items-center bg-default bg-gradient-to-b from-red-900/15 to-red-900/40 rounded-lg shadow-inner shadow-red-600/25",
});

const Header = styled("h1", {
  base: "text-2xl font-bold text-transparent bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text",
});
