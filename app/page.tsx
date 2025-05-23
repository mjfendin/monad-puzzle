// app/page.tsx
'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/frame-sdk'

export default function Home() {
  useEffect(() => {
    const init = async () => {
      await sdk.actions.ready({ disableNativeGestures: true })
    }
    init()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Monad Puzzle</h1>
      <p className="text-lg text-center">
        Welcome to the Farcaster Mini App for Monad Puzzle!
      </p>
    </main>
  )
}