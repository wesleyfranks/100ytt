import { VideoItem } from '../utils/fetchYouTubeVideos';

const VideoList = ({ videos }: { videos: VideoItem[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => {
        const { videoId } = video.id;
        const { title, publishedAt, thumbnails } = video.snippet;

        return (
          <a
            key={videoId}
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noreferrer noopener external"
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
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
  );
};

export default VideoList;
