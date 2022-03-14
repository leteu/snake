import { defineComponent, h, reactive, onBeforeUnmount, onMounted } from 'vue';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let gameInterval: NodeJS.Timeout;

const defaultTail = 1;

declare global {
  interface CanvasRenderingContext2D {
    roundRect: (x: number, y: number, w: number, h: number, r: number) => CanvasDrawPath
  }
}

class MainMenuOptions {
  start(on?: boolean) {
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = on ? 'lime' : "white";
    ctx.textAlign = "center";
    ctx.fillText(`시작`, (canvas.width / 2), ((canvas.height - 100) / 3) * 1);
  }

  options(on?: boolean) {
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = on ? 'lime' : "white";
    ctx.textAlign = "center";
    ctx.fillText(`옵션`, (canvas.width / 2), ((canvas.height - 100) / 3) * 2);
  }

  source(on?: boolean) {
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = on ? 'lime' : "white";
    ctx.textAlign = "center";
    ctx.fillText(`출처`, (canvas.width / 2), ((canvas.height - 100) / 3) * 3);
  }

  menuWidthPosition(x: number): boolean {
    return ((canvas.width / 2) - 50) <= x && x <= ((canvas.width / 2) + 50)
  }

  menuHeightPosition(y: number): 'start' | 'options' | 'source' | undefined {
    const defaultHeight = canvas.height - 100;

    if (
      (y >= (defaultHeight / 3) - 40)
      &&
      (y <= (defaultHeight / 3) + 10)
    ) {
      return 'start';
    }

    if (
      (y >= (defaultHeight / 3 * 2) - 40)
      &&
      (y <= (defaultHeight / 3 * 2) + 10)
    ) {
      return 'options';
    }

    if (
      (y >= defaultHeight - 40)
      &&
      (y <= (defaultHeight + 10))
    ) {
      return 'source';
    }
  }
}

