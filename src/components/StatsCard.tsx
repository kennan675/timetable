import { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const StatsCard = () => {
  const { studyPlan, subjects } = useAppContext();
  const [stats, setStats] = useState({ completed: 0, total: 0, hours: 0 });

  // Calculate total study hours from plan
  const totalHours = useMemo(() => {
    if (!studyPlan) return 0;
    let minutes = 0;
    studyPlan.schedule.forEach(day => {
      day.tasks.forEach(task => {
        minutes += task.duration_minutes;
      });
    });
    return Math.round(minutes / 60);
  }, [studyPlan]);

  useEffect(() => {
    const updateStats = () => {
      if (!studyPlan) {
        setStats({ completed: 0, total: 0, hours: 0 });
        return;
      }

      // Get completed tasks from localStorage
      const saved = localStorage.getItem('completedTasks');
      const completedTasks = saved ? new Set(JSON.parse(saved)) : new Set();

      // Count total tasks and completed hours
      let total = 0;
      let completed = 0;
      let completedMinutes = 0;

      studyPlan.schedule.forEach(day => {
        day.tasks.forEach((task, tIdx) => {
          const taskId = `${day.date}-${tIdx}`;
          total++;
          if (completedTasks.has(taskId)) {
            completed++;
            completedMinutes += task.duration_minutes;
          }
        });
      });

      setStats({
        completed,
        total,
        hours: Math.round(completedMinutes / 60)
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [studyPlan]);

  if (!studyPlan) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-yellow-300">-</div>
          <div className="text-sm text-blue-200 mt-2">Sessions Completed</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-green-300">-</div>
          <div className="text-sm text-blue-200 mt-2">Study Hours Done</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-pink-300">{subjects.length || '-'}</div>
          <div className="text-sm text-blue-200 mt-2">Subjects</div>
        </div>
      </div>
    );
  }

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
