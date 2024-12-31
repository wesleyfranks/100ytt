import { useEffect, useState } from 'react';
import { fetchYouTubeVideos, VideoItem } from './utils/fetchYouTubeVideos';
import YouTubeProfile from './components/YouTubeProfile';
import VideoCounter from './components/VideoCounter';
import VideoList from './components/VideoList';
import { FaSun, FaMoon } from 'react-icons/fa';

function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [darkMode, setDarkMode] = useState(true); // Default dark mode to true

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
          <YouTubeProfile />

          {/* Counter */}
          <VideoCounter videoCount={videoCount} />

          {/* Video List */}
          <VideoList videos={videos} />
        </div>
      </div>
    </div>
  );
}

export default App;
