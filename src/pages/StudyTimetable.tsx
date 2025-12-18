import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ExamCard } from '@/components/ExamCard';
import { exams } from '@/utils/studyData';

const StudyTimetable = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <Navigation />

    <main className="py-20 px-4">
      <section className="max-w-7xl mx-auto text-center mb-16">
        <p className="uppercase tracking-wide text-sm text-blue-200 mb-3">Stay ready</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Exam Timetable</h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto">
          Track key exam dates, venues, and lecturers at a glance. Use this page to stay organised and
          prepare with confidence.
        </p>
      </section>

      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.length > 0 ? (
            exams.map((exam, idx) => (
              <ExamCard key={exam.unitCode} exam={exam} index={idx} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <p className="text-xl text-white mb-4">No exams scheduled yet.</p>
              <p className="text-blue-200">Use the <a href="/study-architect" className="text-yellow-300 hover:underline font-semibold">AI Architect</a> to generate your plan from your timetable image!</p>
            </div>
          )}
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default StudyTimetable;
