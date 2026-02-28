import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCommitmentStore } from '@/store/commitmentStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Check, X, Info, Receipt } from 'lucide-react';
import type { Commitment, CommitmentCategory } from '@/types';
import { CATEGORY_CONFIG, CATEGORY_ORDER, getCategoryBadgeClass } from '@/lib/categories';
import { CategoryBar, getCategoryTotals } from '@/components/CategoryBar';

export default function Commitments() {
  const { commitments, togglePaid, deleteCommitment } = useCommitmentStore();
  const salary = useUserProfileStore((state) => state.profile?.salary ?? null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<Commitment | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this commitment?')) {
      try {
        await deleteCommitment(id);
      } catch (error) {
        alert('Failed to delete commitment. Please try again.');
      }
    }
  };

  const handleTogglePaid = async (id: string) => {
    try {
      await togglePaid(id);
    } catch (error) {
      alert('Failed to update payment status. Please try again.');
    }
  };

  const totalAmount = commitments.reduce((sum, c) => sum + c.amount, 0);
  const paidAmount = commitments.filter((c) => c.isPaid).reduce((sum, c) => sum + c.amount, 0);
  const paidPercent = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Monthly Commitments</h1>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Commitment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CommitmentForm
              onSuccess={() => setIsAddOpen(false)}
              onCancel={() => setIsAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {commitments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Commitments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xl sm:text-2xl font-bold">RM{totalAmount.toFixed(2)}</p>
              <div className="space-y-1">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${paidPercent}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{paidPercent.toFixed(0)}% paid</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader >
              <div className="flex items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-4 -mr-1">
                      <Info className="size-3.5 text-muted-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Categories</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      {getCategoryTotals(commitments).map(({ category, amount, percentage }) => {
                        const config = CATEGORY_CONFIG[category];
                        const Icon = config.icon;
                        return (
                          <div key={category} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-sm shrink-0 ${config.progressColor}`} />
                            <div className={`p-1 rounded ${config.bgColor} ${config.darkBgColor}`}>
                              <Icon className={`size-3.5 ${config.textColor} ${config.darkTextColor}`} />
                            </div>
                            <span className="flex-1 text-sm">{config.label}</span>
                            <span className="text-sm font-medium">RM{amount.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground w-10 text-right">{percentage.toFixed(0)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {salary !== null && (
                <p className="text-xl sm:text-2xl font-bold">
                  {((totalAmount / salary) * 100).toFixed(0)}% of salary
                </p>
              )}
              <div className="space-y-1">
                <CategoryBar commitments={commitments} />
                {salary !== null && (
                  <p className="text-sm text-muted-foreground">
                    RM{(salary - totalAmount).toFixed(2)} left
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Commitments List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Commitments</CardTitle>
        </CardHeader>
        <CardContent>
          {commitments.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Receipt className="size-10 mx-auto text-muted-foreground/40" />
              <p className="text-muted-foreground">
                No commitments yet. Click "Add Commitment" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {commitments.map((commitment) => {
                const categoryConfig = CATEGORY_CONFIG[commitment.category];
                const CategoryIcon = categoryConfig.icon;
                return (
                <div
                  key={commitment.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors ${
                    commitment.isPaid ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-sm sm:text-base truncate ${commitment.isPaid ? 'line-through' : ''}`}>
                        {commitment.name}
                      </h3>
                      <Badge className={getCategoryBadgeClass(commitment.category)}>
                        <CategoryIcon className="size-3 mr-1" />
                        {categoryConfig.label}
                      </Badge>
                      {commitment.isPaid && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <Check className="size-3 mr-1" />
                          Paid
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg sm:text-2xl font-bold">RM{commitment.amount.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant={commitment.isPaid ? 'outline' : 'default'}
                      onClick={() => handleTogglePaid(commitment.id)}
                      className="text-xs sm:text-sm"
                    >
                      {commitment.isPaid ? (
                        <>
                          <X className="size-3 sm:size-4 mr-1" />
                          <span className="hidden sm:inline">Mark Unpaid</span>
                          <span className="sm:hidden">Unpaid</span>
                        </>
                      ) : (
                        <>
                          <Check className="size-3 sm:size-4 mr-1" />
                          <span className="hidden sm:inline">Mark Paid</span>
                          <span className="sm:hidden">Paid</span>
                        </>
                      )}
                    </Button>

                    <Dialog
                      open={editingCommitment?.id === commitment.id}
                      onOpenChange={(open) => !open && setEditingCommitment(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCommitment(commitment)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <CommitmentForm
                          commitment={commitment}
                          onSuccess={() => setEditingCommitment(null)}
                          onCancel={() => setEditingCommitment(null)}
                        />
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(commitment.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Commitment Form Component
interface CommitmentFormProps {
  commitment?: Commitment;
  onSuccess: () => void;
  onCancel: () => void;
}

function CommitmentForm({ commitment, onSuccess, onCancel }: CommitmentFormProps) {
  const user = useAuthStore((state) => state.user);
  const { addCommitment, updateCommitment } = useCommitmentStore();

  const [name, setName] = useState(commitment?.name || '');
  const [amount, setAmount] = useState(commitment?.amount.toString() || '');
  const [category, setCategory] = useState<CommitmentCategory>(commitment?.category || 'other');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    if (!user) {
      setError('You must be logged in');
      return;
    }

    setLoading(true);

    try {
      if (commitment) {
        // Update existing commitment
        await updateCommitment(commitment.id, {
          name: name.trim(),
          amount: parsedAmount,
          category,
        });
      } else {
        // Add new commitment
        await addCommitment({
          userId: user.uid,
          name: name.trim(),
          amount: parsedAmount,
          category,
          isPaid: false,
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save commitment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{commitment ? 'Edit Commitment' : 'Add New Commitment'}</DialogTitle>
        <DialogDescription>
          {commitment
            ? 'Update your monthly commitment details.'
            : 'Add a new monthly commitment to track.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Rent, Internet, Gym"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (RM)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as CommitmentCategory)} disabled={loading}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ORDER.map((value) => (
                  <SelectItem key={value} value={value}>
                    {CATEGORY_CONFIG[value].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : commitment ? 'Update' : 'Add'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
