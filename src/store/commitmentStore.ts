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
  writeBatch,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CommitmentState, Commitment } from '@/types';

export const useCommitmentStore = create<CommitmentState>((set, get) => ({
  commitments: [],
  setCommitments: (commitments) => set({ commitments }),

  addCommitment: async (commitmentData) => {
    try {
      await addDoc(collection(db, 'commitments'), {
        ...commitmentData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      // Real-time subscription will update the state
    } catch (error) {
      console.error('Error adding commitment:', error);
      throw error;
    }
  },

  updateCommitment: async (id, updates) => {
    try {
      const commitmentRef = doc(db, 'commitments', id);
      await updateDoc(commitmentRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      // Real-time subscription will update the state
    } catch (error) {
      console.error('Error updating commitment:', error);
      throw error;
    }
  },

  deleteCommitment: async (id) => {
    try {
      await deleteDoc(doc(db, 'commitments', id));
      // Real-time subscription will update the state
    } catch (error) {
      console.error('Error deleting commitment:', error);
      throw error;
    }
  },

  togglePaid: async (id) => {
    const commitment = get().commitments.find((c) => c.id === id);
    if (commitment) {
      await get().updateCommitment(id, { isPaid: !commitment.isPaid });
    }
  },
}));

// Helper function to subscribe to user's commitments
export function subscribeToCommitments(userId: string, callback: (commitments: Commitment[]) => void) {
  const q = query(collection(db, 'commitments'), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const commitments: Commitment[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          name: data.name,
          amount: data.amount,
          category: data.category,
          isPaid: data.isPaid,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
      callback(commitments);
    },
    (error) => {
      console.error('Error subscribing to commitments:', error);
    }
  );
}

// Helper function to check if it's a new month and reset commitments if needed
export async function checkAndResetMonthlyCommitments(userId: string): Promise<boolean> {
  try {
    const userMetaRef = doc(db, 'userMeta', userId);
    const userMetaSnap = await getDoc(userMetaRef);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let shouldReset = false;
    let lastResetDate: Date | null = null;

    if (userMetaSnap.exists()) {
      const data = userMetaSnap.data();
      lastResetDate = data.lastCommitmentReset?.toDate() || null;

      if (lastResetDate) {
        const lastResetMonth = lastResetDate.getMonth();
        const lastResetYear = lastResetDate.getFullYear();

        // Reset if we're in a different month or year
        shouldReset =
          currentYear > lastResetYear ||
          (currentYear === lastResetYear && currentMonth > lastResetMonth);
      } else {
        // No reset date recorded, reset now
        shouldReset = true;
      }
    } else {
      // First time, create metadata and reset
      shouldReset = true;
    }

    if (shouldReset) {
      // Get all commitments for this user
      const q = query(collection(db, 'commitments'), where('userId', '==', userId));
      const snapshot = await getDocs(q);

      // Use batch to reset all commitments
      const batch = writeBatch(db);
      snapshot.docs.forEach((commitmentDoc) => {
        batch.update(commitmentDoc.ref, {
          isPaid: false,
          updatedAt: Timestamp.now(),
        });
      });

      // Update the last reset timestamp
      batch.set(
        userMetaRef,
        {
          lastCommitmentReset: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );

      await batch.commit();
      console.log('Monthly commitments reset completed');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking/resetting monthly commitments:', error);
    return false;
  }
}
