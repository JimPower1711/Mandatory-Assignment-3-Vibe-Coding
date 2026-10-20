import { useState } from 'react'
import { demoData } from '../data/demoData'
import type {
  FinanceData,
  SavingsGoalDetails,
  SavingsGoalDraft,
  SavingsTransferDraft,
  TransactionDraft,
} from '../types/finance'

const STORAGE_KEY = 'wealth-tracker:data:v1'

const SAVINGS_COLOR_MIGRATION: Record<string, string> = {
  '#8b5cf6': '#9B7AFF',
  '#22d3ee': '#B39AFF',
  '#f59e0b': '#7E63D3',
  '#34d399': '#9B7AFF',
  '#fb7185': '#7E63D3',
  '#60a5fa': '#B39AFF',
  '#d9fa72': '#9B7AFF',
  '#a5b2a8': '#B39AFF',
  '#f5f6f0': '#7E63D3',
  '#4f8cff': '#9B7AFF',
  '#94a3b8': '#B39AFF',
  '#f0a18b': '#7E63D3',
  '#f5f7fb': '#6A55AD',
  '#9b7aff': '#9B7AFF',
  '#b39aff': '#B39AFF',
  '#7e63d3': '#7E63D3',
  '#6a55ad': '#6A55AD',
  '#9695aa': '#B39AFF',
  '#ff766c': '#7E63D3',
  '#f5f5f8': '#6A55AD',
  '#b8cb7b': '#9B7AFF',
  '#7f9185': '#B39AFF',
}

function normalizeSavingsColor(color: string) {
  return SAVINGS_COLOR_MIGRATION[color.toLowerCase()] ?? '#9B7AFF'
}

function loadFinanceData(): FinanceData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<FinanceData>
      const normalized: FinanceData = {
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : demoData.transactions,
        savingsGoals: (Array.isArray(parsed.savingsGoals) ? parsed.savingsGoals : demoData.savingsGoals)
          .map((goal) => ({ ...goal, color: normalizeSavingsColor(goal.color) })),
        savingsActivities: Array.isArray(parsed.savingsActivities)
          ? parsed.savingsActivities
          : demoData.savingsActivities,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      return normalized
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData))
  } catch {
    // The in-memory demo still keeps the dashboard usable if storage is blocked.
  }

  return demoData
}

export function useFinanceData() {
  const [data, setData] = useState<FinanceData>(loadFinanceData)

  const updateData = (updater: (current: FinanceData) => FinanceData) => {
    setData((current) => {
      const next = updater(current)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // State remains usable for this session if storage becomes unavailable.
      }
      return next
    })
  }

  const addTransaction = (transaction: TransactionDraft) => {
    const id = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `transaction-${Date.now()}`
    updateData((current) => ({
      ...current,
      transactions: [...current.transactions, { ...transaction, id }],
    }))
  }

  const updateTransaction = (id: string, transaction: TransactionDraft) => {
    updateData((current) => ({
      ...current,
      transactions: current.transactions.map((item) =>
        item.id === id ? { ...transaction, id } : item,
      ),
    }))
  }

  const deleteTransaction = (id: string) => {
    updateData((current) => ({
      ...current,
      transactions: current.transactions.filter((item) => item.id !== id),
    }))
  }

  const addSavingsGoal = (goal: SavingsGoalDraft) => {
    const id = createId('goal')
    updateData((current) => {
      const cashBalance = current.transactions.reduce(
        (sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount),
        0,
      )
      const savedTotal = current.savingsGoals.reduce((sum, item) => sum + item.currentAmount, 0)
      if (goal.currentAmount > cashBalance - savedTotal) return current

      return {
        ...current,
        savingsGoals: [...current.savingsGoals, { ...goal, id }],
        savingsActivities: goal.currentAmount > 0
          ? [...current.savingsActivities, {
              id: createId('activity'),
              goalId: id,
              type: 'contribution',
              amount: goal.currentAmount,
              date: new Date().toISOString().slice(0, 10),
              note: 'Initial deposit',
            }]
          : current.savingsActivities,
      }
    })
  }

  const updateSavingsGoal = (id: string, details: SavingsGoalDetails) => {
    updateData((current) => ({
      ...current,
      savingsGoals: current.savingsGoals.map((goal) =>
        goal.id === id ? { ...goal, ...details } : goal,
      ),
    }))
  }

  const deleteSavingsGoal = (id: string) => {
    updateData((current) => ({
      ...current,
      savingsGoals: current.savingsGoals.filter((goal) => goal.id !== id),
      savingsActivities: current.savingsActivities.filter((activity) => activity.goalId !== id),
    }))
  }

  const transferSavings = (goalId: string, transfer: SavingsTransferDraft) => {
    updateData((current) => {
      const goal = current.savingsGoals.find((item) => item.id === goalId)
      if (!goal || transfer.amount <= 0) return current
      if (transfer.type === 'withdrawal' && transfer.amount > goal.currentAmount) return current

      if (transfer.type === 'contribution') {
        const cashBalance = current.transactions.reduce(
          (sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount),
          0,
        )
        const savedTotal = current.savingsGoals.reduce((sum, item) => sum + item.currentAmount, 0)
        if (transfer.amount > cashBalance - savedTotal) return current
      }

      return {
        ...current,
        savingsGoals: current.savingsGoals.map((item) => {
          if (item.id !== goalId) return item
          const change = transfer.type === 'contribution' ? transfer.amount : -transfer.amount
          return { ...item, currentAmount: item.currentAmount + change }
        }),
        savingsActivities: [...current.savingsActivities, {
          ...transfer,
          id: createId('activity'),
          goalId,
        }],
      }
    })
  }

  return {
    data,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    transferSavings,
  }
}

function createId(prefix: string) {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
