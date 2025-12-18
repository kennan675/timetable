import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const CountdownTimer = () => {
  const { getFirstExamDate, subjects } = useAppContext();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [examName, setExamName] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const firstExamDate = getFirstExamDate();

      if (!firstExamDate) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setExamName('');
        return;
      }

      // Find the name of the first exam
      const now = new Date();
      const upcoming = subjects
        .filter(s => s.examDate !== 'TBD')
        .map(s => ({ name: s.name, date: new Date(s.examDate) }))
        .filter(s => s.date > now)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      if (upcoming.length > 0) {
        setExamName(upcoming[0].name);
      }

      const diff = firstExamDate.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [getFirstExamDate, subjects]);

  return (
    <div className="text-center">
      {examName && (
        <p className="text-blue-200 text-sm mb-2">
          Next: <span className="text-yellow-300 font-semibold">{examName}</span>
        </p>
      )}
      <div className="flex gap-4 justify-center">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[70px]">
              <div className="text-3xl font-bold text-white">{value}</div>
              <div className="text-xs text-blue-100 uppercase">{unit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