export default defineComponent({
  name: "SnakeGame",
  setup() {
    const state = reactive({
      size: 15,

      player: {
        x: 15,
        y: 15
      },

      score: {
        x: 15,
        y: 15,
      },

      move: {
        x: 0,
        y: 0
      },

      trailArr: [] as { x: number, y: number }[],
      tail: defaultTail,

      gameStatus: false,

      max: {
        width: 0,
        height: 0
      }
    });

    const mainMenu = new MainMenuOptions();

    CanvasRenderingContext2D.prototype.roundRect = function (x: number, y: number, w: number, h: number, r: number) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };

    function getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
      var rect = canvas.getBoundingClientRect();

      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    function canvasClickEvent(evt: MouseEvent) {
      const pos = getMousePos(canvas, evt);

      if (!state.gameStatus) {
        if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'start') {
          startGame();
        }
      }
    }

    function canvasMouseMoveEvent(evt: MouseEvent) {
      const pos = getMousePos(canvas, evt);
      resetMap();

      if (!state.gameStatus) {
        if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'start') {
          mainMenu.start(true);
        } else {
          mainMenu.start(false);
        }

        if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'options') {
          mainMenu.options(true);
        } else {
          mainMenu.options(false);
        }

        if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'source') {
          mainMenu.source(true);
        } else {
          mainMenu.source(false);
        }

        if (
          (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'start')
          ||
          (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'options')
          ||
          (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'source')
        ) {
          canvas.style.cursor = 'pointer';
        } else {
          canvas.style.cursor = 'default';
        }
      }

      if (state.gameStatus) {
        canvas.style.cursor = 'default';
      }
    }

    function addEvent() {
      window.addEventListener('resize', resetSize);
      document.addEventListener("keydown", keyPush);
      canvas.addEventListener('click', canvasClickEvent);
      canvas.addEventListener('mousemove', canvasMouseMoveEvent)
    }

    function removeEvent() {
      window.removeEventListener('resize', resetSize);
      document.removeEventListener("keydown", keyPush);
      canvas.removeEventListener('click', canvasClickEvent);
      canvas.removeEventListener('mousemove', canvasMouseMoveEvent)
      clearInterval(gameInterval);
    }

    function resetSize() {
      canvas.width = 900;
      canvas.height = 600;

      state.max = {
        width: (canvas.width / state.size) - 1,
        height: (canvas.height / state.size) - 1
      };

      resetMap();
    }

    function startGame() {
      if (!state.gameStatus) {
        state.move = { x: 0.1, y: 0 };
        state.score = getScorePosition();
        gameInterval = setInterval(game, 1);
        state.gameStatus = true;
      }
    }

    // 배경
    function resetMap() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function getScorePosition() {
      const position = {
        x: Math.floor(Math.random() * ((canvas.width / 15) - 1)),
        y: Math.floor(Math.random() * ((canvas.height / 15) - 1))
      };

      return position;
    }

    function game() {
      state.player.x += state.move.x;
      state.player.y += state.move.y;

      state.player.x = parseFloat(state.player.x.toFixed(1));
      state.player.y = parseFloat(state.player.y.toFixed(1));

      if (state.player.x < 0) {
        state.player.x = state.max.width;
      }
      if (state.player.x > state.max.width) {
        state.player.x = 0;
      }
      if (state.player.y < 0) {
        state.player.y = state.max.height;
      }
      if (state.player.y > state.max.height) {
        state.player.y = 0;
      }

      resetMap();

      // 점수
      if (
        (
          (
            (state.player.x >= (state.score.x + (state.size / 30) - (state.size / 15)))
            &&
            (state.player.x <= (state.score.x + (state.size / 30) + (state.size / 15)))
          )
        )
        &&
        (
          (
            (state.player.y >= (state.score.y + (state.size / 30) - (state.size / 15)))
            &&
            (state.player.y <= (state.score.y + (state.size / 30) + (state.size / 15)))
          )
        )
      ) {
        state.tail++;
        state.score = getScorePosition();
      }

      ctx.fillStyle = "red";
      ctx.roundRect(
        state.score.x * state.size,
        state.score.y * state.size,
        state.size - 2,
        state.size - 2,
        state.size / 2
      ).fill();

      // snake
      ctx.fillStyle = "lime";
      // console.log("*===================================================*")
      state.trailArr.forEach((item, index, arr) => {
        // console.log(item.x, item.y);

        const x = item.x * state.size;
        const y = item.y * state.size;

        ctx.roundRect(
          x,
          y,
          state.size - 2,
          state.size - 2,
          state.size / 2
        ).fill();

        if ((item.x === state.player.x) && (item.y === state.player.y)) {
          state.gameStatus = false;
          alert(`게임 오버 \n 기록 : ${state.tail}`);
          clearInterval(gameInterval);
          state.tail = defaultTail;
          state.player = {
            x: 15,
            y: 15
          };
          state.move = { x: 0.1, y: 0 };
          mainMap();
        }
      })
      // console.log("*===================================================*")

      state.trailArr.push({ x: state.player.x, y: state.player.y });
      while (state.trailArr.length > state.tail * 10) {
        state.trailArr.shift();
      }

      ctx.font = "15px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "right";
      ctx.fillText(`Score: ${state.tail}`, canvas.width - 9, 20);
    }

    function keyPush(evt: KeyboardEvent) {
      switch (evt.keyCode) {
        case 65:
        case 37:
          state.move = { x: -0.1, y: 0 }
          break;
        case 87:
        case 38:
          state.move = { x: 0, y: -0.1 }
          break;
        case 68:
        case 39:
          state.move = { x: 0.1, y: 0 }
          break;
        case 83:
        case 40:
          state.move = { x: 0, y: 0.1 }
          break;
      }
    }

    function mainMap() {
      resetMap();
      mainMenu.start();
      mainMenu.options();
      mainMenu.source();
    }

    function optionMap() {

    }

    function sourceMap() {
      
    }

    onMounted(() => {
      canvas = document.getElementById("gc") as HTMLCanvasElement;
      ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      addEvent();
      resetSize();
      mainMap();
    });

    onBeforeUnmount(() => {
      removeEvent();
    });

    return () => h('canvas', { id: 'gc' })
  }
});
