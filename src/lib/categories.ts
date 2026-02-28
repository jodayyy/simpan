import {
  Home,
  Zap,
  Tv,
  Shield,
  CreditCard,
  Users,
  TrendingUp,
  Car,
  Package,
  type LucideIcon,
} from 'lucide-react';
import type { CommitmentCategory } from '@/types';

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  darkBgColor: string;
  darkTextColor: string;
  progressColor: string;
}

export const CATEGORY_CONFIG: Record<CommitmentCategory, CategoryConfig> = {
  rent: {
    label: 'Rent',
    icon: Home,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    darkBgColor: 'dark:bg-blue-900',
    darkTextColor: 'dark:text-blue-300',
    progressColor: 'bg-blue-500',
  },
  utilities: {
    label: 'Utilities',
    icon: Zap,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    darkBgColor: 'dark:bg-yellow-900',
    darkTextColor: 'dark:text-yellow-300',
    progressColor: 'bg-yellow-500',
  },
  subscriptions: {
    label: 'Subscriptions',
    icon: Tv,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    darkBgColor: 'dark:bg-purple-900',
    darkTextColor: 'dark:text-purple-300',
    progressColor: 'bg-purple-500',
  },
  insurance: {
    label: 'Insurance',
    icon: Shield,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    darkBgColor: 'dark:bg-green-900',
    darkTextColor: 'dark:text-green-300',
    progressColor: 'bg-green-500',
  },
  loan: {
    label: 'Loan',
    icon: CreditCard,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    darkBgColor: 'dark:bg-red-900',
    darkTextColor: 'dark:text-red-300',
    progressColor: 'bg-red-500',
  },
  family: {
    label: 'Family',
    icon: Users,
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800',
    darkBgColor: 'dark:bg-pink-900',
    darkTextColor: 'dark:text-pink-300',
    progressColor: 'bg-pink-500',
  },
  investment: {
    label: 'Investment',
    icon: TrendingUp,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    darkBgColor: 'dark:bg-emerald-900',
    darkTextColor: 'dark:text-emerald-300',
    progressColor: 'bg-emerald-500',
  },
  transport: {
    label: 'Transport',
    icon: Car,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    darkBgColor: 'dark:bg-orange-900',
    darkTextColor: 'dark:text-orange-300',
    progressColor: 'bg-orange-500',
  },
  other: {
    label: 'Other',
    icon: Package,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    darkBgColor: 'dark:bg-gray-900',
    darkTextColor: 'dark:text-gray-300',
    progressColor: 'bg-gray-500',
  },
};

export function getCategoryBadgeClass(category: CommitmentCategory): string {
  const config = CATEGORY_CONFIG[category];
  return `${config.bgColor} ${config.textColor} ${config.darkBgColor} ${config.darkTextColor}`;
}

export const CATEGORY_ORDER: CommitmentCategory[] = [
  'rent',
  'utilities',
  'subscriptions',
  'insurance',
  'loan',
  'family',
  'investment',
  'transport',
  'other',
];
