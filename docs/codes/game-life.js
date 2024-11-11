const { Stage, Sprite } = flashthem;

const cellMap = {};
let it = 0;
let paused = false;

const stage = new Stage(canvas);
const box = new Sprite();
const grid = new Sprite();
stage.addChild(grid);
stage.addChild(box);
const cell = 10;
grid.graphics.lineStyle(1, "#ddd");
// 绘制网格
for (let i = 0; i < width; i += cell) {
  grid.graphics.moveTo(i, 0);
  grid.graphics.lineTo(i, height);
}
for (let j = 0; j < height; j += cell) {
  grid.graphics.moveTo(0, j);
  grid.graphics.lineTo(width, j);
}

// 获取格子
for (let i = 0; i < Math.floor(width / cell); i++) {
  for (let j = 0; j < Math.floor(height / cell); j++) {
    const key = [i, j].join("-");
    cellMap[key] = -1;
  }
}
const keys = Object.keys(cellMap);
const total = keys.length;

function reset() {
  it = 0;
  keys.forEach((k) => {
    cellMap[k] = -1;
  });
  const x = Math.floor(Math.random() * 20);
  const y = x;
  const w = Math.random() * 5 + 2;
  const h = Math.random() * 5 + 2;
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      console.log(x + i, y + j);
      cellMap[[x + i, y + j].join("-")] = 1;
    }
  }
  draw();
}
function draw() {
  box.graphics.clear();
  let n = 0;
  for (let i = 0; i < total; i++) {
    if (cellMap[keys[i]] === 1) {
      const [x, y] = keys[i].split("-");
      n++;
      box.graphics.beginFill("#000");
      box.graphics.drawRect(x * cell, y * cell, cell, cell);
    }
  }
  document.querySelector("#game-life-num").innerHTML = n;
}

function run() {
  if (paused) {
    return;
  }
  it++;
  for (let i = 0; i < total; i++) {
    const [x, y] = keys[i].split("-").map((o) => +o);
    const old = cellMap[keys[i]];
    const list = [[x - 1, y].join("-"), [x + 1, y].join("-")];
    for (let j = -1; j <= 1; j++) {
      list.push([x + j, y - 1].join("-"));
      list.push([x + j, y + 1].join("-"));
    }
    const lives = list
      .filter((k) => cellMap[k] !== undefined)
      .map((k) => cellMap[k])
      .filter((v) => v === 1);
    if (old === -1) {
      if (lives.length === 3) {
        cellMap[keys[i]] = 1;
      }
    } else if (old === 1) {
      if (lives.length === 2 || lives.length === 3) {
        //存活
      } else {
        cellMap[keys[i]] = -1;
      }
    }
  }

  draw();
  setTimeout(run, 500);
}

function stop() {
  paused = true;
  draw();
}

reset();

document.querySelector("#game-life-reset").onclick = reset;
document.querySelector("#game-life-stop").onclick = stop;
document.querySelector("#game-life-start").onclick = () => {
  paused = false;
  setTimeout(run, 500);
};
