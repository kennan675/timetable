import { useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { StudyDayCard } from '@/components/StudyDayCard';
import { generateNovemberCalendar } from '@/utils/calendarUtils';

const StudyPlan = () => {
  const calendar = useMemo(() => generateNovemberCalendar(), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />

      <main className="py-20 px-4">
        <section className="max-w-5xl mx-auto text-center mb-16">
          <p className="uppercase tracking-wide text-sm text-blue-200 mb-3">Plan the process</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">November Study Plan</h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Review daily study sessions and tap each slot to mark it complete. Weekends include extended study
            blocks while weekdays focus on evening revision.
          </p>
        </section>

        <section className="max-w-6xl mx-auto">
          <p className="text-center text-blue-200 mb-8">Click sessions to mark as completed</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {calendar.map(day => (
              <StudyDayCard key={day.date} {...day} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudyPlan;
