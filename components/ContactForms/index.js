/*

This form uses Netlify Forms, which works by parsing the statically-generated HTML
at build time to find the html form element.

This means that the form MUST appear on some statically-generated page of the site
in order to function. (So it *cannot* be lazy-loaded everywhere it's used.)

*/

import { createContext, useContext, useRef } from "react";
import { useRouter } from "next/router";
import Clickable from "../Clickable";
import styles from "./index.module.scss";

export function ContactForm() {
  return (
    <Form name="contact-general">
      <InputRow>
        <Input name="name" label="Name" />
        <Input name="email" type="email" label="Email" />
      </InputRow>

      <Select
        name="reason"
        label="Reason for contacting"
        options={[
          { value: "blank", label: "" },
          { value: "speaking", label: "Speaking request" },
          { value: "licensing", label: "Licensing request" },
          { value: "correction", label: "Video Correction" },
          { value: "website", label: "Issue with the website" },
          { value: "talent", label: "Inquiry about 3b1b Talent" },
          { value: "share", label: "Want to share something" },
          { value: "merchandise", label: "Merchandise question" },
          { value: "thanks", label: "Jut saying thanks" },
          { value: "other", label: "Other" },
        ]}
      />
      <Input name="subject" label="Subject" />
      <Input type="textarea" name="message" label="Message" />
    </Form>
  );
}

export function ContactFormReceivedMessage() {
  const router = useRouter();

  if (router.query.received === "contact-general") {
    return (
      <div className={styles.receivedFormThanks}>
        <strong>Thank you for your submission!</strong>
      </div>
    );
  }

  return null;
}

function Form({ name, children }) {
  const hiddenSubmitRef = useRef();

  const submit = () => {
    /*
      The browser's build-in form validation popups don't appear
      if you call form.submit() directly. They only work upon
      clicking the submit button. But we're using a Clickable
      component for the submit button, which can't actually be
      a submit button itself, so it just calls this function which
      clicks a hidden submit button behind the scenes.
    */
    hiddenSubmitRef.current.click();
  };

  return (
    <div className={styles.form}>
      <form
        method="POST"
        action={`/faq?received=${name}#contact`}
        data-netlify="true"
        name={name}
      >
        <input type="hidden" name="form-name" value={name} />

        {children}

        <input
          ref={hiddenSubmitRef}
          type="submit"
          value="Send"
          style={{ display: "none" }}
        />
        <Clickable text="Send" onClick={submit} />

        {process.env.NODE_ENV === "development" && (
          <div style={{ color: "red", marginTop: 16 }}>
            This form won't actually work because you are in development mode.
            It depends on Netlify Forms, which is only available on deploy
            previews and in production.
          </div>
        )}
      </form>
    </div>
  );
}

function Input({ name, label, type = "text", required = true }) {
  return (
    <label className={styles.inputWrapper}>
      <span className={styles.label}>{label}</span>
      {type === "textarea" && (
        <textarea
          className={styles.input}
          rows={6}
          name={name}
          required={required}
        />
      )}
      {type !== "textarea" && (
        <input className={styles.input} name={name} required={required} />
      )}
    </label>
  );
}

function Select({ name, label, options, required = true }) {
  return (
    <div className={styles.inputWrapper}>
      <span className={styles.label}>{label}</span>
      <select className={styles.input} name={name} required={required}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputRow({ children }) {
  return <div className={styles.inputRow}>{children}</div>;
}

const CheckboxSetContext = createContext({ name: null });

function CheckboxSet({ title, name, children }) {
  return (
    <CheckboxSetContext.Provider value={{ name }}>
      <fieldset className={styles.checkboxSet}>
        <legend>{title}</legend>
        <div>{children}</div>
      </fieldset>
    </CheckboxSetContext.Provider>
  );
}

function Checkbox({ value, label }) {
  const { name } = useContext(CheckboxSetContext);

  return (
    <label className={styles.checkbox}>
      <input type="checkbox" name={name} value={value} />
      <span>{label}</span>
    </label>
  );
}

const RadioSetContext = createContext({ name: null, required: true });

function RadioSet({ title, name, children, required = true }) {
  return (
    <RadioSetContext.Provider value={{ name, required }}>
      <fieldset className={styles.radioSet}>
        <legend>{title}</legend>
        <div>{children}</div>
      </fieldset>
    </RadioSetContext.Provider>
  );
}

function Radio({ value, label }) {
  const { name, required } = useContext(RadioSetContext);

  return (
    <label className={styles.radio}>
      <input type="radio" name={name} value={value} required={required} />
      <span>{label}</span>
    </label>
  );
}

function VerificationCheckbox({ label }) {
  return (
    <label className={styles.verificationCheckbox}>
      <input type="checkbox" required />
      <span>{label}</span>
    </label>
  );
}
