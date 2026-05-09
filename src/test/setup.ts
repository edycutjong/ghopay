import '@testing-library/jest-dom';

// Polyfill requestAnimationFrame for jsdom
globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(() => cb(Date.now()), 0) as unknown as number;
};
globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);

// Stub HTMLCanvasElement.getContext for jsdom
HTMLCanvasElement.prototype.getContext = () => null;
