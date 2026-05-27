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
import CheckBox from "~/components/CheckBox";
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
  let [contact, setContact] = useLocalStorage("feedback-contact", "");
  let [subject, setSubject] = useLocalStorage("feedback-subject", "");
  let [page, setPage] = useState("");
  let [message, setMessage] = useLocalStorage("feedback-message", "");

  // set fallbacks
  name ||= "";
  contact ||= "";
  username ||= "";
  subject ||= "";
  page ||= "";
  message ||= "";

  // validate username
  if (username && username.length > 0)
    username = username.replaceAll(/^@*/g, "@");

  // current page
  const { pathname, search, hash } = useLocation();
  const path = pathname + search + hash;

  // debug info
  const { userAgent: debug } = useUA();

  // feedback title
  const title = truncate(
    [subject.trim() || message.trim()].filter(Boolean).join(" | "),
    { length: 100 },
  );

  // feedback body
  const empty = "\\-";
  const body = [
    ["<details><summary>User</summary>"],
    ["**Name**", name.trim() || empty],
    ["**Username**", username.trim() || empty],
    ["**Contact**", contact.trim() || empty],
    ["</details>"],
    ["<details><summary>Debug</summary>"],
    ...Object.entries(debug).map(([key, value]) => [
      `**${startCase(key)}**`,
      value.trim() || empty,
    ]),
    ["</details>"],
    ["**Page**", page.trim() || empty],
    ["**Subject**", subject.trim() || empty],
    ["**Message**", message.trim() || empty],
  ]
    .map((row) => row.join("\n"))
    .join("\n\n");

  // fallback link
  const fallback = new URL(`${site.github.site_issues}/new`);
  fallback.searchParams.set("title", title);
  fallback.searchParams.set("body", body);

  const [status, setStatus] = useState<AlertType>("info");
  const [issueLink, setIssueLink] = useState("");

  // submit feedback
  const onSubmit = async () => {
    setStatus("loading");

    try {
      const { link } = await createIssue({
        owner: site.github.org,
        repo: site.github.site_repo,
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
        title="Site Feedback"
        trigger={
          <Button className="p-2!" aria-label="Site feedback">
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
          } else {
            // if opening
            setPage(path);
          }
        }}
      >
        {(close) => (
          <>
            <p>
              Please see{" "}
              <Link to={`${href("/about")}#faqs`} onClick={close}>
                the FAQs
              </Link>{" "}
              and{" "}
              <Link to={`${href("/about")}#contact`} onClick={close}>
                contact form
              </Link>{" "}
              first, then give us feedback about <b>this site</b>.
            </p>

            <div className="grid grid-flow-row-dense grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
              <TextBox
                label="Name"
                help="Optional. So we can address you properly."
                placeholder="Your Name"
                value={name}
                onChange={setName}
                form={id}
              />
              <TextBox
                label="GitHub Username"
                help="Optional. So we can tag you in the issue."
                placeholder="@yourname"
                value={username}
                onChange={setUsername}
                form={id}
              />
              <TextBox
                label="Contact Info"
                help="Optional. So we can follow up with you."
                placeholder="Email/phone/anything"
                value={contact}
                onChange={setContact}
                form={id}
              />
              <TextBox
                label="Subject"
                placeholder="Subject"
                required
                value={subject}
                onChange={setSubject}
                form={id}
                className="col-span-2 max-sm:col-span-1"
              />
              <TextBox
                label="Page"
                placeholder="Page"
                value={page}
                onChange={setPage}
                form={id}
              />

              <TextBox
                label="Message"
                placeholder="Bugs/corrections/suggestions/etc. about this site"
                required
                multi
                rows={5}
                value={message}
                onChange={setMessage}
                form={id}
                className="col-span-full"
              />

              <CheckBox required form={id} className="col-span-full">
                <span>
                  My message is about this site and is not addressed by the FAQs
                </span>
              </CheckBox>

              <Alert type={status} className="col-span-full">
                {status === "info" && (
                  <p>
                    This will start a <strong>public</strong> issue on{" "}
                    <Link to={site.github.site_issues}>GitHub</Link> with{" "}
                    <strong>everything above</strong> and some{" "}
                    {/* span for google translate react errors */}
                    <span>
                      <Tooltip trigger="debug info">
                        <dl className="self-center">
                          {Object.entries(debug).map(([key, value]) => (
                            <Fragment key={key}>
                              <dt>{key}</dt>
                              <dd>{value}</dd>
                            </Fragment>
                          ))}
                        </dl>
                      </Tooltip>
                    </span>
                    . You'll get a link to it once it's created, where you can
                    attach more details.
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
          </>
        )}
      </Dialog>
    </Form>
  );
}
