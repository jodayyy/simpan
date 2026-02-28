import { create } from 'zustand';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfileState, UserProfile } from '@/types';

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  profile: null,
  loading: false,
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  updateUsername: async (username: string) => {
    const profile = get().profile;
    if (!profile) {
      throw new Error('No profile found. Please try refreshing the page.');
    }

    if (!username || username.trim().length === 0) {
      throw new Error('Username cannot be empty.');
    }

    try {
      const userRef = doc(db, 'users', profile.id);
      await updateDoc(userRef, {
        username: username.trim(),
        updatedAt: new Date(),
      });

      set({
        profile: {
          ...profile,
          username: username.trim(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  },
  updateSalary: async (salary: number | null) => {
    const profile = get().profile;
    if (!profile) {
      throw new Error('No profile found. Please try refreshing the page.');
    }

    try {
      const userRef = doc(db, 'users', profile.id);
      await updateDoc(userRef, {
        salary: salary,
        updatedAt: new Date(),
      });

      set({
        profile: {
          ...profile,
          salary: salary,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating salary:', error);
      throw error;
    }
  },
}));

// Helper function to create user profile on signup
export async function createUserProfile(userId: string, email: string) {
  const userRef = doc(db, 'users', userId);
  const userProfile: Omit<UserProfile, 'id'> = {
    email,
    username: null,
    salary: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(userRef, userProfile);
  return { id: userId, ...userProfile };
}

// Helper function to fetch user profile
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      id: userSnap.id,
      email: data.email,
      username: data.username,
      salary: data.salary ?? null,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  return null;
}
