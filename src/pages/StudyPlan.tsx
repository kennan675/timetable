import { useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BookOpen, CheckCircle2, Circle, Sparkles } from "lucide-react";

type SessionColor =
  | "distributed"
  | "networks"
  | "oop"
  | "entrepreneurship"
  | "web"
  | "sdm";

interface StudySession {
  day: string;
  time: string;
  unit: string;
  color: SessionColor;
}

interface StudyWeek {
  week: string;
  dateRange: string;
  schedule: StudySession[];
}

const studySchedule: StudyWeek[] = [
  {
    week: "Week 1",
    dateRange: "Nov 2 – 8",
    schedule: [
      { day: "Sun 2 Nov", time: "2:00 PM – 5:00 PM", unit: "Distributed Systems", color: "distributed" },
      { day: "Mon 3 Nov", time: "7:30 PM – 11:00 PM", unit: "Fundamentals of Computer Networks", color: "networks" },
      { day: "Tue 4 Nov", time: "7:30 PM – 11:00 PM", unit: "Distributed Systems", color: "distributed" },
      { day: "Wed 5 Nov", time: "7:30 PM – 11:00 PM", unit: "Object-Oriented Analysis & Design", color: "oop" },
      { day: "Thu 6 Nov", time: "7:30 PM – 11:00 PM", unit: "Entrepreneurship & Innovation", color: "entrepreneurship" },
      { day: "Fri 7 Nov", time: "7:30 PM – 12:00 AM", unit: "Web Application Development", color: "web" },
      { day: "Sat 8 Nov", time: "10:00 AM – 2:00 PM", unit: "System Development Methodologies", color: "sdm" }
    ]
  },
  {
    week: "Week 2",
    dateRange: "Nov 9 – 15",
    schedule: [
      { day: "Sun 9 Nov", time: "1:00 PM – 5:00 PM", unit: "System Development Methodologies", color: "sdm" },
      { day: "Mon 10 Nov", time: "7:30 PM – 11:00 PM", unit: "Fundamentals of Computer Networks", color: "networks" },
      { day: "Tue 11 Nov", time: "7:30 PM – 11:00 PM", unit: "Distributed Systems", color: "distributed" },
      { day: "Wed 12 Nov", time: "7:30 PM – 11:00 PM", unit: "Object-Oriented Analysis & Design", color: "oop" },
      { day: "Thu 13 Nov", time: "7:30 PM – 11:00 PM", unit: "Entrepreneurship & Innovation", color: "entrepreneurship" },
      { day: "Fri 14 Nov", time: "7:30 PM – 12:00 AM", unit: "Web Application Development", color: "web" },
      { day: "Sat 15 Nov", time: "11:00 AM – 3:00 PM", unit: "Distributed Systems", color: "distributed" }
    ]
  },
  {
    week: "Week 3",
    dateRange: "Nov 16 – 22",
    schedule: [
      { day: "Sun 16 Nov", time: "1:00 PM – 4:30 PM", unit: "System Development Methodologies", color: "sdm" },
      { day: "Mon 17 Nov", time: "7:30 PM – 11:00 PM", unit: "Fundamentals of Computer Networks", color: "networks" },
      { day: "Tue 18 Nov", time: "7:30 PM – 11:00 PM", unit: "Distributed Systems", color: "distributed" },
      { day: "Wed 19 Nov", time: "7:30 PM – 11:00 PM", unit: "Object-Oriented Analysis & Design", color: "oop" },
      { day: "Thu 20 Nov", time: "7:30 PM – 11:00 PM", unit: "Entrepreneurship & Innovation", color: "entrepreneurship" },
      { day: "Fri 21 Nov", time: "7:30 PM – 12:00 AM", unit: "Web Application Development", color: "web" },
      { day: "Sat 22 Nov", time: "10:30 AM – 2:30 PM", unit: "Distributed Systems", color: "distributed" }
    ]
  },
  {
    week: "Week 4",
    dateRange: "Nov 23 – 29",
    schedule: [
      { day: "Sun 23 Nov", time: "12:30 PM – 4:30 PM", unit: "System Development Methodologies", color: "sdm" },
      { day: "Mon 24 Nov", time: "7:30 PM – 11:00 PM", unit: "Fundamentals of Computer Networks", color: "networks" },
      { day: "Tue 25 Nov", time: "7:30 PM – 11:00 PM", unit: "Distributed Systems", color: "distributed" },
      { day: "Wed 26 Nov", time: "7:30 PM – 11:00 PM", unit: "Object-Oriented Analysis & Design", color: "oop" },
      { day: "Thu 27 Nov", time: "7:30 PM – 11:00 PM", unit: "Entrepreneurship & Innovation", color: "entrepreneurship" },
      { day: "Fri 28 Nov", time: "7:30 PM – 12:30 AM", unit: "Web Application Development", color: "web" },
      { day: "Sat 29 Nov", time: "9:30 AM – 1:30 PM", unit: "Distributed Systems", color: "distributed" }
    ]
  }
];

