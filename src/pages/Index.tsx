import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureGrid } from '@/components/commercial/FeatureGrid';

export default function Index() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Now with Gemini 1.5 Pro AI
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 max-w-4xl mx-auto leading-tight">
            Stop Studying Hard. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Start Studying Smart.
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your messy exam timetable. Tell us what's hard. StudyFlow's AI architects your perfect revision strategy in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/study-architect">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                Generate My Plan Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> No Credit Card</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Instant Results</span>
            </div>
          </div>

          <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-white/50 backdrop-blur-sm overflow-hidden p-2">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=2000"
              alt="App Dashboard Preview"
              className="rounded-xl w-full h-auto opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-slate-950" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <FeatureGrid />

      {/* Social Proof / Footer CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Ace Your Exams?</h2>
          <p className="text-slate-400 mb-10 text-lg">Join thousands of students who have claimed back their sleep schedule.</p>
          <Link to="/study-architect">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full">
              Build Your Plan Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
