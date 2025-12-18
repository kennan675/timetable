import { Navigation } from './Navigation';
import { CountdownTimer } from './CountdownTimer';
import { DigitalClock } from './DigitalClock';
import { ProgressBar } from './ProgressBar';
import { StatsCard } from './StatsCard';
import { QuoteRotator } from './QuoteRotator';
import { Footer } from './Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/690601180dd533794e18430b_1762001226657_558cd244.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div className="text-white text-sm">November 2025</div>
            <DigitalClock />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            Your Personal Study Hub 📚
          </h1>

          <p className="text-2xl text-yellow-300 mb-12 italic">
            "Discipline now, freedom later."
          </p>

          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group" onClick={() => window.location.href = '/study-architect'}>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                🚀 AI Study Architect
              </h3>
              <p className="text-blue-100 mb-4">
                Upload your timetable image and let Gemini build your schedule.
              </p>
              <span className="inline-block bg-white text-blue-900 px-6 py-2 rounded-full font-bold group-hover:scale-105 transition-transform">
                Launch Architect
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-white text-lg mb-4">Time Until First Exam</h3>
            <CountdownTimer />
          </div>

          <div className="mt-12 mb-8">
            <ProgressBar />
          </div>

          <StatsCard />
          <QuoteRotator />
        </div>
      </section>

      <Footer />
    </div>
  );
}
