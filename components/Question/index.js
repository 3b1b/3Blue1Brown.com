import { useRef, useState } from "react";
import PropTypes from "prop-types";
import Clickable from "../Clickable";
import PiCreature from "../PiCreature";
import Markdownify from "../Markdownify";
import { shakeElement } from "../../util/animation";
import styles from "./index.module.scss";

// interactive multiple-choice question component with explanation
Question.propTypes = {
  question: PropTypes.string.isRequired,
  choice1: PropTypes.string.isRequired,
  choice2: PropTypes.string.isRequired,
  choice3: PropTypes.string,
  choice4: PropTypes.string,
  choice5: PropTypes.string,
  choice6: PropTypes.string,
  answer: PropTypes.number.isRequired,
  children: PropTypes.node,
};

// component takes choices as enumerated/separate props rather than single array
// prop, because with array, jsx syntax will escape math latex like
// "\times" -> "[TAB]imes"
export default function Question({
  question,
  choice1,
  choice2,
  choice3,
  choice4,
  choice5,
  choice6,
  answer,
  children: explanation,
}) {
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState("unanswered");
  const resultRef = useRef();

  // convert 1-index to 0-index
  answer = answer - 1;

  // convert choices to array
  const choices = [choice1, choice2, choice3, choice4, choice5, choice6].filter(
    (choice) => choice
  );

  // if no question or choices, don't render
  if (!question || !choices.length) return null;

  // check answer
  const submit = () => {
    if (selected === answer) setState("correct");
    else {
      setState("incorrect");
      shakeElement(resultRef?.current?.querySelector("button"));
    }
  };

  // reset question
  const reset = () => {
    setState("unanswered");
    setSelected(null);
  };

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
              checked={index === selected}
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
          <Clickable
            text="Check Answer"
            onClick={submit}
            disabled={selected === null}
          />
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
      {state === "correct" && explanation && (
        <div className={styles.explanation}>{explanation}</div>
      )}
    </div>
  );
}
