import { CATEGORY_CONFIG } from '@/lib/categories';
import type { Commitment, CommitmentCategory } from '@/types';

interface CategoryBarProps {
  commitments: Commitment[];
}

export interface CategoryTotal {
  category: CommitmentCategory;
  amount: number;
  percentage: number;
}

export function getCategoryTotals(commitments: Commitment[]): CategoryTotal[] {
  const totalAmount = commitments.reduce((sum, c) => sum + c.amount, 0);
  return (Object.keys(CATEGORY_CONFIG) as CommitmentCategory[])
    .map((category) => {
      const amount = commitments
        .filter((c) => c.category === category)
        .reduce((sum, c) => sum + c.amount, 0);
      return {
        category,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function CategoryBar({ commitments }: CategoryBarProps) {
  const categoryTotals = getCategoryTotals(commitments);

  if (categoryTotals.length === 0) return null;

  return (
    <div className="flex w-full h-2 rounded-full overflow-hidden">
      {categoryTotals.map(({ category, percentage }) => (
        <div
          key={category}
          className={`h-full ${CATEGORY_CONFIG[category].progressColor}`}
          style={{ width: `${percentage}%` }}
        />
      ))}
    </div>
  );
}
