import { useState } from "react";
import { PaperPlaneIcon } from "@phosphor-icons/react";
import { useLocalStorage } from "@reactuses/core";
import Alert from "~/components/Alert";
import Button from "~/components/Button";
import Checkbox from "~/components/Checkbox";
import Select from "~/components/Select";
import Textbox from "~/components/Textbox";

const formName = "contact-general";

const reasonOptions = [
  { value: "", label: "" },
  { value: "[speaking-request]", label: "Speaking request" },
  { value: "[licensing-request]", label: "Licensing request" },
  { value: "[video-correction]", label: "Video Correction" },
  { value: "[website-issue]", label: "Issue with the website" },
  { value: "[talent-inquiry]", label: "Inquiry about 3b1b Talent" },
  { value: "[share-something]", label: "Want to share something" },
  { value: "[merchandise-question]", label: "Merchandise question" },
  { value: "[thanks]", label: "Jut saying thanks" },
  { value: "[other]", label: "Other" },
] as const;

export default function Contact() {
  // form state, persisted in local storage
  const [name, setName] = useLocalStorage("contact-name", "");
  const [email, setEmail] = useLocalStorage("contact-email", "");
  const [subject, setSubject] = useLocalStorage("contact-subject", "");
  const [reason, setReason] = useLocalStorage<
    (typeof reasonOptions)[number]["value"]
  >("contact-reason", reasonOptions[0].value);
  const [message, setMessage] = useLocalStorage("contact-message", "");

  // form status
  const [status, setStatus] = useState<"" | "success" | "error">("");

  return (
    <form
      method="POST"
      data-netlify="true"
      name={formName}
      className="grid grid-cols-2 gap-8 max-md:grid-cols-1"
      onSubmit={async (event) => {
        // prevent page navigation
        event.preventDefault();

        // collect form data as url string params (netlify only supports this format)
        const params = new URLSearchParams();
        for (const [key, value] of new FormData(event.target).entries()) {
          if (typeof value !== "string") continue;
          params.append(key, value);
        }

        try {
          // send form data to netlify
          const response = await window.fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
          });
          if (!response.ok) throw Error("Response no OK");
          setStatus("success");
          setSubject("");
          setMessage("");
        } catch (error) {
          console.error(error);
          setStatus("error");
        }
      }}
    >
      <label>
        Name
        <Textbox
          name="name"
          placeholder="Name"
          required
          value={name ?? ""}
          onChange={setName}
        />
      </label>
      <label>
        Email
        <Textbox
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email ?? ""}
          onChange={setEmail}
        />
      </label>
      <label>
        Subject
        <Textbox
          name="subject"
          placeholder="Subject"
          required
          value={subject ?? ""}
          onChange={setSubject}
        />
      </label>
      <label>
        Reason
        <Select
          name="reason"
          options={reasonOptions}
          required
          value={reason ?? ""}
          onChange={setReason}
        />
      </label>
      <label className="col-span-full">
        Message
        <Textbox
          multi
          name="message"
          placeholder="Message"
          required
          value={message ?? ""}
          onChange={setMessage}
        />
      </label>
      <Checkbox
        name="read-faqs"
        required
        className="col-span-full justify-self-center"
      >
        My message is not addressed by any of of the FAQs above.
      </Checkbox>

      {!status && (
        <Button
          type="submit"
          color="accent"
          className="col-span-full w-50 justify-self-center"
        >
          <PaperPlaneIcon />
          Send
        </Button>
      )}

      {status === "success" && (
        <Alert type="success" className="col-span-full">
          Thank you for your message!
        </Alert>
      )}

      {status === "error" && (
        <Alert type="error" className="col-span-full">
          Sorry, there was an error sending your message. Please try again later
          or reach out on social media platforms.
        </Alert>
      )}
    </form>
  );
}
