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
      <p className="text-xl text-gray-500 dark:text-gray-400 mt-2">
        Videos posted since December 10th up to March 31st, 2025.
      </p>
    </div>
  );
};

export default VideoCounter;
