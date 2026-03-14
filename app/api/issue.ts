import { request } from "~/api";
import site from "~/data/site.json";

// cloud func
const url = site.issues;

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
