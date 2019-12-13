import classNames from "classnames";
import { detectedLanguage } from "../utils";
import styles from "./song-card.css";
import { useState, useContext } from "preact/hooks";
import { Zap, Lock, Edit, Slash } from "preact-feather";
import { TranslateContext } from "@denysvuika/preact-translate";
import { IconMenu } from "./icon-menu";
import { CardLabel } from "./card-label";

const isJapanese = detectedLanguage === "ja";

export function SongCard(props) {
  const {
    chart,
    vetoedBy,
    protectedBy,
    replacedBy,
    replacedWith,
    onVeto,
    onProtect,
    onReplace,
    onReset
  } = props;

  const { t } = useContext(TranslateContext);
  const [showingIconMenu, setShowIconMenu] = useState(false);
  const showIcons = () => setShowIconMenu(true);
  const hideIcons = () => {
    setShowIconMenu(false);
    return true;
  };

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
    genre,
    abbreviation,
  } = replacedWith || chart;

  const rootClassname = classNames(styles.chart, styles[difficulty], {
    [styles.vetoed]: vetoedBy,
    [styles.protected]: protectedBy || replacedBy
  });

  let jacketBg = {};
  if (jacket) {
    jacketBg = {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url("jackets/${jacket}-${id}.jpg")`
    };
  }

  return (
    <div
      className={rootClassname}
      onClick={showingIconMenu ? undefined : showIcons}
    >
      {vetoedBy && (
        <CardLabel left={vetoedBy === 1} isP2={vetoedBy === 2}>
          P{vetoedBy}
          <Slash size={16} />
        </CardLabel>
      )}
      {protectedBy && (
        <CardLabel left={protectedBy === 1} isP2={protectedBy === 2}>
          P{protectedBy}
          <Lock size={16} />
        </CardLabel>
      )}
      {replacedBy && (
        <CardLabel left={replacedBy === 1} isP2={replacedBy === 2}>
          P{replacedBy}
          <Edit size={16} />
        </CardLabel>
      )}
      {showingIconMenu && (
        <IconMenu
          onProtect={player => hideIcons() && onProtect(player)}
          onPocketPicked={(player, chart) =>
            hideIcons() && onReplace(player, chart)
          }
          onVeto={player => hideIcons() && onVeto(player)}
          onlyReset={vetoedBy || protectedBy || replacedBy}
          onReset={() => hideIcons() && onReset()}
          onClose={hideIcons}
        />
      )}
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
        {genre && <div className={styles.genre}>{genre}</div>}
        <div className={styles.difficulty}>
          {t(difficulty)} {level}
        </div>
      </div>
    </div>
  );
}
