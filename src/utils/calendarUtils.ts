import { exams } from './studyData';

export const generateNovemberCalendar = () => {
  const calendar = [];
  const units = exams.map(e => e.unitCode);
  
  for (let day = 1; day <= 30; day++) {
    const date = new Date(2025, 10, day); // November 2025
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const unitIndex = (day - 1) % units.length;
    const unit = units[unitIndex];
    
    if (isWeekend) {
      calendar.push({
        date: day,
        sessions: [
          { time: '10:00 AM - 1:00 PM', unit },
          { time: '2:00 PM - 6:00 PM', unit },
          { time: '8:00 PM - 12:00 AM', unit }
        ],
        isWeekend: true
      });
    } else {
      calendar.push({
        date: day,
        sessions: [{ time: '7:30 PM - Sleep', unit }],
        isWeekend: false
      });
    }
  }
  
  return calendar;
};

export const getCompletedSessions = (): Set<string> => {
  const stored = localStorage.getItem('completedSessions');
  return new Set(stored ? JSON.parse(stored) : []);
};

export const toggleSession = (sessionId: string) => {
  const completed = getCompletedSessions();
  if (completed.has(sessionId)) {
    completed.delete(sessionId);
  } else {
    completed.add(sessionId);
  }
  localStorage.setItem('completedSessions', JSON.stringify([...completed]));
};
