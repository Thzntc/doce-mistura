const board = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const popSound = document.getElementById("popSound");
const soundBtn = document.getElementById("soundBtn");

const candies = ["🍭", "🍬", "🍫", "🍡", "🍩"];
let tiles = [];
let selected = null;
let score = 0;
let soundOn = true;

function toggleSound() {
  soundOn = !soundOn;
  soundBtn.innerText = soundOn ? "🔊 Som: Ligado" : "🔇 Som: Desligado";
}

function resetGame() {
  tiles = [];
  board.innerHTML = "";
  score = 0;
  scoreDisplay.innerText = score;
  initBoard();
  checkMatches();
}

function initBoard() {
  for (let i = 0; i < 64; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.index = i;
    tile.innerText = getRandomCandy();
    tile.addEventListener("click", handleClick);
    board.appendChild(tile);
    tiles.push(tile);
  }
}

function getRandomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

function handleClick(e) {
  const tile = e.currentTarget;

  if (selected === tile) {
    tile.classList.remove("selected");
    selected = null;
    return;
  }

  if (selected) {
    swapTiles(selected, tile);
    selected.classList.remove("selected");
    selected = null;
  } else {
    tile.classList.add("selected");
    selected = tile;
  }
}

function swapTiles(a, b) {
  const i = parseInt(a.dataset.index);
  const j = parseInt(b.dataset.index);

  const [xi, yi] = [i % 8, Math.floor(i / 8)];
  const [xj, yj] = [j % 8, Math.floor(j / 8)];

  if (Math.abs(xi - xj) + Math.abs(yi - yj) !== 1) return;

  const temp = a.innerText;
  a.innerText = b.innerText;
  b.innerText = temp;

  setTimeout(() => {
    if (!checkMatches()) {
      // Desfaz se não houver combinação
      const temp2 = a.innerText;
      a.innerText = b.innerText;
      b.innerText = temp2;
    }
  }, 150);
}

function checkMatches() {
  let matched = new Set();

  // Linhas
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      const i = row * 8 + col;
      const match = [i, i + 1, i + 2];
      if (tiles[i].innerText === tiles[i + 1].innerText &&
          tiles[i].innerText === tiles[i + 2].innerText) {
        match.forEach(m => matched.add(m));
      }
    }
  }

  // Colunas
  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 6; row++) {
      const i = row * 8 + col;
      const match = [i, i + 8, i + 16];
      if (tiles[i].innerText === tiles[i + 8].innerText &&
          tiles[i].innerText === tiles[i + 16].innerText) {
        match.forEach(m => matched.add(m));
      }
    }
  }

  if (matched.size === 0) return false;

  matched.forEach(i => {
    tiles[i].innerText = "";
    if (soundOn) popSound.play();
    score += 10;
    scoreDisplay.innerText = score;
  });

  setTimeout(dropCandies, 200);
  return true;
}

function dropCandies() {
  for (let col = 0; col < 8; col++) {
    let empty = [];
    for (let row = 7; row >= 0; row--) {
      const i = row * 8 + col;
      if (tiles[i].innerText === "") {
        empty.push(i);
      } else if (empty.length > 0) {
        const target = empty.shift();
        tiles[target].innerText = tiles[i].innerText;
        tiles[i].innerText = "";
        empty.push(i);
      }
    }

    for (let i of empty) {
      tiles[i].innerText = getRandomCandy();
    }
  }

  setTimeout(checkMatches, 200);
}

resetGame();
