import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://monad-puzzle.vercel.app"

  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Monad Puzzle - Farcaster Mini App</title>
        
        <!-- Farcaster Frame Meta Tags -->
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/frame/image" />
        <meta property="fc:frame:button:1" content="🎮 Play Puzzle" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}" />
        <meta property="fc:frame:button:2" content="📊 Leaderboard" />
        <meta property="fc:frame:button:2:action" content="post" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
        
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="Monad Puzzle - Farcaster Mini App" />
        <meta property="og:description" content="A sliding tile puzzle game featuring the Monad logo. Built as a Farcaster Mini App." />
        <meta property="og:image" content="${baseUrl}/api/frame/image" />
        <meta property="og:url" content="${baseUrl}" />
        <meta property="og:type" content="website" />
        
        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Monad Puzzle - Farcaster Mini App" />
        <meta name="twitter:description" content="A sliding tile puzzle game featuring the Monad logo." />
        <meta name="twitter:image" content="${baseUrl}/api/frame/image" />
      </head>
      <body>
        <h1>Monad Puzzle - Farcaster Mini App</h1>
        <p>A sliding tile puzzle game featuring the Monad logo.</p>
        <a href="${baseUrl}">Play Now</a>
      </body>
    </html>
  `

  return new NextResponse(frameHtml, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://monad-puzzle.vercel.app"

    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Monad Puzzle - Level Select</title>
          
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/frame/image" />
          <meta property="fc:frame:button:1" content="🟢 Easy" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="${baseUrl}?level=1" />
          <meta property="fc:frame:button:2" content="🟡 Medium" />
          <meta property="fc:frame:button:2:action" content="link" />
          <meta property="fc:frame:button:2:target" content="${baseUrl}?level=2" />
          <meta property="fc:frame:button:3" content="🔴 Expert" />
          <meta property="fc:frame:button:3:action" content="link" />
          <meta property="fc:frame:button:3:target" content="${baseUrl}?level=3" />
        </head>
        <body>
          <h1>Select Difficulty Level</h1>
        </body>
      </html>
    `

    return new NextResponse(frameHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Frame POST error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
