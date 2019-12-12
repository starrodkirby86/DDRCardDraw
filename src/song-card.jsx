import classNames from "classnames";
import { Component } from "preact";
import { detectedLanguage } from "./utils";
import styles from "./song-card.css";
import { Localizer, Text } from "preact-i18n";

const isJapanese = detectedLanguage === "ja";

export class SongCard extends Component {
  render() {
    const {
      id,
      name,
      name_jp,
      artist,
      artist_jp,
      bpm,
      difficulty,
      level,
      vetoed,
      jacket,
      abbreviation,
    } = this.props;

    const rootClassname = classNames(styles.chart, styles[difficulty], {
      [styles.vetoed]: vetoed
    });

    const jacketBg = {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url("jackets/${jacket}-${id}.jpg")`
    };

    return (
      <div className={rootClassname} onClick={this.props.onVeto}>
        <div className={styles.cardCenter} style={jacketBg}>
          <div className={styles.name} title={name_jp}>
            {name}
          </div>
          {isJapanese || (name_jp === name) ? null : (
            <div className={styles.nameTranslation}>{name_jp}</div>
          )}
          <div className={styles.artist} title={artist_jp}>
            {artist}
          </div>
        </div>
        <div className={styles.cardFooter}>
          {bpm !== 0 && <div className={styles.bpm}>{bpm} BPM</div>}
          <div className={styles.difficulty}>
            <Text id={difficulty} /> {level}
          </div>
        </div>
      </div>
    );
  }

  toggleVeto = () => {
    this.setState(prevState => ({
      vetoed: !prevState.vetoed
    }));
  };
}
