const boardSize = 6;
const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart");
const soundBtn = document.getElementById("toggleSound");
const popSound = document.getElementById("popSound");

let tiles = [];
let score = 0;
let soundEnabled = true;

const emojis = ["🍒", "🍋", "🍇", "🍏", "🍊", "🍉"];

function createTile(row, col) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.dataset.row = row;
  tile.dataset.col = col;
  tile.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  board.appendChild(tile);
  return tile;
}

function generateBoard() {
  board.innerHTML = "";
  tiles = [];
  for (let row = 0; row < boardSize; row++) {
    tiles[row] = [];
    for (let col = 0; col < boardSize; col++) {
      const tile = createTile(row, col);
      tiles[row][col] = tile;
    }
  }
}

let firstTile = null;

function handleClick(e) {
  const tile = e.target;
  if (!tile.classList.contains("tile")) return;

  if (!firstTile) {
    firstTile = tile;
    tile.style.border = "2px solid #ff69b4";
  } else {
    swapTiles(firstTile, tile);
    firstTile.style.border = "none";
    firstTile = null;
  }
}

function swapTiles(tile1, tile2) {
  if (!areAdjacent(tile1, tile2)) return;

  const temp = tile1.textContent;
  tile1.textContent = tile2.textContent;
  tile2.textContent = temp;

  if (!checkMatches()) {
    // Reverte se não houver combinação
    setTimeout(() => {
      tile1.textContent = temp;
      tile2.textContent = tile1.textContent;
    }, 300);
  }
}

function areAdjacent(t1, t2) {
  const r1 = parseInt(t1.dataset.row), c1 = parseInt(t1.dataset.col);
  const r2 = parseInt(t2.dataset.row), c2 = parseInt(t2.dataset.col);
  return (Math.abs(r1 - r2) + Math.abs(c1 - c2)) === 1;
}

function checkMatches() {
  let matched = [];

  // Horizontal
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize - 2; col++) {
      const t1 = tiles[row][col];
      const t2 = tiles[row][col + 1];
      const t3 = tiles[row][col + 2];
      if (
        t1.textContent === t2.textContent &&
        t2.textContent === t3.textContent
      ) {
        matched.push(t1, t2, t3);
      }
    }
  }

  // Vertical
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row < boardSize - 2; row++) {
      const t1 = tiles[row][col];
      const t2 = tiles[row + 1][col];
      const t3 = tiles[row + 2][col];
      if (
        t1.textContent === t2.textContent &&
        t2.textContent === t3.textContent
      ) {
        matched.push(t1, t2, t3);
      }
    }
  }

  if (matched.length > 0) {
    removeMatches(matched);
    return true;
  }
  return false;
}

function removeMatches(matched) {
  matched.forEach(tile => {
    tile.classList.add("removing");
  });

  setTimeout(() => {
    matched.forEach(tile => {
      tile.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      tile.classList.remove("removing");
    });

    score += matched.length;
    scoreDisplay.textContent = score;
    if (soundEnabled) popSound.play();

    setTimeout(checkMatches, 300);
  }, 400);
}

restartBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = score;
  generateBoard();
});

soundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundBtn.textContent = soundEnabled ? "🔊 Som" : "🔇 Som";
});

board.addEventListener("click", handleClick);

generateBoard();
