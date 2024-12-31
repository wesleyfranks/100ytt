import SocialIcons from './SocialIcons';

const YouTubeProfile = () => {
  return (
    <div className="flex items-center space-x-4 mb-8 mt-8">
      <img
        src="https://yt3.googleusercontent.com/8ed6g9LRSWJ2A0MOLBRTTExBVc6NCX3kB80Cj0LBdjAMM63KqFikYgfDld8pQ8eNnZ-zIw0L3g=s160-c-k-c0x00ffffff-no-rj"
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
