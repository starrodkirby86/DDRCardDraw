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

/**
 * Checks if a level is '+'. If so, adds 0.5.
 * @param n
 * @returns {number}
 */
export function convert_level_for_pluses(n) {
  const str = n.toString();
  return str[str.length - 1] === '+' ? parseInt(str.slice(0, -1)) + 0.5 : n;
}

/**
 * Convert it back.
 * @param n
 * @returns {string}
 */
export function displayLevel(n) {
  return n % 1 !== 0 ? `${n - 0.5}+` : n;
}
