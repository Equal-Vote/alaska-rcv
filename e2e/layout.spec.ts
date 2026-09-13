import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Route sample
// ---------------------------------------------------------------------------
// Unlike src/__tests__/routes.test.tsx, this file cannot derive its routes from
// `elections`: that module pulls in React components and binary assets, neither
// of which Node can import outside the bundler. A hardcoded sample is the right
// scope anyway -- jsdom already renders all ~78 routes, and what is being
// checked here (does the browser lay this out) does not vary meaningfully from
// one case study to the next.
const ROUTES = {
  selector: '/',
  simulation: '/alaska22',
  // star-conversion is the dimension whose explainer renders <Bars>, i.e. the
  // only @mui/x-charts surface in the app.
  chart: '/alaska22/star-conversion',
  otherElection: '/burlington09',
} as const;

// `domcontentloaded` rather than the default `load`: several case studies embed
// multi-megabyte .ogg/.mp4 assets (allElections1.ogg alone is 4.5MB), and
// waiting on the load event means waiting for all of them to finish
// downloading. Nothing asserted here depends on media bytes, and on burlington09
// the default reliably blew the 30s test timeout.
//
// The app then paints over several physics frames before layout settles:
// Simulation.tsx passes 800 as a fallback height until simRef is attached, and
// Bars.tsx measures its container in an effect. Polling for a non-zero
// .simulation box is more reliable than a fixed timeout on a loaded CI runner.
async function visit(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.app')).toBeVisible();
  const sim = page.locator('.simulation');
  if (await sim.count()) {
    await expect(sim).toBeVisible();
    await expect
      .poll(async () => (await sim.boundingBox())?.height ?? 0, { timeout: 15_000 })
      .toBeGreaterThan(0);
  }
}

// A page that lays out correctly never scrolls sideways. This catches the
// classic MUI/emotion regression: a Box or Grid whose default width or margin
// changes and pushes the content wider than the viewport.
//
// This asks whether the page CAN be scrolled, rather than comparing
// documentElement.scrollWidth to clientWidth. The obvious scrollWidth version
// reports 11px of overflow on the selector route at mobile widths that no
// element accounts for -- nothing has a box past either edge, body.scrollWidth
// is exactly the viewport, and window.scrollX will not move off zero. Whatever
// produces that number, the user cannot reach it, so asserting on it would mean
// a permanently red mobile run over something invisible.
async function expectNoHorizontalOverflow(page: Page) {
  const scrolled = await page.evaluate(() => {
    const startX = window.scrollX;
    window.scrollTo(99_999, window.scrollY);
    const reached = window.scrollX;
    window.scrollTo(startX, window.scrollY);
    return reached - startX;
  });
  expect(scrolled).toBe(0);
}

test.describe('case study selector', () => {
  test('renders a list of case studies without overflowing', async ({ page }) => {
    await visit(page, ROUTES.selector);

    // The selector is built entirely from MUI primitives (Box, Button, List,
    // Typography), so "it rendered real content" is a direct MUI smoke test.
    await expect(page.locator('.app')).toBeVisible();
    const text = await page.locator('.app').innerText();
    expect(text.trim().length).toBeGreaterThan(0);

    await expectNoHorizontalOverflow(page);
  });

  test('the MUI filter dialog opens', async ({ page }) => {
    await visit(page, ROUTES.selector);

    // Dialog is the most behaviourally complex MUI component in the app --
    // portals, focus trap, transitions. If a MUI major breaks it, it breaks
    // here and nowhere jsdom looks.
    const filter = page.getByRole('button').filter({ hasText: /filter/i }).first();
    const trigger = (await filter.count()) ? filter : page.locator('button').first();
    await trigger.click();

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
  });
});

test.describe('simulation layout', () => {
  for (const [name, route] of [
    ['alaska22', ROUTES.simulation],
    ['burlington09', ROUTES.otherElection],
  ] as const) {
    test(`${name} lays out the simulation and explainer`, async ({ page }) => {
      await visit(page, route);

      // The simulation panel must occupy real space. In jsdom every one of
      // these boxes is 0x0, so this assertion is only meaningful here.
      const simBox = await page.locator('.simulation').boundingBox();
      expect(simBox).not.toBeNull();
      expect(simBox!.width).toBeGreaterThan(0);
      expect(simBox!.height).toBeGreaterThan(0);

      // Voters are the simulation. GameObject.asComponent renders each as
      // <div class="object Voter ...">, so zero of them means the simulation
      // is not drawing at all.
      await expect
        .poll(async () => page.locator('.simulation .object').count(), { timeout: 10_000 })
        .toBeGreaterThan(0);

      const explainer = page.locator('.explainer');
      await expect(explainer).toBeVisible();
      const explainerBox = await explainer.boundingBox();
      expect(explainerBox!.height).toBeGreaterThan(0);

      await expectNoHorizontalOverflow(page);
    });
  }

  test('the physics loop actually runs', async ({ page }) => {
    // Count requestAnimationFrame calls rather than watching a voter move.
    // Voters legitimately come to rest -- Simulation.tsx decrements
    // simState.activeFrames once every object isMember(), and GameObject sleeps
    // settled bodies -- so "the transform changed" is not a sound signal for
    // "the loop is alive". Counting the ticks tests the loop directly, and is
    // how a React scheduling regression would surface while every static
    // assertion above still passed.
    await page.addInitScript(() => {
      (window as any).__rafTicks = 0;
      const original = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb: FrameRequestCallback) => {
        (window as any).__rafTicks++;
        return original(cb);
      };
    });

    await visit(page, ROUTES.simulation);

    const ticks = () => page.evaluate(() => (window as any).__rafTicks as number);
    const before = await ticks();
    expect(before).toBeGreaterThan(0);
    await expect.poll(ticks, { timeout: 10_000 }).toBeGreaterThan(before);
  });
});

test.describe('@mui/x-charts', () => {
  test('the bar chart measures itself and renders', async ({ page }) => {
    await visit(page, ROUTES.chart);

    // This is the single most valuable assertion in the file. Bars.tsx sizes
    // the chart from ref.current.clientWidth, and x-charts measures its own
    // container with ResizeObserver -- which src/setupTests.ts stubs to a class
    // that never fires. So in jsdom this chart is always 0x0 and any x-charts
    // regression passes silently.
    const chart = page.locator('.bars svg').first();
    await expect(chart).toBeVisible({ timeout: 10_000 });

    const box = await chart.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(50);

    // A chart that measured itself but drew nothing would still have a box, so
    // assert it actually emitted bar geometry.
    await expect
      .poll(async () => page.locator('.bars svg rect').count(), { timeout: 10_000 })
      .toBeGreaterThan(0);
  });
});
