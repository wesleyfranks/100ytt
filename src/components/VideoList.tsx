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
                {thumbnails.medium && (
                  <img
                    src={thumbnails.medium.url}
                    alt={title}
                    className="w-full h-auto"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </a>
            );
          })}
      </div>
      <div>
        <p
          className="
        text-[4vw]   
      text-gray-500 
      dark:text-gray-400
        text-center
        leading-none
        mt-4
        pb-2
        "
        >
          <strong>
            Videos posted since December 31st up to March 31st, 2025.
          </strong>
        </p>
        <p
          className="
        text-1vm
       text-gray-500 
       dark:text-gray-400 
         pb-2
         "
        >
          <i>
            <strong>Videos of value</strong> are videos that are filled with
            educational content, tutorials, helpful information, and stories
            that are entertaining and fun. The videos would be something for you
            as a viewer to say,{' '}
            <strong>"I got something out of this video."</strong>.
          </i>
        </p>
      </div>
    </div>
  );
};

export default VideoList;
