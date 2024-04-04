import { Metadata } from "next"

export const name = "LLM Arena"
export const title = "Compare LLMs side-by-side"
export const description =
  "Create and share beautiful side-by-side LLM Comparisons"
const url = process.env.NEXT_PUBLIC_SITE_URL
const coverImage = url + "/images/cover.png"

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
    url,
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
