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
    this.ctx.fillText(`시작`, (this.canvas.width / 2), ((this.canvas.height - 100) / 9) * 3);
  }

  options(on?: boolean) {
    this.ctx.font = "bold 40px 둥근모꼴";
    this.ctx.fillStyle = on ? 'lime' : "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`옵션`, (this.canvas.width / 2), ((this.canvas.height - 100) / 9) * 5);
  }

  exit(on?: boolean) {
    this.ctx.font = "bold 40px 둥근모꼴";
    this.ctx.fillStyle = on ? 'red' : "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`나가기`, (this.canvas.width / 2), ((this.canvas.height - 100) / 9) * 9);
  }

  showRecord(on?: boolean) {
    this.ctx.font = "bold 40px 둥근모꼴";
    this.ctx.fillStyle = on ? 'lime' : "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`기록보기`, (this.canvas.width / 2), ((this.canvas.height - 100) / 9) * 7);
  }

  menuWidthPosition(x: number): boolean {
    return ((this.canvas.width / 2) - 50) <= x && x <= ((this.canvas.width / 2) + 50)
  }

  menuHeightPosition(y: number): 'start' | 'options' | 'exit' | 'record' | undefined {
    const defaultHeight = (this.canvas.height - 100) / 9;

    if (
      (y >= (defaultHeight * 3) - 30)
      &&
      (y <= (defaultHeight * 3) + 7)
    ) {
      return 'start';
    }

    if (
      (y >= (defaultHeight * 5) - 30)
      &&
      (y <= (defaultHeight * 5) + 7)
    ) {
      return 'options';
    }

    if (
      (y >= (defaultHeight * 9) - 30)
      &&
      (y <= (defaultHeight * 9) + 7)
    ) {
      return 'exit';
    }

    if (
      (y >= (defaultHeight * 7) - 30)
      &&
      (y <= (defaultHeight * 7) + 7)
    ) {
      return 'record';
    }
  }
}

export default MainMenuOptions;
