/** Deterministic noise in [0, 1): the same index always gives the same value, so server and client markup match. */
export function noise(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const cache = new Map<string, number[]>();

/**
 * Start delay (ms) of every square in a cols x rows grid: left to right over
 * `sweep` ms, plus up to `jitter` ms of noise. With the 120 ms fade, the last
 * square is in at about 400 ms.
 */
export function pixelDelays(cols: number, rows: number, sweep = 180, jitter = 100) {
  const key = `${cols}x${rows}:${sweep}:${jitter}`;
  let d = cache.get(key);
  if (!d) {
    const step = cols > 1 ? sweep / (cols - 1) : 0;
    d = Array.from({ length: cols * rows }, (_, i) =>
      Math.round((i % cols) * step + noise(i) * jitter),
    );
    cache.set(key, d);
  }
  return d;
}
