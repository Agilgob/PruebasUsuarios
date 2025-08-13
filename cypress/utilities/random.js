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

function getAlphaSuffix(n) {
  // Converts 1 -> 'A', 2 -> 'B', ..., 26 -> 'Z', 27 -> 'AA', 28 -> 'AB', etc.
  let s = '';
  while (n > 0) {
    n--; // 0-based
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
}

export function newExpedientNumber() {
  const now = new Date();
  const year = now.getFullYear()
  const monthSuffix = getAlphaSuffix(now.getMonth() + 1); // 1-12
  const daySuffix = getAlphaSuffix(now.getDate()); // 1-31
  const hourSuffix = getAlphaSuffix(now.getHours() + 1); // 1-24
  const minuteSuffix = getAlphaSuffix(now.getMinutes() + 1); // 1-60
  const secondSuffix = getAlphaSuffix(now.getSeconds() + 1);
  return `L1/${year}${monthSuffix}${daySuffix}${hourSuffix}${minuteSuffix}${secondSuffix}`;
}

