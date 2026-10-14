// Same rounding as the RN app's NumberUtils, so results match to the cent.
export const round2 = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export const round4 = (value: number): number =>
  Math.round((value + Number.EPSILON) * 10000) / 10000;
