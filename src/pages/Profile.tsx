import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore, fetchUserProfile } from '@/store/userProfileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, X, Check } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { profile, loading, setProfile, setLoading, updateUsername, updateSalary } = useUserProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salary, setSalary] = useState('');
  const [salaryError, setSalaryError] = useState('');
  const [savingSalary, setSavingSalary] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchUserProfile(user.uid)
        .then(async (userProfile) => {
          // If profile doesn't exist, create it
          if (!userProfile) {
            const { createUserProfile } = await import('@/store/userProfileStore');
            const newProfile = await createUserProfile(user.uid, user.email || '');
            setProfile(newProfile);
            setUsername(newProfile?.username || '');
          } else {
            setProfile(userProfile);
            setUsername(userProfile?.username || '');
          }
        })
        .catch((err) => {
          console.error('Error fetching profile:', err);
          setError('Failed to load profile. Please try refreshing the page.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, setProfile, setLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setUsername(profile?.username || '');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUsername(profile?.username || '');
    setError('');
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);

    try {
      await updateUsername(username.trim());
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update username');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSalary = () => {
    setIsEditingSalary(true);
    setSalary(profile?.salary?.toString() || '');
    setSalaryError('');
  };

  const handleCancelSalary = () => {
    setIsEditingSalary(false);
    setSalary(profile?.salary?.toString() || '');
    setSalaryError('');
  };

  const handleSaveSalary = async () => {
    setSalaryError('');
    setSavingSalary(true);

    try {
      const parsedSalary = salary.trim() ? parseFloat(salary) : null;
      if (salary.trim() && (isNaN(parsedSalary!) || parsedSalary! < 0)) {
        setSalaryError('Please enter a valid amount');
        setSavingSalary(false);
        return;
      }
      await updateSalary(parsedSalary);
      setIsEditingSalary(false);
    } catch (err: any) {
      setSalaryError(err.message || 'Failed to update salary');
    } finally {
      setSavingSalary(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account settings</p>
      </div>

      <div>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={saving}
                />
                <Button
                  size="icon"
                  variant="default"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Check className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  id="username"
                  type="text"
                  value={profile?.username || 'Not set'}
                  readOnly
                  className="bg-muted"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleEdit}
                >
                  <Pencil className="size-4" />
                </Button>
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Email Field (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || user?.email || ''}
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          {/* Salary Field */}
          <div className="space-y-2">
            <Label htmlFor="salary">Monthly Take-Home Pay</Label>
            {isEditingSalary ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    RM
                  </span>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    disabled={savingSalary}
                    className="pl-10"
                  />
                </div>
                <Button
                  size="icon"
                  variant="default"
                  onClick={handleSaveSalary}
                  disabled={savingSalary}
                >
                  <Check className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCancelSalary}
                  disabled={savingSalary}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  id="salary"
                  type="text"
                  value={profile?.salary ? `RM ${profile.salary.toLocaleString('en-MY', { minimumFractionDigits: 2 })}` : 'Not set'}
                  readOnly
                  className="bg-muted"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleEditSalary}
                >
                  <Pencil className="size-4" />
                </Button>
              </div>
            )}
            {salaryError && <p className="text-sm text-destructive">{salaryError}</p>}
            <p className="text-xs text-muted-foreground">
              Your monthly take-home salary after deductions
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate('/profile/change-password')}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
