import { Fragment } from "react";
import Markdownify from "../Markdownify";
import styles from "./index.module.scss";
import SpeechBubble from "../../public/images/pi-creatures/bubble-speech.svg";
import ThoughtBubble from "../../public/images/pi-creatures/bubble-thought.svg";

const PiCreature = ({ emotion, text, thought, placement, design, flip }) => {
  let Bubble = Fragment;
  if (text) {
    if (thought) Bubble = ThoughtBubble;
    else Bubble = SpeechBubble;
  }

  return (
    <div
      className={styles.pi_creature}
      data-flip={flip || false}
      data-placement={placement || "auto"}
      data-design={design}
      data-text={text ? true : false}
    >
      <div className={styles.frame}>
        <img src={`/images/pi-creatures/${emotion}.svg`} />
        <Bubble />
        {text && (
          <div className={styles.text}>
            <Markdownify>{text}</Markdownify>
          </div>
        )}
      </div>
    </div>
  );
};

export default PiCreature;
