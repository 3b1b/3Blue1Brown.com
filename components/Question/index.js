import { useRef, useState } from "react";
import Clickable from "../Clickable";
import PiCreature from "../PiCreature";
import Markdownify from "../Markdownify";
import { shakeElement } from "../../util/animation";
import styles from "./index.module.scss";

const Question = ({
  question,
  choice1,
  choice2,
  choice3,
  choice4,
  choice5,
  choice6,
  answer,
  explanation,
}) => {
  const [selected, setSelected] = useState(0);
  const [state, setState] = useState("unanswered");
  const resultRef = useRef();

  // convert 1-index to 0-index
  answer = answer - 1;

  // check answer
  const submit = () => {
    console.log(selected, answer);
    if (selected === answer) setState("correct");
    else {
      setState("incorrect");
      shakeElement(resultRef?.current?.querySelector("button"));
    }
  };

  const choices = [choice1, choice2, choice3, choice4, choice5, choice6].filter(
    (choice) => choice
  );

  // reset question
  const reset = () => setState("unanswered");

  return (
    <div className={styles.question}>
      <div className={styles.text}>
        <Markdownify>{question}</Markdownify>
      </div>
      <div className={styles.choices}>
        {choices.map((choice, index) => (
          <label
            key={index}
            className={styles.choice}
            data-highlight={index === answer && state === "correct"}
          >
            <input
              className={styles.radio_input}
              type="radio"
              name={question}
              value={choice}
              onChange={() => setSelected(index)}
              disabled={state === "correct"}
            />
            <span className={styles.radio_svg}></span>
            <span className={styles.choice_text}>
              <Markdownify>{choice}</Markdownify>
            </span>
            <span className={styles.choice_icon}>
              {index === answer && <i className="fas fa-check" />}
            </span>
          </label>
        ))}
      </div>
      <div ref={resultRef} className={styles.result}>
        {state === "unanswered" && (
          <Clickable text="Check Answer" onClick={submit} />
        )}
        {state === "incorrect" && (
          <>
            <PiCreature emotion="thinking" placement="inline" design="small" />
            <span>Not quite...</span>
            <Clickable text="Try Again" onClick={submit} />
          </>
        )}
        {state === "correct" && (
          <>
            <PiCreature emotion="hooray" placement="inline" design="small" />
            <span>Correct!</span>
            <Clickable text="Reset" onClick={reset} />
          </>
        )}
      </div>
      {state === "correct" && (
        <div className={styles.explanation}>
          <Markdownify>{explanation}</Markdownify>
        </div>
      )}
    </div>
  );
};

export default Question;
