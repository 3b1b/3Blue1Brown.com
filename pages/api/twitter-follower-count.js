import axios from 'axios';

export default async function handler(req, res) {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  const screenName = '3blue1brown';
  const apiUrl = `https://api.twitter.com/2/users/${screenName}?user.fields=public_metrics`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      },
    });
    const followerCount = response.data.followers_count;
    res.status(200).json({ followerCount });
  } catch (error) {
    console.error('Error fetching Twitter follower count:', error.message, error.response && error.response.data);
    res.status(500).json({ message: 'Error fetching Twitter follower count' });
  }
}
