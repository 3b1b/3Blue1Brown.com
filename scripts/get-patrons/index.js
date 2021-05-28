// packages
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const { parse, stringify } = require("yaml");
const sort = require("array-sort");

const script = async () => {
  // request params
  const params = new URLSearchParams();
  const fields =
    "full_name,pledge_relationship_start,last_charge_date,lifetime_support_cents,currently_entitled_amount_cents";
  params.set("fields[member]", fields);
  params.set("page[size]", "1000");

  // assemble request url
  const api = "https://www.patreon.com/api/oauth2/v2";
  const campaignId = "580365";
  let request = `${api}/campaigns/${campaignId}/members?${params.toString()}`;

  // request headers
  const { PATREON_ACCESS_TOKEN } = process.env;
  const headers = { Authorization: `Bearer ${PATREON_ACCESS_TOKEN}` };

  // master list of patrons to export
  let patrons = [];

  // hard limit on requests
  for (let page = 1; page < 20; page++) {
    // show progress
    console.log(`Page: ${page}`);

    // make request for current page
    const { data, links, meta } = await (
      await fetch(request, { headers })
    ).json();

    // show progress
    console.log(`Total patrons: ${meta.pagination.total}`);
    console.log(`Patrons on this page: ${data.length}`);

    // go through all patrons on page
    for (const { attributes } of data) {
      // rename and process api values and add to master list of patrons
      // https://docs.patreon.com/?shell#member
      patrons.push({
        name: (attributes.full_name || "").trim(),
        start: attributes.pledge_relationship_start || "",
        end: attributes.last_charge_date || "",
        amount: Math.ceil((attributes.lifetime_support_cents || 0) / 100),
      });
    }

    // go to next page of results or exit
    const next = links?.next;
    if (next) request = next;
    else break;
  }

  // filter patrons to save some space
  console.log(`Total patrons: ${patrons.length}`);
  patrons = patrons.filter(({ amount }) => amount > 0);
  console.log(`Final filtered patrons: ${patrons.length}`);

  // sort patrons for less hugo processing
  patrons = sort(patrons, ["amount", "end"], { reverse: true });

  // override names
  const overrides = parse(fs.readFileSync("name-overrides.yaml", "utf-8"));
  for (const [key, value] of Object.entries(overrides)) {
    const match = patrons.find(({ name }) => name.trim() === key.trim());
    match.name = value;
  }

  // export patrons to yaml
  fs.writeFileSync("../../data/patrons.yaml", stringify(patrons));
};

script();
