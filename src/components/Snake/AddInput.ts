import RecordClass from "./RecordClass";

export default class AddInput extends RecordClass {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pos: {
    x: number;
    y: number;
  };
  inputTextValue: string;
  input: HTMLInputElement | undefined;
  constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super();
    this.canvas = canvas;
    this.ctx = ctx;
    this.pos = {
      x: 4,
      y: 4,
    };
    this.input;
    this.inputTextValue = '';
  }

  async inputPos(x: number, y: number) {
    this.input = document.createElement('input');
    this.pos = { x, y };
  
    this.input.type = 'text';
    this.input.style.position = 'fixed';
    this.input.style.left = `${this.pos.x - 4}px`;
    this.input.style.top = `${this.pos.y - 4}px`;
    this.input.style.height = '30px';
    this.input.style.width = '150px';
    this.input.placeholder = 'nickname';

    document.body.appendChild(this.input);
    this.input.focus();

    return this.input;
  }

  handleBlur = (e: Event) => {
    return new Promise((resolve) => {
      this.inputTextValue = this.input?.value||'';
      document.body.removeChild(this.input as HTMLInputElement);
      resolve(this.inputTextValue);
    })
  }

  drawText() {
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'left';
    this.ctx.font = '14px 둥근모꼴';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(this.inputTextValue, this.pos.x, this.pos.y);
  }
}
