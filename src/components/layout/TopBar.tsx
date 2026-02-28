import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore, fetchUserProfile } from '@/store/userProfileStore';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';

interface TopBarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function TopBar({ sidebarCollapsed, onToggleSidebar }: TopBarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { profile, setProfile } = useUserProfileStore();
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (user && !profile && !loadingProfile) {
      setLoadingProfile(true);
      fetchUserProfile(user.uid)
        .then((userProfile) => {
          setProfile(userProfile);
        })
        .catch((err) => {
          console.error('Error fetching profile:', err);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
  }, [user, profile, setProfile, loadingProfile]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const displayName = profile?.username || user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleSidebar}
            className="hidden md:flex"
          >
            {sidebarCollapsed ? (
              <Menu className="size-5" />
            ) : (
              <X className="size-5" />
            )}
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Simpan</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm font-medium text-muted-foreground sm:inline">
            {displayName}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="size-5 text-red-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}
