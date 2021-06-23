/*

This form uses Netlify Forms, which works by parsing the statically-generated HTML
at build time to find the html form element.

This means that the form MUST appear on some statically-generated page of the site
in order to function. (So it *cannot* be lazy-loaded everywhere it's used.)

*/

import { useRef } from "react";
import Clickable from "../Clickable";
import styles from "./index.module.scss";

export default function ContactForm() {
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
    <div className={styles.contactForm}>
      <form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        <input type="hidden" name="form-name" value="contact" />

        <div className={styles.twoInputRow}>
          <label className={styles.inputWrapper}>
            <span className={styles.label}>Name:</span>
            <input className={styles.input} type="text" name="name" required />
          </label>

          <label className={styles.inputWrapper}>
            <span className={styles.label}>Email:</span>
            <input
              className={styles.input}
              type="email"
              name="email"
              required
            />
          </label>
        </div>

        <label className={styles.inputWrapper}>
          <span className={styles.label}>Message:</span>
          <textarea className={styles.input} name="message" required />
        </label>

        <label className={styles.checkboxWrapper}>
          <input type="checkbox" required />
          <span className={styles.checkboxDescription}>
            I am not asking a question that is answered in the FAQs above.
          </span>
        </label>

        <input
          ref={hiddenSubmitRef}
          type="submit"
          value="Send"
          style={{ display: "none" }}
        />
        <Clickable text="Send" onClick={submit} />

        {process.env.NODE_ENV === "development" && (
          <div style={{ color: "red", marginTop: 16 }}>
            This contact form won't actually work because you are in development
            mode. It depends on Netlify Forms, which are only available on
            deploy previews and in production.
          </div>
        )}
      </form>
    </div>
  );
}
