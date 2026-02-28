import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        setError('No user logged in');
        return;
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Current password is incorrect');
      } else if (err.code === 'auth/weak-password') {
        setError('New password is too weak');
      } else {
        setError(err.message || 'Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/profile')}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Profile
      </Button>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold">Change Password</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Update your password to keep your account secure
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>
            Enter your current password and choose a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <PasswordInput
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Password changed successfully! Redirecting...
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={loading || success}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
