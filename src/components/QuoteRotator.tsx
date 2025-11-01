import { useState, useEffect } from 'react';

const quotes = [
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Study while others are sleeping; work while others are loafing.", author: "William Arthur Ward" },
  { text: "Education is the passport to the future.", author: "Malcolm X" }
];

export const QuoteRotator = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto my-8 transition-all duration-500">
      <div className="text-center">
        <p className="text-lg text-white italic mb-2">"{quotes[currentQuote].text}"</p>
        <p className="text-sm text-blue-300">— {quotes[currentQuote].author}</p>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {quotes.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-2 rounded-full transition-all ${
              idx === currentQuote ? 'bg-yellow-400 w-8' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
