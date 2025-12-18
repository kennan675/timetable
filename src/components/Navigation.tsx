import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
}

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Exam Timetable', path: '/study-timetable' },
    { label: 'AI Architect', path: '/study-architect' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              K
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-xl tracking-tight">Your Personal Study Hub</span>
          </div>

          <div className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-purple-600 ${isActive ? 'text-purple-600' : 'text-slate-600 dark:text-slate-300'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pl-4 border-l border-slate-200 dark:border-slate-700 flex items-center gap-4">
              {/* Auth buttons removed by request */}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-600 dark:text-slate-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map(item => (
              <NavLink
                key={`${item.path}-mobile`}
                to={item.path}
                className={({ isActive }) =>
                  `block w-full text-left text-white hover:bg-white/10 px-4 py-2 rounded ${isActive ? 'bg-white/10 text-yellow-300' : ''
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
