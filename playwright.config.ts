import { defineConfig, devices } from '@playwright/test';

// Playwright covers the one thing the jsdom suite structurally cannot: real
// layout. src/setupTests.ts has to stub requestAnimationFrame and
// ResizeObserver to make jsdom deterministic, which pins every jsdom test to
// the first painted frame and leaves @mui/x-charts measuring a 0x0 container.
// That is the exact blind spot a MUI or emotion bump falls into -- the bundle
// builds, the app mounts, types check, and the page is visually broken.
//
// These tests deliberately assert layout INVARIANTS (non-zero boxes, no
// horizontal overflow, charts that actually measured themselves) rather than
// pixel screenshots. Voter.js mixes Math.random() into voter positions on every
// physics frame, so a pixel baseline would be flaky by construction, and a
// flaky gate on a repo that wants to auto-merge Dependabot PRs is worse than no
// gate -- it trains you to ignore red CI.
export default defineConfig({
  testDir: './e2e',

  // A bare `test.only` left in a file would silently skip everything else.
  forbidOnly: !!process.env.CI,

  // The physics loop means a slow CI runner can occasionally miss a frame
  // budget. One retry absorbs that without hiding a real regression, which
  // would fail both attempts.
  retries: process.env.CI ? 1 : 0,

  // Chromium alone. The point here is catching layout regressions from
  // dependency bumps, and those show up identically across engines; adding
  // WebKit and Firefox would triple CI time for close to no extra signal.
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      // SimContext.tsx and index.css both branch at `window.innerWidth < 900`,
      // and the mobile branch uses a completely different voter layout plus
      // different .simulation/.explainer rules. It is a genuinely separate
      // layout to regress, so it gets its own project.
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],

  use: {
    baseURL: 'http://localhost:3000',
    // Artifacts only on failure, so a green run leaves nothing behind.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // `serve -s build` is the same static server the Dockerfile ships, so this
  // exercises the real production bundle rather than the dev server. It needs
  // `npm run build` to have run first -- the `test:e2e` script does that, and
  // in CI the Build step already has.
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
