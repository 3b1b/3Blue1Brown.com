import { useState } from "react";
import { href, useLocation } from "react-router";
import { Fragment } from "react/jsx-runtime";
import {
  ChatTeardropDotsIcon,
  DownloadSimpleIcon,
  PaperPlaneIcon,
} from "@phosphor-icons/react";
import { useLocalStorage } from "@reactuses/core";
import { startCase, truncate } from "lodash-es";
import { createIssue } from "~/api/issue";
import Alert from "~/components/Alert";
import Button from "~/components/Button";
import Collapsible from "~/components/Collapsible";
import Dialog from "~/components/Dialog";
import Form from "~/components/Form";
import Help from "~/components/Help";
import Link from "~/components/Link";
import Textbox from "~/components/Textbox";
import site from "~/data/site.yaml";
import { downloadJpg } from "~/util/download";
import { useDebug } from "~/util/hooks";
import { shortenUrl } from "~/util/string";

// form id
const id = "feedback";

// feedback form on every page
export default function Feedback() {
  // form state, saved to local storage
  let [name, setName] = useLocalStorage("feedback-name", "");
  let [username, setUsername] = useLocalStorage("feedback-username", "");
  let [subject, setSubject] = useLocalStorage("feedback-subject", "");
  let [feedback, setFeedback] = useLocalStorage("feedback-body", "");

  // set fallbacks
  name ||= "";
  username ||= "";
  subject ||= "";
  feedback ||= "";

  // validate username
  if (username && username.length > 0)
    username = username.replaceAll(/^@*/g, "@");

  const { userAgent } = useDebug();

  // extra details to include in report
  const { pathname, search, hash } = useLocation();
  const details = { Page: pathname + search + hash, ...userAgent };

  // feedback title
  const title = truncate(
    [subject.trim() || feedback.trim()].filter(Boolean).join(" | "),
    { length: 100 },
  );

  // feedback body
  const body = Object.entries({ name, username, ...details, feedback })
    .map(([key, value]) => [
      `**${startCase(key)}**`,
      value.trim() ? value.trim() : "\\-",
    ])
    .flat()
    .join("\n");

  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error" | string
  >("idle");
  const [issueLink, setIssueLink] = useState("");

  // submit feedback
  const onSubmit = async () => {
    setStatus("pending");

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
          <Button color="light" aria-label="Give us feedback">
            <ChatTeardropDotsIcon />
          </Button>
        }
        onChange={(open) => {
          if (open && (status === "success" || status === "error")) {
            if (status === "success") {
              setSubject(null);
              setFeedback(null);
            }
          }
        }}
        bottomContent={
          <>
            <div className="flex flex-wrap gap-2">
              <Button
                color="light"
                onClick={async () => {
                  close();
                  await downloadJpg(document.body, "screenshot");
                  open();
                }}
              >
                Screenshot
                <DownloadSimpleIcon />
              </Button>
              <Help>
                <div>
                  This can help us troubleshoot issues. Currently, we can't{" "}
                  <i>automatically</i> attach a screenshot with your feedback,
                  so you'll have to download and attach/send it manually.
                </div>
              </Help>
            </div>

            <div className="grow" />

            {status === "idle" && (
              <Button color="critical" type="submit" form={id}>
                Submit
                <PaperPlaneIcon />
              </Button>
            )}
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <div className="flex flex-col">
            <label>
              <div className="flex items-center gap-2">
                Name <Help>Optional. So we know who you are.</Help>
              </div>
              <Textbox
                placeholder="Your Name"
                value={name}
                onChange={setName}
                form={id}
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              <div className="flex items-center gap-2">
                Username <Help>Optional. So we can tag you in the post.</Help>
              </div>
              <Textbox
                placeholder="@yourname"
                value={username}
                onChange={setUsername}
                form={id}
              />
            </label>
          </div>

          <label className="col-span-2">
            <div className="flex items-center gap-2">Subject</div>
            <Textbox
              placeholder="Subject"
              required
              value={subject}
              onChange={setSubject}
              form={id}
            />
          </label>
          <label className="col-span-2">
            <div className="flex items-center gap-2">Feedback</div>
            <Textbox
              placeholder="Corrections, suggestions, bugs, etc."
              required
              multi
              rows={5}
              value={feedback}
              onChange={setFeedback}
              form={id}
            />
          </label>
        </div>

        <Collapsible title="Debug" className="self-center">
          <dl className="self-center">
            {Object.entries(details).map(([key, value]) => (
              <Fragment key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </Fragment>
            ))}
          </dl>
        </Collapsible>

        <Alert
          type={
            status === "pending"
              ? "loading"
              : status === "error"
                ? "error"
                : status === "success"
                  ? "success"
                  : "info"
          }
        >
          {status === "idle" && (
            <p>
              Submitting will start a <strong>public</strong>{" "}
              <Link
                to={`https://github.com/${site.github_org}/${site.github_repo}/issues`}
              >
                issue on our GitHub
              </Link>{" "}
              with <strong>all of the information above</strong>. You'll get a
              link to it once it's created.
            </p>
          )}
          {status === "pending" && "Submitting feedback"}
          {status === "error" && (
            <p>
              Error submitting feedback.
              <Link to={href("/about")}>Please contact us directly</Link>.
            </p>
          )}
          {status === "success" && issueLink && (
            <p>
              Submitted feedback!{" "}
              <Link to={issueLink}>{shortenUrl(issueLink)}</Link>
            </p>
          )}
        </Alert>
      </Dialog>
    </Form>
  );
}
