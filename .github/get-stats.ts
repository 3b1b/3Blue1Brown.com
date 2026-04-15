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
  subscribers: Number(statistics?.subscriberCount) || 0,
  views: Number(statistics?.viewCount) || 0,
  videos: Number(statistics?.videoCount) || 0,
};

// save data in appropriate place
const path = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "app",
  "pages",
  "home",
  "stats.json",
);
const data = JSON.stringify(stats, null, 2);
writeFileSync(path, data);