const sessionStyles: Record<SessionColor, {
  border: string;
  borderCompleted: string;
  glow: string;
  badge: string;
  indicator: string;
  text: string;
}> = {
  distributed: {
    border: "border-purple-400/40",
    borderCompleted: "border-purple-200/70",
    glow: "from-purple-500/40 via-purple-500/20 to-transparent",
    badge: "bg-purple-500/15 text-purple-100 border-purple-400/30",
    indicator: "bg-purple-300",
    text: "text-purple-100"
  },
  networks: {
    border: "border-sky-400/40",
    borderCompleted: "border-sky-200/70",
    glow: "from-sky-500/40 via-sky-500/20 to-transparent",
    badge: "bg-sky-500/15 text-sky-100 border-sky-400/30",
    indicator: "bg-sky-300",
    text: "text-sky-100"
  },
  oop: {
    border: "border-amber-400/40",
    borderCompleted: "border-amber-200/70",
    glow: "from-amber-500/40 via-amber-500/20 to-transparent",
    badge: "bg-amber-500/15 text-amber-100 border-amber-400/30",
    indicator: "bg-amber-300",
    text: "text-amber-100"
  },
  entrepreneurship: {
    border: "border-emerald-400/40",
    borderCompleted: "border-emerald-200/70",
    glow: "from-emerald-500/40 via-emerald-500/20 to-transparent",
    badge: "bg-emerald-500/15 text-emerald-100 border-emerald-400/30",
    indicator: "bg-emerald-300",
    text: "text-emerald-100"
  },
  web: {
    border: "border-rose-400/40",
    borderCompleted: "border-rose-200/70",
    glow: "from-rose-500/40 via-rose-500/20 to-transparent",
    badge: "bg-rose-500/15 text-rose-100 border-rose-400/30",
    indicator: "bg-rose-300",
    text: "text-rose-100"
  },
  sdm: {
    border: "border-indigo-400/40",
    borderCompleted: "border-indigo-200/70",
    glow: "from-indigo-500/40 via-indigo-500/20 to-transparent",
    badge: "bg-indigo-500/15 text-indigo-100 border-indigo-400/30",
    indicator: "bg-indigo-300",
    text: "text-indigo-100"
  }
};

