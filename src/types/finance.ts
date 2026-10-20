export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
}

export type TransactionDraft = Omit<Transaction, 'id'>

export interface SavingsGoal {
  id: string
  name: string
  currentAmount: number
  targetAmount: number
  deadline: string
  color: string
}

export type SavingsGoalDraft = Omit<SavingsGoal, 'id'>
export type SavingsGoalDetails = Omit<SavingsGoal, 'id' | 'currentAmount'>

export type SavingsActivityType = 'contribution' | 'withdrawal'

export interface SavingsActivity {
  id: string
  goalId: string
  type: SavingsActivityType
  amount: number
  date: string
  note: string
}

export type SavingsTransferDraft = Omit<SavingsActivity, 'id' | 'goalId'>

export interface FinanceData {
  transactions: Transaction[]
  savingsGoals: SavingsGoal[]
  savingsActivities: SavingsActivity[]
}

export type AppView = 'dashboard' | 'transactions' | 'goals' | 'analytics'
