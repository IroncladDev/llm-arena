import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { styled } from "react-tailwind-variants";

export default function Header({
  children = null,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <HeaderBase className={className}>
      {children}
      <SheetClose asChild>
        <CloseButton size="icon">
          <XIcon className="w-4 h-4" />
        </CloseButton>
      </SheetClose>
    </HeaderBase>
  );
}

const HeaderBase = styled("div", {
  base: "flex items-center gap-4",
});

const CloseButton = styled(Button, {
  base: "outline-none shrink-0",
});
