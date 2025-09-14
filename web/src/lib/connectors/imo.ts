// Stub – setur bara skynsamleg demo-gildi fyrir prufuna
export async function getForecastForSegment(_id: string) {
  return { windGustMs: 18, windDirDeg: 260, tempC: 1, precipMmH: 0.3, isNight: false };
}
