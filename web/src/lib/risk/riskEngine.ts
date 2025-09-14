export type Vehicle = {
  class: 'jeppi' | 'sendibil' | 'husbil';
  massKg?: number;
  wheelHeightM?: number;
  wadingM?: number;
};

export function crosswindScore(
  gustMs: number,
  windDirDeg: number,
  roadDirDeg: number,
  v: Vehicle
) {
  const rad = Math.abs(Math.sin(((windDirDeg - roadDirDeg) * Math.PI) / 180));
  const xwind = gustMs * rad;
  const limit = v.class === 'husbil' ? 16 : v.class === 'sendibil' ? 20 : 24; // gróf mörk
  return xwind / limit; // >1 → rautt
}

export function icingScore(tempC: number, precipMmH: number, isNight: boolean) {
  const nearZero = tempC > -2 && tempC < 2;
  let s = 0;
  if (nearZero && precipMmH > 0) s += 0.8;
  if (isNight) s += 0.2;
  return s; // 0..1
}

export function fordScore(depthM?: number, velocityMs?: number) {
  const H = (depthM || 0) * (velocityMs || 0);
  if (!depthM && !velocityMs) return 0.2; // lítið vitað → varfærni
  return H >= 0.8 ? 1 : H >= 0.4 ? 0.7 : 0.2;
}

export function totalRisk(W: number, I: number, H: number) {
  const R = Math.max(W, I, H);
  return { R, level: R >= 1 ? 'red' : R >= 0.6 ? 'yellow' : 'green' };
}
