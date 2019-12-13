import classNames from "classnames";
import { detectedLanguage } from "./utils";
import styles from "./footer.css";
import globalStyles from "./app.css";
import { AuthButton } from "./auth-button";
import { Icon } from "./icon";
import { useContext, useState } from "preact/hooks";
import { Github } from "preact-feather";
import { TranslateContext } from "@denysvuika/preact-translate";
import { About } from "./about";

export function Footer() {
  const { t } = useContext(TranslateContext);
  const [showAbout, updateShowAbout] = useState(false);

  return (
    <footer className={classNames(styles.footer, globalStyles.padded)}>
      {showAbout && <About onClose={() => updateShowAbout(false)} />}
      <div>
        maimai Card Draw v0.0.2
        &nbsp;-&nbsp;
        <a href="#" onClick={e => (e.preventDefault(), updateShowAbout(true))}>{t("credits")}</a>
      </div>
    </footer>
    
  );
}