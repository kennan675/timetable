import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { Clock, BookOpen, Brain, Calendar, Target, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CountdownDisplay = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[80px] text-center border border-white/20">
          <div className="text-3xl md:text-4xl font-bold text-white">{value}</div>
          <div className="text-xs text-blue-200 uppercase tracking-wider">{label}</div>
        </div>
      ))}
    </div>
  );
};

const StudyTimetable = () => {
  const navigate = useNavigate();
  const { studyPlan, subjects, getFirstExamDate } = useAppContext();
  const firstExamDate = getFirstExamDate();

  if (!studyPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Navigation />
        <main className="py-20 px-4">
          <section className="max-w-3xl mx-auto text-center">
            <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm p-12">
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">No Study Plan Yet</h1>
              <p className="text-blue-200 mb-8">
                Use the AI Architect to generate your personalized study timetable from your exam schedule.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={() => navigate('/study-architect')}
              >
                Create Your Plan <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />

      <main className="py-12 px-4">
        {/* Header with Countdown */}
        <section className="max-w-7xl mx-auto text-center mb-12">
          <p className="uppercase tracking-wide text-sm text-blue-200 mb-3">Your AI-Generated Schedule</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Study Timetable</h1>

          {firstExamDate && (
            <div className="mb-8">
              <p className="text-blue-200 mb-4">Time until first exam ({format(firstExamDate, 'MMM d')})</p>
              <CountdownDisplay targetDate={firstExamDate} />
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{studyPlan.summary.total_days}</div>
              <div className="text-xs text-blue-200">Total Days</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{studyPlan.summary.intensity_level}</div>
              <div className="text-xs text-blue-200">Intensity</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{subjects.length}</div>
              <div className="text-xs text-blue-200">Subjects</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{studyPlan.schedule.reduce((acc, d) => acc + d.tasks.length, 0)}</div>
              <div className="text-xs text-blue-200">Total Tasks</div>
            </div>
          </div>
        </section>

        {/* Subjects Overview */}
        <section className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-yellow-400" />
            Your Subjects
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((subject, idx) => (
              <div key={idx} className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="font-semibold text-white">{subject.name}</div>
                <div className="text-sm text-blue-200">Exam: {subject.examDate}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Schedule */}
        <section className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-400" />
            Daily Schedule
          </h2>
          <div className="space-y-6">
            {studyPlan.schedule.map((day, idx) => (
              <Card key={idx} className="bg-white/5 border-white/10 overflow-hidden">
                <div className="bg-white/10 px-6 py-3 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-white">
                        {format(new Date(day.date), 'EEEE, MMM d')}
                      </span>
                    </div>
                    <span className="text-sm text-blue-200">{day.tasks.length} tasks</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {day.tasks.map((task, tIdx) => (
                      <div key={tIdx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                            {task.subject}
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              task.priority === 'high' ? "bg-red-500/20 text-red-300" :
                                task.priority === 'medium' ? "bg-yellow-500/20 text-yellow-300" :
                                  "bg-green-500/20 text-green-300"
                            )}>
                              {task.priority}
                            </span>
                          </h3>
                          <div className="text-sm text-blue-200 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {task.duration_minutes} min
                          </div>
                        </div>
                        <p className="text-blue-100 mb-2">{task.topic_focus}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                          <BookOpen className="w-3 h-3" />
                          {task.study_type}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <section className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Pro Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {studyPlan.pro_tips.map((tip, idx) => (
              <div key={idx} className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                <p className="text-purple-100">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="max-w-7xl mx-auto text-center">
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/study-architect')} className="border-white/20 text-white hover:bg-white/10">
              Regenerate Plan
            </Button>
            <Button onClick={() => window.print()} className="bg-white text-blue-900 hover:bg-blue-100">
              Export / Print
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudyTimetable;
