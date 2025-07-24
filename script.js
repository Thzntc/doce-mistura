const board = document.getElementById("board");
const scoreValue = document.getElementById("scoreValue");
const width = 8;
const candy = ['🍭', '🍬', '🍫', '🍪'];
let score = 0;
let squares = [];

function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    square.innerText = candy[Math.floor(Math.random() * candy.length)];
    board.appendChild(square);
    squares.push(square);
  }
}

function dragDropMechanics() {
  let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

  squares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', e => e.preventDefault());
    square.addEventListener('drop', dragDrop);
    square.addEventListener('dragend', dragEnd);
  });

  function dragStart() {
    colorBeingDragged = this.innerText;
    squareIdBeingDragged = parseInt(this.id);
  }

  function dragDrop() {
    colorBeingReplaced = this.innerText;
    squareIdBeingReplaced = parseInt(this.id);
    squares[squareIdBeingDragged].innerText = colorBeingReplaced;
    squares[squareIdBeingReplaced].innerText = colorBeingDragged;
  }

  function dragEnd() {
    checkMatches();
  }
}

function checkMatches() {
  for (let i = 0; i < width * width; i++) {
    let rowOfThree = [i, i + 1, i + 2];
    let columnOfThree = [i, i + width, i + width * 2];

    let validRow = i % width < width - 2;
    let validColumn = i < width * (width - 2);

    if (validRow) {
      let emoji = squares[i].innerText;
      if (rowOfThree.every(index => squares[index].innerText === emoji)) {
        rowOfThree.forEach(index => squares[index].innerText = candy[Math.floor(Math.random() * candy.length)]);
        score += 10;
      }
    }

    if (validColumn) {
      let emoji = squares[i].innerText;
      if (columnOfThree.every(index => squares[index].innerText === emoji)) {
        columnOfThree.forEach(index => squares[index].innerText = candy[Math.floor(Math.random() * candy.length)]);
        score += 10;
      }
    }
  }

  scoreValue.textContent = score;
}

function updateBoard() {
  setInterval(() => {
    checkMatches();
  }, 1000);
}

// Inicialização
createBoard();
dragDropMechanics();
updateBoard();
