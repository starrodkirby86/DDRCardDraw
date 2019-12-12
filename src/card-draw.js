import { levels, convert_level_for_pluses, displayLevel, mapLevel, times } from './utils';

/**
 * Used to give each drawing an auto-incrementing id
 */
let drawingID = 0;

/**
 * Produces a drawn set of charts given the song data and the user
 * input of the html form elements.
 * @param {Array<{}>} songs The song data (see `src/songs/`)
 * @param {FormData} configData the data gathered by all form elements on the page, indexed by `name` attribute
 */
export function draw(songs, configData) {
  const numChartsToRandom = parseInt(configData.get("chartCount"), 10);
  const upperBound = mapLevel(configData.get("upperBound"));
  const lowerBound = mapLevel(configData.get("lowerBound"));
  const abbreviations = JSON.parse(configData.get("abbreviations"));
  const style = configData.get("style");
  // requested difficulties
  const difficulties = new Set(configData.getAll("difficulties"));
  // other options: usLocked, extraExclusive, removed, unlock
  const inclusions = new Set(configData.getAll("inclusions"));

  // build an array of possible levels to pick from
  const validCharts = {};
  levels.forEach(n => validCharts[mapLevel(n)] = []);

  for (const currentSong of songs) {
    const charts = currentSong.charts;
    // song-level filters

    /*
    if (
      (!inclusions.has("usLocked") && currentSong["us_locked"]) ||
      (!inclusions.has("extraExclusive") && currentSong["extra_exclusive"]) ||
      (!inclusions.has("removed") && currentSong["removed"]) ||
      (!inclusions.has("tempUnlock") && currentSong["temp_unlock"]) ||
      (!inclusions.has("unlock") && currentSong["unlock"]) ||
      (!inclusions.has("goldExclusive") && currentSong["gold_exclusive"])
    ) {
      continue;
    }
   */

    if (!inclusions.has("is_v1_data") && (currentSong["is_v1_data"] === 0)) continue;
    if (!inclusions.has("crystal") && parseInt(currentSong["release"]) >= 191024) continue;

    // We're going to each chart inside the json and see if this is one of the diffs we want.
    charts.forEach((chart) => {
      // chart-level filters

      const level = mapLevel(chart.level);

      // the chuni data may have blank fields
      if (!level) { return; }

      if (
        !chart || // no chart for difficulty
        !difficulties.has(chart.difficulty) || // don't want this difficulty
        // (!inclusions.has("unlock") && chart["unlock"]) || // chart must be individually unlocked
        // (!inclusions.has("usLocked") && chart["us_locked"]) || // chart is locked for us
        // (!inclusions.has("extraExclusive") && chart["extra_exclusive"]) || // chart is extra/final exclusive
        +level < lowerBound || // too easy
        +level > upperBound // too hard
      ) {
        return;
      }

      // add chart to deck
      validCharts[chart.level].push({
        name: currentSong.name,
        name_jp: currentSong.name_jp,
        id: currentSong.id,
        artist: currentSong.artist,
        artist_jp: currentSong.artist_jp,
        bpm: currentSong.bpm,
        difficulty: chart.difficulty,
        level: chart.level,
        jacket: currentSong.jacket,
        abbreviation: 'foo',
      });
    });
  }

  const weighted = !!configData.get("weighted");
  const limitOutliers = !!configData.get("limitOutliers");
  /**
   * the "deck" of difficulty levels to pick from
   * @type {Array<number>}
   */
  let distribution = [];
  /**
   * Total amount of weight used, so we can determine expected outcome below
   */
  let totalWeights = 0;
  /**
   * The number of charts we can expect to draw of each level
   * @type {Record<string, number>}
   */
  const expectedDrawPerLevel = {};

  for (let levelIndex = levels.indexOf(lowerBound); levels[levelIndex] <= upperBound; levelIndex++) {
    const level = levels[levelIndex];
    let weightAmount = 0;
    if (weighted) {
      weightAmount = parseInt(configData.get(`weight-${mapLevel(level)}`), 10);
      expectedDrawPerLevel[mapLevel(level)] = weightAmount;
      totalWeights += weightAmount;
    } else {
      weightAmount = validCharts[mapLevel(level)].length;
    }
    times(weightAmount, () => distribution.push(level));
  }

  // If custom weights are used, expectedDrawsPerLevel[level] will be the maximum number
  // of cards of that level allowed in the card draw.
  // e.g. For a 5-card draw, we increase the cap by 1 at every 100%/5 = 20% threshold,
  // so a level with a weight of 15% can only show up on at most 1 card, a level with
  // a weight of 30% can only show up on at most 2 cards, etc.
  if (weighted && limitOutliers) {
    for (let levelIndex = levels.indexOf(lowerBound); levels[levelIndex] <= upperBound; levelIndex++) {
      const level = levels[levelIndex];
      let normalizedWeight =
        expectedDrawPerLevel[mapLevel(level)] / totalWeights;
      expectedDrawPerLevel[mapLevel(level)] = Math.ceil(
        normalizedWeight * numChartsToRandom
      );
    }
  }

  const drawnCharts = [];
  /**
   * Record of how many songs of each difficulty have been drawn so far
   * @type {Record<string, number>}
   */
  const difficultyCounts = {};

  while (drawnCharts.length < numChartsToRandom) {
    if (distribution.length === 0) {
      // no more songs available to pick in the requested range
      // will be returning fewer than requested number of charts
      break;
    }

    // first pick a difficulty
    // Need to convert this back to n+ diff, if exists.
    const chosenDifficulty =
      mapLevel(distribution[Math.floor(Math.random() * distribution.length)]);
    const selectableCharts = validCharts[chosenDifficulty.toString()];
    const randomIndex = Math.floor(Math.random() * selectableCharts.length);
    const randomChart = selectableCharts[randomIndex];

    if (randomChart) {
      drawnCharts.push(randomChart);
      // remove drawn chart so it cannot be re-drawn
      selectableCharts.splice(randomIndex, 1);
      if (!difficultyCounts[chosenDifficulty]) {
        difficultyCounts[chosenDifficulty] = 1;
      } else {
        difficultyCounts[chosenDifficulty]++;
      }
    }

    // check if maximum number of expected occurrences of this level of chart has been reached
    const reachedExpected =
      limitOutliers &&
      difficultyCounts[chosenDifficulty.toString()] ===
        expectedDrawPerLevel[chosenDifficulty.toString()];

    if (selectableCharts.length === 0 || reachedExpected) {
      // can't pick any more songs of this difficulty
      distribution = distribution.filter(n => n !== chosenDifficulty);
    }
  }

  drawingID += 1;
  return {
    id: drawingID,
    charts: drawnCharts,
    vetos: new Set()
  };
}
