import { Brain, Calendar, Zap, Target, BookOpen, Clock } from "lucide-react";

const features = [
    {
        icon: <Brain className="w-6 h-6 text-purple-600" />,
        title: "AI-Powered Scheduling",
        description: "Our advanced algorithm distributes your subjects based on difficulty and cognitive load."
    },
    {
        icon: <Calendar className="w-6 h-6 text-blue-600" />,
        title: "Smart Spaced Repetition",
        description: "Never forget a formula again. We schedule reviews at optimal intervals for maximum retention."
    },
    {
        icon: <Zap className="w-6 h-6 text-yellow-500" />,
        title: "Instant Timetable OCR",
        description: "Snap a photo of your messy exam schedule. We transform it into a structured plan in seconds."
    },
    {
        icon: <Target className="w-6 h-6 text-red-500" />,
        title: "Weakness Targeting",
        description: "Tell us what's hard using our simple 1-5 scale. We prioritize your toughest subjects automatically."
    },
    {
        icon: <BookOpen className="w-6 h-6 text-green-600" />,
        title: "Exam Readiness Score",
        description: "Track your preparation level with our real-time analytics dashboard."
    },
    {
        icon: <Clock className="w-6 h-6 text-orange-500" />,
        title: "Burnout Protection",
        description: "Smart breaks and 'Buffer Days' are built-in to keep you fresh for the big day."
    }
];

export const FeatureGrid = () => {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Why Students Trust StudyFlow
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        More than just a calendar. It's a cognitive science engine for your grades.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
