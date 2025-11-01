import { useState, useEffect } from 'react';
import { getCompletedSessions } from '../utils/calendarUtils';

export const StatsCard = () => {
  const [stats, setStats] = useState({ completed: 0, total: 90, hours: 0 });
  
  useEffect(() => {
    const updateStats = () => {
      const completed = getCompletedSessions();
      const weekdayHours = 21 * 4; // 21 weekdays * ~4 hours each
      const weekendHours = 9 * 8; // 9 weekend days * ~8 hours each
      const totalHours = weekdayHours + weekendHours;
      const completedHours = (completed.size / 90) * totalHours;
      
      setStats({
        completed: completed.size,
        total: 90,
        hours: Math.round(completedHours)
      });
    };
    
    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-yellow-300">{stats.completed}</div>
        <div className="text-sm text-blue-200 mt-2">Sessions Completed</div>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-green-300">{stats.hours}h</div>
        <div className="text-sm text-blue-200 mt-2">Study Hours Done</div>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-pink-300">{stats.total - stats.completed}</div>
        <div className="text-sm text-blue-200 mt-2">Sessions Remaining</div>
      </div>
    </div>
  );
};
