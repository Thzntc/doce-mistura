window.onload = function () {
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
  let firstTile = null;

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
        tile.innerText = randomEmoji();
        tile.addEventListener("click", onClickTile);
        board.appendChild(tile);
        tiles[r][c] = tile;
      }
    }
  }

  function randomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

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
        const tempBack = a.innerText;
        a.innerText = b.innerText;
        b.innerText = tempBack;
      }
    }, 300);
  }

  function checkMatch() {
    let matched = new Set();

    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize - 2; c++) {
        const t1 = tiles[r][c];
        const t2 = tiles[r][c + 1];
        const t3 = tiles[r][c + 2];
        if (t1.innerText === t2.innerText && t2.innerText === t3.innerText) {
          matched.add(t1);
          matched.add(t2);
          matched.add(t3);
        }
      }
    }

    for (let c = 0; c < boardSize; c++) {
      for (let r = 0; r < boardSize - 2; r++) {
        const t1 = tiles[r][c];
        const t2 = tiles[r + 1][c];
        const t3 = tiles[r + 2][c];
        if (t1.innerText === t2.innerText && t2.innerText === t3.innerText) {
          matched.add(t1);
          matched.add(t2);
          matched.add(t3);
        }
      }
    }

    if (matched.size === 0) return false;

    matched.forEach(t => {
      t.classList.add("removing");
      if (soundOn) {
        popSound.currentTime = 0;
        popSound.play();
      }
    });

    score += matched.size;
    scoreDisplay.innerText = score;

    setTimeout(() => {
      matched.forEach(t => {
        t.classList.remove("removing");
        t.innerText = randomEmoji();
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

  startGame();
};
