import CountDown from './CountDown';

const VideoCounter = ({ videoCount }: { videoCount: number }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-6 leading-none">
      
      <h2
        className="
        font-extrabold 
        bg-gradient-to-r from-purple-500 to-blue-500 
        text-transparent 
        bg-clip-text 
        leading-[.9]
        text-[20vw]       
        overflow-hidden  
        whitespace-nowrap
  "
      >
        {videoCount}/100
      </h2>

      {/* Countdown */}
      <CountDown />
    </div>
  );
};

export default VideoCounter;
