import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { orderBy } from "lodash-es";
import { PatreonCreatorClient, QueryBuilder } from "patreon-api.ts";

// node/server script to fetch all current and past patreon patrons

// patreon campaign id
const campaignId = "580365";

const {
  PATREON_CLIENT_ID = "",
  PATREON_CLIENT_SECRET = "",
  PATREON_CREATOR_ACCESS_TOKEN = "",
  PATREON_CREATOR_REFRESH_TOKEN = "",
} = process.env;

// set up patreon api client
const client = new PatreonCreatorClient({
  oauth: {
    clientId: PATREON_CLIENT_ID,
    clientSecret: PATREON_CLIENT_SECRET,
    token: {
      access_token: PATREON_CREATOR_ACCESS_TOKEN,
      refresh_token: PATREON_CREATOR_REFRESH_TOKEN,
    },
  },
});

// get member data from api
const { data } = await client.fetchCampaignMembers(
  campaignId,
  QueryBuilder.campaignMembers
    .setAttributes({
      member: ["full_name", "patron_status", "campaign_lifetime_support_cents"],
    })
    .setRequestOptions({ count: 100 }),
);

// keep relevant fields
let members = data.map((member) => ({
  name: member.attributes.full_name,
  active: member.attributes.patron_status === "active_patron",
  amount: member.attributes.campaign_lifetime_support_cents,
}));

// sort by amount and active status
members = orderBy(
  members,
  ["amount", "active", "name"],
  ["desc", "desc", "asc"],
);

// remove amount for privacy
members.forEach((member) => (member.amount = 0));

// save data next to this file
writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "patrons.json"),
  JSON.stringify(members, null, 2),
);
