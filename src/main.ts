import { Game } from "./classes/game";
import { CELL_SIZE, COLS, ROWS } from "./constants/constants";
import "./style.css";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
  if (!canvas) {
    throw new Error("Canvas not rendered");
  }

  // set up canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Error getting canvas context");
  }

  const game = new Game(ctx);

  canvas.addEventListener("click", ({ clientX, clientY }) => {
    const [i, j] = [
      Math.floor(clientY / CELL_SIZE),
      Math.floor(clientX / CELL_SIZE),
    ];
    // Outside of grid
    if (j >= COLS || i >= ROWS) {
      return;
    }

    game.click(i, j);
  });

  const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
  const clearBtn = document.getElementById("clear-btn") as HTMLButtonElement;
  const controls = document.getElementsByClassName("control");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      for (const control of controls) {
        (control as any).disabled = !game.running;
      }
      if (game.running) {
        startBtn.innerText = "Start";
        clearBtn.disabled = false;
        game.stop();
      } else {
        startBtn.innerText = "Stop";
        clearBtn.disabled = true;
        game.start();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (game.running) {
        console.log("Cannot clear while simulation is running");
        return;
      }
      game.clear();
    });
  }

  const menu = document.getElementById("menu");
  if (menu) {
    let isDragging = false;
    let offsetX = 0,
      offsetY = 0;

    menu.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX += e.offsetX;
      offsetY += e.offsetY;
    });

    menu.addEventListener("mouseup", () => {
      isDragging = false;
      offsetX = 0;
      offsetY = 0;
    });

    document.addEventListener("mousemove", ({ clientX, clientY }) => {
      if (isDragging) {
        menu.style.left = `${clientX - offsetX}px`;
        menu.style.top = `${clientY - offsetY}px`;
      }
    });
  }

  for (const control of controls) {
    control.addEventListener("change", (e) => {
      const target = e.target as any;
      game.changeSettings({ [target.id]: target.value });
    });
  }
});
