class Area {

  constructor(width, height, onCellClick) {
    this.width = width;
    this.height = height;

    this.onCellClick = onCellClick;

    this.initArea();
  }

  initArea() {
    const gameContainer = document.getElementById('game');

    while (gameContainer.firstChild) {
      gameContainer.removeChild(gameContainer.firstChild);
    }

    for (let i = 0; i < this.width; i++) {
      const row = document.createElement('div');
      row.className = 'row';
      for (let j = 0; j < this.height; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-row', `${i}`);
        cell.setAttribute('data-col', `${j}`);

        cell.addEventListener('click', () => { this.onCellClick(i, j); });

        row.appendChild(cell);
      }
      gameContainer.appendChild(row);
    }
  }

  setCellClass(className, x, y) {
    const el = document.querySelector(`div[data-row="${x}"][data-col="${y}"]`);
    el.classList.add(className);
  };

  removeCellClass(className, x, y) {
    const el = document.querySelector(`div[data-row="${x}"][data-col="${y}"]`);
    el.classList.remove(className);
  }

  updateCounter(compCounter, userCounter) {
    document.getElementById('comp').innerHTML = compCounter;
    document.getElementById('user').innerHTML = userCounter;
  };
}

class Game {

  constructor(interval = 2000, width = 10, height = 10) {
    this.interval = interval;
    this.userCount = 0;
    this.compCount = 0;

    this.width = width;
    this.height = height;

    this.step = null;

    this.posX = null;
    this.posY = null;

    this.area = new Area(width, height, this.onClickCell.bind(this));
  }

  onClickCell(x, y) {
    this.userClick(x, y);
  }

  start() {
    this.compCount = 0;
    this.userCount = 0;
    this.step = null;
    this.posX = null;
    this.posY = null;

    this.area.updateCounter(this.compCount, this.userCount);

    setTimeout(() => this.random(), 700);
  };

  random() {
    this.posX = Math.abs(Math.round(Math.random() * (this.width - 1)));
    this.posY = Math.abs(Math.round(Math.random() * (this.height - 1)));

    this.area.setCellClass('yellow', this.posX, this.posY);

    this.step = setTimeout(() => {
      this.area.removeCellClass('yellow', this.posX, this.posY);
      this.area.setCellClass('red', this.posX, this.posY);

      this.compCount++;
      this.area.updateCounter(this.compCount, this.userCount);
      clearTimeout(this.step);
      this.step = null;

      if (this.checkWinner()) {
        $('#myModal').modal('show');
        document.getElementById('modalBody').innerHTML = `Вы проиграли! Счет: ${this.compCount}:${this.userCount}`;
        return;
      }
      setTimeout(() => {
        this.area.removeCellClass('red', this.posX, this.posY);

        setTimeout(() => this.random(), 1000);
      }, 1000);
    }, this.interval);
  };

  checkWinner() {
    if (this.compCount === 10 || this.userCount === 10) {
      return true;
    }
    return false;
  };

  userClick(x, y) {
    if (this.step && x === this.posX && y === this.posY) {

      this.area.removeCellClass('yellow', this.posX, this.posY);
      this.area.setCellClass('green', this.posX, this.posY);

      this.userCount++;
      this.area.updateCounter(this.compCount, this.userCount);
      clearTimeout(this.step);

      this.step = null;

      if (this.checkWinner()) {
        $('#myModal').modal('show');
        document.getElementById('modalBody').innerHTML = `Вы выиграли! Счет: ${this.compCount}:${this.userCount}`;
        return;
      }

      setTimeout(() => {
        this.area.removeCellClass('green', this.posX, this.posY);
        setTimeout(() => this.random(), 1000);
      }, 1000);
    }
  };

}

let interval;
document.getElementById('interval').addEventListener('input', () => {
  interval = +document.getElementById('interval').value;
});

const startBTN = document.getElementById('start');

startBTN.addEventListener('click', () => {
  const game = new Game(interval, 10, 10);
  game.start();
});

