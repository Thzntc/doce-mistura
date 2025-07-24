const board = document.getElementById('board');
const scoreValue = document.getElementById('scoreValue');
const popSound = document.getElementById('popSound');
const toggleSound = document.getElementById('toggleSound');
const resetButton = document.getElementById('reset');

const gridSize = 8;
const candyColors = [
  'red', 'yellow', 'green', 'blue', 'orange', 'purple'
];
let boardArray = [];
let score = 0;
let soundOn = true;

toggleSound.addEventListener('click', () => {
  soundOn = !soundOn;
  toggleSound.textContent = soundOn ? '🔊 Som' : '🔇 Sem Som';
});

resetButton.addEventListener('click', () => {
  score = 0;
  scoreValue.textContent = score;
  board.innerHTML = '';
  boardArray = [];
  init();
});

function createBoard() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.setAttribute('draggable', true);
    cell.setAttribute('id', i);
    cell.classList.add('cell');

    const candy = document.createElement('img');
    const color = getRandomColor();
    candy.src = `https://raw.githubusercontent.com/alura-challenges/challenge-html-css-js-matching-game/main/assets/candies/${color}.png`;
    candy.setAttribute('data-color', color);

    cell.appendChild(candy);
    board.appendChild(cell);
    boardArray.push(cell);
  }
}

function getRandomColor() {
  return candyColors[Math.floor(Math.random() * candyColors.length)];
}

function swapCandies(id1, id2) {
  const candy1 = boardArray[id1].querySelector('img');
  const candy2 = boardArray[id2].querySelector('img');

  if (!candy1 || !candy2) return;

  const src1 = candy1.src;
  const src2 = candy2.src;
  const color1 = candy1.getAttribute('data-color');
  const color2 = candy2.getAttribute('data-color');

  candy1.src = src2;
  candy2.src = src1;
  candy1.setAttribute('data-color', color2);
  candy2.setAttribute('data-color', color1);
}

function checkMatches() {
  let matchFound = false;

  // Horizontal
  for (let i = 0; i < 64; i++) {
    if ((i % gridSize) > gridSize - 3) continue;
    const c1 = boardArray[i].querySelector('img');
    const c2 = boardArray[i + 1].querySelector('img');
    const c3 = boardArray[i + 2].querySelector('img');
    if (c1 && c2 && c3 &&
        c1.getAttribute('data-color') === c2.getAttribute('data-color') &&
        c2.getAttribute('data-color') === c3.getAttribute('data-color')) {
      c1.classList.add('blink');
      c2.classList.add('blink');
      c3.classList.add('blink');
      setTimeout(() => {
        c1.remove();
        c2.remove();
        c3.remove();
        updateScore(30);
        if (soundOn) popSound.play();
      }, 200);
      matchFound = true;
    }
  }

  // Vertical
  for (let i = 0; i < 47; i++) {
    const c1 = boardArray[i].querySelector('img');
    const c2 = boardArray[i + gridSize].querySelector('img');
    const c3 = boardArray[i + gridSize * 2].querySelector('img');
    if (c1 && c2 && c3 &&
        c1.getAttribute('data-color') === c2.getAttribute('data-color') &&
        c2.getAttribute('data-color') === c3.getAttribute('data-color')) {
      c1.classList.add('blink');
      c2.classList.add('blink');
      c3.classList.add('blink');
      setTimeout(() => {
        c1.remove();
        c2.remove();
        c3.remove();
        updateScore(30);
        if (soundOn) popSound.play();
      }, 200);
      matchFound = true;
    }
  }

  return matchFound;
}

function updateScore(points) {
  score += points;
  scoreValue.textContent = score;
}

function moveCandiesDown() {
  for (let i = 55; i >= 0; i--) {
    if (!boardArray[i + gridSize].querySelector('img')) {
      const candy = boardArray[i].querySelector('img');
      if (candy) {
        boardArray[i + gridSize].appendChild(candy);
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    if (!boardArray[i].querySelector('img')) {
      const newCandy = document.createElement('img');
      const color = getRandomColor();
      newCandy.src = `https://raw.githubusercontent.com/alura-challenges/challenge-html-css-js-matching-game/main/assets/candies/${color}.png`;
      newCandy.setAttribute('data-color', color);
      boardArray[i].appendChild(newCandy);
    }
  }
}

function dragEvents() {
  let draggedId;

  boardArray.forEach(cell => {
    cell.addEventListener('dragstart', (e) => {
      draggedId = parseInt(e.target.parentElement.id);
    });

    cell.addEventListener('dragover', (e) => e.preventDefault());

    cell.addEventListener('drop', (e) => {
      const targetId = parseInt(e.target.parentElement.id);
      const validMoves = [draggedId - 1, draggedId + 1, draggedId - gridSize, draggedId + gridSize];
      if (validMoves.includes(targetId)) {
        swapCandies(draggedId, targetId);
        setTimeout(() => {
          if (!checkMatches()) {
            swapCandies(draggedId, targetId); // desfaz se não houver combinação
          }
        }, 100);
      }
    });
  });
}

function init() {
  createBoard();
  dragEvents();
  setInterval(() => {
    checkMatches();
    moveCandiesDown();
  }, 200);
}

init();
