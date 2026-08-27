'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetDate: string | Date;
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownProps> = ({ targetDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    isEndingSoon: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false, isEndingSoon: false });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isEndingSoon: false });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      const isEndingSoon = difference <= 5 * 60 * 1000; // < 5 mins

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false, isEndingSoon });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
        <Clock className="w-3.5 h-3.5 mr-1" /> AUCTION ENDED
      </span>
    );
  }

  if (timeLeft.isEndingSoon) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 live-pulse">
        <Clock className="w-3.5 h-3.5 mr-1 animate-spin" /> ENDING SOON — {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
      <Clock className="w-3.5 h-3.5 mr-1" />
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
    </span>
  );
};
