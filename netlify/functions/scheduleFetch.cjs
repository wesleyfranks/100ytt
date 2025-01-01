const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const res = await fetch(`${process.env.URL}/.netlify/functions/fetchYouTubeVideos`);
    if (!res.ok) {
      throw new Error('Failed to trigger fetchYouTubeVideos function');
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Scheduled fetch triggered successfully!' }),
    };
  } catch (error) {
    console.error('Error triggering scheduled fetch:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to trigger scheduled fetch' }),
    };
  }
};