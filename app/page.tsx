"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import Script from "next/script"

// Level configuration
const LEVEL_CONFIG = {
  1: {
    size: 3,
    time: 240,
    asset:
      "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/WJrCzoja5Knp/monad-1jNW27jKDl6XxiH2kng82xyuRNQBaB.jpg",
    name: "Level 1 (Easy)",
  },
  2: {
    size: 4,
    time: 420,
    asset:
      "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/WJrCzoja5Knp/patapak-u9ITGAqeSSqLycXRd4nOxrGcBbNIQ2.png",
    name: "Level 2 (Medium)",
  },
  3: {
    size: 5,
    time: 600,
    asset:
      "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/WJrCzoja5Knp/indonads-Ug2AoCDCH32I9SRGg65Z6bX02pWCkP.jpg",
    name: "Level 3 (Expert)",
  },
}

declare global {
  interface Window {
    FarcadeSDK: {
      on: (event: string, callback: (data?: any) => void) => void
      singlePlayer: {
        actions: {
          ready: () => void
          gameOver: (data: { score: number }) => void
          hapticFeedback: () => void
        }
      }
    }
  }
}

export default function MonadPuzzle() {
  const [tiles, setTiles] = useState<number[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(LEVEL_CONFIG[1].time)
  const [timerStarted, setTimerStarted] = useState(false)
  const [message, setMessage] = useState("")
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0 })
  const [totalScore, setTotalScore] = useState(0)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const config = LEVEL_CONFIG[currentLevel as keyof typeof LEVEL_CONFIG]

  // Initialize Farcade SDK
  const initializeFarcadeSDK = useCallback(() => {
    if (typeof window !== "undefined" && window.FarcadeSDK) {
      setSdkLoaded(true)

      window.FarcadeSDK.on("play_again", () => {
        startGame()
      })

      window.FarcadeSDK.on("toggle_mute", (data) => {
        console.log("Mute state:", data?.isMuted)
      })
    }
  }, [])

  // Shuffle array with solvability check
  const shuffleArray = (arr: number[]) => {
    const shuffled = [...arr]
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
    } while (!isSolvable(shuffled))
    return shuffled
  }

  // Check if puzzle is solvable
  const isSolvable = (array: number[]) => {
    let inv = 0
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i] && array[j] && array[i] > array[j]) inv++
      }
    }
    return inv % 2 === 0
  }

  // Get score variant based on remaining time
  const getScoreVariant = (timeLeftValue: number) => {
    const total = config.time
    const timeRatio = timeLeftValue / total
    if (timeRatio >= 0.9) return 300
    if (timeRatio >= 0.75) return 250
    if (timeRatio >= 0.5) return 200
    if (timeRatio >= 0.25) return 150
    if (timeRatio >= 0.1) return 100
    return 50
  }

  // Count correct placed tiles
  const checkCorrectPieces = (currentTiles: number[]) => {
    if (!timerStarted) return 0
    let correctPieces = 0
    for (let i = 0; i < currentTiles.length - 1; i++) {
      if (currentTiles[i] === i + 1) correctPieces++
    }
    if (currentTiles[currentTiles.length - 1] === 0) correctPieces++
    return correctPieces
  }

  // Update total score
  const updateScoreDisplay = useCallback(() => {
    const newTotalScore = Object.values(levelScores).reduce((a, b) => a + b, 0)
    setTotalScore(newTotalScore)
  }, [levelScores])

  // Start or restart game
  const startGame = useCallback(
    (resetTimer = true) => {
      setMessage("")

      if (countdownRef.current) {
        clearInterval(countdownRef.current)
        countdownRef.current = null
      }

      if (resetTimer) {
        setTimeLeft(config.time)
        countdownRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            const newTime = prev - 1
            if (newTime <= 0) {
              if (countdownRef.current) {
                clearInterval(countdownRef.current)
                countdownRef.current = null
              }
              // Time's up - calculate partial score
              setTiles((currentTiles) => {
                let correct = 0
                for (let i = 0; i < currentTiles.length - 1; i++) {
                  if (currentTiles[i] === i + 1) correct++
                }
                if (currentTiles[currentTiles.length - 1] === 0) correct++

                const percentComplete = correct / currentTiles.length
                const maxScore = getScoreVariant(1)
                const partialScore = Math.floor(maxScore * percentComplete)
                const correctPiecesBonus = correct * 125
                const finalScore = partialScore + correctPiecesBonus

                setLevelScores((prev) => ({ ...prev, [currentLevel]: finalScore }))

                if (currentLevel === 3) {
                  setMessage(`⏱️ Time's up on Expert Level! 
Score: ${finalScore} (Base: ${partialScore} + Bonus: ${correctPiecesBonus})

🎯 So close to completing all levels! Try again!`)
                } else {
                  setMessage(`⏱️ Waktu habis! Skor: ${finalScore} (Base: ${partialScore} + Bonus: ${correctPiecesBonus})`)
                }

                if (sdkLoaded && window.FarcadeSDK) {
                  const newTotal = Object.values({ ...levelScores, [currentLevel]: finalScore }).reduce(
                    (a, b) => a + b,
                    0,
                  )
                  window.FarcadeSDK.singlePlayer.actions.gameOver({ score: newTotal })
                }

                return currentTiles
              })
              setTimerStarted(false)
              return 0
            }
            return newTime
          })
        }, 1000)
      }

      setTimerStarted(true)

      // Generate initial tiles and shuffle
      const initialTiles = Array.from({ length: config.size * config.size }, (_, i) => i)
      const shuffledTiles = shuffleArray(initialTiles)
      setTiles(shuffledTiles)

      if (sdkLoaded && window.FarcadeSDK) {
        window.FarcadeSDK.singlePlayer.actions.ready()
      }
    },
    [config, currentLevel, sdkLoaded, levelScores],
  )

  // Move tile logic
  const moveTile = (index: number) => {
    if (!timerStarted) return

    const emptyIndex = tiles.indexOf(0)
    const size = config.size

    const tileRow = Math.floor(index / size)
    const tileCol = index % size
    const emptyRow = Math.floor(emptyIndex / size)
    const emptyCol = emptyIndex % size

    const rowDiff = Math.abs(tileRow - emptyRow)
    const colDiff = Math.abs(tileCol - emptyCol)

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      const correctBefore = checkCorrectPieces(tiles)

      const newTiles = [...tiles]
      ;[newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]]

      setTiles(newTiles)

      const correctAfter = checkCorrectPieces(newTiles)

      if (correctAfter > correctBefore) {
        const bonus = 125 * (correctAfter - correctBefore)
        setLevelScores((prev) => ({
          ...prev,
          [currentLevel]: (prev[currentLevel as keyof typeof prev] || 0) + bonus,
        }))
        setMessage(`+${bonus} points for correct placement!`)
        setTimeout(() => setMessage(""), 1000)
      }

      // Check win condition
      let isWin = true
      for (let i = 0; i < newTiles.length - 1; i++) {
        if (newTiles[i] !== i + 1) {
          isWin = false
          break
        }
      }
      if (newTiles[newTiles.length - 1] !== 0) isWin = false

      if (isWin) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current)
          countdownRef.current = null
        }

        const baseScore = getScoreVariant(timeLeft)
        const completionBonus = 50
        const finalScore = baseScore + completionBonus

        setLevelScores((prev) => ({ ...prev, [currentLevel]: finalScore }))

        if (currentLevel === 3) {
          const finalTotalScore = Object.values({ ...levelScores, [currentLevel]: finalScore }).reduce((a, b) => a + b, 0)
          setTotalScore(finalTotalScore)
          setMessage(
            `🎉 Congratulations! You've completed all levels!

Final Score: ${finalTotalScore}

Please share your score to the leaderboard!`,
          )
          if (sdkLoaded && window.FarcadeSDK) {
            window.FarcadeSDK.singlePlayer.actions.gameOver({ score: finalTotalScore })
          }
          setTimerStarted(false)
        } else {
          setMessage(
            `🎉 Level ${currentLevel} complete! Your score: ${finalScore}

Proceed to the next level.`,
          )
          setCurrentLevel((prev) => prev + 1)
          setTimerStarted(false)
        }
      }
    }
  }

  // Update total score when levelScores change
  useEffect(() => {
    updateScoreDisplay()
  }, [levelScores, updateScoreDisplay])

  // Initialize Farcade SDK on mount
  useEffect(() => {
    initializeFarcadeSDK()
    startGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update timeLeft when level changes
  useEffect(() => {
    startGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel])

  // Get tile background style to show image slice
  const getTileStyle = (tile: number, index: number) => {
    if (tile === 0) return {}

    const size = config.size
    const x = ((tile - 1) % size) * (100 / (size - 1))
    const y = Math.floor((tile - 1) / size) * (100 / (size - 1))

    return {
      backgroundImage: `url(${config.asset})`,
      backgroundSize: `${size * 100}% ${size * 100}%`,
      backgroundPosition: `${x}% ${y}%`,
      cursor: "pointer",
      userSelect: "none",
    }
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/farcade-sdk@latest/farcade-sdk.min.js"
        onLoad={() => initializeFarcadeSDK()}
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 p-4">
        <h1 className="text-3xl font-bold text-white mb-6">Monad Puzzle - {config.name}</h1>

        <div className="mb-4 w-64">
          <Select
            value={currentLevel.toString()}
            onValueChange={(value) => setCurrentLevel(parseInt(value))}
            disabled={timerStarted}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LEVEL_CONFIG).map(([level, levelCfg]) => (
                <SelectItem key={level} value={level}>
                  {levelCfg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 text-white font-mono text-xl select-none">Time Left: {timeLeft}s</div>

        <Card className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md w-full">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${config.size}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${config.size}, minmax(0, 1fr))`,
              aspectRatio: "1 / 1",
              userSelect: "none",
            }}
          >
            {tiles.map((tile, index) => (
              <button
                key={index}
                className={`aspect-square w-full flex items-center justify-center rounded-md border transition-all duration-300
                  ${
                    tile === 0
                      ? "bg-gray-900 border-gray-700 cursor-default"
                      : "bg-white text-black border-gray-300 hover:scale-105 active:scale-95"
                  }`}
                style={tile !== 0 ? getTileStyle(tile, index) : {}}
                onClick={() => moveTile(index)}
                disabled={tile === 0 || !timerStarted}
                aria-label={tile !== 0 ? `Tile ${tile}` : "Empty space"}
              >
                {/* Uncomment if you want to show number:
                  tile !== 0 ? tile : ""
                */}
              </button>
            ))}
          </div>
        </Card>

        <div className="text-center mt-6 space-y-2 text-white font-semibold select-none max-w-md">
          <div>Total Score: {totalScore}</div>
          <div className="whitespace-pre-line">{message}</div>

          <Button
            className="mt-3 bg-blue-600 hover:bg-blue-700 w-full"
            onClick={() => startGame(true)}
            disabled={timerStarted}
          >
            Shuffle / Restart Level
          </Button>
        </div>
      </div>
    </>
  )
}
