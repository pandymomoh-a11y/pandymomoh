
import React from 'react';
import { EggIcon } from './icons/EggIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { CalendarIcon } from './icons/CalendarIcon';

export type View = 'reports' | 'history' | 'weekly' | 'monthly';

interface NavigationProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
      isActive ? 'text-indigo-600' : 'text-black hover:text-indigo-600'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  const iconSize = "w-6 h-6 mb-1";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)] z-10">
      <div className="container mx-auto">
        <div className="flex justify-around">
          <NavItem
            icon={<EggIcon className={iconSize} />}
            label="Reports"
            isActive={activeView === 'reports'}
            onClick={() => setActiveView('reports')}
          />
          <NavItem
            icon={<HistoryIcon className={iconSize} />}
            label="History"
            isActive={activeView === 'history'}
            onClick={() => setActiveView('history')}
          />
          <NavItem
            icon={<CalendarIcon className={iconSize} />}
            label="Weekly"
            isActive={activeView === 'weekly'}
            onClick={() => setActiveView('weekly')}
          />
          <NavItem
            icon={<CalendarIcon className={iconSize} />}
            label="Monthly"
            isActive={activeView === 'monthly'}
            onClick={() => setActiveView('monthly')}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
