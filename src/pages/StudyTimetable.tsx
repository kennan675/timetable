import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Clock, BookOpen, Brain, Calendar, Target, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';

// Generate unique task ID
const getTaskId = (date: string, taskIndex: number) => `${date}-${taskIndex}`;

const CountdownDisplay = ({ targetDate, examName }: { targetDate: Date; examName: string }) => {
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
    <div className="text-center">
      <p className="text-blue-200 mb-4">
        ⏱️ Countdown to <span className="font-bold text-yellow-400">{examName}</span>
      </p>
      <div className="flex gap-3 justify-center">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
          { label: 'Sec', value: timeLeft.seconds },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/10 backdrop-blur-md rounded-xl p-3 min-w-[70px] text-center border border-white/20">
            <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
            <div className="text-xs text-blue-200 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StudyTimetable = () => {
  const navigate = useNavigate();
  const { studyPlan, subjects, getFirstExamDate } = useAppContext();
  const firstExamDate = getFirstExamDate();

  // Task completion state - persisted to localStorage
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('completedTasks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Save to localStorage whenever completedTasks changes
  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));
  }, [completedTasks]);

  const toggleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  // Calculate per-subject progress
  const subjectProgress = useMemo(() => {
    if (!studyPlan) return {};

    const progress: Record<string, { total: number; completed: number }> = {};

    studyPlan.schedule.forEach(day => {
      day.tasks.forEach((task, tIdx) => {
        const taskId = getTaskId(day.date, tIdx);
        if (!progress[task.subject]) {
          progress[task.subject] = { total: 0, completed: 0 };
        }
        progress[task.subject].total++;
        if (completedTasks.has(taskId)) {
          progress[task.subject].completed++;
        }
      });
    });

    return progress;
  }, [studyPlan, completedTasks]);

  // Overall progress
  const overallProgress = useMemo(() => {
    if (!studyPlan) return { total: 0, completed: 0, percent: 0 };

    let total = 0;
    let completed = 0;

    studyPlan.schedule.forEach(day => {
      day.tasks.forEach((_, tIdx) => {
        const taskId = getTaskId(day.date, tIdx);
        total++;
        if (completedTasks.has(taskId)) {
          completed++;
        }
      });
    });

    return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [studyPlan, completedTasks]);

  // Get next upcoming exam
  const nextExam = useMemo(() => {
    if (subjects.length === 0) return null;

    const now = new Date();
    const upcoming = subjects
      .filter(s => s.examDate !== 'TBD')
      .map(s => ({ name: s.name, date: new Date(s.examDate) }))
      .filter(s => s.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return upcoming.length > 0 ? upcoming[0] : null;
  }, [subjects]);

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
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900"
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

          {nextExam && (
            <div className="mb-8">
              <CountdownDisplay targetDate={nextExam.date} examName={nextExam.name} />
            </div>
          )}

          {/* Overall Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-blue-200">Overall Progress</span>
              <span className="text-yellow-400 font-bold">{overallProgress.percent}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallProgress.percent}%` }}
              />
            </div>
            <p className="text-xs text-blue-200 mt-1">
              {overallProgress.completed} of {overallProgress.total} tasks completed
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
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
              <div className="text-2xl font-bold text-green-400">{overallProgress.completed}</div>
              <div className="text-xs text-blue-200">Completed</div>
            </div>
          </div>
        </section>

        {/* Per-Subject Progress */}
        <section className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Subject Progress
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(subjectProgress).map(([subject, { total, completed }]) => {
              const percent = Math.round((completed / total) * 100);
              return (
                <div key={subject} className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="font-semibold text-white mb-2">{subject}</div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        percent === 100 ? "bg-green-400" : "bg-yellow-400"
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-200">{completed}/{total} tasks</span>
                    <span className={cn(
                      "font-bold",
                      percent === 100 ? "text-green-400" : "text-yellow-400"
                    )}>
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Daily Schedule with Checkboxes */}
        <section className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-400" />
            Daily Schedule
          </h2>
          <div className="space-y-6">
            {studyPlan.schedule.map((day, idx) => {
              const dayTasks = day.tasks.map((_, tIdx) => getTaskId(day.date, tIdx));
              const dayCompleted = dayTasks.filter(id => completedTasks.has(id)).length;
              const dayPercent = Math.round((dayCompleted / day.tasks.length) * 100);

              return (
                <Card key={idx} className="bg-white/5 border-white/10 overflow-hidden">
                  <div className={cn(
                    "px-6 py-3 border-b border-white/10 flex items-center justify-between",
                    dayPercent === 100 ? "bg-green-500/20" : "bg-white/10"
                  )}>
                    <div className="flex items-center gap-3">
                      {dayPercent === 100 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                      <span className="text-xl font-bold text-white">
                        {format(new Date(day.date), 'EEEE, MMM d')}
                      </span>
                    </div>
                    <span className={cn(
                      "text-sm font-medium px-3 py-1 rounded-full",
                      dayPercent === 100 ? "bg-green-400/20 text-green-400" : "bg-white/10 text-blue-200"
                    )}>
                      {dayCompleted}/{day.tasks.length} done
                    </span>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      {day.tasks.map((task, tIdx) => {
                        const taskId = getTaskId(day.date, tIdx);
                        const isCompleted = completedTasks.has(taskId);

                        return (
                          <div
                            key={tIdx}
                            className={cn(
                              "rounded-lg p-4 border cursor-pointer transition-all",
                              isCompleted
                                ? "bg-green-500/10 border-green-500/30"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            )}
                            onClick={() => toggleTaskComplete(taskId)}
                          >
                            <div className="flex items-start gap-4">
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => toggleTaskComplete(taskId)}
                                className={cn(
                                  "mt-1 border-white/40",
                                  isCompleted && "bg-green-400 border-green-400"
                                )}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className={cn(
                                    "font-semibold text-lg flex items-center gap-2",
                                    isCompleted ? "text-green-300 line-through" : "text-white"
                                  )}>
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
                                <p className={cn(
                                  "mb-2",
                                  isCompleted ? "text-green-200/70" : "text-blue-100"
                                )}>{task.topic_focus}</p>
                                <span className={cn(
                                  "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded",
                                  isCompleted ? "bg-green-400/20 text-green-300" : "bg-purple-500/20 text-purple-300"
                                )}>
                                  <BookOpen className="w-3 h-3" />
                                  {task.study_type}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="outline"
              onClick={() => {
                setCompletedTasks(new Set());
                localStorage.removeItem('completedTasks');
              }}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Reset Progress
            </Button>
            <Button variant="outline" onClick={() => navigate('/study-architect')} className="border-white/20 text-white hover:bg-white/10">
              Regenerate Plan
            </Button>
            <Button onClick={() => window.print()} className="bg-yellow-400 hover:bg-yellow-500 text-blue-900">
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
