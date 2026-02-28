import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { checkAndResetMonthlyCommitments } from '@/store/commitmentStore';

/**
 * Custom hook to automatically check and reset monthly commitments
 * Runs once when the user logs in or when the component mounts
 */
export function useMonthlyReset() {
  const user = useAuthStore((state) => state.user);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!user || hasChecked.current) return;

    const checkReset = async () => {
      try {
        const wasReset = await checkAndResetMonthlyCommitments(user.uid);
        if (wasReset) {
          console.log('Commitments have been reset for the new month');
        }
        hasChecked.current = true;
      } catch (error) {
        console.error('Error during monthly reset check:', error);
      }
    };

    checkReset();
  }, [user]);
}
