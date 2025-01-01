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

export async function fetchYouTubeVideosFromCache(): Promise<VideoItem[]> {
  try {
    const res = await fetch('/youtube_videos.json'); // Fetch from cached JSON

    if (!res.ok) {
      throw new Error(`Failed to fetch cached videos: ${res.statusText}`);
    }

    // Attempt to parse JSON
    const data = await res.json();
    return data || []; // Return the parsed data or an empty array
  } catch (error) {
    console.error('Error fetching cached videos:', error);
    return []; // Return an empty array on failure
  }
}