const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart");
const soundBtn = document.getElementById("toggleSound");
const popSound = document.getElementById("popSound");

const boardSize = 6;
const emojis = ["🍒","🍋","🍇","🍏","🍊","🍉"];
let tiles = [];
let score = 0;
let soundOn = true;

function startGame() {
  board.innerHTML = "";
  tiles = [];
  score = 0;
  scoreDisplay.innerText = score;
  for (let r = 0; r < boardSize; r++) {
    tiles[r] = [];
    for (let c = 0; c < boardSize; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.row = r;
      tile.dataset.col = c;
      tile.innerText = emojis[Math.floor(Math.random()*emojis.length)];
      tile.addEventListener("click", onClickTile);
      board.appendChild(tile);
      tiles[r][c] = tile;
    }
  }
}

let firstTile = null;

function onClickTile(e) {
  const tile = e.currentTarget;
  if (!firstTile) {
    firstTile = tile;
    tile.classList.add("selected");
  } else {
    swapTiles(firstTile, tile);
    firstTile.classList.remove("selected");
    firstTile = null;
  }
}

function swapTiles(a, b) {
  const r1 = a.dataset.row, c1 = a.dataset.col;
  const r2 = b.dataset.row, c2 = b.dataset.col;
  if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;
  const temp = a.innerText;
  a.innerText = b.innerText;
  b.innerText = temp;

  setTimeout(() => {
    if (!checkMatch()) {
      // desfaz se não tiver combinação
      a.innerText = temp;
      b.innerText = a.innerText;
    }
  }, 200);
}

function checkMatch() {
  let matched = new Set();
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize - 2; c++) {
      const t1 = tiles[r][c], t2 = tiles[r][c+1], t3 = tiles[r][c+2];
      if (t1.innerText === t2.innerText && t2.innerText === t3.innerText) {
        [t1, t2, t3].forEach(t => matched.add(t));
      }
    }
  }
  for (let c = 0; c < boardSize; c++) {
    for (let r = 0; r < boardSize - 2; r++) {
      const t1 = tiles[r][c], t2 = tiles[r+1][c], t3 = tiles[r+2][c];
      if (t1.innerText === t2.innerText && t2.innerText === t3.innerText) {
        [t1, t2, t3].forEach(t => matched.add(t));
      }
    }
  }
  if (matched.size === 0) return false;
  matched.forEach(t => {
    t.classList.add("removing");
    if (soundOn) popSound.play();
  });
  score += matched.size;
  scoreDisplay.innerText = score;

  setTimeout(() => {
    matched.forEach(t => {
      t.innerText = emojis[Math.floor(Math.random()*emojis.length)];
      t.classList.remove("removing");
    });
    checkMatch();
  }, 400);

  return true;
}

function toggleSound() {
  soundOn = !soundOn;
  soundBtn.innerText = soundOn ? "🔊 Som" : "🔇 Som";
}

restartBtn.addEventListener("click", startGame);
soundBtn.addEventListener("click", toggleSound);
board.addEventListener("click", e => { if (!firstTile) return; });

startGame();
