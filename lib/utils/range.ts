export const range = (startOrCount: number, end?: number, step: number = 1) =>
  Array.from(Array(Math.floor(end !== undefined ? (end - startOrCount) / step : startOrCount))).map((_, i) => end !== undefined ? (i * step) + startOrCount : i * step);
