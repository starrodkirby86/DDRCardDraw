import * as classNames from "classnames";
import { TranslateContext } from "@denysvuika/preact-translate";
import "formdata-polyfill";
import { useContext, useRef, useState } from "preact/hooks";
import { Component } from "preact";
import { DrawStateContext } from "./draw-state";
import styles from "./controls.css";
import bgStyles from './bg.css';
import globalStyles from "./app.css";
import { WeightsControls } from "./controls-weights";
import { mapLevel, levels } from './utils';

const dataSetConfigs = {
  maimai: {
    defaultState: {
      lowerBound: 10,
      upperBound: 13,
    },
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
  chuni: {
    upperMaximum: 14,
    defaultState: {
      lowerBound: 11,
      upperBound: 13,
    },
    difficulties: [
      {
        key: "difficulty.chuni.bas",
        value: "Basic",
        checked: false
      },
      {
        key: "difficulty.chuni.adv",
        value: "Advanced",
        checked: false
      },
      { key: "difficulty.chuni.exp", value: "Expert", checked: true },
      {
        key: "difficulty.chuni.mas",
        value: "Master",
        checked: true
      }
    ],
    includables: {
      crystal: false,
    }
  },
};

function preventDefault(e) {
  e.preventDefault();
}

function UncontrolledCheckbox(props) {
  const { defaultChecked, onChange, ...otherProps } = props;
  const [checked, updateChecked] = useState(defaultChecked);
  return (
    <input
      {...otherProps}
      type="checkbox"
      checked={checked}
      onChange={e => {
        updateChecked(!!e.currentTarget.checked);
        if (onChange) {
          onChange(e);
        }
      }}
    />
  );
}

export function Controls(props) {
  const { t } = useContext(TranslateContext);
  const { drawSongs, dataSetName, loadSongSet } = useContext(DrawStateContext);
  const {
    difficulties,
    includables,
    defaultState,
    upperMaximum
  } = dataSetConfigs[dataSetName];
  const form = useRef();
  const [collapsed, setCollapsed] = useState(true);
  const [weighted, setWeighted] = useState(false);
  const [chartCount, setChartCount] = useState(5);
  const [lowerBound, setLowerBound] = useState(defaultState.lowerBound);
  const [upperBound, setUpperBound] = useState(defaultState.upperBound);

  const abbrKeys = {};
  for (const d of difficulties) {
    abbrKeys[d.value] = d.key + ".abbreviation";
  }

  const handleWeightedChange = e => {
    setWeighted(!!e.currentTarget.checked);
  };

  const handleLowerBoundChange = e => {
    const newValue = mapLevel(e.currentTarget.value);
    setLowerBound(newValue > upperBound ? lowerBound : mapLevel(newValue));
  };

  const handleUpperBoundChange = e => {
    const newValue = mapLevel(e.currentTarget.value);
    setUpperBound(newValue < lowerBound ? upperBound : mapLevel(newValue));
  };

  const handleSongListChange = e => {
    const game = e.currentTarget.value;
    const newDefaults = dataSetConfigs[game].defaultState;
    setLowerBound(newDefaults.lowerBound);
    setUpperBound(newDefaults.upperBound);
    loadSongSet(game);
  };

  const handleRandomize = e => {
    e.preventDefault();
    const data = new FormData(form.current);
    drawSongs(data);
  };

  return (
    <form
      ref={form}
      className={styles.form + (collapsed ? " " + styles.collapsed : "") + ' ' + bgStyles['hero-bg']}
      onSubmit={preventDefault}
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
              {t("dataSource")}:{" "}
              <select name="dataSource" onChange={handleSongListChange}>
                <option value="maimai" defaultSelected>Maimai</option>
                <option value="chuni">Chunithm</option>
              </select>
            </label>
          </div>
          <div className={styles.group}>
            <label>
              {t("chartCount")}:{" "}
              <input type="number" name="chartCount" value={chartCount} min="1" onChange={(e) => setChartCount(e.value)} />
            </label>
          </div>
          <div className={styles.group}>
            {t("difficultyLevel")}:
            <label>
              {t("upperBound")}:
              <select name="upperBound" value={upperBound} onChange={handleUpperBoundChange}>
                {
                  levels.map(n => (
                    <option key={`upperBound-level-${n}`} selected={n === upperBound} value={mapLevel(n)}>
                      {mapLevel(n)}
                    </option>)
                  )
                }
              </select>
            </label>
            <label>
              {t("lowerBound")}:
              <select name="lowerBound" value={lowerBound} onChange={handleLowerBoundChange}>
                {
                  levels.map(n => (
                    <option key={`lowerBound-level-${n}`} selected={n === lowerBound} value={mapLevel(n)}>
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
                checked={weighted}
                onChange={handleWeightedChange}
              />
              {t("useWeightedDistributions")}
            </label>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.group}>
            {t("difficulties")}:
            {difficulties.map(dif => (
              <label key={`${dataSetName}:${dif.value}`}>
                <UncontrolledCheckbox
                  name="difficulties"
                  value={dif.value}
                  defaultChecked={dif.checked}
                />
                {t(dif.key + ".name")}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.column}>
          {includables && (
            <div className={styles.group}>
              {t("include")}:
              {Object.keys(includables).map(key => (
                <label key={`${dataSetName}:${key}`}>
                  <UncontrolledCheckbox
                    name="inclusions"
                    value={key}
                    defaultChecked={includables[key]}
                  />
                  {t("controls." + key)}
                </label>
              ))}
            </div>
          )}
          <div className={classNames(globalStyles.padded, styles.buttons)}>
            <button className={styles.controlButton} onClick={handleRandomize}>{t("draw")}</button>{" "}
            <button className={styles.controlButton} onClick={() => setCollapsed(!collapsed)}>
              {t(collapsed ? "controls.show" : "controls.hide")}
            </button>
          </div>
          {!!props.lastDrawFailed && <div>{t("controls.invalid")}</div>}
        </div>
      </section>
      <WeightsControls
        hidden={!weighted || collapsed}
        high={upperBound}
        low={lowerBound}
      />
    </form>
  );
}
