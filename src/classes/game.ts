import { CELL_SIZE, COLS, ROWS } from "../constants/constants";
import { NEIGHBORS } from "../helpers/helpers";
import type { Settings, Grid } from "../interfaces/game";

export class Game {
  public running = false;
  private ctx: CanvasRenderingContext2D;
  private grid!: Grid;
  private interval: number | undefined;
  private settings: Settings;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.settings = {
      fill: "#7272ff",
      interval: 100,
      strokeColor: "#000",
      strokeWidth: 1,
    };
    this.init();
  }

  public click(row: number, col: number) {
    if (this.running) {
      return;
    }
    const newGrid = this.cloneGrid();
    newGrid[row][col] = !newGrid[row][col];
    this.setGrid(newGrid);
  }

  public draw() {
    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        this.drawCell(j, i, cell);
      });
    });
  }

  public start() {
    this.running = true;
    this.simulate();
  }

  public stop() {
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  public calculate() {
    const newGrid = this.cloneGrid();
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        let aliveNeighbor = 0;
        NEIGHBORS.forEach(([nX, nY]) => {
          const neighbor = this.grid[nX + i]?.[nY + j];
          // Neighbor is inside grid and is alive
          if (neighbor != undefined && neighbor) {
            aliveNeighbor++;
          }
        });

        const cell = this.grid[i][j];

        if (cell) {
          if (aliveNeighbor < 2 || aliveNeighbor > 3) {
            newGrid[i][j] = false;
          } else {
            newGrid[i][j] = true;
          }
        } else {
          if (aliveNeighbor === 3) {
            newGrid[i][j] = true;
          }
        }
      }
    }

    this.setGrid(newGrid);
  }

  public clear() {
    this.initEmptyGrid();
  }

  public changeSettings(settings: Partial<Settings>) {
    this.settings = {
      ...this.settings,
      ...settings,
    };
    this.draw();
  }

  private init() {
    this.initEmptyGrid();
    Object.entries(this.settings).forEach(([key, val]) => {
      const control = document.getElementById(key) as HTMLInputElement | null;
      if (control) {
        control.value = val;
      }
    });
  }

  private initEmptyGrid() {
    this.grid = new Array(ROWS).fill(new Array(COLS).fill(0));
    this.draw();
  }

  private simulate() {
    this.interval = setInterval(() => {
      this.calculate();
    }, this.settings.interval);
  }

  private drawCell(x: number, y: number, value: boolean) {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.settings.strokeWidth;
    this.ctx.strokeStyle = this.settings.strokeColor;
    this.ctx.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    this.ctx.fillStyle = value ? this.settings.fill : "white";
    this.ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    this.ctx.stroke();
  }

  private setGrid(grid: Grid) {
    // Reference changed
    if (grid !== this.grid) {
      this.grid = grid;
      this.draw();
    }
  }

  private cloneGrid() {
    return JSON.parse(JSON.stringify(this.grid)) as Grid;
  }
}
