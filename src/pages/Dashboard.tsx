import { useCommitmentStore } from '@/store/commitmentStore';
import { useSavingsStore } from '@/store/savingsStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Target, Receipt, PiggyBank } from 'lucide-react';
import { CategoryBar } from '@/components/CategoryBar';
import { CATEGORY_CONFIG } from '@/lib/categories';

export default function Dashboard() {
  const { commitments } = useCommitmentStore();
  const { goals } = useSavingsStore();
  const salary = useUserProfileStore((state) => state.profile?.salary ?? null);
  const username = useUserProfileStore((state) => state.profile?.username ?? null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Commitments stats
  const totalAmount = commitments.reduce((sum, c) => sum + c.amount, 0);
  const paidAmount = commitments.filter((c) => c.isPaid).reduce((sum, c) => sum + c.amount, 0);
  const paidPercent = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  // Savings stats
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const savedPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const incompleteGoals = goals.filter((g) => !g.isCompleted);
  const totalRemaining = incompleteGoals.reduce(
    (sum, g) => sum + (g.targetAmount - g.currentAmount),
    0
  );

  // Lists
  const recentCommitments = [...commitments]
    .sort((a, b) => {
      if (a.isPaid === b.isPaid) return 0;
      return a.isPaid ? 1 : -1;
    })
    .slice(0, 5);

  const recentGoals = [...goals]
    .sort((a, b) => {
      if (a.isCompleted === b.isCompleted) {
        return b.currentAmount / b.targetAmount - a.currentAmount / a.targetAmount;
      }
      return a.isCompleted ? 1 : -1;
    })
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {greeting}{username ? `, ${username}` : ''}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
      </div>

      {/* Stat Cards */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Commitments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commitments.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <Receipt className="size-8 mx-auto text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No commitments yet.</p>
              </div>
            ) : (
              <>
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
                <div className="space-y-1">
                  <CategoryBar commitments={commitments} />
                  {salary !== null && (
                    <p className="text-sm text-muted-foreground">
                      RM{(salary - totalAmount).toFixed(2)} left of salary
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <PiggyBank className="size-8 mx-auto text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No savings goals yet.</p>
              </div>
            ) : (
              <>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">RM{totalSaved.toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">saved</p>
                  </div>
                  <div className="border-l pl-4">
                    <p className="text-xl sm:text-2xl font-bold">RM{totalRemaining.toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">remaining</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(savedPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {incompleteGoals.length} active goal{incompleteGoals.length !== 1 ? 's' : ''} ·{' '}
                    {savedPercent.toFixed(0)}% saved
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lists */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Commitments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCommitments.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Receipt className="size-10 mx-auto text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">
                  No commitments yet. Start adding your monthly expenses.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCommitments.map((commitment) => {
                  const config = CATEGORY_CONFIG[commitment.category];
                  return (
                    <div
                      key={commitment.id}
                      className={`flex items-center justify-between p-2 sm:p-3 border rounded-lg transition-opacity ${
                        commitment.isPaid ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${config.progressColor}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`font-medium text-sm sm:text-base truncate ${
                                commitment.isPaid ? 'line-through' : ''
                              }`}
                            >
                              {commitment.name}
                            </h4>
                            {commitment.isPaid && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shrink-0">
                                <Check className="size-3 mr-1" />
                                Paid
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            RM{commitment.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {commitments.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    Showing 5 of {commitments.length} commitments
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {recentGoals.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <PiggyBank className="size-10 mx-auto text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">
                  No savings goals yet. Create your first goal.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentGoals.map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <div key={goal.id} className="p-2 sm:p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm sm:text-base truncate">{goal.name}</h4>
                            {goal.isCompleted && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shrink-0">
                                <Target className="size-3 mr-1" />
                                Done
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            RM{goal.currentAmount.toFixed(2)} / RM{goal.targetAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold shrink-0">
                          {progress.toFixed(0)}%
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            goal.isCompleted ? 'bg-green-500' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {goals.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    Showing 5 of {goals.length} goals
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
