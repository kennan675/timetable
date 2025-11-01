import { useState, useEffect } from 'react';
import { getCompletedSessions } from '../utils/calendarUtils';

export const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const updateProgress = () => {
      const completed = getCompletedSessions();
      const totalSessions = 90; // 30 days with varying sessions
      const percentage = (completed.size / totalSessions) * 100;
      setProgress(Math.min(percentage, 100));
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Study Progress</span>
        <span className="font-bold">{progress.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
