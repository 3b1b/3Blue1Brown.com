import { useState } from "react";
import { EnvelopeIcon, PaperPlaneIcon } from "@phosphor-icons/react";
import { useLocalStorage } from "@reactuses/core";
import Alert from "~/components/Alert";
import Button from "~/components/Button";
import Checkbox from "~/components/Checkbox";
import Form from "~/components/Form";
import Select from "~/components/Select";
import TextBox from "~/components/TextBox";

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
  const [status, setStatus] = useState<"" | "loading" | "success" | "error">(
    "",
  );

  return (
    <Form
      method="POST"
      data-netlify="true"
      name={formName}
      className="grid grid-cols-2 gap-8 max-md:grid-cols-1"
      onSubmit={async (data) => {
        // collect form data as url string params (netlify only supports this format)
        const params = new URLSearchParams();
        for (const [key, value] of data.entries()) {
          if (typeof value !== "string") continue;
          params.append(key, value);
        }

        try {
          setStatus("loading");
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
      <TextBox
        label="Name"
        name="name"
        placeholder="Name"
        required
        value={name ?? ""}
        onChange={setName}
      />
      <TextBox
        label="Email"
        name="email"
        type="email"
        placeholder="Email"
        required
        icon={<EnvelopeIcon />}
        value={email ?? ""}
        onChange={setEmail}
      />
      <TextBox
        label="Subject"
        name="subject"
        placeholder="Subject"
        required
        value={subject ?? ""}
        onChange={setSubject}
      />
      <Select
        label="Reason"
        name="reason"
        options={reasonOptions}
        required
        value={reason ?? ""}
        onChange={setReason}
      />
      <TextBox
        label="Message"
        multi
        name="message"
        placeholder="Message"
        required
        value={message ?? ""}
        onChange={setMessage}
        className="col-span-full"
      />
      <Checkbox
        name="read-faqs"
        required
        className="col-span-full justify-self-center"
      >
        My message is not addressed by any of the FAQs
      </Checkbox>

      {!status && (
        <Button
          type="submit"
          color="critical"
          className="col-span-full w-50 justify-self-center"
        >
          <PaperPlaneIcon />
          Send
        </Button>
      )}

      {status === "loading" && (
        <Alert type="loading" className="col-span-full">
          Sending message...
        </Alert>
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
    </Form>
  );
}
