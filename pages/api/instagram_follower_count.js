export default async function handler(req, res) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const apiUrl = `https://graph.instagram.com/me?fields=followers_count&access_token=${accessToken}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      const followerCount = data.followers_count;
      res.status(200).json({ followerCount });
    } else {
      res
        .status(response.status)
        .json({ message: "Error fetching Instagram follower count" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching Instagram follower count" });
  }
}
