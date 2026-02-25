import { writeFileSync } from "fs";
import { orderBy } from "lodash-es";

const campaignId = "580365";
const token = process.env.PATREON_KEY;

const api = "https://www.patreon.com/api/oauth2/v2";
const headers = { Authorization: `Bearer ${token}` };

// list of members
let members = [];

// request url
const url = new URL(`${api}/campaigns/${campaignId}/members`);

// pagination
let cursor;
do {
  if (cursor) url.searchParams.set("page[cursor]", cursor);

  // make request
  const { data = [], meta = {} } = await (await fetch(url, { headers })).json();

  // for each member
  for (const { attributes } of data)
    members.push({
      name: attributes.full_name,
      active: attrs.patron_status === "active_patron",
      amount: lifetimeCents,
    });

  // next page
  cursor = meta.pagination?.cursors?.next;
} while (cursor);

// sort by amount and active status
members = orderBy(members, ["amount", "active"], ["desc", "desc"]);

// remove amount for privacy
members.forEach((member) => delete member.amount);

// save
writeFileSync("patrons.json", JSON.stringify(members, null, 2));
