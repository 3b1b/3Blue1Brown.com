import { writeFileSync } from "fs";

const key = process.env.YOUTUBE_API_KEY ?? "";
const channelId = "UCYO_jab_esuFRV4b17AJtAw";

// get dump of all videos in channel
export const dumpChannel = async () => {
  let nextPageToken = "";
  const videos: Record<PropertyKey, unknown>[] = [];

  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.append("key", key);
    url.searchParams.append("channelId", channelId);
    url.searchParams.append("part", "snippet");
    url.searchParams.append("order", "date");
    url.searchParams.append("type", "video");
    url.searchParams.append("maxResults", "50");
    if (nextPageToken) url.searchParams.append("pageToken", nextPageToken);

    console.debug("Fetching page");
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) throw new Error(`YouTube API Error: ${data.error.message}`);

    const results = await Promise.all(
      data.items.map(async (item: { id: { videoId: string } }) => ({
        ...item,
        short: await isShort(item.id.videoId),
      })),
    );

    videos.push(...results);

    nextPageToken = data.nextPageToken ?? "";
  } while (nextPageToken);

  return videos;
};

const isShort = async (id: string) => {
  try {
    const url = `https://www.youtube.com/shorts/${id}`;
    const response = await fetch(url);
    if (response.url !== url) throw Error("Redirected");
    if (response.status !== 200) throw Error("Not 200 status");
    return true;
  } catch {
    return false;
  }
};

writeFileSync(
  "channel-dump.json",
  JSON.stringify(await dumpChannel(), null, 2),
);
