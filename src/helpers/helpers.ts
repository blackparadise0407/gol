export const serializeNonPOJO = <T>(obj: T) => structuredClone(obj);

export const NEIGHBORS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];
