const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");

const width = 8;
const candies = ['🍭', '🍬', '🍫', '🍪', '🧁', '🍩'];
let grid = [];
let score = 0;

function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const cell = document.createElement("div");
    cell.setAttribute("draggable", true);
    cell.setAttribute("id", i);
    cell.classList.add("cell");
    const candy = candies[Math.floor(Math.random() * candies.length)];
    cell.textContent = candy;
    grid[i] = candy;
    board.appendChild(cell);
  }
}

function dragDropSetup() {
  const cells = document.querySelectorAll(".cell");
  let dragged, replaced, draggedId, replacedId;

  cells.forEach(cell => {
    cell.addEventListener("dragstart", () => {
      dragged = cell.textContent;
      draggedId = parseInt(cell.id);
    });

    cell.addEventListener("dragover", e => e.preventDefault());
    cell.addEventListener("drop", () => {
      replaced = cell.textContent;
      replacedId = parseInt(cell.id);

      const validMoves = [
        draggedId - 1,
        draggedId + 1,
        draggedId - width,
        draggedId + width
      ];

      if (validMoves.includes(replacedId)) {
        grid[draggedId] = replaced;
        grid[replacedId] = dragged;
        document.getElementById(draggedId).textContent = replaced;
        document.getElementById(replacedId).textContent = dragged;

        checkMatch();
      }
    });
  });
}

function checkMatch() {
  let removed = false;

  // linha
  for (let i = 0; i < width * width; i++) {
    let rowEnd = Math.floor(i / width) * width + (width - 2);
    if (i <= rowEnd) {
      let trio = [i, i + 1, i + 2];
      let candy = grid[i];
      if (trio.every(idx => grid[idx] === candy)) {
        trio.forEach(idx => {
          grid[idx] = '';
          document.getElementById(idx).textContent = '';
        });
        score += 10;
        removed = true;
      }
    }
  }

  // coluna
  for (let i = 0; i < width * (width - 2); i++) {
    let trio = [i, i + width, i + width * 2];
    let candy = grid[i];
    if (trio.every(idx => grid[idx] === candy)) {
      trio.forEach(idx => {
        grid[idx] = '';
        document.getElementById(idx).textContent = '';
      });
      score += 10;
      removed = true;
    }
  }

  if (removed) {
    scoreDisplay.textContent = `Pontos: ${score}`;
    setTimeout(dropCandies, 200);
  }
}

function dropCandies() {
  for (let i = width * width - 1; i >= 0; i--) {
    if (grid[i] === '') {
      if (i - width >= 0) {
        grid[i] = grid[i - width];
        grid[i - width] = '';
        document.getElementById(i).textContent = grid[i];
        document.getElementById(i - width).textContent = '';
      } else {
        let newCandy = candies[Math.floor(Math.random() * candies.length)];
        grid[i] = newCandy;
        document.getElementById(i).textContent = newCandy;
      }
    }
  }

  setTimeout(checkMatch, 200);
}

createBoard();
dragDropSetup();
setInterval(checkMatch, 1000);
