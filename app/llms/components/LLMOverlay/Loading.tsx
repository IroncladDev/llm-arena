import { Skeleton } from "@/components/ui/skeleton";
import Header from "./Header";
import { ContentContainer } from ".";

export default function Loading() {
  return (
    <ContentContainer>
      <Header>
        <Skeleton className="grow h-4" />
      </Header>
    </ContentContainer>
  );
}
