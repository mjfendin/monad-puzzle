import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Monad Puzzle - Farcaster Mini App",
  description: "A sliding tile puzzle game featuring the Monad logo. Built as a Farcaster Mini App using Farcade SDK.",
  keywords: ["puzzle", "game", "monad", "farcaster", "mini app", "farcade"],
  authors: [{ name: "Monad Puzzle Team" }],
  viewport: "width=device-width, initial-scale=1.0",
  openGraph: {
    title: "Monad Puzzle - Farcaster Mini App",
    description: "A sliding tile puzzle game featuring the Monad logo.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://monad-puzzle.vercel.app",
    siteName: "Monad Puzzle",
    images: [
      {
        url: "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/WJrCzoja5Knp/monad-1jNW27jKDl6XxiH2kng82xyuRNQBaB.jpg",
        width: 400,
        height: 400,
        alt: "Monad Puzzle Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monad Puzzle - Farcaster Mini App",
    description: "A sliding tile puzzle game featuring the Monad logo.",
    images: [
      "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/WJrCzoja5Knp/monad-1jNW27jKDl6XxiH2kng82xyuRNQBaB.jpg",
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#121212" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}