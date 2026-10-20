import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { useFinanceData } from './hooks/useFinanceData'
import { Analytics } from './pages/Analytics'
import { Dashboard } from './pages/Dashboard'
import { SavingsGoals } from './pages/SavingsGoals'
import { Transactions } from './pages/Transactions'
import type { AppView } from './types/finance'
import { getDashboardMetrics } from './utils/finance'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const {
    data,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    transferSavings,
  } = useFinanceData()

  const content = currentView === 'dashboard'
    ? <Dashboard data={data} onNavigate={setCurrentView} />
    : currentView === 'transactions'
      ? <Transactions transactions={data.transactions} onAdd={addTransaction} onUpdate={updateTransaction} onDelete={deleteTransaction} />
      : currentView === 'goals'
        ? <SavingsGoals goals={data.savingsGoals} activities={data.savingsActivities} availableBalance={getDashboardMetrics(data).availableBalance} onAdd={addSavingsGoal} onUpdate={updateSavingsGoal} onDelete={deleteSavingsGoal} onTransfer={transferSavings} />
        : <Analytics data={data} />

  return (
    <AppShell currentView={currentView} onSelect={setCurrentView}>
      {content}
    </AppShell>
  )
}

export default App
