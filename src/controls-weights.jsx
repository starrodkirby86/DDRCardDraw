import { Component } from 'preact';
import styles from './controls-weights.css';
import { mapLevel, times } from './utils';
import { Text, Localizer } from 'preact-i18n';
import { levels } from './utils';

export class WeightsControls extends Component {
  state = {
    weights: this.getWeightsFor(this.props),
  };

  getWeightsFor(props, state = this.state) {
    if (!state.weights) {
      state.weights = [];
    };

    const filteredLevels = levels.filter(n => n <= mapLevel(props.high) && n >= mapLevel(props.low));
    return filteredLevels.map((n) => {
      const level = mapLevel(n);
      return ({
        label: level,
        value: state.weights[level] ? state.weights[level].value : 1,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.low !== this.props.low || nextProps.high !== this.props.high) {
      this.setState({
        weights: this.getWeightsFor(nextProps),
      });
    }
  }

  setWeight(index, value) {
    this.state.weights[index].value = value;
    this.forceUpdate();
  }

  render() {
    const {
      hidden,
    } = this.props;
    const { weights } = this.state;
    const totalWeight = this.state.weights.reduce((total, weight) => total + weight.value, 0);
    const percentages = this.state.weights.map(weight => {
      return weight.value ? (100 * weight.value / totalWeight).toFixed(0) : 0;
    });

    return (
      <section className={hidden ? styles.hidden : styles.weights}>
        <p><Text id="weights.explanation">Integers only. Set a fixed probability that charts of each difficulty level will be drawn.</Text></p>
        {this.state.weights.map((weight, i) => {
          return (
            <label key={weight.label}>
              <input
                type="number"
                name={`weight-${weight.label}`}
                value={weight.value}
                min="0"
                onChange={(e) => this.setWeight(i, +e.currentTarget.value)}
              />
              {weight.label} <sub>{percentages[i]}%</sub>
            </label>
          );
        })}
        <Localizer>
          <label title={<Text id="weights.check.title">"Prevents very unlikely outcomes (e.g. multiple 17s drawn when at 10% chance)"</Text>}>
            <input
              type="checkbox"
              name="limitOutliers"
              defaultChecked={true}
            />
            <Text id="weights.check.label">
              Force Expected Distribution
            </Text>
          </label>
        </Localizer>
      </section>
    );
  }
}