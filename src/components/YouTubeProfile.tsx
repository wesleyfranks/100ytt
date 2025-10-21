import SocialIcons from './SocialIcons';

const YouTubeProfile = () => {
  return (
    <div className="flex items-center space-x-4 mb-8 mt-8">
      <img
        src="https://yt3.googleusercontent.com/Uqy3a1GKRQAhGnovbnwiGdWc5SJXyTwFQmiQByqcC5iSWoDW8Sze7UbqCwHc9lwb45_fXKCeCQE=s160-c-k-c0x00ffffff-no-rj"
        alt="Wesley"
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h1 className="text-2xl font-bold">Wesley Franks</h1>
        <SocialIcons />
      </div>
    </div>
  );
};

export default YouTubeProfile;
