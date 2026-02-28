import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSavingsStore } from '@/store/savingsStore';
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
import { Plus, Pencil, Trash2, DollarSign, Target } from 'lucide-react';
import type { SavingsGoal } from '@/types';

export default function Savings() {
  const { goals, deleteGoal } = useSavingsStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [contributingGoal, setContributingGoal] = useState<SavingsGoal | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      try {
        await deleteGoal(id);
      } catch (error) {
        alert('Failed to delete savings goal. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Savings Goals</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {goals.length > 0
              ? `${goals.length} goal${goals.length !== 1 ? 's' : ''} tracked`
              : 'Create your first savings goal to start building your future'}
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <GoalForm onSuccess={() => setIsAddOpen(false)} onCancel={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No savings goals yet. Click "Add Goal" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div
                    key={goal.id}
                    className="p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-base sm:text-lg truncate">{goal.name}</h3>
                          {goal.isCompleted && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shrink-0">
                              <Target className="size-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="size-3 sm:size-4 text-muted-foreground shrink-0" />
                            <span className="font-semibold">RM{goal.currentAmount.toFixed(2)}</span>
                            <span className="text-muted-foreground shrink-0">/ RM{goal.targetAmount.toFixed(2)}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {progress.toFixed(0)}% complete
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              goal.isCompleted
                                ? 'bg-green-500'
                                : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!goal.isCompleted && (
                          <Dialog
                            open={contributingGoal?.id === goal.id}
                            onOpenChange={(open) => !open && setContributingGoal(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => setContributingGoal(goal)}
                              >
                                <DollarSign className="size-4 mr-1" />
                                Add Funds
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <ContributionForm
                                goal={goal}
                                onSuccess={() => setContributingGoal(null)}
                                onCancel={() => setContributingGoal(null)}
                              />
                            </DialogContent>
                          </Dialog>
                        )}

                        <Dialog
                          open={editingGoal?.id === goal.id}
                          onOpenChange={(open) => !open && setEditingGoal(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingGoal(goal)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <GoalForm
                              goal={goal}
                              onSuccess={() => setEditingGoal(null)}
                              onCancel={() => setEditingGoal(null)}
                            />
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(goal.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
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

// Goal Form Component
interface GoalFormProps {
  goal?: SavingsGoal;
  onSuccess: () => void;
  onCancel: () => void;
}

function GoalForm({ goal, onSuccess, onCancel }: GoalFormProps) {
  const user = useAuthStore((state) => state.user);
  const { addGoal, updateGoal } = useSavingsStore();

  const [name, setName] = useState(goal?.name || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount.toString() || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const parsedTarget = parseFloat(targetAmount);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      setError('Target amount must be a positive number');
      return;
    }

    if (!user) {
      setError('You must be logged in');
      return;
    }

    setLoading(true);

    try {
      if (goal) {
        // Update existing goal
        await updateGoal(goal.id, {
          name: name.trim(),
          targetAmount: parsedTarget,
        });
      } else {
        // Add new goal
        await addGoal({
          userId: user.uid,
          name: name.trim(),
          targetAmount: parsedTarget,
          currentAmount: 0,
          isCompleted: false,
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{goal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
        <DialogDescription>
          {goal ? 'Update your savings goal details.' : 'Create a new savings goal to track.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (RM)</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : goal ? 'Update' : 'Add'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

// Contribution Form Component
interface ContributionFormProps {
  goal: SavingsGoal;
  onSuccess: () => void;
  onCancel: () => void;
}

function ContributionForm({ goal, onSuccess, onCancel }: ContributionFormProps) {
  const { addContribution } = useSavingsStore();

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const remaining = goal.targetAmount - goal.currentAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    setLoading(true);

    try {
      await addContribution(goal.id, parsedAmount);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add contribution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Contribution</DialogTitle>
        <DialogDescription>Add money to your "{goal.name}" savings goal.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current:</span>
              <span className="font-semibold">RM{goal.currentAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target:</span>
              <span className="font-semibold">RM{goal.targetAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Remaining:</span>
              <span className="font-semibold text-primary">RM{remaining.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Add (RM)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              autoFocus
            />
            {amount && parseFloat(amount) > 0 && (
              <p className="text-xs text-muted-foreground">
                New total: RM{(goal.currentAmount + parseFloat(amount)).toFixed(2)}
                {goal.currentAmount + parseFloat(amount) >= goal.targetAmount && (
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    {' '}
                    - Goal will be completed!
                  </span>
                )}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Contribution'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
