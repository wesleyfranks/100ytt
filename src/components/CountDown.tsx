import { useState, useEffect } from 'react';

const CountDown = () => {
  const totalVideosRequired = 100;
  const videosDoneSoFar = 3;

  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [videosPerDay, setVideosPerDay] = useState<number>(0);

  useEffect(() => {
    const targetDate = new Date('2025-03-31T23:59:59');

    const calculate = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setDaysLeft(0);
        setVideosPerDay(0);
        return;
      }

      const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(d);

      const remaining = totalVideosRequired - videosDoneSoFar;
      if (remaining <= 0) {
        setVideosPerDay(0);
      } else {
        // Convert .toFixed(2) string result back into a number
        const vpd = Number((remaining / d).toFixed(2));
        setVideosPerDay(vpd);
      }
    };

    calculate();
    const intervalId = setInterval(calculate, 1000 * 60 * 60); // update every hour
    return () => clearInterval(intervalId);
  }, []);

  if (daysLeft <= 0 || videosPerDay <= 0) {
    return (
      <p
        className="
          font-extrabold
          bg-gradient-to-r from-pink-400 to-yellow-400
          text-transparent
          bg-clip-text
          text-[8vw]
          md:text-6xl
          text-center
          mt-4
        "
      >
        &#x2705; Done!
      </p>
    );
  }

  return (
    <p
      className="
        font-extrabold
        bg-gradient-to-r from-pink-400 to-yellow-400
        text-transparent
        bg-clip-text
        text-[8vw]
        md:text-6xl
        text-center
        mt-4
      "
    >
      {videosPerDay}vids / Day with {daysLeft} Days left
    </p>
  );
};

export default CountDown;
