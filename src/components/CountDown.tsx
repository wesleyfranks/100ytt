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
    flex flex-col items-center justify-center mb-6
    text-[4rem] sm:text-[5rem] font-semibold text-gray-500 dark:text-gray-400"
    >
      {daysLeft} days left
    </p>
  );
};

export default CountDown;
