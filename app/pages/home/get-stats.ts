import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

// node/server script to fetch current channel stats

const channel = "@3blue1brown";

const { YOUTUBE_API_KEY = "" } = process.env;

// set up youtube api client
const youtube = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

// get stats data from api
const response = await youtube.channels.list({
  part: ["statistics"],
  forHandle: channel,
});

// first result stats
const statistics = response.data.items?.[0]?.statistics;

// keep relevant fields
const stats = {
  subscribers: statistics?.subscriberCount ?? 0,
  views: statistics?.viewCount ?? 0,
  videos: statistics?.videoCount ?? 0,
};

// save data next to this file
writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "stats.json"),
  JSON.stringify(stats, null, 2),
);
