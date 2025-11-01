import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

type NavItem =
  | { label: string; type: 'route'; path: string }
  | { label: string; type: 'section'; sectionId: string };

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSectionNavigation = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      scrollToSection(sectionId);
    }
    setIsOpen(false);
  };

  const navItems: NavItem[] = [
    { label: 'Home', type: 'route', path: '/' },
    { label: 'Study Timetable', type: 'route', path: '/study-timetable' },
    { label: 'Study Plan', type: 'route', path: '/study-plan' },
    { label: 'Motivation', type: 'section', sectionId: 'motivation' }
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-white font-bold text-xl">KB Study Hub</div>

          <div className="hidden md:flex space-x-8">
            {navItems.map(item =>
              item.type === 'route' ? (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-white hover:text-yellow-300 transition-colors font-medium ${
                      isActive ? 'text-yellow-300' : ''
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ) : (
                <button
                  key={item.sectionId}
                  onClick={() => handleSectionNavigation(item.sectionId)}
                  className="text-white hover:text-yellow-300 transition-colors font-medium"
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map(item =>
              item.type === 'route' ? (
                <NavLink
                  key={`${item.path}-mobile`}
                  to={item.path}
                  className={({ isActive }) =>
                    `block w-full text-left text-white hover:bg-white/10 px-4 py-2 rounded ${
                      isActive ? 'bg-white/10 text-yellow-300' : ''
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ) : (
                <button
                  key={`${item.sectionId}-mobile`}
                  onClick={() => handleSectionNavigation(item.sectionId)}
                  className="block w-full text-left text-white hover:bg-white/10 px-4 py-2 rounded"
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
