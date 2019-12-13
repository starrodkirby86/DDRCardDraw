import * as classNames from "classnames";
import styles from "./card-label.css";

export function CardLabel({ children, left, isP2 }) {
  const c = classNames(styles.cardLabel, {
    [styles.left]: left,
    [styles.p2]: isP2
  });
  return (
    <div className={c}>
      <span>{children}</span>
    </div>
  );
}
