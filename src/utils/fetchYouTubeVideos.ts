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

export async function fetchVideosFromJSON() {
  const filterDate = new Date('2024-12-31T00:00:00Z'); // Set the filter date

  try {
    const response = await fetch('/videos.json');
    const data = await response.json();

    // Filter videos based on the `publishedAt` date
    const filteredVideos = data.filter((video: VideoItem) => {
      const publishedAt = new Date(video.snippet.publishedAt);
      return publishedAt > filterDate;
    });

    return filteredVideos; // Return only the filtered videos
  } catch (error) {
    console.error('Error fetching videos from JSON file:', error);
    throw error;
  }
}