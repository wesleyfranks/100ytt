export type VideoItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      medium?: { url: string };
    };
  };
};

export async function fetchYouTubeVideos(
  channelId: string,
  publishedAfter: string
): Promise<VideoItem[]> {
  const apiKey = import.meta.env.VITE_YT_API_KEY; // from .env

  if (!apiKey) {
    throw new Error('Missing VITE_YT_API_KEY in .env');
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.append('key', apiKey);
  url.searchParams.append('channelId', channelId);
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('order', 'date');
  url.searchParams.append('maxResults', '50');
  url.searchParams.append('publishedAfter', publishedAfter);
  url.searchParams.append('type', 'video');

  const res = await fetch(url.toString());
  const data = await res.json();
  return data.items || [];
}
