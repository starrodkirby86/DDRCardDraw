import classNames from "classnames";
import { useContext, useState, useRef, useLayoutEffect } from "preact/hooks";
import { DrawStateContext } from "./draw-state";
import styles from "./song-search.css";
import { getDrawnChart } from "./card-draw";
import { Modal } from "./modal";

const DifficultyCard = ({ song, chart, onSelect }) => {
  const { difficulty, level } = chart;
  return (
    <div
      className={classNames(styles.chart, styles[difficulty])}
      onClick={() => onSelect(getDrawnChart(song, chart))}
    >
      XXX
      <br />
      {level}
    </div>
  );
}

function getSuggestions(fuzzySearch, searchTerm, onSelect) {
  if (fuzzySearch && searchTerm) {
    const suggestions = fuzzySearch.search(searchTerm).slice(0, 5);
    if (suggestions.length) {
      return suggestions.map(song => (
        <div className={styles.suggestion}>
          <img src={`jackets/${song.jacket}-${song.id}`} className={styles.img} />
          <div className={styles.title}>
            {song.name_jp || song.name}
            <br />
            {song.artist_jp || song.artist}
          </div>
          {
            song.charts.map(chart => <DifficultyCard
              key={`diff-card-${chart.difficulty}`}
              song={song}
              chart={chart}
              onSelect={onSelect}
            />)
          }
        </div>
      ));
    }
  }
  return null;
}

export function SongSearch(props) {
  const { autofocus, onSongSelect, onCancel } = props;
  const [searchTerm, updateSearchTerm] = useState("");

  const { fuzzySearch } = useContext(DrawStateContext);
  const input = useRef();
  useLayoutEffect(() => {
    if (autofocus && input.current) {
      input.current.focus();
    }
  }, []);

  return (
    <Modal onClose={onCancel}>
      <div className={styles.input}>
        <input
          placeholder="Search for a song"
          ref={input}
          type="search"
          onKeyUp={e => {
            if (e.keyCode === 27) {
              updateSearchTerm("");
              onCancel && onCancel();
            } else if (e.currentTarget.value !== searchTerm) {
              updateSearchTerm(e.currentTarget.value);
            }
          }}
          value={searchTerm}
        />
      </div>
      <div className={styles.suggestionSet}>
        {getSuggestions(fuzzySearch, searchTerm, onSongSelect)}
      </div>
    </Modal>
  );
}
