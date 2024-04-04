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

const name = "AI to AI"
const title = "Compare LLMs side-by-side"
const description = "Create and share beautiful side-by-side LLM Comparisons"
const url = process.env.NEXT_PUBLIC_SITE_URL
const coverImage = new URL(url, "/images/cover.png").toString()

export const metadata: Metadata = {
  title,
  description,
  icons: ["/logo.svg"],
  keywords: ["Compare", "LLMs", "AI", "Models"],
  authors: [
    { name: "IroncladDev", url: "https://x.com/IroncladDev" },
    { name: "Amjad Masad", url: "https://x.com/amasad" }
  ],
  applicationName: name,
  creator: "IroncladDev",
  category: "technology",
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [coverImage]
  },
  robots: {
    "max-image-preview": "large",
    index: true,
    follow: true,
    nocache: true
  },
  openGraph: {
    title,
    siteName: name,
    description,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    images: [
      {
        url: coverImage,
        width: 3000,
        height: 1700
      }
    ],
    type: "website"
  }
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
      <body className={inter.className}>
        <QueryClientProvider>
          <SessionProvider session={session}>
            <CurrentUserProvider user={currentUserSession?.user || null}>
              <TooltipProvider delayDuration={500}>{children}</TooltipProvider>
            </CurrentUserProvider>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
