import { create } from 'zustand';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SavingsGoalState, SavingsGoal } from '@/types';

export const useSavingsStore = create<SavingsGoalState>((set, get) => ({
  goals: [],
  setGoals: (goals) => set({ goals }),

  addGoal: async (goalData) => {
    try {
      await addDoc(collection(db, 'savings'), {
        ...goalData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      // Real-time subscription will update the state
    } catch (error) {
      console.error('Error adding savings goal:', error);
      throw error;
    }
  },

  updateGoal: async (id, updates) => {
    try {
      const goalRef = doc(db, 'savings', id);
      await updateDoc(goalRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      // Real-time subscription will update the state
    } catch (error) {
      console.error('Error updating savings goal:', error);
      throw error;
    }
  },

  deleteGoal: async (id) => {
    try {
      await deleteDoc(doc(db, 'savings', id));
      // Real-time subscription will update the state
    } catch (error) {
      console.error('Error deleting savings goal:', error);
      throw error;
    }
  },

  addContribution: async (id, amount) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal) {
      throw new Error('Goal not found');
    }

    const newAmount = goal.currentAmount + amount;
    const isCompleted = newAmount >= goal.targetAmount;

    await get().updateGoal(id, {
      currentAmount: newAmount,
      isCompleted,
    });
  },
}));

// Helper function to subscribe to user's savings goals
export function subscribeToSavings(userId: string, callback: (goals: SavingsGoal[]) => void) {
  const q = query(collection(db, 'savings'), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const goals: SavingsGoal[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          name: data.name,
          targetAmount: data.targetAmount,
          currentAmount: data.currentAmount,
          monthlyContribution: data.monthlyContribution ?? null,
          isCompleted: data.isCompleted,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
      callback(goals);
    },
    (error) => {
      console.error('Error subscribing to savings goals:', error);
    }
  );
}
