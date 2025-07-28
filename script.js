const grid = [];
const container = document.getElementById("game-container");
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("high-score").innerText = highScore;

function createGrid() {
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.innerText = '';
    container.appendChild(cell);
    grid.push(cell);
    document.getElementById("game-over").style.display = "none";
  }
}

function updateColors() {
  grid.forEach(cell => {
    const val = parseInt(cell.innerText);
    cell.dataset.value = val || 0;
  });
}

function generateTile() {
  const emptyCells = grid.filter(cell => cell.innerText === '');
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  if (randomCell) randomCell.innerText = Math.random() < 0.9 ? '2' : '4';
  updateColors();
}

function getCellValues() {
  return grid.map(cell => parseInt(cell.innerText) || 0);
}

function setCellValues(values) {
  values.forEach((val, i) => {
    grid[i].innerText = val === 0 ? '' : val;
  });
  updateColors();
}

function move(direction) {
  let moved = false;
  let cells = getCellValues();

  function slide(row) {
    row = row.filter(val => val !== 0);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        row[i + 1] = 0;
        updateScore();
      }
    }
    return row.filter(val => val !== 0);
  }

  function buildNewGrid(newRows) {
    return newRows.flat().concat(Array(16 - newRows.flat().length).fill(0));
  }

  let newValues;

  if (direction === "left" || direction === "right") {
    newValues = [];
    for (let r = 0; r < 4; r++) {
      let row = cells.slice(r * 4, r * 4 + 4);
      if (direction === "right") row.reverse();
      row = slide(row);
      while (row.length < 4) row.push(0);
      if (direction === "right") row.reverse();
      newValues.push(row);
    }
    newValues = buildNewGrid(newValues);
  } else {
    newValues = Array(16).fill(0);
    for (let c = 0; c < 4; c++) {
      let col = [];
      for (let r = 0; r < 4; r++) col.push(cells[r * 4 + c]);
      if (direction === "down") col.reverse();
      col = slide(col);
      while (col.length < 4) col.push(0);
      if (direction === "down") col.reverse();
      for (let r = 0; r < 4; r++) newValues[r * 4 + c] = col[r];
    }
  }

  if (cells.toString() !== newValues.toString()) {
    moved = true;
    setCellValues(newValues);
    generateTile();
  }

  if (!hasMoves()) {
    document.getElementById("game-over").style.display = "block";
  }
}

function updateScore() {
  document.getElementById("score").innerText = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.getElementById("high-score").innerText = highScore;
  }
}

function hasMoves() {
  const values = getCellValues();

  // boş kutu varsa oyun devam eder
  if (values.includes(0)) return true;

  // yatay kontrol
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      if (values[r * 4 + c] === values[r * 4 + c + 1]) return true;
    }
  }

  // dikey kontrol
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 3; r++) {
      if (values[r * 4 + c] === values[(r + 1) * 4 + c]) return true;
    }
  }

  return false;
}

document.addEventListener("keydown", e => {
  if (document.getElementById("game-over").style.display === "block") return;
  switch (e.key) {
    case "ArrowUp": move("up"); break;
    case "ArrowDown": move("down"); break;
    case "ArrowLeft": move("left"); break;
    case "ArrowRight": move("right"); break;
  }
});
document.getElementById("reset-btn").addEventListener("click", () => {
  // Kutuları temizle
  grid.forEach(cell => cell.innerText = '');
  score = 0;
  updateScore();
  document.getElementById("game-over").style.display = "none";
  generateTile();
  generateTile();
  updateColors();
});
let startX, startY;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move("right");
    else if (dx < -30) move("left");
  } else {
    if (dy > 30) move("down");
    else if (dy < -30) move("up");
  }
});


createGrid();
generateTile();
generateTile();
