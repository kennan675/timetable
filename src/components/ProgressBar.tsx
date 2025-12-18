import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const ProgressBar = () => {
  const { studyPlan } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    const updateProgress = () => {
      if (!studyPlan) {
        setProgress(0);
        setStats({ completed: 0, total: 0 });
        return;
      }

      // Get completed tasks from localStorage
      const saved = localStorage.getItem('completedTasks');
      const completedTasks = saved ? new Set(JSON.parse(saved)) : new Set();

      // Count total tasks
      let total = 0;
      let completed = 0;
      studyPlan.schedule.forEach(day => {
        day.tasks.forEach((_, tIdx) => {
          const taskId = `${day.date}-${tIdx}`;
          total++;
          if (completedTasks.has(taskId)) {
            completed++;
          }
        });
      });

      const percentage = total > 0 ? (completed / total) * 100 : 0;
      setProgress(Math.min(percentage, 100));
      setStats({ completed, total });
    };

    updateProgress();
    // Listen for storage changes
    const handleStorage = () => updateProgress();
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(updateProgress, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [studyPlan]);

  if (!studyPlan) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <p className="text-blue-200 text-sm">No study plan generated yet</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-blue-200">Study Progress</span>
        <span className="font-bold text-yellow-300">{progress.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-blue-200 mt-1 text-center">
        {stats.completed} of {stats.total} tasks completed
      </p>
    </div>
  );
};
