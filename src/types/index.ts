import type { User } from 'firebase/auth';

// Auth types
export interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

// Commitment types
export type CommitmentCategory =
  | 'rent'
  | 'utilities'
  | 'subscriptions'
  | 'insurance'
  | 'loan'
  | 'family'
  | 'investment'
  | 'transport'
  | 'other';

export interface Commitment {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: CommitmentCategory;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommitmentState {
  commitments: Commitment[];
  setCommitments: (commitments: Commitment[]) => void;
  addCommitment: (commitment: Omit<Commitment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCommitment: (id: string, updates: Partial<Commitment>) => void;
  deleteCommitment: (id: string) => void;
  togglePaid: (id: string) => void;
}

// Savings Goal types
export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingsGoalState {
  goals: SavingsGoal[];
  setGoals: (goals: SavingsGoal[]) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  addContribution: (id: string, amount: number) => void;
}

// User Profile types
export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  salary: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  updateUsername: (username: string) => Promise<void>;
  updateSalary: (salary: number | null) => Promise<void>;
}
