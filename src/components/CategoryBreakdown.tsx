import { CATEGORY_CONFIG } from '@/lib/categories';
import type { Commitment, CommitmentCategory } from '@/types';

interface CategoryStats {
  category: CommitmentCategory;
  amount: number;
  percentage: number;
  count: number;
}

interface CategoryBreakdownProps {
  commitments: Commitment[];
  variant?: 'full' | 'compact';
  maxItems?: number;
}

export function CategoryBreakdown({
  commitments,
  variant = 'full',
  maxItems,
}: CategoryBreakdownProps) {
  const totalAmount = commitments.reduce((sum, c) => sum + c.amount, 0);

  const categoryStats: CategoryStats[] = (
    Object.keys(CATEGORY_CONFIG) as CommitmentCategory[]
  )
    .map((category) => {
      const categoryCommitments = commitments.filter(
        (c) => c.category === category
      );
      const amount = categoryCommitments.reduce((sum, c) => sum + c.amount, 0);
      return {
        category,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
        count: categoryCommitments.length,
      };
    })
    .filter((stat) => stat.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const displayStats = maxItems ? categoryStats.slice(0, maxItems) : categoryStats;

  if (displayStats.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No commitments to display
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {displayStats.map((stat) => {
        const config = CATEGORY_CONFIG[stat.category];
        const Icon = config.icon;

        return (
          <div key={stat.category} className="space-y-1.5">
            {/* Mobile: stack vertically, Desktop: side by side */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1 rounded ${config.bgColor} ${config.darkBgColor}`}
                >
                  <Icon
                    className={`size-3.5 ${config.textColor} ${config.darkTextColor}`}
                  />
                </div>
                <span className="font-medium">{config.label}</span>
                {variant === 'full' && (
                  <span className="text-muted-foreground hidden sm:inline">
                    ({stat.count} item{stat.count !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 pl-7 sm:pl-0">
                <span className="font-semibold text-xs sm:text-sm">
                  RM {stat.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-muted-foreground w-10 sm:w-12 text-right text-xs sm:text-sm">
                  {stat.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${config.progressColor}`}
                style={{ width: `${Math.min(stat.percentage, 100)}%` }}
              />
            </div>
          </div>
        );
      })}

      {maxItems && categoryStats.length > maxItems && (
        <p className="text-xs text-center text-muted-foreground pt-1">
          +{categoryStats.length - maxItems} more categor
          {categoryStats.length - maxItems === 1 ? 'y' : 'ies'}
        </p>
      )}
    </div>
  );
}
