import { request } from "~/api";

// cloud func
const url = "https://xxx.us-central1.run.app";

// see /cloud/issue
type Body = {
  owner: string;
  repo: string;
  title: string;
  body: string;
  labels: string[];
};

// create issue in repo
export const createIssue = async (body: Body) => {
  // https://docs.github.com/en/rest/issues/issues#create-an-issue
  const created = await request<{ html_url: string }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { link: created.html_url };
};
