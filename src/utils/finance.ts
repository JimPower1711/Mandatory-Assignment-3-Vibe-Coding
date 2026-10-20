import type { FinanceData, Transaction } from '../types/finance'

export const formatNok = (value: number) =>
  new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    maximumFractionDigits: 0,
  }).format(value)

export const formatCompactNok = (value: number) =>
  new Intl.NumberFormat('nb-NO', {
    notation: 'compact',
    maximumFractionDigits: 0,
  }).format(value)

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(
    new Date(`${date}T12:00:00`),
  )

const monthKey = (date: string) => date.slice(0, 7)

export function getReportingMonth(transactions: Transaction[]) {
  return transactions.reduce(
    (latest, transaction) => Math.max(latest, new Date(`${transaction.date}T12:00:00`).getTime()),
    0,
  )
}
export function getDashboardMetrics(data: FinanceData) {
  const reportingDate = new Date(getReportingMonth(data.transactions))
  const reportKey = reportingDate.toISOString().slice(0, 7)
  const previousDate = new Date(reportingDate.getFullYear(), reportingDate.getMonth() - 1, 1)
  const previousKey = previousDate.toISOString().slice(0, 7)

  const monthTransactions = data.transactions.filter((item) => monthKey(item.date) === reportKey)
  const previousTransactions = data.transactions.filter((item) => monthKey(item.date) === previousKey)
  const monthlyIncome = monthTransactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)
  const monthlyExpenses = monthTransactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)
  const previousExpenses = previousTransactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)
  const cashBalance = data.transactions.reduce(
    (sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount),
    0,
  )
  const savingsTotal = data.savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const expenseChange = previousExpenses
    ? ((monthlyExpenses - previousExpenses) / previousExpenses) * 100
    : 0

  return {
    reportingDate,
    monthlyIncome,
    monthlyExpenses,
    availableBalance: cashBalance - savingsTotal,
    savingsTotal,
    savingsRate: monthlyIncome ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0,
    expenseChange,
  }
}

export function getMonthlyChartData(transactions: Transaction[]) {
  const totals = new Map<string, { income: number; expenses: number }>()

  for (const item of transactions) {
    const key = monthKey(item.date)
    const current = totals.get(key) ?? { income: 0, expenses: 0 }
    current[item.type === 'income' ? 'income' : 'expenses'] += item.amount
    totals.set(key, current)
  }

  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, value]) => ({
      key,
      month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(new Date(`${key}-01T12:00:00`)),
      ...value,
    }))
}

export function getExpenseCategories(transactions: Transaction[]) {
  const reportingMonth = new Date(getReportingMonth(transactions)).toISOString().slice(0, 7)
  const categories = new Map<string, number>()

  for (const item of transactions) {
    if (item.type === 'expense' && monthKey(item.date) === reportingMonth) {
      categories.set(item.category, (categories.get(item.category) ?? 0) + item.amount)
    }
  }

  return [...categories.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}
