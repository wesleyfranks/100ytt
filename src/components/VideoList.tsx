import { VideoItem } from '../utils/fetchYouTubeVideos';

const VideoList = ({ videos }: { videos: VideoItem[] }) => {
  // Sort videos by published date (oldest first)
  const sortedVideos = [...videos].sort(
    (a, b) =>
      new Date(a.snippet.publishedAt).getTime() -
      new Date(b.snippet.publishedAt).getTime()
  );

  return (
    <div>
      {/* If there are no videos, display a message */}
      {sortedVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
          <h3 className="text-2xl font-bold">No Vids Yet</h3>
          <p className="text-3xl">(-_-)</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render videos in reverse order for newest on top */}
          {sortedVideos
            .slice() // Create a copy of the sorted array
            .reverse() // Reverse it for rendering
            .map((video, index) => {
              // Calculate the number based on the original sorted array
              const originalIndex = sortedVideos.length - 1 - index;
              const { videoId } = video.id;
              const { title, publishedAt, thumbnails } = video.snippet;

              return (
                <a
                  key={videoId}
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noreferrer noopener external"
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden relative"
                >
                  {/* Video number in the top-left corner */}
                  <div
                    className="absolute top-2 left-2 bg-gray-800 text-white text-sm md:text-base font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
                    }}
                  >
                    {originalIndex + 1}
                  </div>

                  {/* Thumbnail */}
                  {thumbnails.medium && (
                    <img
                      src={thumbnails.medium.url}
                      alt={title}
                      className="w-full h-auto"
                    />
                  )}

                  {/* Title and Date Container */}
                  <div className="p-4 relative h-28">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {title}
                    </h3>

                    {/* Published Date */}
                    <p
                      className="absolute bottom-2 right-2 text-sm text-white bg-black bg-opacity-70 px-2 py-1 rounded"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                    >
                      {new Date(publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default VideoList;