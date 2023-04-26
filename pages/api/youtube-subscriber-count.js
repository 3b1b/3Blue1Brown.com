import axios from 'axios';

export default async function handler(req, res) {
  const channelId = 'UCYO_jab_esuFRV4b17AJtAw';
  const apiKey = process.env.YOUTUBE_API_KEY;
  const apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const subscriberCount = response.data.items[0].statistics.subscriberCount;
    res.status(200).json({ subscriberCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching YouTube subscriber count' });
  }
}