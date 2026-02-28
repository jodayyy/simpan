import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCommitmentStore, subscribeToCommitments } from '@/store/commitmentStore';
import { useSavingsStore, subscribeToSavings } from '@/store/savingsStore';

/**
 * Global hook to manage Firestore subscriptions
 * This should only be used once in the app to prevent duplicate subscriptions
 */
export function useFirestoreSync() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      // Clear stores when user logs out
      useCommitmentStore.getState().setCommitments([]);
      useSavingsStore.getState().setGoals([]);
      return;
    }

    // Subscribe to commitments
    const unsubscribeCommitments = subscribeToCommitments(user.uid, (updatedCommitments) => {
      useCommitmentStore.getState().setCommitments(updatedCommitments);
    });

    // Subscribe to savings
    const unsubscribeSavings = subscribeToSavings(user.uid, (updatedGoals) => {
      useSavingsStore.getState().setGoals(updatedGoals);
    });

    return () => {
      unsubscribeCommitments();
      unsubscribeSavings();
      // Clear stores on unmount
      useCommitmentStore.getState().setCommitments([]);
      useSavingsStore.getState().setGoals([]);
    };
  }, [user]);
}
