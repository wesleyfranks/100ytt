import { useEffect, useState } from 'react';
import { fetchYouTubeVideos, VideoItem } from './utils/fetchYouTubeVideos';
import {
  FaYoutube,
  FaTwitter,
  FaInstagram,
  FaSun,
  FaMoon,
} from 'react-icons/fa';

function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const channelId = import.meta.env.VITE_YT_CHANNEL_ID;
  const publishedAfter = '2024-12-10T00:00:00Z';

  useEffect(() => {
    (async () => {
      try {
        const items = await fetchYouTubeVideos(channelId, publishedAfter);
        setVideos(items);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    })();
  }, []);

  const videoCount = videos.length;

  // Dark Mode Button Classes
  const toggleButtonClasses = darkMode
    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    : 'bg-gray-900 text-white hover:bg-gray-700';

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen p-6 font-inter bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <div className="max-w-5xl mx-auto relative">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded transition-colors ${toggleButtonClasses}`}
            aria-label="Toggle Dark Mode"
            title="Toggle Dark Mode"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-4 mb-8 mt-8">
            <img
              src="https://yt3.googleusercontent.com/8ed6g9LRSWJ2A0MOLBRTTExBVc6NCX3kB80Cj0LBdjAMM63KqFikYgfDld8pQ8eNnZ-zIw0L3g=s160-c-k-c0x00ffffff-no-rj"
              alt="Wesley"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">Wesley Franks</h1>
              <div className="flex space-x-4 mt-1 text-blue-600 dark:text-blue-400">
                <a
                  href="https://www.youtube.com/@WesleyFranks"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="YouTube Channel"
                  title="YouTube"
                  className="inline-flex items-center hover:text-blue-500 dark:hover:text-blue-300"
                >
                  <FaYoutube size={24} />
                </a>
                <a
                  href="https://x.com/wesleyfranks"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Twitter Profile"
                  title="Twitter"
                  className="inline-flex items-center hover:text-blue-500 dark:hover:text-blue-300"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://instagram.com/wesleyfranks"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Instagram Profile"
                  title="Instagram"
                  className="inline-flex items-center hover:text-blue-500 dark:hover:text-blue-300"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Large Counter Section */}
          <div className="flex flex-col items-center justify-center mb-6">
            <h2
              className="
                font-extrabold 
                bg-gradient-to-r from-purple-500 to-blue-500 
                text-transparent 
                bg-clip-text 
                leading-none 
                text-[10rem] 
                sm:text-[12rem] 
                md:text-[15rem]
              "
            >
              {videoCount}/100
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mt-2">
              Videos posted since December 10th
            </p>
          </div>

          {/* Tile-Based Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const { videoId } = video.id;
              const { title, publishedAt, thumbnails } = video.snippet;

              return (
                <a
                  key={videoId}
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noreferrer"
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
        </div>
      </div>
    </div>
  );
}

export default App;
