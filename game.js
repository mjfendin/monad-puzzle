const board = document.getElementById("board");
const timerDisplay = document.getElementById("timer");
const shuffleBtn = document.getElementById("shuffleBtn");
const message = document.getElementById("message");
const levelSelect = document.getElementById("levelSelect");
const reference = document.getElementById("reference").querySelector("img");
const levelScoreDisplay = document.getElementById("levelScore");
const totalScoreDisplay = document.getElementById("totalScore");

let size = 3;
let tiles = [];
let countdown;
let timeLeft = 240;
let timerStarted = false;
let currentLevel = 1;
let bgImage = "";
let totalScore = 0;
let levelScores = { 1: 0, 2: 0, 3: 0 };

const levelConfig = {
  1: {
    size: 3,
    time: 240,
    asset:
      "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/WJrCzoja5Knp/monad-1jNW27jKDl6XxiH2kng82xyuRNQBaB.jpg",
  },
  2: {
    size: 4,
    time: 420,
    asset:
      "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/WJrCzoja5Knp/patapak-u9ITGAqeSSqLycXRd4nOxrGcBbNIQ2.png",
  },
  3: {
    size: 5,
    time: 600,
    asset:
      "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/WJrCzoja5Knp/indonads-Ug2AoCDCH32I9SRGg65Z6bX02pWCkP.jpg",
  },
};

levelSelect.addEventListener("change", () => {
  currentLevel = Number.parseInt(levelSelect.value);
  startGame();
});

function updateScoreDisplay() {
  levelScoreDisplay.textContent = `Current Level Score: ${levelScores[currentLevel]}`;
  totalScoreDisplay.textContent = `Total Score: ${totalScore}`;
}

function startGame(resetTimer = true) {
  message.textContent = "";
  const config = levelConfig[currentLevel];
  size = config.size;
  bgImage = config.asset;
  reference.src = bgImage;

  if (resetTimer) {
    timeLeft = config.time;
    updateTimer();
    clearInterval(countdown);
    countdown = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        clearInterval(countdown);

        // partial progress scoring
        let correct = 0;
        for (let i = 0; i < tiles.length - 1; i++) {
          if (tiles[i] === i + 1) correct++;
        }
        if (tiles[tiles.length - 1] === 0) correct++;

        const percentComplete = correct / tiles.length;
        const maxScore = getScoreVariant(1); // base score
        const partialScore = Math.floor(maxScore * percentComplete);
        const correctPiecesBonus = correct * 125; // Bonus for correct pieces

        levelScores[currentLevel] = partialScore + correctPiecesBonus;
        totalScore = Object.values(levelScores).reduce((a, b) => a + b, 0);
        updateScoreDisplay();

        message.textContent = `⏱️ Waktu habis! Skor: ${
          partialScore + correctPiecesBonus
        } (Base: ${partialScore} + Bonus: ${correctPiecesBonus})`;
        window.FarcadeSDK.singlePlayer.actions.gameOver({ score: totalScore });
      }
    }, 1000);
  }

  timerStarted = true;
  tiles = Array.from({ length: size * size }, (_, i) => i);
  shuffleArray(tiles);
  render();
  updateScoreDisplay();
  window.FarcadeSDK?.singlePlayer?.actions?.ready?.();
}

function updateTimer() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `Waktu: ${minutes}:${seconds}`;
}

function render() {
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.innerHTML = "";
  tiles.forEach((tile, i) => {
    const div = document.createElement("div");
    div.classList.add("tile");
    div.style.backgroundImage = `url(${bgImage})`;
    if (tile === 0) {
      div.classList.add("empty");
    } else {
      const x = (tile - 1) % size;
      const y = Math.floor((tile - 1) / size);
      div.style.backgroundSize = `${size * 100}% ${size * 100}%`;
      div.style.backgroundPosition = `${(x * 100) / (size - 1)}% ${
        (y * 100) / (size - 1)
      }%`;
    }
    div.addEventListener("click", () => moveTile(i));
    board.appendChild(div);
  });
}

function checkCorrectPieces() {
  if (!timerStarted) return 0;

  let correctPieces = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] === i + 1) correctPieces++;
  }
  if (tiles[tiles.length - 1] === 0) correctPieces++;

  return correctPieces;
}

function moveTile(index) {
  const emptyIndex = tiles.indexOf(0);

  const tileRow = Math.floor(index / size);
  const tileCol = index % size;
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;

  const rowDiff = Math.abs(tileRow - emptyRow);
  const colDiff = Math.abs(tileCol - emptyCol);

  if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
    // Check correct pieces before move
    const correctBefore = checkCorrectPieces();

    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    render();

    // Check correct pieces after move
    const correctAfter = checkCorrectPieces();

    // If more pieces are correct after the move, award bonus points
    if (correctAfter > correctBefore) {
      const bonus = 125 * (correctAfter - correctBefore);
      levelScores[currentLevel] += bonus;
      totalScore = Object.values(levelScores).reduce((a, b) => a + b, 0);
      updateScoreDisplay();
      message.textContent = `+${bonus} points for correct placement!`;
      setTimeout(() => {
        message.textContent = "";
      }, 1000);
    }

    checkWin();
    window.FarcadeSDK?.singlePlayer?.actions?.hapticFeedback?.();
  }
}

function getScoreVariant(timeLeftValue) {
  const total = levelConfig[currentLevel].time;
  const timeRatio = timeLeftValue / total;
  if (timeRatio >= 0.9) return 300;
  if (timeRatio >= 0.75) return 250;
  if (timeRatio >= 0.5) return 200;
  if (timeRatio >= 0.25) return 150;
  if (timeRatio >= 0.1) return 100;
  return 50;
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return;
  }
  if (tiles[tiles.length - 1] !== 0) return;
  clearInterval(countdown);
  const baseScore = getScoreVariant(timeLeft);
  const completionBonus = 50;
  const score = baseScore + completionBonus;
  levelScores[currentLevel] = score;
  totalScore = Object.values(levelScores).reduce((a, b) => a + b, 0);
  message.textContent = `🎉 Puzzle Selesai! Skor: ${score} (Base: ${baseScore} + Bonus: ${completionBonus})`;
  updateScoreDisplay();
  window.FarcadeSDK?.singlePlayer?.actions?.gameOver?.({ score: totalScore });
}

function shuffleArray(arr) {
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (!isSolvable(arr));
}

function isSolvable(array) {
  let inv = 0;
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] && array[j] && array[i] > array[j]) inv++;
    }
  }
  return inv % 2 === 0;
}

shuffleBtn.addEventListener("click", () => {
  startGame(false);
});

window.FarcadeSDK?.on?.("play_again", () => {
  startGame();
});

window.FarcadeSDK?.on?.("toggle_mute", (data) => {
  console.log("Mute state:", data.isMuted);
});

startGame();
