import { describe, it, expect, beforeEach, afterEach } from '@rstest/core';
import { render } from '@testing-library/react';
import App from '../App';
import { elections } from '../Transitions';

// ---------------------------------------------------------------------------
// Route matrix, derived rather than hardcoded
// ---------------------------------------------------------------------------
// Deriving from `elections` means new case studies and new dimensions are
// covered the day they are added, with no edit here.
const routes: string[] = [
  '/', // the case-study selector
  ...elections.flatMap((election) => {
    const dimensions = [
      ...election.dimensions,
      ...Object.keys(election.customDimensions ?? {}),
    ];
    return [
      `/${election.tag}`,
      ...dimensions.map((dimension) => `/${election.tag}/${dimension}`),
    ];
  }),
];

// ---------------------------------------------------------------------------
// console.error guard
// ---------------------------------------------------------------------------
// React reports unknown props, invalid prop types and invalid DOM nesting
// through console.error rather than by throwing. For dependency bumps that is
// the highest-value signal a jsdom test can capture: when MUI or x-charts
// renames a prop, nothing crashes -- React logs here and renders something
// subtly wrong.
//
// IMPORTANT: React de-duplicates each distinct warning process-wide, so a given
// warning surfaces on whichever route hits it first and stays silent after.
// That is why rendering and the console assertion happen in ONE test per route:
// splitting them into two passes would let the first pass swallow every warning
// and leave the second asserting on nothing.
//
// Entries below are pre-existing issues, recorded so NEW ones fail the build.
// Fix the markup and delete the entry; never add here to silence a regression.
const KNOWN_CONSOLE_ERRORS: { pattern: RegExp; why: string }[] = [
  {
    pattern: /ReactDOMTestUtils\.act` is deprecated/,
    why: 'Environmental, not app code: @testing-library/react 13 on React 18.3. Clears when RTL is upgraded to 16 (needed for React 19 anyway).',
  },
  {
    pattern: /Each child in a list should have a unique "key" prop/,
    why: 'App bug: a list is rendered without keys.',
  },
  {
    pattern: /<ul> cannot appear as a descendant of <p>/,
    why: 'App bug: election extraContext wraps <ul> in <p> (e.g. AlaskaGeneral2022.tsx).',
  },
  {
    pattern: /<ol> cannot appear as a descendant of <p>/,
    why: 'App bug: as above, with <ol>.',
  },
  {
    pattern: /<tr> cannot appear as a child of <table>/,
    why: 'App bug: MUI <Table> used with <TableRow> and no <TableBody> in TransitionTemplates.tsx.',
  },
];

let captured: string[] = [];
let originalError: typeof console.error;
let originalWarn: typeof console.warn;

beforeEach(() => {
  captured = [];
  originalError = console.error;
  originalWarn = console.warn;
  const capture = (...args: unknown[]) => {
    // React logs with printf-style placeholders ("%s cannot appear as a
    // descendant of <%s>") and passes the values as separate arguments.
    // Substituting them here means `captured` holds what a developer actually
    // sees in a browser console, so the patterns below read naturally instead
    // of having to match raw "%s" text.
    const [first, ...rest] = args;
    let message: string;
    if (typeof first === 'string' && first.includes('%s')) {
      let i = 0;
      message = first.replace(/%s/g, () => (i < rest.length ? String(rest[i++]) : '%s'));
      message += rest.slice(i).map((a) => ' ' + String(a)).join('');
    } else {
      message = args.map((a) => (a instanceof Error ? a.message : String(a))).join(' ');
    }
    captured.push(message);
  };
  console.error = capture;
  console.warn = capture;
});

afterEach(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

describe('route smoke tests', () => {
  it('derives a non-trivial route matrix', () => {
    // Guards against the matrix silently collapsing if `elections` changes shape.
    expect(routes.length).toBeGreaterThan(50);
    expect(routes).toContain('/');
    expect(routes).toContain('/alaska22');
  });

  it.each(routes)('renders %s cleanly', (route: string) => {
    window.history.pushState({}, '', route);

    const { container } = render(<App />);

    // The app shell renders on every route, and is never an empty shell.
    // testing-library/no-container is disabled deliberately: this asserts that
    // the shell mounted at all, which is structural rather than user-visible,
    // and there is no role or text that identifies it. Everything behavioural
    // should still use Testing Library queries.
    /* eslint-disable testing-library/no-container, testing-library/no-node-access */
    expect(container.querySelector('.app')).toBeTruthy();
    expect(container.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    /* eslint-enable testing-library/no-container, testing-library/no-node-access */

    const unexpected = captured.filter(
      (msg) => !KNOWN_CONSOLE_ERRORS.some(({ pattern }) => pattern.test(msg)),
    );
    expect(unexpected).toEqual([]);
  });
});
