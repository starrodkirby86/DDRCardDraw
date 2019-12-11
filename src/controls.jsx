import "formdata-polyfill";
import { Component } from "preact";
import styles from "./controls.css";
import globalStyles from "./app.css";
import { WeightsControls } from "./controls-weights";
import { Text } from "preact-i18n";
import { mapLevel, levels } from './utils';

const dataSetConfigs = {
  maimai: {
    lowerBound: 10,
    upperBound: 13,
    upperMaximum: 14,
    difficulties: [
      {
        key: "difficulty.maimai.easy",
        value: "Easy",
        checked: false
      },
      {
        key: "difficulty.maimai.bas",
        value: "Basic",
        checked: false
      },
      {
        key: "difficulty.maimai.adv",
        value: "Advanced",
        checked: false
      },
      { key: "difficulty.maimai.exp", value: "Expert", checked: true },
      {
        key: "difficulty.maimai.mas",
        value: "Master",
        checked: true
      },
      {
        key: "difficulty.maimai.remas",
        value: "Re:Master",
        checked: true
      }
    ],
    includables: {
      is_v1_data: true,
    }
  },
  a20: {
    lowerBound: 13,
    upperBound: 16,
    upperMaximum: 19,
    difficulties: [
      {
        key: "difficulty.ace.beg",
        value: "beginner",
        checked: false
      },
      {
        key: "difficulty.ace.bas",
        value: "basic",
        checked: false
      },
      {
        key: "difficulty.ace.dif",
        value: "difficult",
        checked: false
      },
      { key: "difficulty.ace.exp", value: "expert", checked: true },
      {
        key: "difficulty.ace.cha",
        value: "challenge",
        checked: true
      }
    ],
    includables: {
      unlock: false,
      goldExclusive: false,
      extraExclusive: false,
      tempUnlock: false
    }
  },
  extreme: {
    lowerBound: 6,
    upperBound: 10,
    upperMaximum: 10,
    difficulties: [
      {
        key: "difficulty.extreme.bas",
        value: "basic",
        checked: false
      },
      {
        key: "difficulty.extreme.dif",
        value: "difficult",
        checked: false
      },
      {
        key: "difficulty.extreme.exp",
        value: "expert",
        checked: true
      },
      {
        key: "difficulty.extreme.cha",
        value: "challenge",
        checked: true
      }
    ],
    includables: null
  }
};
const DEFAULT_DATA_SET = dataSetConfigs.maimai;

export class Controls extends Component {
  state = Object.assign(
    {
      weighted: false,
      collapsed: false
    },
    DEFAULT_DATA_SET
  );

  form = null;

  render() {
    const { canPromote } = this.props;
    const { collapsed, difficulties } = this.state;
    const abbrKeys = {};
    for (const d of difficulties) {
      abbrKeys[d.value] = d.key + ".abbreviation";
    }

    return (
      <form
        ref={this.saveFormRef}
        className={styles.form + (collapsed ? " " + styles.collapsed : "")}
        onSubmit={this.handleSubmit}
      >
        <input
          type="hidden"
          name="abbreviations"
          value={JSON.stringify(abbrKeys)}
        />
        <section className={styles.columns}>
          <div className={styles.column}>
            <div className={styles.group}>
              <label>
                <Text id="chartCount">Number to draw</Text>:{" "}
                <input
                  type="number"
                  name="chartCount"
                  defaultValue="5"
                  min="1"
                />
              </label>
            </div>
            <div className={styles.group}>
              <Text id="difficultyLevel">Difficulty level</Text>:
              <label>
                <Text id="upperBound">Upper bound (inclusive)</Text>:
                <select name="upperBound">
                  {
                    levels.map(n => (
                    <option key={`upperBound-level-${n}`} selected={n === this.state.upperBound} value={mapLevel(n)}>
                      {mapLevel(n)}
                    </option>)
                    )
                  }
                </select>
              </label>
              <label>
                <Text id="lowerBound">Lower bound (inclusive)</Text>:
                <select name="lowerBound">
                  {
                    levels.map(n => (
                      <option key={`lowerBound-level-${n}`} selected={n === this.state.lowerBound} value={mapLevel(n)}>
                        {mapLevel(n)}
                      </option>)
                    )
                  }
                </select>
              </label>
            </div>
            <div className={styles.group}>
              <label>
                <input
                  type="checkbox"
                  name="weighted"
                  checked={this.state.weighted}
                  onChange={this.handleWeightedChange}
                />
                <Text id="useWeightedDistributions">
                  Use Weighted Distributions
                </Text>
              </label>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.group}>
              <Text id="difficulties">Difficulties</Text>:
              {difficulties.map(dif => (
                <label key={dif.value}>
                  <input
                    type="checkbox"
                    name="difficulties"
                    value={dif.value}
                    checked={dif.checked}
                    onChange={e => {
                      dif.checked = !!e.currentTarget.checked;
                      this.forceUpdate();
                    }}
                  />
                  <Text id={dif.key + ".name"} />
                </label>
              ))}
            </div>
          </div>
          <div className={styles.column}>
            {this.state.includables && (
              <div className={styles.group}>
                <Text id="include">Include</Text>:
                {Object.keys(this.state.includables).map(key => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      name="inclusions"
                      value={key}
                      checked={this.state.includables[key]}
                      onChange={e => {
                        this.state.includables[key] = !!e.currentTarget.checked;
                        this.forceUpdate();
                      }}
                    />
                    <Text id={"controls." + key} />
                  </label>
                ))}
              </div>
            )}
            <div className={globalStyles.padded}>
              <button onClick={this.handleRandomize}>
                <Text id="draw">Draw!</Text>
              </button>{" "}
              {canPromote && (
                <button onClick={this.handlePromote}>Next match</button>
              )}{" "}
              <button
                onClick={() =>
                  this.setState(state => ({ collapsed: !state.collapsed }))
                }
              >
                <Text id={collapsed ? "controls.show" : "controls.hide"} />
              </button>
            </div>
            {!!this.props.lastDrawFailed && (
              <div>
                <Text id="controls.invalid">
                  Couldn't draw anything with current settings!
                </Text>
              </div>
            )}
          </div>
        </section>

        <WeightsControls
          hidden={!this.state.weighted || collapsed}
          high={this.state.upperBound}
          low={this.state.lowerBound}
        />
      </form>
    );
  }

  saveFormRef = form => {
    this.form = form;
  };

  handleWeightedChange = e => {
    this.setState({
      weighted: e.currentTarget.checked
    });
  };

  handleLowerBoundChange = e => {
    const newValue = parseInt(e.currentTarget.value, 10);
    if (newValue > this.state.upperBound) {
      return;
    }

    this.setState({
      lowerBound: newValue
    });
  };

  handleUpperBoundChange = e => {
    const newValue = parseInt(e.currentTarget.value, 10);
    if (newValue < this.state.lowerBound) {
      return;
    }

    this.setState({
      upperBound: newValue
    });
  };

  handleSubmit(e) {
    e.preventDefault();
  }

  handleSongListChange = e => {
    const game = e.currentTarget.value;
    this.props.onSongListChange(game);
    this.setState(dataSetConfigs[game]);
  };

  handleRandomize = e => {
    e.preventDefault();
    const data = new FormData(this.form);
    this.props.onDraw(data);
  };

  handlePromote = e => {
    e.preventDefault();
    this.props.onPromote();
  };
}
