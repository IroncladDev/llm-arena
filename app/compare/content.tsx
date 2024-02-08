"use client";

import { MotionContainer } from "@/components/container";

export default function Content() {
  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Compare
    </MotionContainer>
  );
}
