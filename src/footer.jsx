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
        maimai Card Draw v0.0.1
        &nbsp;-&nbsp;
        <a href="#" onClick={showCredits}>
          <p id="credits">Credits</p>
        </a>
      </div>
      <div>
        <a href="https://github.com/starrodkirby86/maimaiCardDraw">
          <Icon src={Github} title={<Text id="contact.github" />} />
        </a>
      </div>
    </footer>
  );
}

function showCredits(e) {
  e.preventDefault();
  alert(
    "App originally by Jeff Lloyd, Noah Manneschmidt. \
Weighted distribution code by Chris Chike. \
Japanese localization by nalpan. \
Maintained by Watson Tungjunyatham."
  );
}
