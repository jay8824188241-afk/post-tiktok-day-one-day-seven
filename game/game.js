// Star Hop — a tiny original game written for make.fun's
// "Day one, day seven" bounty (post-tiktok-day-one-day-seven-20261123-0327).
//
// One map, one opening, two builds. Day 1: a ghost, one star, bare ground.
// Day 7: the same map and the same start, plus patrolling spike enemies,
// eight stars, particles, a parallax night sky and a HUD. The camera never
// moves — the change is the whole story.
//
// Play: Arrow keys / A D to move, Space / W / Up to jump. Collect all the
// stars, dodge the spikes, reach the golden goal star to win.

export const MAP = {
  width: 1000,
  height: 960,
  groundY: 860,
  spawn: { x: 90, y: 780 },
  // Fixed platforms: [x, y, width]. Same in both builds.
  platforms: [
    { x: 210, y: 700, w: 190 },
    { x: 480, y: 590, w: 200 },
    { x: 720, y: 700, w: 190 },
  ],
  // Fixed star spots. Day 1 only shows the first one.
  stars: [
    { x: 300, y: 640 },
    { x: 560, y: 530 },
    { x: 810, y: 640 },
    { x: 170, y: 780 },
    { x: 430, y: 780 },
    { x: 660, y: 780 },
    { x: 905, y: 780 },
    { x: 950, y: 500 },
  ],
  goal: { x: 940, y: 470 },
  // Fixed enemy patrol ranges. Day 7 only.
  enemies: [
    { x0: 380, x1: 620, y: 820, speed: 1.4 },
    { x0: 660, x1: 900, y: 820, speed: 1.1 },
    { x0: 500, x1: 700, y: 550, speed: 1.7 },
  ],
};

// Ghost position on the scripted opening run: the same timeline in both
// builds, so a frame at time t shows the ghost in the same place on Day 1
// and on Day 7. x moves right at a steady pace; jumps are fixed parabolas.
export function ghostAt(t) {
  const x = 90 + t * 62;
  let y = 780;
  const jumps = [
    [2.0, 2.9],
    [4.6, 5.5],
    [7.1, 8.0],
    [9.6, 10.5],
    [11.4, 12.3],
  ];
  for (const [a, b] of jumps) {
    if (t >= a && t <= b) {
      const u = (t - a) / (b - a);
      y = 780 - 190 * 4 * u * (1 - u);
    }
  }
  return { x: Math.min(x, 940), y };
}

// Enemy position: a ping-pong patrol, deterministic in t.
export function enemyAt(e, t) {
  const span = e.x1 - e.x0;
  const period = (2 * span) / (60 * e.speed);
  const phase = (t % period) / period;
  const u = phase < 0.5 ? phase * 2 : 2 - phase * 2;
  return { x: e.x0 + u * span, y: e.y };
}

// Which stars the ghost has collected by time t: a star counts once the
// ghost has ever come within 52px of it (sampled along the timeline).
export function collectedStars(t, day) {
  const count = day === 1 ? 1 : MAP.stars.length;
  const out = [];
  const steps = Math.max(1, Math.round(t / 0.05));
  for (let i = 0; i < count; i++) {
    const s = MAP.stars[i];
    let got = false;
    for (let k = 0; k <= steps; k++) {
      const g = ghostAt((t * k) / steps);
      if (Math.hypot(g.x - s.x, g.y - s.y) < 52) {
        got = true;
        break;
      }
    }
    out.push(got);
  }
  return out;
}

export function scoreAt(t, day) {
  return collectedStars(t, day).filter(Boolean).length * 100;
}

// The win moment on Day 7: the ghost reaches the goal star.
export const WIN_T = 12.4;

export function hasWon(t) {
  return t >= WIN_T;
}
