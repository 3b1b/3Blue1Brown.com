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

export function LicensingForm() {
  return (
    <Form name="contact-licensing">
      <InputRow>
        <Input name="name" label="Name:" />
        <Input name="email" type="email" label="Email:" />
      </InputRow>

      <Input name="organization_name" label="Organization name:" />
      <Input name="website" label="Website:" />

      <RadioSet
        name="clip_type"
        title="Are you seeking to license clips or full videos?"
      >
        <Radio value="clips" label="Clips" />
        <Radio value="full_videos" label="Full videos" />
      </RadioSet>

      <CheckboxSet
        name="series"
        title="Are you looking to license any of the following series?"
      >
        <Checkbox
          value="neural_networks"
          label="Neural networks (4 videos, ~1 hour)"
        />
        <Checkbox
          value="calculus"
          label="Calculus series (12 videos, ~3.25 hours)"
        />
        <Checkbox
          value="linear_algebra"
          label="Linear algebra series (16 videos, ~3.2 hours)"
        />
        <Checkbox
          value="differential_equations"
          label="Differential equations (6 videos, ~2 hours)"
        />
      </CheckboxSet>

      <Input
        type="textarea"
        name="message"
        label="Tell us more about what you're looking for:"
      />
    </Form>
  );
}

export function SpeakingForm() {
  return (
    <Form name="contact-speaking">
      <InputRow>
        <Input name="name" label="Name:" />
        <Input name="email" type="email" label="Email:" />
      </InputRow>

      <Input name="subject" label="Organization name:" />

      <Input
        name="estimated_date"
        label="Approximate date for the desired talk:"
      />
      <Input name="estimated_honorarium" label="Estimated honorarium:" />

      <Input
        type="textarea"
        name="message"
        label="Tell us more about what you're looking for:"
      />
    </Form>
  );
}

export function ThanksForm() {
  return (
    <Form name="contact-thanks">
      <InputRow>
        <Input name="name" label="Name:" />
        <Input name="email" type="email" label="Email:" />
      </InputRow>

      <Input name="subject" label="Subject:" />
      <Input type="textarea" name="message" label="Message:" />

      <RadioSet
        name="allow_anonymous_sharing"
        title="Would you be comfortable with this note being shared anonymously with people who have helped or supported the channel?"
      >
        <Radio value="yes" label="Yes" />
        <Radio value="no" label="No" />
      </RadioSet>
    </Form>
  );
}

export function ContactForm() {
  return (
    <Form name="contact-general">
      <InputRow>
        <Input name="name" label="Name:" />
        <Input name="email" type="email" label="Email:" />
      </InputRow>

      <Input name="subject" label="Subject:" />
      <Input type="textarea" name="message" label="Message:" />

      <VerificationCheckbox label="I am not asking a question that is answered in the FAQs above." />
    </Form>
  );
}

export function ContactFormReceivedMessage() {
  const router = useRouter();

  switch (router.query.received) {
    case "contact-licensing":
    case "contact-speaking":
      return (
        <div className={styles.receivedFormThanks}>
          <strong>Thank you for your submission!</strong>
          <div>We will try to get back to you shortly.</div>
        </div>
      );
    case "contact-thanks":
    case "contact-general":
      return (
        <div className={styles.receivedFormThanks}>
          <strong>Thank you for your submission!</strong>
          <div>
            We read every message, but can't respond personally to all of them.
            We hope you understand.
          </div>
        </div>
      );
    default:
      return null;
  }
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
        action={`/contact?received=${name}`}
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
