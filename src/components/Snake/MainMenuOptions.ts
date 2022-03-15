class MainMenuOptions {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  start(on?: boolean) {
    this.ctx.font = "bold 40px 둥근모꼴";
    this.ctx.fillStyle = on ? 'lime' : "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`시작`, (this.canvas.width / 2), ((this.canvas.height - 100) / 3) * 1);
  }

  options(on?: boolean) {
    this.ctx.font = "bold 40px 둥근모꼴";
    this.ctx.fillStyle = on ? 'lime' : "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`옵션`, (this.canvas.width / 2), ((this.canvas.height - 100) / 3) * 2);
  }

  exit(on?: boolean) {
    this.ctx.font = "bold 40px 둥근모꼴";
    this.ctx.fillStyle = on ? 'red' : "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`나가기`, (this.canvas.width / 2), ((this.canvas.height - 100) / 3) * 3);
  }

  menuWidthPosition(x: number): boolean {
    return ((this.canvas.width / 2) - 50) <= x && x <= ((this.canvas.width / 2) + 50)
  }

  menuHeightPosition(y: number): 'start' | 'options' | 'source' | undefined {
    const defaultHeight = this.canvas.height - 100;

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

export default MainMenuOptions;
