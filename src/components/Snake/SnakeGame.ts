import { defineComponent, h, reactive, ref, Ref, onBeforeUnmount, onMounted, watch } from 'vue';
import 'src/components/Canvas';
import getScoreSound from 'app/public/mixkit-game-ball-tap-2073.wav';
import getEndSound from 'app/public/mixkit-player-losing-or-failing-2042.wav';
import MainMenuOptions from './MainMenuOptions';
import GameOver from './GameOver';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let gameInterval: NodeJS.Timeout;
let mainMenu: MainMenuOptions;
let gameOver: GameOver;
const defaultTail = 1;

declare global {
  interface CanvasRenderingContext2D {
    roundRect: (x: number, y: number, w: number, h: number, r: number) => CanvasDrawPath
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
    
    const music = reactive({
      score: {
        volume: 1,
        sound: new Audio(getScoreSound)
      },
      end:{
        volume: 1,
        sound: new Audio(getEndSound)
      }
    });

    function playGetScoreSound() {
      music.score.sound.volume = music.score.volume;
      music.score.sound.play();
    }

    function playEndSound() {
      music.end.sound.volume = music.end.volume;
      music.end.sound.play();
    }

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

        if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'options') {
          
        }

        if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'source') {
          window.close();
        }
      }
    }

    function canvasMouseMoveEvent(evt: MouseEvent) {
      const pos = getMousePos(canvas, evt);
      resetMap();

      if (!state.gameStatus && state.pageStatus === 'main') {
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
          mainMenu.exit(true);
        } else {
          mainMenu.exit(false);
        }

        if (
          (
            (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'start')
            ||
            (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'options')
            ||
            (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'source')
          )
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
        playGetScoreSound();
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
      for (const item of state.trailArr) {
        if ((item.x === state.player.x) && (item.y === state.player.y)) {
          playEndSound();
          state.gameStatus = false;
          state.pageStatus = 'gameOver';
          gameOver.gameOver(state.tail);
          clearInterval(gameInterval);

          state.tail = defaultTail;
          state.player = { x: 15, y: 15 };
          state.move = { x: 0.1, y: 0 };
          return;
        }

        const x = item.x * state.size;
        const y = item.y * state.size;

        ctx.roundRect(
          x,
          y,
          state.size - 2,
          state.size - 2,
          state.size / 2
        ).fill();
      }

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
      mainMenu.exit();
    }

    function optionMap() {
      
    }

    function sourceMap() {
      
    }

    onMounted(() => {
      canvas = document.getElementById("gc") as HTMLCanvasElement;
      ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      mainMenu = new MainMenuOptions(canvas, ctx);
      gameOver = new GameOver(canvas, ctx);

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
