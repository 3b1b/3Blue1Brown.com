import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      "https://www.patreon.com/api/campaigns/580365",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
      }
    );

    if (response.data && response.data.data) {
      const memberCount = response.data.data.attributes.patron_count;
      res.status(200).json({ memberCount });
    } else {
      res.status(500).json({ error: "Failed to fetch Patreon member count" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Patreon member count" });
  }
}