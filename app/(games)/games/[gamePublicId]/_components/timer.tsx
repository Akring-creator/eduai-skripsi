'use client';

import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
}
const Timer = ({ initialTime }: TimerProps) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="flex mr-4 gap-x-2 items-center">
      <Clock className="h-5 w-5" />
      {time > 0 ? <div>{formatTime(time)}</div> : <div>00:00</div>}
    </div>
  );
};

export default Timer;
