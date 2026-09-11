import Module from 'node:module';
import { expect, afterEach, beforeEach } from '@rstest/core';
// jest-dom ships its matchers separately from its Jest auto-registration, so
// they can be attached to rstest's expect explicitly. Doing it this way means
// the suite does not depend on `globals: true`.
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers as any);

// ---------------------------------------------------------------------------
// Binary assets
// ---------------------------------------------------------------------------
// ImageObject.js and Video.js build their asset paths dynamically:
//   this.url = require(`../assets/${url}`)
// rspack leaves a dynamic require() like that untransformed -- it does not build
// a context module for it -- so at test time the call reaches Node's require,
// which tries to parse the PNG/JPEG bytes as JavaScript and throws
// "SyntaxError: Invalid or unexpected token".
//
// Registering loaders for the binary extensions makes those requires resolve to
// a harmless string. Components only pass the value to an <img src>/<video src>,
// so nothing here depends on the real bytes.
const stubAsset = (module: NodeJS.Module) => {
  (module as any).exports = 'test-asset-stub';
};
for (const ext of ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.mp4', '.ogg', '.mkv', '.pdn', '.webp']) {
  (Module as any)._extensions[ext] = stubAsset;
}

// ---------------------------------------------------------------------------
// Browser APIs jsdom does not implement
// ---------------------------------------------------------------------------
// @mui/x-charts measures its container with ResizeObserver.
if (!('ResizeObserver' in globalThis)) {
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom throws "Not implemented" for media playback; Video.js calls play().
if (typeof globalThis.HTMLMediaElement !== 'undefined') {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: () => Promise.resolve(),
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: () => {},
  });
}

beforeEach(() => {
  // Simulation.tsx drives a requestAnimationFrame game loop that calls setState
  // every frame. Left live, it re-renders forever and makes any assertion a
  // race. Stubbing it to a no-op pins every test to the first painted frame,
  // which is the right scope for a smoke test -- the animation itself is
  // Playwright's job, not jsdom's.
  (globalThis as any).requestAnimationFrame = () => 0;
  (globalThis as any).cancelAnimationFrame = () => {};

  // SimContext branches on window.innerWidth < 900 and picks a completely
  // different voter layout below that. Pin it so runs are reproducible.
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 });
});

afterEach(() => {
  cleanup();
});
