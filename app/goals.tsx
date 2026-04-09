'use client';
import { useState } from 'react';

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_year: number;
  priority: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: 'Emergency Fund',
      target_amount: 500000,
      current_amount: 150000,
      target_year: 2026,
      priority: 'high'
    },
    {
      id: 2,
      name: 'Retirement Corpus',
      target_amount: 5000000,
      current_amount: 850000,
      target_year: 2035,
      priority: 'high'
    },
    {
      id: 3,
      name: 'Vacation Fund',
      target_amount: 200000,
      current_amount: 45000,
      target_year: 2027,
      priority: 'medium'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    name: '',
    target_amount: '',
    current_amount: '0',
    target_year: new Date().getFullYear() + 1,
    priority: 'medium'
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
    goalItem: {
      padding: '1.5rem',
      background: '#f9f9f9',
      borderRadius: '8px',
      marginBottom: '1rem',
      borderLeft: '4px solid #0070f3'
    },
    progressBar: {
      height: '8px',
      background: '#e0e0e0',
      borderRadius: '4px',
      marginTop: '0.75rem',
      overflow: 'hidden'
    },
    progressFill: (progress: number) => ({
      height: '100%',
      width: `${Math.min(progress, 100)}%`,
      background: 'linear-gradient(90deg, #0070f3, #667eea)',
      transition: 'width 0.3s ease'
    }),
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
    priorityBadge: (priority: string) => ({
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      background: priority === 'high' ? '#fee2e2' : priority === 'medium' ? '#fef3c7' : '#dbeafe',
      color: priority === 'high' ? '#991b1b' : priority === 'medium' ? '#92400e' : '#1e40af'
    })
  };

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const addGoal = () => {
    if (newGoal.name && newGoal.target_amount) {
      const goal: Goal = {
        id: goals.length + 1,
        name: newGoal.name,
        target_amount: parseFloat(newGoal.target_amount),
        current_amount: parseFloat(newGoal.current_amount),
        target_year: newGoal.target_year,
        priority: newGoal.priority
      };
      setGoals([...goals, goal]);
      setNewGoal({
        name: '',
        target_amount: '',
        current_amount: '0',
        target_year: new Date().getFullYear() + 1,
        priority: 'medium'
      });
    }
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🎯 Financial Goals</h1>

      <div style={styles.card}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your Goals</h2>
        {goals.map(goal => {
          const progress = calculateProgress(goal.current_amount, goal.target_amount);
          return (
            <div key={goal.id} style={styles.goalItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                    {goal.name}
                  </h3>
                  <span style={styles.priorityBadge(goal.priority)}>
                    {goal.priority.toUpperCase()}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                    ₹{goal.current_amount.toLocaleString()} / ₹{goal.target_amount.toLocaleString()}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.875rem' }}>
                    Target: {goal.target_year}
                  </div>
                </div>
              </div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill(progress)}></div>
              </div>
              <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
                {progress.toFixed(1)}% complete • ₹{(goal.target_amount - goal.current_amount).toLocaleString()} remaining
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.card}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add New Goal</h2>
        <input
          style={styles.input}
          placeholder="Goal name (e.g., House Down Payment)"
          value={newGoal.name}
          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Target amount (₹)"
          type="number"
          value={newGoal.target_amount}
          onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Current amount (₹)"
          type="number"
          value={newGoal.current_amount}
          onChange={(e) => setNewGoal({ ...newGoal, current_amount: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Target year"
          type="number"
          value={newGoal.target_year}
          onChange={(e) => setNewGoal({ ...newGoal, target_year: parseInt(e.target.value) })}
        />
        <select
          style={styles.input}
          value={newGoal.priority}
          onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button style={styles.button} onClick={addGoal}>Add Goal</button>
      </div>
    </main>
  );
}