const StudyPlan = () => {
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());

  const totalSessions = useMemo(
    () => studySchedule.reduce((count, week) => count + week.schedule.length, 0),
    []
  );

  const legend = useMemo(() => {
    const seen = new Set<string>();
    return studySchedule.flatMap(week =>
      week.schedule.filter(session => {
        if (seen.has(session.unit)) {
          return false;
        }
        seen.add(session.unit);
        return true;
      })
    );
  }, []);

  const progress = totalSessions === 0 ? 0 : Math.round((completedSessions.size / totalSessions) * 100);

  const toggleSession = (weekId: string, sessionIndex: number) => {
    const key = `${weekId}-${sessionIndex}`;
    setCompletedSessions(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <Navigation />

      <main className="relative py-20 px-4">
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true">
          <div className="mx-auto h-full max-w-6xl bg-gradient-to-br from-white/10 via-transparent to-white/5 blur-3xl" />
        </div>

        <section className="relative max-w-6xl mx-auto space-y-12">
          <header className="text-center md:text-left space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Plan the process</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold">November Study Plan</h1>
            <p className="text-lg text-blue-100 md:max-w-3xl">
              A focused four-week roadmap leading into finals. Mark each session as you complete it and keep the momentum alive.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3 text-blue-100">
                <Sparkles className="h-6 w-6" />
                <span className="text-sm uppercase tracking-widest">Progress</span>
              </div>
              <p className="mt-4 text-4xl font-bold">{progress}%</p>
              <p className="text-sm text-blue-100/80">{completedSessions.size} of {totalSessions} sessions completed</p>
              <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-xl backdrop-blur">
              <p className="text-sm uppercase tracking-widest text-blue-100">Evening cadence</p>
              <p className="mt-3 text-sm text-blue-100/90">
                Weeknights are dedicated to deep evening sessions starting at 7:30 PM. Use the extra hour on Friday to consolidate what you learned.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-xl backdrop-blur">
              <p className="text-sm uppercase tracking-widest text-blue-100">Weekend stride</p>
              <p className="mt-3 text-sm text-blue-100/90">
                Saturdays and Sundays offer longer daytime blocks for project work, catching up, and extended revision sprints.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {studySchedule.map((week, weekIndex) => (
              <section
                key={week.week}
                className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 md:p-8 shadow-xl backdrop-blur"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />

                <header className="relative mb-6 flex flex-wrap items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/60 via-purple-500/60 to-indigo-500/60">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold">{week.week}</h2>
                    <p className="text-sm text-blue-100/80">{week.dateRange}</p>
                  </div>
                </header>

                <ul className="relative space-y-3">
                  {week.schedule.map((session, sessionIndex) => {
                    const theme = sessionStyles[session.color];
                    const sessionKey = `${week.week}-${sessionIndex}`;
                    const isCompleted = completedSessions.has(sessionKey);

                    return (
                      <li
                        key={sessionKey}
                        className="group relative"
                      >
                        <div
                          role="button"
                          aria-pressed={isCompleted}
                          tabIndex={0}
                          onClick={() => toggleSession(week.week, sessionIndex)}
                          onKeyDown={event => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              toggleSession(week.week, sessionIndex);
                            }
                          }}
                          className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-300 backdrop-blur focus:outline-none focus:ring-2 focus:ring-yellow-300/60 ${
                            isCompleted ? `bg-white/15 ${theme.borderCompleted}` : `bg-white/5 hover:bg-white/10 ${theme.border}`
                          }`}
                        >
                          <span className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-6 w-6 text-yellow-300" />
                            ) : (
                              <Circle className="h-6 w-6 text-blue-200" />
                            )}
                          </span>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold${isCompleted ? " line-through text-blue-100/60" : ""}`}>
                              {session.day}
                            </p>
                            <p className="text-xs text-blue-100/80 font-medium">{session.time}</p>
                          </div>

                          <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${theme.badge}`}>
                            <span className={`h-2 w-2 rounded-full ${theme.indicator}`} />
                            <span className="truncate max-w-[10rem]">{session.unit}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          <section className="grid gap-4 rounded-3xl border border-white/15 bg-white/5 p-6 text-sm text-blue-100/90 shadow-xl backdrop-blur md:grid-cols-3">
            {legend.map(entry => {
              const theme = sessionStyles[entry.color];
              return (
                <div key={entry.unit} className="flex items-center gap-3">
                  <span className={`h-2 w-8 rounded-full ${theme.indicator}`} />
                  <p className="font-medium text-white/90">{entry.unit}</p>
                </div>
              );
            })}
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudyPlan;
