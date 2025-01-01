import CountDown from './CountDown';

const VideoCounter = ({ videoCount }: { videoCount: number }) => {
  return (
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

      {/* Countdown */}
      <CountDown />
      <p className="text-xl text-gray-500 dark:text-gray-400">
        {videoCount} <strong>Videos of Value</strong> posted since December 11th
        up to March 31st, 2025.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-96 mt-6">
        <i>
          <strong>videos of value</strong> are videos that are filled with
          educational content, tutorials, helpful information, and stories that are entertaining and fun.
          The videos would be something for you as a viewer to say, <strong>"I got something out of this video."</strong>.
        </i>
      </p>
    </div>
  );
};

export default VideoCounter;
