import { useCommitmentStore } from '@/store/commitmentStore';
import { useSavingsStore } from '@/store/savingsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Target } from 'lucide-react';

export default function Dashboard() {
  const { commitments } = useCommitmentStore();
  const { goals } = useSavingsStore();

  // Calculate commitment stats
  const paidCount = commitments.filter((c) => c.isPaid).length;

  // Calculate savings stats
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedGoals = goals.filter((g) => g.isCompleted).length;
  const activeGoals = goals.length - completedGoals;

  // Get recent commitments (up to 5, unpaid first)
  const recentCommitments = [...commitments]
    .sort((a, b) => {
      if (a.isPaid === b.isPaid) return 0;
      return a.isPaid ? 1 : -1;
    })
    .slice(0, 5);

  // Get recent goals (up to 5, incomplete first, sorted by progress)
  const recentGoals = [...goals]
    .sort((a, b) => {
      if (a.isCompleted === b.isCompleted) {
        const progressA = a.currentAmount / a.targetAmount;
        const progressB = b.currentAmount / b.targetAmount;
        return progressB - progressA;
      }
      return a.isCompleted ? 1 : -1;
    })
    .slice(0, 5);

  const unpaidCount = commitments.length - paidCount;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {unpaidCount > 0
            ? `You have ${unpaidCount} unpaid commitment${unpaidCount > 1 ? 's' : ''} and ${activeGoals} active savings goal${activeGoals !== 1 ? 's' : ''}`
            : commitments.length > 0
            ? `All commitments paid! • RM${totalSaved.toFixed(2)} saved across ${goals.length} goal${goals.length !== 1 ? 's' : ''}`
            : `No commitments yet • RM${totalSaved.toFixed(2)} saved across ${goals.length} goal${goals.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Monthly Commitments */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Commitments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCommitments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No commitments yet. Start adding your monthly expenses.
              </p>
            ) : (
              <div className="space-y-3">
                {recentCommitments.map((commitment) => (
                  <div
                    key={commitment.id}
                    className="flex items-center justify-between p-2 sm:p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm sm:text-base truncate">{commitment.name}</h4>
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
                ))}
                {commitments.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    Showing 5 of {commitments.length} commitments
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Savings Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {recentGoals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No savings goals yet. Create your first goal.
              </p>
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
                        <div className="text-xs sm:text-sm font-semibold shrink-0">{progress.toFixed(0)}%</div>
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
