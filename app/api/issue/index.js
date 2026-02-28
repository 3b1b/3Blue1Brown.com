/* eslint-disable */
// @ts-nocheck

const functions = require("@google-cloud/functions-framework");
const { Octokit } = require("octokit");

/**
 * token permissions:
 * contents, read/write
 * pull requests, read/write
 */
const auth = process.env.GITHUB_TOKEN;

// entry point
functions.http("entrypoint", async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "OPTIONS, POST");
  response.set("Access-Control-Allow-Headers", "Accept, Content-Type");

  // handle pre-flight
  if (request.method == "OPTIONS") return response.status(200).send();

  let octokit;
  try {
    // auth with github
    octokit = new Octokit({ auth });
  } catch (error) {
    // https://github.com/octokit/request-error.js
    return response
      .status(error.status)
      .send(`Couldn't authenticate with GitHub: ${error.message}`);
  }

  // get params
  const { owner, repo, title, body, labels } = request.body || {};

  // check for missing params
  const missing = [];
  if (!owner) missing.push("owner");
  if (!repo) missing.push("repo");
  if (!title) missing.push("title");
  if (!body) missing.push("body");
  if (!labels) missing.push("labels");
  if (missing.length)
    return response.status(400).send(`Missing params: ${missing.join(", ")}`);

  // create issue
  let issue;
  try {
    issue = (
      await octokit.rest.issues.create({
        owner,
        repo,
        title,
        body,
        labels,
      })
    ).data;
  } catch (error) {
    // https://github.com/octokit/request-error.js
    return response
      .status(error.status || 500)
      .send(`Couldn't create issue: ${error.message}`);
  }

  // return created issue
  return response.status(200).json(issue);
});
