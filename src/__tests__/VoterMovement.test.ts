import { describe, it, expect } from '@rstest/core';
import { VoterMovement } from '../VoterMovement';
// @ts-ignore -- untyped .js modules
import Voter from '../components/Voter';
// @ts-ignore
import VoterCamp from '../components/VoterCamp';

// VoterMovement is what actually reassigns voters between camps as the reader
// scrolls. It is pure logic over a simState bag, so it can be exercised without
// rendering anything.

// Same order as the private campNames array in VoterMovement.ts, which is also
// the order an election's `camps` tuple is written in.
const CAMP_NAMES = [
  'home', 'centerBullet', 'centerThenRight', 'rightThenCenter',
  'rightBullet', 'rightThenLeft', 'leftThenRight',
  'leftBullet', 'leftThenCenter', 'centerThenLeft',
] as const;

function makeSimState(voterCount: number) {
  const state: any = { objects: [], activeFrames: 0 };

  CAMP_NAMES.forEach((name, i) => {
    // home sits at the centre; the rest ring it, as in SimContext.
    state[name] = new VoterCamp(name === 'home' ? 0 : 28, i * 36, 'center', 'center');
  });

  for (let i = 0; i < voterCount; i++) {
    // camp starts undefined, matching a freshly built simulation.
    state.objects.push(new Voter(i, 80, (i / voterCount) * 360, undefined));
  }
  return state;
}

const countIn = (state: any, campName: string) =>
  state.objects.filter((o: any) => o.camp === state[campName]).length;

const countUnassigned = (state: any) =>
  state.objects.filter((o: any) => o.camp === undefined).length;

describe('VoterMovement scalar moves', () => {
  it('moves exactly n unassigned voters into a camp', () => {
    const state = makeSimState(20);
    new VoterMovement(5, undefined, 'home').apply(state);

    expect(countIn(state, 'home')).toBe(5);
    expect(countUnassigned(state)).toBe(15);
  });

  it('moves voters between two named camps', () => {
    const state = makeSimState(20);
    new VoterMovement(8, undefined, 'leftBullet').apply(state);
    new VoterMovement(3, 'leftBullet', 'rightBullet').apply(state);

    expect(countIn(state, 'leftBullet')).toBe(5);
    expect(countIn(state, 'rightBullet')).toBe(3);
  });

  it('moves everything it can when n exceeds the source population', () => {
    const state = makeSimState(10);
    new VoterMovement(4, undefined, 'leftBullet').apply(state);
    new VoterMovement(99, 'leftBullet', 'rightBullet').apply(state);

    expect(countIn(state, 'leftBullet')).toBe(0);
    expect(countIn(state, 'rightBullet')).toBe(4);
  });

  it("'anywhere' pulls from every camp at once", () => {
    const state = makeSimState(20);
    new VoterMovement(5, undefined, 'leftBullet').apply(state);
    new VoterMovement(5, undefined, 'rightBullet').apply(state);
    new VoterMovement(10, 'anywhere', 'home').apply(state);

    expect(countIn(state, 'home')).toBe(10);
  });

  it('conserves the total voter population across a move', () => {
    const state = makeSimState(20);
    new VoterMovement(12, undefined, 'centerBullet').apply(state);
    new VoterMovement(7, 'centerBullet', 'centerThenLeft').apply(state);

    const assigned = CAMP_NAMES.reduce((sum, name) => sum + countIn(state, name), 0);
    expect(assigned + countUnassigned(state)).toBe(20);
  });

  it('raises activeFrames so the animation runs', () => {
    const state = makeSimState(10);
    state.activeFrames = 0;
    new VoterMovement(2, undefined, 'home').apply(state);
    expect(state.activeFrames).toBeGreaterThanOrEqual(20);
  });
});

