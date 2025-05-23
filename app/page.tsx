// app/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/frame-sdk'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const postFrame = params.get('post_frame')

    if (postFrame) {
      // Simulate loading process before showing the game
      const timeout = setTimeout(async () => {
        setLoading(false)

        // Notify Farcaster that the app is ready and disable gestures
        await sdk.actions.ready({ disableNativeGestures: true })
      }, 1000)

      return () => clearTimeout(timeout)
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading game...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-bold">🎮 Monad Puzzle Game Loaded!</p>
    </div>
  )
}
