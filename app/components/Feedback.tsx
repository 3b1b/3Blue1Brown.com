import type { Type as AlertType } from "~/components/Alert";
import { useState } from "react";
import { href, useLocation } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { ChatTeardropDotsIcon, PaperPlaneIcon } from "@phosphor-icons/react";
import { useLocalStorage } from "@reactuses/core";
import { startCase, truncate } from "lodash-es";
import { createIssue } from "~/api/issue";
import Alert from "~/components/Alert";
import Button from "~/components/Button";
import Checkbox from "~/components/Checkbox";
import Dialog from "~/components/Dialog";
import Form from "~/components/Form";
import Link from "~/components/Link";
import TextBox from "~/components/TextBox";
import Tooltip from "~/components/Tooltip";
import site from "~/data/site.json";
import { useUA } from "~/util/hooks";
import { shorten } from "~/util/url";

// form id
const id = "feedback";

// feedback form
export default function Feedback() {
  // form state, saved to local storage
  let [name, setName] = useLocalStorage("feedback-name", "");
  let [username, setUsername] = useLocalStorage("feedback-username", "");
  let [subject, setSubject] = useLocalStorage("feedback-subject", "");
  let [message, setMessage] = useLocalStorage("feedback-message", "");

  // set fallbacks
  name ||= "";
  username ||= "";
  subject ||= "";
  message ||= "";

  // validate username
  if (username && username.length > 0)
    username = username.replaceAll(/^@*/g, "@");

  const { userAgent } = useUA();

  // extra details to include in report
  const { pathname, search, hash } = useLocation();
  const details = { Page: pathname + search + hash, ...userAgent };

  // feedback title
  const title = truncate(
    [subject.trim() || message.trim()].filter(Boolean).join(" | "),
    { length: 100 },
  );

  // feedback body
  const body = Object.entries({ name, username, ...details, message })
    .map(([key, value]) => [
      `**${startCase(key)}**`,
      value.trim() ? value.trim() : "\\-",
    ])
    .flat()
    .join("\n");

  // fallback link
  const fallback = new URL(
    `https://github.com/${site.github_org}/${site.github_repo}/issues/new`,
  );
  fallback.searchParams.set("title", title);
  fallback.searchParams.set("body", body);

  const [status, setStatus] = useState<AlertType>("info");
  const [issueLink, setIssueLink] = useState("");

  // submit feedback
  const onSubmit = async () => {
    setStatus("loading");

    try {
      const { link } = await createIssue({
        owner: site.github_org,
        repo: site.github_repo,
        title,
        body,
        labels: ["feedback"],
      });
      setStatus("success");
      setIssueLink(link);
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <Form id={id} onSubmit={onSubmit}>
      <Dialog
        title="Feedback"
        trigger={
          <Button aria-label="Give us feedback">
            <ChatTeardropDotsIcon />
          </Button>
        }
        bottomContent={
          <Button
            color="critical"
            type="submit"
            form={id}
            className="self-center"
            aria-disabled={status === "loading" || status === "success"}
          >
            Submit
            <PaperPlaneIcon />
          </Button>
        }
        onChange={(open) => {
          // if closing
          if (!open) {
            if (status === "success") {
              // reset form
              setSubject(null);
              setMessage(null);
              // reset status
              setStatus("info");
            }
            if (status === "error")
              // reset status and allow retry
              setStatus("info");
          }
        }}
      >
        <p>
          Give us feedback on <b>this site/page</b>. For anything else, see{" "}
          <Link to={`${href("/about")}#faqs`}>the FAQs</Link> and{" "}
          <Link to={`${href("/about")}#contact`}>contact form</Link>.
        </p>
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <TextBox
            label="Name"
            help="Optional. So we can address you properly."
            placeholder="Your Name"
            value={name}
            onChange={setName}
            form={id}
          />
          <TextBox
            label="Username"
            help="Optional. So we can tag you in the issue."
            placeholder="@yourname"
            value={username}
            onChange={setUsername}
            form={id}
          />
          <TextBox
            label="Subject"
            placeholder="Subject"
            required
            value={subject}
            onChange={setSubject}
            form={id}
            className="col-span-full"
          />
          <TextBox
            label="Message"
            placeholder="Corrections/suggestions/bugs/etc."
            required
            multi
            rows={5}
            value={message}
            onChange={setMessage}
            form={id}
            className="col-span-full"
          />

          <Checkbox required form={id} className="col-span-full">
            <span>
              My message is about <b>this site/page</b>
            </span>
          </Checkbox>

          <Alert type={status} className="col-span-full">
            {status === "info" && (
              <p>
                This will start a <strong>public</strong> issue on{" "}
                <Link
                  to={`https://github.com/${site.github_org}/${site.github_repo}/issues`}
                >
                  GitHub
                </Link>{" "}
                with the above and some{" "}
                <Tooltip trigger="debug info">
                  <dl className="self-center">
                    {Object.entries(details).map(([key, value]) => (
                      <Fragment key={key}>
                        <dt>{key}</dt>
                        <dd>{value}</dd>
                      </Fragment>
                    ))}
                  </dl>
                </Tooltip>
                . You'll get a link to it once it's created, where you can
                attach screenshots or more details.
              </p>
            )}
            {status === "loading" && "Submitting feedback"}
            {status === "error" && (
              <p>
                Error submitting feedback. Please try{" "}
                <Link to={fallback.toString()}>
                  submitting directly on GitHub
                </Link>
                .
              </p>
            )}
            {status === "success" && issueLink && (
              <p>
                Submitted feedback!{" "}
                <Link to={issueLink}>{shorten(issueLink)}</Link>
              </p>
            )}
          </Alert>
        </div>
      </Dialog>
    </Form>
  );
}
