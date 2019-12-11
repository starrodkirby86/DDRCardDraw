import classNames from "classnames";
import { Localizer, Text } from "preact-i18n";

import { detectedLanguage } from "./utils";
import styles from "./footer.css";
import globalStyles from "./app.css";

import fbLogo from "ionicons/dist/ionicons/svg/logo-facebook.svg";
import twitterLogo from "ionicons/dist/ionicons/svg/logo-twitter.svg";
import githubLogo from "ionicons/dist/ionicons/svg/logo-github.svg";

function Icon({ src, title }) {
  return (
    <figure
      title={title}
      alt={title}
      dangerouslySetInnerHTML={{ __html: src }}
      className={styles.icon}
    />
  );
}

export function Footer() {
  return (
    <footer className={classNames(styles.footer, globalStyles.padded)}>
      <div>
        maimai Card Draw v0.0.1
        &nbsp;-&nbsp;
        <a href="#" onClick={showCredits}>
          <Text id="credits">Credits</Text>
        </a>
      </div>
      <div>
        <a href="https://github.com/starrodkirby86/DDRCardDraw">
          <Localizer>
            <Icon src={githubLogo} title={<Text id="contact.github" />} />
          </Localizer>
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
