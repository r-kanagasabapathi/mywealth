'use client';
import { useState } from 'react';

interface IncomeExpense {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  month: number;
  year: number;
}

interface NewEntryType {
  type: 'income' | 'expense';
  category: string;
  amount: string;
  month: number;
  year: number;
}

export default function CashFlowPage() {
  const [entries, setEntries] = useState<IncomeExpense[]>([
    { id: 1, type: 'income', category: 'Salary', amount: 75000, month: 4, year: 2026 },
    { id: 2, type: 'income', category: 'Freelance', amount: 15000, month: 4, year: 2026 },
    { id: 3, type: 'expense', category: 'Rent', amount: 25000, month: 4, year: 2026 },
    { id: 4, type: 'expense', category: 'Groceries', amount: 8000, month: 4, year: 2026 },
    { id: 5, type: 'expense', category: 'Utilities', amount: 3000, month: 4, year: 2026 },
  ]);

  const [newEntry, setNewEntry] = useState<NewEntryType>({
    type: 'income',
    category: '',
    amount: '',
    month: 4,
    year: 2026
  });

  const styles = {
    container: {
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    },
    card: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #eaeaea',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      color: '#1a1a1a'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    statBox: (color: string) => ({
      padding: '1.5rem',
      background: `linear-gradient(135deg, ${color}0d 0%, ${color}1a 100%)`,
      border: `2px solid ${color}`,
      borderRadius: '8px',
      textAlign: 'center' as const
    }),
    statValue: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    statLabel: {
      color: '#666',
      fontSize: '0.875rem'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    th: {
      textAlign: 'left' as const,
      padding: '0.75rem',
      borderBottom: '2px solid #eaeaea',
      fontWeight: '600',
      color: '#1a1a1a'
    },
    td: {
      padding: '0.75rem',
      borderBottom: '1px solid #eaeaea'
    },
    input: {
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '1rem',
      width: '100%',
      marginBottom: '0.75rem',
      boxSizing: 'border-box' as const
    },
    button: {
      padding: '0.75rem 1.5rem',
      background: '#0070f3',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem'
    },
    tag: (type: string) => ({
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      background: type === 'income' ? '#d1fae5' : '#fee2e2',
      color: type === 'income' ? '#065f46' : '#991b1b'
    })
  };

  const totalIncome = entries
    .filter(e => e.type === 'income' && e.month === newEntry.month && e.year === newEntry.year)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = entries
    .filter(e => e.type === 'expense' && e.month === newEntry.month && e.year === newEntry.year)
    .reduce((sum, e) => sum + e.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const addEntry = () => {
    if (newEntry.category && newEntry.amount) {
      const entry: IncomeExpense = {
        id: entries.length + 1,
        type: newEntry.type,
        category: newEntry.category,
        amount: parseFloat(newEntry.amount),
        month: newEntry.month,
        year: newEntry.year
      };
      setEntries([...entries, entry]);
      setNewEntry({
        type: 'income',
        category: '',
        amount: '',
        month: newEntry.month,
        year: newEntry.year
      });
    }
  };

  const monthName = new Date(newEntry.year, newEntry.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>💵 Income & Expenses</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statBox('#10b981')}>
          <div style={styles.statValue}>₹{totalIncome.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Income</div>
          <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.25rem' }}>{monthName}</div>
        </div>
        <div style={styles.statBox('#ef4444')}>
          <div style={styles.statValue}>₹{totalExpenses.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Expenses</div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>{monthName}</div>
        </div>
        <div style={styles.statBox('#3b82f6')}>
          <div style={styles.statValue}>₹{netSavings.toLocaleString()}</div>
          <div style={styles.statLabel}>Net Savings</div>
          <div style={{ fontSize: '0.75rem', color: '#1d4ed8', marginTop: '0.25rem' }}>Savings Rate: {savingsRate.toFixed(1)}%</div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Transactions - {monthName}</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {entries
              .filter(e => e.month === newEntry.month && e.year === newEntry.year)
              .map(entry => (
              <tr key={entry.id}>
                <td style={styles.td}>
                  <span style={styles.tag(entry.type)}>
                    {entry.type.toUpperCase()}
                  </span>
                </td>
                <td style={styles.td}>{entry.category}</td>
                <td style={styles.td}>
                  <span style={{ fontWeight: '600', color: entry.type === 'income' ? '#10b981' : '#ef4444' }}>
                    {entry.type === 'expense' ? '−' : '+'}₹{entry.amount.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add New Entry</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <select
            style={styles.input}
            value={newEntry.type}
            onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as 'income' | 'expense' })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            style={styles.input}
            value={newEntry.month}
            onChange={(e) => setNewEntry({ ...newEntry, month: parseInt(e.target.value) })}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
              <option key={m} value={m}>
                {new Date(2026, m - 1).toLocaleDateString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <input
          style={styles.input}
          placeholder={newEntry.type === 'income' ? 'Income source (e.g., Salary)' : 'Expense category (e.g., Rent)'}
          value={newEntry.category}
          onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Amount (₹)"
          type="number"
          value={newEntry.amount}
          onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
        />
        <button style={styles.button} onClick={addEntry}>Add {newEntry.type === 'income' ? 'Income' : 'Expense'}</button>
      </div>
    </main>
  );
}
