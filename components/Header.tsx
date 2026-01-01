
import React from 'react';
import { UserProfile } from '../types';
import { UserIcon } from './icons/UserIcon';
import { SwitchUserIcon } from './icons/SwitchUserIcon';

interface HeaderProps {
  activeProfile: UserProfile | null;
  onSwitchProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeProfile, onSwitchProfile }) => (
  <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">Suffy Poultry</h1>
      {activeProfile && (
        <div className="flex items-center space-x-2">
           <div className="flex items-center space-x-1 text-sm text-gray-600">
              <UserIcon className="w-5 h-5" />
              <span className="font-medium">{activeProfile.name}</span>
            </div>
          <button onClick={onSwitchProfile} title="Switch Profile" className="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
            <SwitchUserIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  </header>
);

export default Header;
