import { useState } from "react";
import PropTypes from "prop-types";
import Clickable from "../Clickable";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

FreeResponse.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function FreeResponse({ children }) {
  const [userAnswer, setUserAnswer] = useState("");

  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={styles.free_response} data-submitted={submitted}>
      <div className={styles.answerHeader}>Your answer:</div>
      <div className={styles.yours}>
        <textarea
          className={styles.input}
          placeholder="Enter what you think here..."
          value={userAnswer}
          onChange={(event) => {
            setUserAnswer(event.target.value);
          }}
          disabled={submitted}
          rows={3}
        />
        <div className={styles.buttons}>
          <Tooltip
            className={styles.tooltip}
            content="Use this box as a chance to slow down for a moment and test your own understanding. Your answer will not be saved; it's just for you."
          >
            ?
          </Tooltip>
          <Clickable
            className={styles.submit}
            text={submitted ? "Change answer" : "Submit"}
            icon={submitted ? "fas fa-lock-open" : "fas fa-paper-plane"}
            disabled={!submitted && userAnswer === ""}
            onClick={() => setSubmitted(!submitted)}
          />
        </div>
      </div>

      <div className={styles.answerHeader}>Our answer:</div>
      <div className={styles.ours} data-visible={submitted}>
        <div className={styles.explanation}>{children}</div>
      </div>
    </div>
  );
}
