"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  endTime: string | Date;
  onExpire?: () => void;
}

const Coundown = ({ endTime, onExpire }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const targetDate = new Date(endTime);
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        onExpire?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (isExpired) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
        <span className="text-gray-500 font-medium">Flash Sale đã kết thúc</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4 text-center">
      <div className="bg-red-500 text-white p-3 rounded-lg min-w-[60px]">
        <span className="text-2xl font-bold block">{timeLeft.days}</span>
        <p className="text-sm">Ngày</p>
      </div>
      <div className="bg-red-500 text-white p-3 rounded-lg min-w-[60px]">
        <span className="text-2xl font-bold block">{timeLeft.hours}</span>
        <p className="text-sm">Giờ</p>
      </div>
      <div className="bg-red-500 text-white p-3 rounded-lg min-w-[60px]">
        <span className="text-2xl font-bold block">{timeLeft.minutes}</span>
        <p className="text-sm">Phút</p>
      </div>
      <div className="bg-red-500 text-white p-3 rounded-lg min-w-[60px]">
        <span className="text-2xl font-bold block">{timeLeft.seconds}</span>
        <p className="text-sm">Giây</p>
      </div>
    </div>
  );
};

export default Coundown;
