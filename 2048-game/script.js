const board = document.getElementById("game-board");
let grid = [];

function createBoard() {
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.innerText = "";
    board.appendChild(tile);
    grid.push(tile);
  }
  generateTile();
  generateTile();
}

function generateTile() {
  let emptyTiles = grid.filter(tile => tile.innerText === "");
  if (emptyTiles.length === 0) return;
  let tile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  tile.innerText = Math.random() < 0.9 ? "2" : "4";
  updateColors();
}

function slide(row) {
  row = row.filter(num => num !== "");
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] = (parseInt(row[i]) * 2).toString();
      row[i + 1] = "";
    }
  }
  return row.filter(num => num !== "").concat(Array(4 - row.filter(n => n !== "").length).fill(""));
}

function combine(direction) {
  let newGrid = Array(16).fill("");
  if (direction === "left" || direction === "right") {
    for (let r = 0; r < 4; r++) {
      let row = [];
      for (let c = 0; c < 4; c++) {
        let index = r * 4 + (direction === "left" ? c : 3 - c);
        row.push(grid[index].innerText);
      }
      row = slide(row);
      for (let c = 0; c < 4; c++) {
        let index = r * 4 + (direction === "left" ? c : 3 - c);
        newGrid[index] = row[c];
      }
    }
  } else {
    for (let c = 0; c < 4; c++) {
      let col = [];
      for (let r = 0; r < 4; r++) {
        let index = (direction === "up" ? r : 3 - r) * 4 + c;
        col.push(grid[index].innerText);
      }
      col = slide(col);
      for (let r = 0; r < 4; r++) {
        let index = (direction === "up" ? r : 3 - r) * 4 + c;
        newGrid[index] = col[r];
      }
    }
  }

  for (let i = 0; i < 16; i++) {
    grid[i].innerText = newGrid[i];
  }

  generateTile();
}

function updateColors() {
  grid.forEach(tile => {
    let value = tile.innerText;
    tile.style.backgroundColor = {
      "": "#cdc1b4",
      "2": "#eee4da",
      "4": "#ede0c8",
      "8": "#f2b179",
      "16": "#f59563",
      "32": "#f67c5f",
      "64": "#f65e3b",
      "128": "#edcf72",
      "256": "#edcc61",
      "512": "#edc850",
      "1024": "#edc53f",
      "2048": "#edc22e"
    }[value] || "#3c3a32";
  });
}

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    combine(e.key.replace("Arrow", "").toLowerCase());
  }
});

createBoard();
