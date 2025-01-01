const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.YT_API_KEY;
  const channelId = process.env.YT_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.error('Environment variables are missing');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing YT_API_KEY or YT_CHANNEL_ID environment variables' }),
    };
  }

  const publishedAfter = '2024-12-31T00:00:00Z';
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.append('key', apiKey);
  url.searchParams.append('channelId', channelId);
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('order', 'date');
  url.searchParams.append('maxResults', '50');
  url.searchParams.append('publishedAfter', publishedAfter);
  url.searchParams.append('type', 'video');

  try {
    console.log('Fetching data from YouTube API:', url.toString());
    const res = await fetch(url.toString());

    if (!res.ok) {
      const errorData = await res.json();
      console.error('YouTube API Error:', errorData.error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: errorData.error.message }),
      };
    }

    const data = await res.json();
    const filePath = path.resolve(__dirname, '../../public/youtube_videos.json');

    // Ensure valid JSON is always written
    fs.writeFileSync(filePath, JSON.stringify(data.items || [], null, 2));

    console.log('Fetched and saved YouTube videos successfully!');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Videos fetched successfully!' }),
    };
  } catch (error) {
    console.error('Error fetching videos:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch videos' }),
    };
  }
};