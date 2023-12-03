type BetterAssign = <T extends {}, U extends {}>(target: T, source: U) => T & U;

export const betterAssign: BetterAssign = (target, source) => {
  source = { ...source };

  let k: keyof typeof source;

  for (k in source) {
    if (source[k] === undefined) {
      delete source[k];
    }
  }

  return Object.assign(target, source);
}
