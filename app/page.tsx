'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzePortfolio = async () => {
    setLoading(true);
    const portfolioData = { equity_inr: 85000, debt_inr: 20000, gold_inr: 5000 };

    try {
        const res = await fetch('/api/recommendation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(portfolioData)
        });
        const data = await res.json();
        setRecommendation(data);
    } catch (error) {
        console.error("Failed to fetch recommendation", error);
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>My Portfolio Dashboard</h1>
      <p>Click below to run the Python recommendation engine.</p>
      
      <button 
        onClick={analyzePortfolio} 
        disabled={loading}
        style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {loading ? 'Analyzing...' : 'Analyze Allocation'}
      </button>
      
      {recommendation && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <h2>AI Recommendation</h2>
            <p><strong>Total Value:</strong> ₹{recommendation.total_value_inr}</p>
            <p><strong>Current Equity:</strong> {recommendation.current_equity_weight_percent}%</p>
            <p><strong>Action Required:</strong> <span style={{ color: '#d9381e'}}>{recommendation.recommended_action}</span></p>
        </div>
      )}
    </main>
  );
}