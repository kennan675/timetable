import { FormEvent, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PraiseSection } from '@/components/PraiseSection';

const ACCESS_PASSWORD = 'luxari';

const Praise = () => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.trim() === ACCESS_PASSWORD) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />

      <main className="py-20 px-4">
        <section className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Private Praise</h1>
          <p className="text-lg text-blue-100">
            This gallery is private. Enter the password to unlock it.
          </p>
        </section>

        {!isUnlocked ? (
          <section className="max-w-md mx-auto bg-white/10 backdrop-blur rounded-xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label htmlFor="praise-password" className="block text-sm font-medium text-blue-100 mb-2">
                  Password
                </label>
                <input
                  id="praise-password"
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <button
                type="submit"
                className="w-full bg-yellow-300 text-gray-900 font-semibold rounded-lg py-2 hover:bg-yellow-200 transition-colors"
              >
                Unlock
              </button>
            </form>
          </section>
        ) : (
          <section className="max-w-4xl mx-auto">
            <PraiseSection />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Praise;
