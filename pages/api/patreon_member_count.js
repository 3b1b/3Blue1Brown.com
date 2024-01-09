export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://www.patreon.com/api/campaigns/580365",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
      }
    );

    const data = await response.json();

    if (data && data.data) {
      const followerCount = data.data.attributes.patron_count;
      res.status(200).json({ followerCount });
    } else {
      res.status(500).json({ error: "Failed to fetch Patreon member count" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Patreon member count" });
  }
}
