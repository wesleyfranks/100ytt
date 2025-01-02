import { useState, useEffect } from 'react';

const CountDown = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const targetDate = new Date('2025-03-31T23:59:59'); // Target date

    const calculateDaysLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setDaysLeft(0);
        return;
      }

      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
    };

    calculateDaysLeft(); // Run once on mount
    const intervalId = setInterval(calculateDaysLeft, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <p
      className="
        font-extrabold 
        bg-gray-500 
        text-transparent 
        bg-clip-text 
        text-[10vw]      
        whitespace-nowrap
        leading-[1.1]
        "
    >
      {daysLeft > 0 ? `${daysLeft} days left` : 'Countdown Complete'}
    </p>
  );
};

export default CountDown;
