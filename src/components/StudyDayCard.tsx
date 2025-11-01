import { useState, useEffect } from 'react';
import { unitColors, exams } from '../utils/studyData';
import { toggleSession, getCompletedSessions } from '../utils/calendarUtils';

interface StudyDayCardProps {
  date: number;
  sessions: { time: string; unit: string }[];
  isWeekend: boolean;
}

export const StudyDayCard = ({ date, sessions, isWeekend }: StudyDayCardProps) => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    setCompleted(getCompletedSessions());
  }, []);
  
  const handleToggle = (sessionId: string) => {
    toggleSession(sessionId);
    setCompleted(getCompletedSessions());
  };
  
  const dayOfWeek = new Date(2025, 10, date).toLocaleDateString('en-US', { weekday: 'short' });
  const unit = sessions[0].unit;
  const color = unitColors[unit];
  const unitName = exams.find(e => e.unitCode === unit)?.unitName || '';
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all duration-300 ${isWeekend ? 'border-2 border-yellow-400' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-2xl font-bold text-gray-800">{date}</div>
          <div className="text-xs text-gray-500">{dayOfWeek}</div>
        </div>
        <div className="px-2 py-1 rounded text-xs font-semibold text-right" style={{ backgroundColor: color }}>
          <div>{unit}</div>
          <div className="text-[10px] mt-1 opacity-90">{unitName}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        {sessions.map((session, idx) => {
          const sessionId = `${date}-${idx}`;
          const isCompleted = completed.has(sessionId);
          
          return (
            <div 
              key={idx}
              onClick={() => handleToggle(sessionId)}
              className={`p-2 rounded cursor-pointer transition-all ${isCompleted ? 'bg-green-100 line-through' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className="text-xs font-medium text-gray-700">{session.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
