export function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export function chooseRandom(arr = []) {
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    const idx = getRandomInt(0, arr.length);
    return arr[idx];
}