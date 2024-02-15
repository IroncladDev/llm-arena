import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";
import { AnimatePresence } from "@/components/motion";
import { QueryClientProvider } from "@/components/providers/QueryClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSession } from "@/lib/server/utils/session";
import { CurrentUserProvider } from "@/components/providers/CurrentUserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Compare LLMs side-by-side",
  description: "Create beautiful side-by-side LLM Comparisons",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const currentUserSession = await getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <SessionProvider session={session}>
            <CurrentUserProvider user={currentUserSession?.user || null}>
              <TooltipProvider>
                <AnimatePresence>{children}</AnimatePresence>
              </TooltipProvider>
            </CurrentUserProvider>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
