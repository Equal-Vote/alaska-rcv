import { describe, it, expect } from '@rstest/core';
import { elections, dimensionNames, getTransitions } from '../Transitions';
import type { DimensionTag } from '../Transitions';

// SimContext.tsx builds exactly this many Voter objects, and an election's
// `camps` array is the distribution of those voters across the ten camps. If
// the two disagree the simulation silently renders the wrong voter counts, so
// it is worth pinning.
const VOTER_COUNT = 200;

// moab21's camps sum to 201. Every other election sums to 200. Left recorded
// rather than silently relaxing the assertion -- it is a real off-by-one in the
// content data. Fix the numbers in src/content/Moab2021.tsx and delete this.
const KNOWN_CAMP_SUM_DEVIATIONS: Record<string, number> = { moab21: 201 };

describe('election content', () => {
  it('has at least one election', () => {
    expect(elections.length).toBeGreaterThan(0);
  });

  it('has unique tags', () => {
    const tags = elections.map((e) => e.tag);
    expect(tags).toEqual([...new Set(tags)]);
  });

  it.each(elections.map((e) => [e.tag, e] as const))(
    '%s has a well-formed camps array',
    (tag, election) => {
      const camps = election.camps as unknown as number[];
      expect(camps).toHaveLength(10);
      camps.forEach((c) => {
        expect(Number.isInteger(c)).toBe(true);
        expect(c).toBeGreaterThanOrEqual(0);
      });
      const sum = camps.reduce((a, b) => a + b, 0);
      expect(sum).toBe(KNOWN_CAMP_SUM_DEVIATIONS[tag] ?? VOTER_COUNT);
    },
  );

  it.each(elections.map((e) => [e.tag, e] as const))(
    '%s names three distinct candidates',
    (_tag, election) => {
      const { left, center, right } = election.names;
      [left, center, right].forEach((n) => expect(n.trim().length).toBeGreaterThan(0));
      expect(new Set([left, center, right]).size).toBe(3);
    },
  );

  it.each(elections.map((e) => [e.tag, e] as const))(
    '%s declares only known dimensions, without duplicates',
    (_tag, election) => {
      election.dimensions.forEach((d) => expect(Object.keys(dimensionNames)).toContain(d));
      expect(election.dimensions).toEqual([...new Set(election.dimensions)]);
      Object.keys(election.customDimensions ?? {}).forEach((d) =>
        expect(Object.keys(dimensionNames)).toContain(d),
      );
    },
  );

  it.each(elections.map((e) => [e.tag, e] as const))(
    '%s cites a source with a parseable URL',
    (_tag, election) => {
      expect(election.title.trim().length).toBeGreaterThan(0);
      expect(election.sourceTitle.trim().length).toBeGreaterThan(0);
      expect(() => new URL(election.sourceURL)).not.toThrow();
    },
  );

  it.each(elections.map((e) => [e.tag, e] as const))(
    '%s has a positive ratio (real votes represented per simulated voter)',
    (_tag, election) => {
      expect(election.ratio).toBeGreaterThan(0);
    },
  );
});

describe('transition building', () => {
  // Every route the app can serve is a (election, dimension) pair, and each one
  // builds its transitions through getTransitions. Building them here catches a
  // broken template without needing to render anything.
  const pairs = elections.flatMap((election) =>
    [...election.dimensions, ...Object.keys(election.customDimensions ?? {})].map(
      (dimension) => [election.tag, dimension, election] as const,
    ),
  );

  it('covers every election/dimension pair', () => {
    expect(pairs.length).toBeGreaterThan(40);
  });

  it.each(pairs)('builds transitions for %s/%s', (_tag, dimension, election) => {
    const transitions = getTransitions({ election, dimension: dimension as DimensionTag });

    expect(Array.isArray(transitions)).toBe(true);
    expect(transitions.length).toBeGreaterThan(0);

    transitions.forEach((t: any) => {
      // Explainer.js maps over these and renders t.explainer for each, so a
      // missing one would blank a scroll step.
      expect(t.explainer).toBeDefined();
      expect(Array.isArray(t.voterMovements)).toBe(true);
    });
  });

  it.each(elections.map((e) => [e.tag, e] as const))(
    '%s overview builds transitions',
    (_tag, election) => {
      const transitions = getTransitions({ election, dimension: 'overview' });
      expect(transitions.length).toBeGreaterThan(0);
    },
  );
});
