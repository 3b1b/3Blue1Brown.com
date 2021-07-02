import { useState } from "react";
import Clickable from "../Clickable";
import Tooltip from "../Tooltip";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./index.module.scss";

export default function FreeResponse({ children: explanation }) {
  const [userAnswer, setUserAnswer] = useState("");

  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={styles.free_response} data-submitted={submitted}>
      <div className={styles.answerHeader}>Your answer:</div>
      <div className={styles.yours}>
        <TextareaAutosize
          placeholder="Enter what you think here..."
          value={userAnswer}
          onChange={(event) => {
            setUserAnswer(event.target.value);
          }}
          disabled={submitted}
          rows={3}
        />
        <Clickable
          text={submitted ? "Change answer" : "Submit"}
          icon={submitted ? "fas fa-lock-open" : "fas fa-paper-plane"}
          disabled={!submitted && userAnswer === ""}
          onClick={() => setSubmitted(!submitted)}
        />
        <Tooltip
          className={styles.about}
          content="Use this box as a chance to slow down for a moment and test your own understanding. Your answer will not be saved; it's just for you."
        >
          ?
        </Tooltip>
      </div>

      <div className={styles.answerHeader}>Our answer:</div>
      <div className={styles.ours} data-visible={submitted}>
        <div className={styles.explanation}>{explanation}</div>
      </div>
    </div>
  );
}
