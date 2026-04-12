import { useState } from "react";
import PropTypes from "prop-types";
import Clickable from "../Clickable";
import styles from "./index.module.scss";

ChallengeAnswer.propTypes = {
  prompt: PropTypes.string,
  message: PropTypes.string.isRequired,
  resume_line: PropTypes.string,
  application_link: PropTypes.string.isRequired,
};

export default function ChallengeAnswer({
  prompt = "Your solution",
  message,
  resume_line,
  application_link,
}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filledMessage = message.replace(/\{answer\}/g, answer);
  const filledResumeLine = resume_line?.replace(/\{answer\}/g, answer);

  return (
    <div className={styles.challenge_answer}>
      <div className={styles.label}>{prompt}</div>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter your answer..."
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setSubmitted(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && answer !== "") setSubmitted(true);
          }}
        />
        <Clickable
          className={styles.submit}
          text={submitted ? "Edit" : "Submit"}
          icon={submitted ? "fas fa-lock-open" : "fas fa-paper-plane"}
          disabled={!submitted && answer === ""}
          onClick={() => setSubmitted(!submitted)}
        />
      </div>

      {submitted && (
        <div className={styles.result}>
          <p className={styles.message}>
            {filledMessage}
            {filledResumeLine && (
              <><br /><strong className={styles.resume_line}>{filledResumeLine}</strong></>
            )}
          </p>
          <Clickable
            link={application_link}
            text="Apply now"
            icon="fas fa-arrow-right"
            design="featured"
            target="_blank"
          />
        </div>
      )}
    </div>
  );
}
