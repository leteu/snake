import { defineComponent, h, reactive, onBeforeUnmount, onMounted } from 'vue';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let gameInterval: NodeJS.Timeout;

const defaultTail = 1;

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

    function addEvent() {
      window.addEventListener('resize', resetSize);
      document.addEventListener("keydown", keyPush);
      canvas.addEventListener("click", startGame);
    }

    function removeEvent() {
      window.removeEventListener('resize', resetSize);
      document.removeEventListener("keydown", keyPush);
      canvas.removeEventListener("click", startGame);
      clearInterval(gameInterval);
    }

    function resetSize() {
      // canvas.width = (15 * Math.floor((canvas?.parentElement?.offsetWidth as number) / 15));
      // canvas.height = (15 * Math.floor((canvas?.parentElement?.offsetHeight as number) / 15));

      canvas.width = 900;
      canvas.height = 600;


      state.max = {
        width: (canvas.width / state.size) - 1,
        height: (canvas.height / state.size) - 1
      };

      console.log(canvas);

      resetMap();
    }

    function startGame() {
      if (!state.gameStatus) {
        state.move = { x: 0.1, y: 0 };
        state.score = getScorePosition();
        gameInterval = setInterval(game, 0);
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
            (state.player.x >= (state.score.x + (state.size/30) - (state.size/15)))
            && 
            (state.player.x <= (state.score.x + (state.size/30) + (state.size/15)))
          )
        )
        &&
        (
          (
            (state.player.y >= (state.score.y + (state.size/30) - (state.size/15)))
            && 
            (state.player.y <= (state.score.y + (state.size/30) + (state.size/15)))
          )
        )
      ) {
        state.tail++;
        state.score = getScorePosition();
      }
      
      ctx.fillStyle = "red";
      ctx.fillRect(
        state.score.x * state.size,
        state.score.y * state.size,
        state.size - 2,
        state.size - 2
      );

      // snake
      ctx.fillStyle = "lime";
      state.trailArr.forEach((item, index) => {
        ctx.fillRect(
          item.x * state.size,
          item.y * state.size,
          state.size - 2,
          state.size - 2
        );

        if ((item.x === state.player.x) && (item.y === state.player.y)) {
          state.gameStatus = false;
          alert(`게임 오버 \n 기록 : ${state.tail}`);
          clearInterval(gameInterval);
          state.tail = defaultTail;
          resetMap();
        }
      })

      state.trailArr.push({ x: state.player.x, y: state.player.y });
      while (state.trailArr.length > state.tail) {
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

    onMounted(() => {
      canvas = document.getElementById("gc") as HTMLCanvasElement;
      ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      addEvent();
      resetSize();
      resetMap();
    });

    onBeforeUnmount(() => {
      removeEvent();
    });

    return () => h('canvas', { id: 'gc' })
  }
});
