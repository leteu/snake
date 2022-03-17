import { defineComponent, h, reactive, ref, Ref, onBeforeUnmount, onMounted, watch, useSlots } from 'vue';
import 'src/components/Canvas';
import getScoreSound from 'app/public/mixkit-game-ball-tap-2073.wav';
import getEndSound from 'app/public/mixkit-player-losing-or-failing-2042.wav';
import getBonusSound from 'app/public/mixkit-video-game-bomb-alert-2803.wav';
import MainMenuOptions from './MainMenuOptions';
import GameOver from './GameOver';
import RecordClass from './RecordClass';
import AddInput from './AddInput';
import { useStore } from 'vuex';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
// let gameInterval: NodeJS.Timeout;
let gameInterval: () => void;
let mainMenu: MainMenuOptions;
let gameOver: GameOver;
let inputClass: AddInput;
const defaultTail = 1;
const recordClass = new RecordClass();

export default defineComponent({
  name: "SnakeGame",
  setup() {
    const $store = useStore();

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
      pageStatus: 'main' as 'main' | 'options' | 'gameOver' | 'game',

      max: {
        width: 0,
        height: 0
      },

      bonus: {
        x: 0,
        y: 0,
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
      },
      bonus: {
        volume: 1,
        sound: new Audio(getBonusSound)
      }
    });

    const rainbowState = reactive({
      bonus: false,
      from: (Math.random() * 360) % 360,
      to: (Math.random() * 360) % 360,
      step: 1
    })

    function playGetScoreSound() {
      music.score.sound.volume = music.score.volume;
      music.score.sound.play();
    }

    function playEndSound() {
      music.end.sound.volume = music.end.volume;
      music.end.sound.play();
    }

    function playBonusSound() {
      music.bonus.sound.volume = music.bonus.volume;
      music.bonus.sound.loop = true;
      music.bonus.sound.play();

      setTimeout(() => {
        music.bonus.sound.pause();
      }, 10 * 1000)
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

      switch(state.pageStatus) {
        case 'main':
          if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'start') {
            startGame();
          }
  
          if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'options') {
            
          }

          if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'record') {
            $store.dispatch('RecordModalModule/show');
          }
  
          if (mainMenu.menuWidthPosition(pos.x) && mainMenu.menuHeightPosition(pos.y) === 'exit') {
            window.close();
          }
          break;

        case 'gameOver':
          if (gameOver.widthPosition(pos.x) === 'restart' && gameOver.heightPosition(pos.y)) {
            startGame();
          }
  
          if (gameOver.widthPosition(pos.x) === 'record' && gameOver.heightPosition(pos.y)) {
            // const playerName = prompt('이름을 입력해주세요.');
            // recordClass.record('');
            canvas.removeEventListener('click', canvasClickEvent);
            canvas.removeEventListener('mousemove', canvasMouseMoveEvent);
            inputClass.inputPos((canvas.width / 10) * 5 ,canvas.height / 4 * 3)
              .then((input) => {
                input.onblur = (event) => inputClass.handleBlur(event)
                  .then((res) => {
                    if(res) {
                      recordClass.record(`${res}`);
                    }
                    canvas.addEventListener('click', canvasClickEvent);
                    canvas.addEventListener('mousemove', canvasMouseMoveEvent);
                  })
              });
          }
  
          if (gameOver.widthPosition(pos.x) === 'goMain' && gameOver.heightPosition(pos.y)) {
            mainMap();
          }
          break;

        default:
          break;
      }
    }

    function canvasMouseMoveEvent(evt: MouseEvent) {
      const pos = getMousePos(canvas, evt);
      resetMap();

      switch(state.pageStatus) {
        case 'main':
          const mainWidthPosition = mainMenu.menuWidthPosition(pos.x);
          const mainHeightPosition = mainMenu.menuHeightPosition(pos.y);

          mainMenu.start(mainWidthPosition && mainHeightPosition === 'start');
          mainMenu.options(mainWidthPosition && mainHeightPosition === 'options');
          mainMenu.exit(mainWidthPosition && mainHeightPosition === 'exit');
          mainMenu.showRecord(mainWidthPosition && mainHeightPosition === 'record');

          canvas.style.cursor = (
            (
              (mainWidthPosition && mainHeightPosition === 'start')
              || (mainWidthPosition && mainHeightPosition === 'options')
              || (mainWidthPosition && mainHeightPosition === 'record')
              || (mainWidthPosition && mainHeightPosition === 'exit')
            )
          ) ? 'pointer' : 'default';

          break;
        case 'gameOver':
          const overWidthPosition = gameOver.widthPosition(pos.x);
          const overHeightPosition = gameOver.heightPosition(pos.y);

          resetMap();
          gameOver.header();
          gameOver.restart(overWidthPosition === 'restart' && overHeightPosition);
          gameOver.recordScore(overWidthPosition === 'record' && overHeightPosition);
          gameOver.goMain(overWidthPosition === 'goMain' && overHeightPosition);

          canvas.style.cursor = (
            (overWidthPosition === 'restart' && overHeightPosition)
            || (overWidthPosition === 'record' && overHeightPosition)
            || (overWidthPosition === 'goMain' && overHeightPosition)
          ) ? 'pointer' : 'default';

          break;
        default:
          canvas.style.cursor = 'default';
          break;
      }
    }

    watch(
      () => state.pageStatus,
      (newVal) => {
        switch(newVal) {
          case 'main':
          case 'gameOver':
            canvas.addEventListener('click', canvasClickEvent);
            canvas.addEventListener('mousemove', canvasMouseMoveEvent);
            break;
          case 'game':
          case 'options':
          default:
            canvas.removeEventListener('click', canvasClickEvent);
            canvas.removeEventListener('mousemove', canvasMouseMoveEvent);
            break;
        }
      },
      {
        deep: true
      }
    )

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
      // clearInterval(gameInterval);
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
        state.bonus = getScorePosition();
        // gameInterval = setInterval(game, 1);
        gameInterval = () => {
          setTimeout(() => {
            if(!state.gameStatus) return;
            game();
            gameInterval();
          }, rainbowState.bonus ? 1 : 7);
        };
        gameInterval();

        state.gameStatus = true;
        state.pageStatus = 'game';
      }
    }

    // 배경
    function resetMap() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if(rainbowState.bonus) {
        ctx.strokeStyle = createGradient();
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      }
    }

    function createGradient() {
      var gr = ctx.createLinearGradient(0, 0, 500, 0);               // create gradient
      gr.addColorStop(0, `hsl(${rainbowState.from}, 100%, 50%)`);   // start color
      gr.addColorStop(1, `hsl(${rainbowState.to}, 100%, 50%)`);   // end color
      return gr;                                            // set as fill style
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
      rainbowState.from += rainbowState.step;
      rainbowState.to += rainbowState.step;

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
        state.tail += rainbowState.bonus ? 2 : 1;
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

      // bonus
      if (
        (
          (
            (state.player.x >= (state.bonus.x + (state.size / 30) - (state.size / 15)))
            &&
            (state.player.x <= (state.bonus.x + (state.size / 30) + (state.size / 15)))
          )
        )
        &&
        (
          (
            (state.player.y >= (state.bonus.y + (state.size / 30) - (state.size / 15)))
            &&
            (state.player.y <= (state.bonus.y + (state.size / 30) + (state.size / 15)))
          )
        )
      ) {
        rainbowState.bonus = true;
        setTimeout(() => {
          rainbowState.bonus = false;
        }, 10 * 1000);
        playBonusSound();
        state.bonus = getScorePosition();
      }

      if(!rainbowState.bonus) {
        ctx.fillStyle = createGradient();
        ctx.roundRect(
          state.bonus.x * state.size,
          state.bonus.y * state.size,
          state.size - 2,
          state.size - 2,
          state.size / 2
        ).fill();
      }

      // snake
      ctx.fillStyle = "lime";
      for (const item of state.trailArr) {
        if ((item.x === state.player.x) && (item.y === state.player.y)) {
          playEndSound();
          state.gameStatus = false;
          state.pageStatus = 'gameOver';
          recordClass.updateScore(state.tail);
          gameOver.gameOver(state.tail);
          // clearInterval(gameInterval);

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
      state.pageStatus = 'main';
      resetMap();
      mainMenu.start();
      mainMenu.options();
      mainMenu.exit();
      mainMenu.showRecord();
    }

    function optionMap() {
      state.pageStatus = 'options';
      
    }

    onMounted(() => {
      canvas = document.getElementById("gc") as HTMLCanvasElement;
      ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      mainMenu = new MainMenuOptions(canvas, ctx);
      gameOver = new GameOver(canvas, ctx);
      inputClass = new AddInput(canvas, ctx);

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
