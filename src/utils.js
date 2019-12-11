export const TOURNAMENT_MODE = false;

export const detectedLanguage =
  (window.navigator.languages && window.navigator.languages[0]) ||
  window.navigator.language ||
  window.navigator.userLanguage ||
  window.navigator.browserLanguage;

/**
 * Terse looping helper
 * @param {number} n number of times to loop
 * @param {function} cb will be executed n times, where N is one-indexed
 * @returns an array of the collected return values of cb
 */
export function times(n, cb) {
  const results = [];
  for (let i = 1; i <= n; i++) {
    results.push(cb(i));
  }
  return results;
}

export const levels = [1,2,3,4,5,6,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14];
export const levelDisplays = [1,2,3,4,5,6,7,'7+',8,'8+',9,'9+',10,'10+',11,'11+',12,'12+',13,'13+',14];

export let levelMap = {};
levels.forEach((n, i) => levelMap[n.toString()] = levelDisplays[i]);
levelDisplays.forEach((n, i) => levelMap[n.toString()] = levels[i]);

export function mapLevel(level) {
  return levelMap[level];
}
