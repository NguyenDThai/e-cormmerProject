"use client";

import { useEffect, useState } from "react";

const Coundown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  //   Thoi gian ket thuc flash sale
  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + 48);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
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
  }, []);
  return (
    <div className="flex gap-4 text-center">
      <div className="bg-gray-100 p-3 rounded-lg">
        <span className="text-2xl font-bold">{timeLeft.days}</span>
        <p className="text-sm">Days</p>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg">
        <span className="text-2xl font-bold">{timeLeft.hours}</span>
        <p className="text-sm">Hours</p>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg">
        <span className="text-2xl font-bold">{timeLeft.minutes}</span>
        <p className="text-sm">Minutes</p>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg">
        <span className="text-2xl font-bold">{timeLeft.seconds}</span>
        <p className="text-sm">Seconds</p>
      </div>
    </div>
  );
};

export default Coundown;
