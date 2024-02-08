import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <Container center>
      <Link href="/login">
        <Button variant="highlight">Login</Button>
      </Link>
    </Container>
  );
}
