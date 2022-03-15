export default class GameOver {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  score: number;
  constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.score = 0;
  }

  resetMap() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  gameOver(score: number) {
    this.resetMap();
    this.score = score;

    this.header();

    this.restart();
    this.goMain();
    this.recordScore();
  }

  header() {
    this.ctx.font = "40px '둥근모꼴'";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`Game Over`, (this.canvas.width / 2), ((this.canvas.height - 100) / 10) * 4);
    
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px '둥근모꼴'";
    this.ctx.fillText(`점수: ${this.score}`, (this.canvas.width / 2), ((this.canvas.height - 100) / 10) * 5);

    this.ctx.font = "25px '둥근모꼴'";
    this.ctx.fillText(`최고 기록: ${this.score}`, (this.canvas.width / 2), ((this.canvas.height - 100) / 10) * 6);
  }

  restart(on?: boolean) {
    // console.log(on, on ? "lime" : "white");
    this.ctx.fillStyle = on ? "lime" : "white";
    this.ctx.fillText(`재시도`, (this.canvas.width / 10) * 2, ((this.canvas.height) / 4) * 3);
  }

  goMain(on?: boolean) {
    this.ctx.fillStyle = on ? "lime" : "white";
    this.ctx.fillText(`메인으로`, (this.canvas.width / 10) * 8, ((this.canvas.height) / 4) * 3);
  }

  recordScore(on?: boolean) {
    this.ctx.fillStyle = on ? "lime" : "white";
    this.ctx.fillText(`점수 기록`, (this.canvas.width / 10) * 5, ((this.canvas.height) / 4) * 3);
  }

  widthPosition(x: number): 'restart' | 'record' | 'goMain' | undefined {
    const defaultWidth = this.canvas.width / 10;

    if(
      (x >= (defaultWidth * 2) - 47)
      &&
      (x <= (defaultWidth * 2) + 44)
    ) {
      return 'restart'
    }

    if(
      (x >= (defaultWidth * 5) - 68)
      &&
      (x <= (defaultWidth * 5) + 65)
    ) {
      return 'record'
    }

    if(
      (x >= (defaultWidth * 8) - 60)
      &&
      (x <= (defaultWidth * 8) + 60)
    ) {
      return 'goMain'
    }
  }
  heightPosition(y: number): boolean {
    return (this.canvas.height / 4 * 3) - 22 <= y && y <= (this.canvas.height / 4 * 3) + 8;
  }
}