describe('VoterMovement reset', () => {
  it('an undefined destination clears every camp assignment', () => {
    const state = makeSimState(15);
    new VoterMovement(10, undefined, 'leftBullet').apply(state);
    expect(countIn(state, 'leftBullet')).toBe(10);

    new VoterMovement(15, 'anywhere', undefined).apply(state);

    expect(countUnassigned(state)).toBe(15);
    expect(countIn(state, 'leftBullet')).toBe(0);
  });

  it('a reset returns voters to their starting positions', () => {
    const state = makeSimState(5);
    const voter = state.objects[0];
    const startX = voter.startPos.x;
    voter.pos.x += 123;

    new VoterMovement(5, 'anywhere', undefined).apply(state);

    expect(voter.pos.x).toBe(startX);
  });
});

describe('VoterMovement array (absolute distribution) form', () => {
  it('sets each camp to the requested population', () => {
    const state = makeSimState(20);
    // Indices line up with CAMP_NAMES; 20 voters total.
    const distribution = [0, 3, 2, 4, 1, 0, 2, 5, 3, 0];
    new VoterMovement(distribution).apply(state);

    CAMP_NAMES.forEach((name, i) => {
      expect(countIn(state, name)).toBe(distribution[i]);
    });
  });

  it('is idempotent when applied twice', () => {
    const state = makeSimState(20);
    const distribution = [0, 3, 2, 4, 1, 0, 2, 5, 3, 0];
    new VoterMovement(distribution).apply(state);
    new VoterMovement(distribution).apply(state);

    CAMP_NAMES.forEach((name, i) => {
      expect(countIn(state, name)).toBe(distribution[i]);
    });
  });

  it('redistributes when moving from one distribution to another', () => {
    const state = makeSimState(20);
    new VoterMovement([0, 10, 10, 0, 0, 0, 0, 0, 0, 0]).apply(state);
    expect(countIn(state, 'centerBullet')).toBe(10);

    new VoterMovement([0, 0, 0, 0, 0, 0, 0, 10, 10, 0]).apply(state);

    expect(countIn(state, 'centerBullet')).toBe(0);
    expect(countIn(state, 'centerThenRight')).toBe(0);
    expect(countIn(state, 'leftBullet')).toBe(10);
    expect(countIn(state, 'leftThenCenter')).toBe(10);
  });
});

describe('VoterMovement reversal', () => {
  it('getReversed swaps the endpoints without mutating the original', () => {
    const forward = new VoterMovement(4, 'leftBullet', 'rightBullet');
    const back = forward.getReversed();

    expect(back.from).toBe('rightBullet');
    expect(back.to).toBe('leftBullet');
    expect(back.count).toBe(4);
    expect(forward.from).toBe('leftBullet');
    expect(forward.to).toBe('rightBullet');
  });

  it('revert restores the camp populations a scalar move changed', () => {
    const state = makeSimState(20);
    new VoterMovement(10, undefined, 'leftBullet').apply(state);

    const movement = new VoterMovement(4, 'leftBullet', 'rightBullet');
    movement.apply(state);
    expect(countIn(state, 'leftBullet')).toBe(6);
    expect(countIn(state, 'rightBullet')).toBe(4);

    movement.revert(state);
    expect(countIn(state, 'leftBullet')).toBe(10);
    expect(countIn(state, 'rightBullet')).toBe(0);
  });

  it('scrolling forward then back through several moves restores the start state', () => {
    const state = makeSimState(20);
    new VoterMovement(20, undefined, 'home').apply(state);

    const moves = [
      new VoterMovement(5, 'home', 'leftBullet'),
      new VoterMovement(3, 'home', 'rightBullet'),
      new VoterMovement(2, 'leftBullet', 'centerBullet'),
    ];
    moves.forEach((m) => m.apply(state));
    // Explainer.js reverts in reverse order when the reader scrolls up.
    [...moves].reverse().forEach((m) => m.revert(state));

    expect(countIn(state, 'home')).toBe(20);
    CAMP_NAMES.filter((n) => n !== 'home').forEach((name) => {
      expect(countIn(state, name)).toBe(0);
    });
  });
});
