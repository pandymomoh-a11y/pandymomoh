
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { UserIcon } from '../icons/UserIcon';

interface ProfileSelectorProps {
  profiles: UserProfile[];
  onSelect: (profile: UserProfile) => void;
  onCreate: (name: string) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ profiles, onSelect, onCreate }) => {
  const [newProfileName, setNewProfileName] = useState('');

  const handleCreate = () => {
    if (newProfileName.trim()) {
      onCreate(newProfileName.trim());
      setNewProfileName('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-extrabold text-white">Suffy Poultry</h1>
          <p className="text-indigo-100 mt-2">Manage your farm records professionally</p>
        </div>
        
        <div className="p-8">
          {profiles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Choose Profile</h2>
              <div className="grid gap-3">
                {profiles.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => onSelect(profile)}
                    className="w-full flex items-center p-4 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 group-hover:bg-indigo-200">
                      <UserIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="font-semibold text-gray-800 text-lg">{profile.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={`${profiles.length > 0 ? 'border-t pt-8' : ''}`}>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Create New Farm Account</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                placeholder="Owner or Farm Name"
                className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-black transition-all"
                onKeyPress={e => e.key === 'Enter' && handleCreate()}
              />
              <button
                onClick={handleCreate}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                disabled={!newProfileName.trim()}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-400">Data is stored locally on this device for your privacy.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelector;
