import type { FinanceData } from '../types/finance'

export type AnalyticsPeriod = 3 | 6 | 'all'

export interface MonthlyAnalytics {
  key: string
  month: string
  fullMonth: string
  income: number
  expenses: number
  net: number
  contributions: number
  withdrawals: number
}

export interface CategoryAnalytics {
  name: string
  value: number
  share: number
}

const monthKey = (date: string) => date.slice(0, 7)

function toMonthDate(key: string) {
  return new Date(`${key}-01T12:00:00`)
}

function getMonthKeys(data: FinanceData, period: AnalyticsPeriod) {
  const eventDates = [
    ...data.transactions.map((item) => item.date),
    ...data.savingsActivities.map((item) => item.date),
  ].sort()
  const latestKey = eventDates.at(-1)?.slice(0, 7) ?? new Date().toISOString().slice(0, 7)
  const earliestKey = eventDates[0]?.slice(0, 7) ?? latestKey
  const latest = toMonthDate(latestKey)
  const start = period === 'all'
    ? toMonthDate(earliestKey)
    : new Date(latest.getFullYear(), latest.getMonth() - period + 1, 1, 12)

  const keys: string[] = []
  const cursor = new Date(start)
  while (cursor <= latest) {
    keys.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`)
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return keys
}

export function getAnalytics(data: FinanceData, period: AnalyticsPeriod) {
  const keys = getMonthKeys(data, period)
  const keySet = new Set(keys)
  const transactions = data.transactions.filter((item) => keySet.has(monthKey(item.date)))
  const activities = data.savingsActivities.filter((item) => keySet.has(monthKey(item.date)))

  const monthly: MonthlyAnalytics[] = keys.map((key) => {
    const monthTransactions = transactions.filter((item) => monthKey(item.date) === key)
    const monthActivities = activities.filter((item) => monthKey(item.date) === key)
    const income = monthTransactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    const expenses = monthTransactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)
    const contributions = monthActivities
      .filter((item) => item.type === 'contribution')
      .reduce((sum, item) => sum + item.amount, 0)
    const withdrawals = monthActivities
      .filter((item) => item.type === 'withdrawal')
      .reduce((sum, item) => sum + item.amount, 0)
    const date = toMonthDate(key)

    return {
      key,
      month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date),
      fullMonth: new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(date),
      income,
      expenses,
      net: income - expenses,
      contributions,
      withdrawals,
    }
  })

  const totalIncome = monthly.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = monthly.reduce((sum, item) => sum + item.expenses, 0)
  const totalContributions = monthly.reduce((sum, item) => sum + item.contributions, 0)
  const totalWithdrawals = monthly.reduce((sum, item) => sum + item.withdrawals, 0)
  const categoryTotals = new Map<string, number>()

  transactions.forEach((item) => {
    if (item.type === 'expense') {
      categoryTotals.set(item.category, (categoryTotals.get(item.category) ?? 0) + item.amount)
    }
  })

  const categories: CategoryAnalytics[] = [...categoryTotals.entries()]
    .map(([name, value]) => ({ name, value, share: totalExpenses ? (value / totalExpenses) * 100 : 0 }))
    .sort((a, b) => b.value - a.value)

  const bestMonth = monthly.reduce<MonthlyAnalytics | null>(
    (best, item) => !best || item.net > best.net ? item : best,
    null,
  )
  const highestSpendMonth = monthly.reduce<MonthlyAnalytics | null>(
    (highest, item) => !highest || item.expenses > highest.expenses ? item : highest,
    null,
  )
  const lastMonth = monthly.at(-1)
  const previousMonth = monthly.at(-2)
  const expenseTrend = previousMonth?.expenses
    ? (((lastMonth?.expenses ?? 0) - previousMonth.expenses) / previousMonth.expenses) * 100
    : 0
  const totalSaved = data.savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalGoalTargets = data.savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)

  return {
    monthly,
    categories,
    totalIncome,
    totalExpenses,
    netCashFlow: totalIncome - totalExpenses,
    averageMonthlySpend: monthly.length ? totalExpenses / monthly.length : 0,
    cashFlowMargin: totalIncome ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
    totalContributions,
    totalWithdrawals,
    netSavingsMovement: totalContributions - totalWithdrawals,
    expenseTrend,
    bestMonth,
    highestSpendMonth,
    topCategory: categories[0] ?? null,
    totalSaved,
    goalProgress: totalGoalTargets ? (totalSaved / totalGoalTargets) * 100 : 0,
    periodLabel: formatPeriodLabel(keys),
  }
}

function formatPeriodLabel(keys: string[]) {
  if (!keys.length) return 'No activity'
  const first = toMonthDate(keys[0])
  const last = toMonthDate(keys.at(-1)!)
  const firstLabel = new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: first.getFullYear() === last.getFullYear() ? undefined : 'numeric',
  }).format(first)
  const lastLabel = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(last)
  return firstLabel === lastLabel ? lastLabel : `${firstLabel} – ${lastLabel}`
}
