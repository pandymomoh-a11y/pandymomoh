
import { useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProfile } from '../types';

export const useProfiles = () => {
  const [profiles, setProfiles] = useLocalStorage<UserProfile[]>('suffy-poultry-profiles', []);
  const [activeProfileId, setActiveProfileId] = useLocalStorage<string | null>('suffy-poultry-active-profile-id', null);

  const activeProfile = useMemo(() => {
    return profiles.find(p => p.id === activeProfileId) || null;
  }, [profiles, activeProfileId]);

  const addProfile = (name: string) => {
    if (name && !profiles.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      const newProfile: UserProfile = {
        id: `user_${Date.now()}`,
        name: name.trim(),
      };
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      setActiveProfileId(newProfile.id);
    } else {
        alert('Profile name cannot be empty or already exist.');
    }
  };

  const setActiveProfile = (profile: UserProfile | null) => {
    setActiveProfileId(profile ? profile.id : null);
  };

  return {
    profiles,
    activeProfile,
    addProfile,
    setActiveProfile,
  };
};
