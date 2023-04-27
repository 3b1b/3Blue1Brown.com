export default async function handler(req, res) {
  const bearerToken = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN;
  const screenName = '3blue1brown';
  const apiUrl = `https://api.twitter.com/1.1/users/show.json?screen_name=${screenName}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${bearerToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      const followerCount = data.followers_count;
      res.status(200).json({ followerCount });
    } else {
      console.error('Error fetching Twitter follower count:', data);
      res.status(response.status).json({ message: 'Error fetching Twitter follower count' });
    }
  } catch (error) {
    console.error('Error fetching Twitter follower count:', error.message);
    res.status(500).json({ message: 'Error fetching Twitter follower count' });
  }
}
