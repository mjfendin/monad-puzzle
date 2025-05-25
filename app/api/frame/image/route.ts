import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Title -->
      <text x="600" y="150" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">
        Monad Puzzle
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="200" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#9ca3af">
        Farcaster Mini App
      </text>
      
      <!-- Puzzle Grid Preview -->
      <g transform="translate(450, 250)">
        <!-- Grid background -->
        <rect x="0" y="0" width="300" height="300" fill="#374151" rx="12"/>
        
        <!-- Puzzle pieces -->
        <rect x="10" y="10" width="90" height="90" fill="#7c3aed" rx="8"/>
        <rect x="110" y="10" width="90" height="90" fill="#7c3aed" rx="8"/>
        <rect x="210" y="10" width="90" height="90" fill="#7c3aed" rx="8"/>
        <rect x="10" y="110" width="90" height="90" fill="#7c3aed" rx="8"/>
        <rect x="110" y="110" width="90" height="90" fill="#7c3aed" rx="8"/>
        <rect x="210" y="110" width="90" height="90" fill="#7c3aed" rx="8"/>
        <rect x="10" y="210" width="90" height="90" fill="#7c3aed" rx="8"/>
        <rect x="110" y="210" width="90" height="90" fill="#7c3aed" rx="8"/>
        <!-- Empty space -->
        <rect x="210" y="210" width="90" height="90" fill="none" stroke="#6b7280" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
        
        <!-- Monad logo elements on pieces -->
        <circle cx="55" cy="55" r="25" fill="white"/>
        <circle cx="155" cy="55" r="25" fill="white"/>
        <circle cx="255" cy="55" r="25" fill="white"/>
        <circle cx="55" cy="155" r="25" fill="white"/>
        <circle cx="155" cy="155" r="25" fill="white"/>
        <circle cx="255" cy="155" r="25" fill="white"/>
        <circle cx="55" cy="255" r="25" fill="white"/>
        <circle cx="155" cy="255" r="25" fill="white"/>
      </g>
      
      <!-- Call to action -->
      <text x="600" y="590" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#d1d5db">
        Click "Play Puzzle" to start the game!
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
