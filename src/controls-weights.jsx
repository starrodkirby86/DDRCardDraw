import { Component } from 'preact';
import styles from './controls-weights.css';
import { mapLevel, levels, times } from './utils';
import { levels as segaLevels } from './utils';
import { TranslateContext } from "@denysvuika/preact-translate";
import { useState, useMemo, useContext } from "preact/hooks";

/**
 *
 * @param {{ high: number, low: number }} props
 * @param {Array<{ label: string, value: number }> | undefined} weightState
 */
function getWeightsFor(props, state = []) {
  const filteredLevels = segaLevels.filter(n => n <= mapLevel(props.high) && n >= mapLevel(props.low));
  return filteredLevels.map((n) => {
    const level = mapLevel(n);
    console.log('nico', level, state.weights);
    return ({
      label: level,
      value: state.weights && state.weights[level] ? state.weights[level].value : 1,
    });
  });
}

export class WeightsControls extends Component {
  render(props) {
    const [savedWeights, updateWeights] = useState([]);
    function setWeight(difficulty, value) {
      const newWeights = savedWeights.slice();
      newWeights[difficulty] = value;
      updateWeights(newWeights);
    }
    // Only get the window of lower to upper bound diffs inside segaLevels
    const levels = useMemo(
      () => segaLevels.filter(n => n <= mapLevel(props.high) && n >= mapLevel(props.low)),
      [props.high, props.low]
    );
    const { t } = useContext(TranslateContext);

    const { hidden } = props;

    const totalWeight = levels.reduce(
      (total, level) => total + (savedWeights[level] || 1),
      0
    );
    const percentages = levels.map(level => {
      const value = savedWeights[level] || 1;
      return value ? ((100 * value) / totalWeight).toFixed(0) : 0;
    });

    return (
      <section className={hidden ? styles.hidden : styles.weights}>
        <p>{t("weights.explanation")}</p>
        {levels.map((level, i) => (
          <label key={level}>
            <input
              type="number"
              name={`weight-${level}`}
              value={savedWeights[level] || 1}
              min="0"
              onChange={e => setWeight(level, +e.currentTarget.value)}
            />
            {level} <sub>{percentages[i]}%</sub>
          </label>
        ))}
        <label title={t("weights.check.title")}>
          <input type="checkbox" name="limitOutliers" defaultChecked={true} />
          {t("weights.check.label")}
        </label>
      </section>
    );
  }
}
