import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import _languages from "../app/data/languages.json";

// node/server script to fetch which lessons have dubbed audio in each language,
// by reading the corresponding YouTube playlist for each language, and to
// fetch translated titles/descriptions via the video localizations API

const __dir = dirname(fileURLToPath(import.meta.url));
const lessonsDir = join(__dir, "..", "app", "pages", "lessons");

const { YOUTUBE_API_KEY = "" } = process.env;

const youtube = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

// build map of YouTube video ID → lesson slug from MDX frontmatter
function buildVideoMap(): Record<string, string> {
  const videoToLesson: Record<string, string> = {};

  for (const year of readdirSync(lessonsDir)) {
    if (!/^20\d\d$/.test(year)) continue;
    const yearDir = join(lessonsDir, year);

    for (const slug of readdirSync(yearDir)) {
      const mdxPath = join(yearDir, slug, "index.mdx");
      try {
        const content = readFileSync(mdxPath, "utf-8");
        const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
        const videoId = frontmatter.match(/^video:\s*(\S+)/m)?.[1]?.trim();
        if (videoId) videoToLesson[videoId] = slug;
      } catch {
        // file missing or unreadable
      }
    }
  }

  return videoToLesson;
}

// fetch all video IDs from a playlist (handles pagination)
async function fetchPlaylistVideos(playlistId: string): Promise<string[]> {
  const videoIds: string[] = [];
  let pageToken: string | undefined;

  do {
    const response = await youtube.playlistItems.list({
      part: ["contentDetails"],
      playlistId,
      maxResults: 50,
      pageToken,
    });

    for (const item of response.data.items ?? []) {
      const videoId = item.contentDetails?.videoId;
      if (videoId) videoIds.push(videoId);
    }

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return videoIds;
}

const videoToLesson = buildVideoMap();

// collect video IDs per language and all unique IDs across all playlists
const languageVideoIds: Record<string, string[]> = {};
const allVideoIds = new Set<string>();

for (const [code, { playlist }] of Object.entries(_languages)) {
  const videoIds = await fetchPlaylistVideos(playlist);
  languageVideoIds[code] = videoIds;
  for (const id of videoIds) allVideoIds.add(id);
}

// build language index (lesson slug arrays per language code)
const index: Record<string, string[]> = {};

for (const [code, videoIds] of Object.entries(languageVideoIds)) {
  index[code] = videoIds
    .map((id) => videoToLesson[id])
    .filter((slug): slug is string => !!slug);

  console.log(`${code}: ${index[code].length} lessons`);
}

// batch-fetch video localizations (translated titles + descriptions) for all
// unique video IDs that map to a known lesson, 50 at a time
type LocalizationEntry = { title: string; description: string };
const localizations: Record<string, Record<string, LocalizationEntry>> = {};

const knownVideoIds = [...allVideoIds].filter((id) => videoToLesson[id]);

for (let i = 0; i < knownVideoIds.length; i += 50) {
  const batch = knownVideoIds.slice(i, i + 50);
  const response = await youtube.videos.list({
    part: ["localizations"],
    id: batch,
  });

  for (const video of response.data.items ?? []) {
    if (!video.id || !video.localizations) continue;
    const slug = videoToLesson[video.id];
    if (!slug) continue;

    localizations[slug] = {};
    for (const [lang, loc] of Object.entries(video.localizations)) {
      if (!loc.title) continue;
      localizations[slug][lang] = {
        title: loc.title,
        description: loc.description?.split("\n")[0] ?? "",
      };
    }
  }
}

console.log(`localizations: ${Object.keys(localizations).length} lessons`);

const indexPath = join(lessonsDir, "language-index.json");
writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");
console.log("Written to", indexPath);

const locPath = join(lessonsDir, "localizations.json");
writeFileSync(locPath, JSON.stringify(localizations, null, 2) + "\n");
console.log("Written to", locPath);
