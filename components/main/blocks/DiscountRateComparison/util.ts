export const randomTruncSkewNormal = ({
  rng = Math.random,
  range = [-Infinity, Infinity],
  mean,
  stdDev,
  skew = 0,
}: {
  rng?: () => number;
  range: [number, number];
  mean: number;
  stdDev: number;
  skew: number;
}) => {
  return randomSkewNormal(rng, range, mean, stdDev, skew);
};

const randomNormals = (rng: () => number) => {
  let u1 = 0,
    u2 = 0;
  //Convert [0,1) to (0,1)
  while (u1 === 0) u1 = rng();
  while (u2 === 0) u2 = rng();
  const R = Math.sqrt(-2.0 * Math.log(u1));
  const Θ = 2.0 * Math.PI * u2;
  return [R * Math.cos(Θ), R * Math.sin(Θ)];
};

const randomSkewNormal = (
  rng: () => number,
  range: [number, number],
  mean: number,
  stdDev: number,
  skew = 0,
): number => {
  const [u0, v] = randomNormals(rng);
  if (skew === 0) {
    const value = mean + stdDev * u0;
    if (value < range[0] || value > range[1])
      return randomSkewNormal(rng, range, mean, stdDev, skew);
    return value;
  }
  const sig = skew / Math.sqrt(1 + skew * skew);
  const u1 = sig * u0 + Math.sqrt(1 - sig * sig) * v;
  const z = u0 >= 0 ? u1 : -u1;
  const value = mean + stdDev * z;
  if (value < range[0] || value > range[1]) return randomSkewNormal(rng, range, mean, stdDev, skew);
  return value;
};
