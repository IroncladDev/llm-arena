import { AnimatePresence } from "@/components/motion"
import { CurrentUserProvider } from "@/components/providers/CurrentUserProvider"
import { QueryClientProvider } from "@/components/providers/QueryClientProvider"
import SessionProvider from "@/components/providers/SessionProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getSession } from "@/lib/server/utils/session"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Compare LLMs side-by-side",
  description: "Create beautiful side-by-side LLM Comparisons",
  icons: ["/logo.svg"]
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const currentUserSession = await getSession()

  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="AI to AI" />
        <meta name="twitter:title" content="AI to AI" />
        <meta property="og:site_name" content="AI to AI" />

        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="copyright"
          content="Copyright 2024 IroncladDev. All rights reserved."
        />

        <meta
          property="og:description"
          content="Create beautiful side-by-side LLM Comparisons."
        />
        <meta
          name="description"
          content="Create beautiful side-by-side LLM Comparisons."
        />
        <meta
          name="twitter:description"
          content="Create beautiful side-by-side LLM Comparisons."
        />

        <meta property="og:image" content="https://ai-to.ai/images/cover.png" />
        <meta
          name="twitter:image"
          content="https://ai-to.ai/images/cover.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="3000" />
        <meta property="og:image:height" content="1700" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:url" content="https://ai-to.ai" />
        <meta name="twitter:url" content="https://ai-to.ai" />

        <meta property="og:type" content="website" />

        <meta name="twitter:creator" content="@IroncladDev" />
      </head>
      <body className={inter.className}>
        <QueryClientProvider>
          <SessionProvider session={session}>
            <CurrentUserProvider user={currentUserSession?.user || null}>
              <TooltipProvider delayDuration={500}>
                <AnimatePresence>{children}</AnimatePresence>
              </TooltipProvider>
            </CurrentUserProvider>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
