import { describe, it, expect } from '@rstest/core';
// @ts-ignore -- untyped .js module
import Vector from '../components/Vector';

// Vector backs every position, velocity and collision calculation in the
// simulation. It has no dependencies, so these tests do not guard against
// package bumps -- they are the regression net that makes it safe to refactor
// the sim once bumps start landing.

const closeTo = (actual: number, expected: number, precision = 10) =>
  expect(Math.abs(actual - expected)).toBeLessThan(10 ** -precision);

describe('Vector construction', () => {
  it('fills y from x when y is omitted', () => {
    const v = new Vector(3);
    expect(v.x).toBe(3);
    expect(v.y).toBe(3);
  });

  it('keeps an explicit y', () => {
    const v = new Vector(3, 4);
    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  it('treats y as degrees in radial mode, with screen-space (downward) y', () => {
    // 0 degrees points along +x.
    const right = new Vector(10, 0, true);
    closeTo(right.x, 10);
    closeTo(right.y, 0);

    // 90 degrees points UP the screen, so y is negative.
    const up = new Vector(10, 90, true);
    closeTo(up.x, 0);
    closeTo(up.y, -10);

    const left = new Vector(10, 180, true);
    closeTo(left.x, -10);
    closeTo(left.y, 0);
  });

  it('treats y=0 as a real zero rather than falling back to x', () => {
    // `y ?? x` means 0 must survive; a `y || x` regression would make this 5.
    const v = new Vector(5, 0);
    expect(v.y).toBe(0);
  });
});

describe('Vector arithmetic', () => {
  it('adds and subtracts componentwise', () => {
    const sum = new Vector(1, 2).add(new Vector(10, 20));
    expect([sum.x, sum.y]).toEqual([11, 22]);

    const diff = new Vector(10, 20).subtract(new Vector(1, 2));
    expect([diff.x, diff.y]).toEqual([9, 18]);
  });

  it('scales by a scalar and by another vector', () => {
    const byScalar = new Vector(2, 3).scale(4);
    expect([byScalar.x, byScalar.y]).toEqual([8, 12]);

    const byVector = new Vector(2, 3).scale(new Vector(10, 100));
    expect([byVector.x, byVector.y]).toEqual([20, 300]);
  });

  it('inverts componentwise', () => {
    const inv = new Vector(2, 4).invert();
    expect([inv.x, inv.y]).toEqual([0.5, 0.25]);
  });

  it('does not mutate its operands', () => {
    const a = new Vector(1, 2);
    const b = new Vector(3, 4);
    a.add(b);
    a.subtract(b);
    a.scale(9);
    expect([a.x, a.y]).toEqual([1, 2]);
    expect([b.x, b.y]).toEqual([3, 4]);
  });
});

describe('Vector measurement', () => {
  it('computes magnitude and squared distance', () => {
    expect(new Vector(3, 4).magnitude()).toBe(5);
    expect(new Vector(0, 0).dist2(new Vector(3, 4))).toBe(25);
  });

  it('reports angle in degrees, inverting screen-space y', () => {
    closeTo(new Vector(1, 0).angle(), 0);
    closeTo(new Vector(0, -1).angle(), 90);

    // Pointing along -x gives -180, not +180: angle() computes
    // Math.atan2(-this.y, this.x), and negating y === 0 yields -0, which sends
    // atan2 to the negative branch. Same direction, opposite sign. Pinned here
    // because anything comparing angles numerically has to expect it.
    closeTo(new Vector(-1, 0).angle(), -180);
    closeTo(Math.abs(new Vector(-1, 0).angle()), 180);
  });

  it('round-trips radial construction through angle and magnitude', () => {
    const v = new Vector(7, 35, true);
    closeTo(v.magnitude(), 7);
    closeTo(v.angle(), 35);
  });

  it('scaleTo sets the magnitude and keeps the direction', () => {
    const v = new Vector(3, 4).scaleTo(10);
    closeTo(v.magnitude(), 10);
    closeTo(v.x, 6);
    closeTo(v.y, 8);
  });

  it('scaleTo returns a zero vector instead of dividing by zero', () => {
    // Voters sitting exactly on their camp centre hit this every frame.
    const v = new Vector(0, 0).scaleTo(10);
    expect([v.x, v.y]).toEqual([0, 0]);
  });
});

describe('Vector interpolation and cloning', () => {
  it('lerps between endpoints', () => {
    const a = new Vector(0, 0);
    const b = new Vector(10, 20);
    expect([a.lerpTo(b, 0).x, a.lerpTo(b, 0).y]).toEqual([0, 0]);
    expect([a.lerpTo(b, 1).x, a.lerpTo(b, 1).y]).toEqual([10, 20]);
    expect([a.lerpTo(b, 0.5).x, a.lerpTo(b, 0.5).y]).toEqual([5, 10]);
  });

  it('clones into an independent instance', () => {
    const a = new Vector(1, 2);
    const b = a.clone();
    expect(b).not.toBe(a);
    expect([b.x, b.y]).toEqual([1, 2]);
  });

  it('renders a CSS translate string', () => {
    expect(new Vector(1.5, -2).asTranslate()).toBe('translate(1.5px, -2px)');
  });
});
