"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import Script from "next/script"

// Level configuration matching the original script
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
  const [timeLeft, setTimeLeft] = useState(240)
  const [timerStarted, setTimerStarted] = useState(false)
  const [message, setMessage] = useState("")
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0 })
  const [totalScore, setTotalScore] = useState(0)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const countdownRef = useRef<NodeJS.Timeout>()

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

  // Get score based on time left
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

  // Check correct pieces
  const checkCorrectPieces = (currentTiles: number[]) => {
    if (!timerStarted) return 0

    let correctPieces = 0
    for (let i = 0; i < currentTiles.length - 1; i++) {
      if (currentTiles[i] === i + 1) correctPieces++
    }
    if (currentTiles[currentTiles.length - 1] === 0) correctPieces++

    return correctPieces
  }

  // Update score display
  const updateScoreDisplay = useCallback(() => {
    const newTotalScore = Object.values(levelScores).reduce((a, b) => a + b, 0)
    setTotalScore(newTotalScore)
  }, [levelScores])

  // Start game
  const startGame = useCallback(
    (resetTimer = true) => {
      setMessage("")

      if (resetTimer) {
        setTimeLeft(config.time)
        if (countdownRef.current) {
          clearInterval(countdownRef.current)
        }

        countdownRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            const newTime = prev - 1
            if (newTime <= 0) {
              if (countdownRef.current) {
                clearInterval(countdownRef.current)
              }

              // Partial progress scoring when time runs out
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
                
                // Special message for level 3 timeout
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

              return 0
            }
            return newTime
          })
        }, 1000)
      }

      setTimerStarted(true)

      // Create and shuffle tiles
      const initialTiles = Array.from({ length: config.size * config.size }, (_, i) => i)
      const shuffledTiles = shuffleArray(initialTiles)
      setTiles(shuffledTiles)

      if (sdkLoaded && window.FarcadeSDK) {
        window.FarcadeSDK.singlePlayer.actions.ready()
      }
    },
    [config, currentLevel, sdkLoaded],
  )

  // Move tile
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
      const temp = newTiles[index]
      newTiles[index] = newTiles[emptyIndex]
      newTiles[emptyIndex] = temp

      setTiles(newTiles)

      const correctAfter = checkCorrectPieces(newTiles)

      if (correctAfter > correctBefore) {
        const bonus = 125 * (correctAfter - correctBefore)
        setLevelScores((prev) => ({
          ...prev,
          [currentLevel]: prev[currentLevel as keyof typeof prev] + bonus,
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
        }
        const baseScore = getScoreVariant(timeLeft)
        const completionBonus = 50
        const finalScore = baseScore + completionBonus
        setLevelScores((prev) => ({ ...prev, [currentLevel]: finalScore }))
        
        // Check if this is level 3 (Expert) completion - GAME COMPLETE
        if (currentLevel === 3) {
          const finalTotalScore = Object.values({ ...levelScores, [currentLevel]: finalScore }).reduce((a, b) => a + b, 0)
          const gameCompleteBonus = 500 // Extra bonus for completing all levels
          const grandTotalScore = finalTotalScore + gameCompleteBonus
          
          setMessage(`🏆 GAME COMPLETE! 🏆
          Level 3 Score: ${finalScore}
          Total Score: ${finalTotalScore}
          Game Complete Bonus: +${gameCompleteBonus}
          FINAL SCORE: ${grandTotalScore}
          
          🎉 Congratulations! You've mastered all levels! 🎉`)
          
          // Update total score with game complete bonus
          setTotalScore(grandTotalScore)
          
          if (sdkLoaded && window.FarcadeSDK) {
            window.FarcadeSDK.singlePlayer.actions.gameOver({ score: grandTotalScore })
          }
        } else {
          setMessage(`🎉 Puzzle Selesai! Skor: ${finalScore} (Base: ${baseScore} + Bonus: ${completionBonus})`)
          
          if (sdkLoaded && window.FarcadeSDK) {
            const newTotal = Object.values({ ...levelScores, [currentLevel]: finalScore }).reduce((a, b) => a + b, 0)
            window.FarcadeSDK.singlePlayer.actions.gameOver({ score: newTotal })
          }
        }
      }

      if (sdkLoaded && window.FarcadeSDK) {
        window.FarcadeSDK.singlePlayer.actions.hapticFeedback()
      }
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get tile background position
  const getTileStyle = (tile: number, index: number) => {
    const actualTile = tile === 0 ? tiles.length : tile
    const x = (actualTile - 1) % config.size
    const y = Math.floor((actualTile - 1) / config.size)

    return {
      backgroundImage: `url(${config.asset})`,
      backgroundSize: `${config.size * 100}% ${config.size * 100}%`,
      backgroundPosition: `${(x * 100) / (config.size - 1)}% ${(y * 100) / (config.size - 1)}%`,
      backgroundRepeat: "no-repeat",
    }
  }

  // Level change handler
  const handleLevelChange = (value: string) => {
    setCurrentLevel(Number(value))
  }

  // Effects
  useEffect(() => {
    updateScoreDisplay()
  }, [levelScores, updateScoreDisplay])

  useEffect(() => {
    startGame()
  }, [currentLevel, startGame])

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@farcade/game-sdk@latest/dist/index.min.js"
        onLoad={initializeFarcadeSDK}
      />

      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start p-4">
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold mt-5 mb-2">Monad Puzzle</h1>

            <div className="mb-2">
              <img
                src={config.asset || "/placeholder.svg"}
                alt="Reference"
                className="w-25 h-25 mx-auto rounded-lg border-2 border-white"
                style={{ width: "100px", height: "100px" }}
              />
            </div>

            <Select value={currentLevel.toString()} onValueChange={handleLevelChange}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 mb-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
                  <SelectItem key={level} value={level} className="text-white">
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-lg mb-2">Waktu: {formatTime(timeLeft)}</div>
          </div>

          <Card className="p-1 bg-black border-gray-700">
            <div
              className="grid gap-1 aspect-square w-full max-w-sm mx-auto"
              style={{
                gridTemplateColumns: `repeat(${config.size}, 1fr)`,
                width: "90vmin",
                height: "90vmin",
                maxWidth: "400px",
                maxHeight: "400px",
              }}
            >
              {tiles.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => moveTile(index)}
                  className={`
                    aspect-square rounded border-2 transition-transform duration-200 active:scale-95
                    ${tile === 0 ? "border-white border-dashed" : "border-white"}
                  `}
                  style={getTileStyle(tile, index)}
                />
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Button onClick={() => startGame(false)} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
              Shuffle
            </Button>
          </div>

          {/* Message */}
          {message && (
            <div className={`text-center text-lg font-bold ${
              message.includes('GAME COMPLETE') 
                ? 'text-yellow-400 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-xl' 
                : 'text-green-400'
            }`}>
              <div className={`${
                message.includes('GAME COMPLETE') 
                  ? 'border-2 border-yellow-400 rounded-lg p-4 bg-yellow-900/20' 
                  : ''
              }`}>
                {message.split('\n').map((line, index) => (
                  <div key={index} className={line.includes('🏆') ? 'text-2xl mb-2' : ''}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center space-y-2 text-gray-300">