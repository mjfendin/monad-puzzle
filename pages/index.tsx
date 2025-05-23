import { useEffect, useState, useRef } from "react";

const levelConfig = {
  1: {
    size: 3,
    time: 240,
    asset:
      "/assets/monad.jpg",
  },
  2: {
    size: 4,
    time: 420,
    asset:
      "/assets/patapak.png",
  },
  3: {
    size: 5,
    time: 600,
    asset:
      "/assets/indonads.jpg",
  },
};

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [size, setSize] = useState(levelConfig[1].size);
  const [bgImage, setBgImage] = useState(levelConfig[1].asset);
  const [tiles, setTiles] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(levelConfig[1].time);
  const [message, setMessage] = useState("");
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0 });
  const [totalScore, setTotalScore] = useState(0);

  const countdown = useRef<NodeJS.Timer | null>(null);

  // Helper: shuffle + solvable check
  function shuffleArray(arr: number[]) {
    let shuffled;
    do {
      shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (!isSolvable(shuffled));
    return shuffled;
  }

  function isSolvable(array: number[]) {
    let inv = 0;
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i] && array[j] && array[i] > array[j]) inv++;
      }
    }
    return inv % 2 === 0;
  }

  // Setup/start game
  const startGame = (resetTimer = true) => {
    const config = levelConfig[currentLevel];
    setSize(config.size);
    setBgImage(config.asset);
    const initialTiles = Array.from({ length: config.size * config.size }, (_, i) => i);
    setTiles(shuffleArray(initialTiles));
    setMessage("");

    if (resetTimer) {
      setTimeLeft(config.time);
      if (countdown.current) clearInterval(countdown.current);
      countdown.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(countdown.current!);
            // Partial score & game over logic here
            setMessage("⏱️ Waktu habis! Skor dihitung...");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
  };

  // Handle tile move
  const moveTile = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const tileRow = Math.floor(index / size);
    const tileCol = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    const rowDiff = Math.abs(tileRow - emptyRow);
    const colDiff = Math.abs(tileCol - emptyCol);

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMessage("");

      // Check win condition
      let won = true;
      for (let i = 0; i < newTiles.length - 1; i++) {
        if (newTiles[i] !== i + 1) {
          won = false;
          break;
        }
      }
      if (won && newTiles[newTiles.length - 1] === 0) {
        if (countdown.current) clearInterval(countdown.current);
        setMessage("🎉 Puzzle Selesai!");
      }
    }
  };

  useEffect(() => {
    startGame();
    return () => {
      if (countdown.current) clearInterval(countdown.current);
    };
  }, [currentLevel]);

  // Render tiles
  const renderTiles = () => {
    return tiles.map((tile, i) => {
      const style: React.CSSProperties = {
        backgroundImage: tile === 0 ? "none" : `url(${bgImage})`,
        backgroundSize: `${size * 100}% ${size * 100}%`,
      };
      if (tile !== 0) {
        const x = (tile - 1) % size;
        const y = Math.floor((tile - 1) / size);
        style.backgroundPosition = `${(x * 100) / (size - 1)}% ${(y * 100) / (size - 1)}%`;
      }
      return (
        <div
          key={i}
          className={`tile ${tile === 0 ? "empty" : ""}`}
          style={style}
          onClick={() => moveTile(i)}
        />
      );
    });
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      <style>{`
        /* copy your css here or import from styles/globals.css */
        .tile {
          border: 2px solid white;
          aspect-ratio: 1 / 1;
          border-radius: 5px;
          transition: transform 0.2s;
          cursor: pointer;
        }
        .tile:active {
          transform: scale(0.95);
        }
        .empty {
          background-color: #000 !important;
          border: 2px dashed #fff;
        }
      `}</style>

      <h1>Monad Puzzle</h1>
      <div id="reference">
        <img src={bgImage} alt="Referensi" width={100} height={100} style={{ borderRadius: 10, border: "2px solid white" }} />
      </div>
      <select
        id="levelSelect"
        value={currentLevel}
        onChange={(e) => setCurrentLevel(parseInt(e.target.value))}
        style={{ marginBottom: 10, padding: "6px 12px", fontSize: 16 }}
      >
        <option value={1}>Level 1 (Easy)</option>
        <option value={2}>Level 2 (Medium)</option>
        <option value={3}>Level 3 (Expert)</option>
      </select>
      <div id="timer" style={{ fontSize: 18, marginBottom: 10 }}>
        Waktu: {formatTime(timeLeft)}
      </div>
      <div
        id="board"
        style={{
          display: "grid",
          gap: 3,
          width: "90vmin",
          height: "90vmin",
          maxWidth: 400,
          maxHeight: 400,
          background: "#000",
          padding: 3,
          borderRadius: 10,
          gridTemplateColumns: `repeat(${size}, 1fr)`,
        }}
      >
        {renderTiles()}
      </div>
      <button onClick={() => startGame(false)} style={{ marginTop: 15, padding: "10px 20px", fontSize: 16, borderRadius: 8, cursor: "pointer", backgroundColor: "#3a3a3a", color: "white", border: "none" }}>
        Shuffle
      </button>
      <div id="message" style={{ marginTop: 15, fontSize: 20, fontWeight: "bold", color: "#00ff00", textAlign: "center" }}>
        {message}
      </div>
      <div id="scoreBoard" style={{ marginTop: 10, textAlign: "center", fontSize: 16, color: "#ccc" }}>
        <div>Current Level Score: {levelScores[currentLevel]}</div>
        <div>Total Score: {totalScore}</div>
      </div>
    </>
  );
}
