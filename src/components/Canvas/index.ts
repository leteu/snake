import roundRect from "./RoundRect";

declare global {
  interface CanvasRenderingContext2D {
    roundRect: (x: number, y: number, w: number, h: number, r: number) => CanvasDrawPath
  }
}

export {
  roundRect
}