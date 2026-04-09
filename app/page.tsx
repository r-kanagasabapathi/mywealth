'use client';
import { useState, useEffect } from 'react';

interface Asset {
  name: string;
  asset_class: string;
  value_inr: number;
  currency: string;
}

interface Liability {
  name: string;
  amount: number;
}

interface PortfolioData {
  assets: Asset[];
  liabilities: Liability[];
}

interface AnalysisResult {
  net_worth: number;
  total_assets: number;
  total_liabilities: number;
  asset_allocation: Record<string, number>;
  allocation_percent: Record<string, number>;
  health_metrics: Record<string, number>;
  recommendations: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    assets: [
      { name: 'HDFC Bank', asset_class: 'equity', value_inr: 85000, currency: 'INR' },
      { name: 'Fixed Deposit', asset_class: 'debt', value_inr: 20000, currency: 'INR' },
      { name: 'Gold (grams)', asset_class: 'gold', value_inr: 5000, currency: 'INR' }
    ],
    liabilities: [
      { name: 'Home Loan', amount: 50000 }
    ]
  });

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [newAsset, setNewAsset] = useState('');
  const [newAssetValue, setNewAssetValue] = useState('');

  const analyzePortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolio)
      });
      const data = await res.json();
      setAnalysis(data);
      setActiveTab('analysis');
    } catch (error) {
      console.error('Failed to analyze portfolio', error);
    }
    setLoading(false);
  };

  const addAsset = () => {
    if (newAsset && newAssetValue) {
      setPortfolio(prev => ({
        ...prev,
        assets: [
          ...prev.assets,
          {
            name: newAsset,
            asset_class: 'equity',
            value_inr: parseFloat(newAssetValue),
            currency: 'INR'
          }
        ]
      }));
      setNewAsset('');
      setNewAssetValue('');
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#fafafa'
    },
    header: {
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#1a1a1a'
    },
    subtitle: {
      color: '#666',
      marginBottom: '2rem'
    },
    tabs: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      borderBottom: '2px solid #eaeaea',
      paddingBottom: '0'
    },
    tab: (active: boolean) => ({
      padding: '0.75rem 1.5rem',
      background: 'none',
      border: 'none',
      borderBottom: active ? '3px solid #0070f3' : 'none',
      color: active ? '#0070f3' : '#666',
      cursor: 'pointer',
      fontWeight: active ? '600' : '500',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    }),
    card: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #eaeaea',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#1a1a1a'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    statBox: {
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '8px',
      textAlign: 'center' as const
    },
    statValue: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    statLabel: {
      fontSize: '0.875rem',
      opacity: 0.9
    },
    button: {
      padding: '0.75rem 1.5rem',
      background: '#0070f3',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'background 0.3s ease'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
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
    assetList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    assetItem: {
      padding: '1rem',
      background: '#f5f5f5',
      borderRadius: '5px',
      marginBottom: '0.75rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    recommendation: (severity: string) => ({
      padding: '1rem',
      borderRadius: '5px',
      marginBottom: '0.75rem',
      borderLeft: `4px solid ${severity === 'warning' ? '#ff6b6b' : '#4dabf7'}`,
      background: severity === 'warning' ? '#fff3cd' : '#e7f5ff'
    }),
    tag: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      background: '#e7f5ff',
      color: '#0070f3',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600'
    }
  };

  const totalAssets = analysis?.total_assets || portfolio.assets.reduce((sum, a) => sum + a.value_inr, 0);
  const totalLiabilities = analysis?.total_liabilities || portfolio.liabilities.reduce((sum, l) => sum + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>💰 MyWealth Dashboard</h1>
        <p style={styles.subtitle}>Track your net worth, assets, and financial goals in one place</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button style={styles.tab(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button style={styles.tab(activeTab === 'assets')} onClick={() => setActiveTab('assets')}>
          Assets & Liabilities
        </button>
        <button style={styles.tab(activeTab === 'analysis')} onClick={() => setActiveTab('analysis')}>
          Analysis & Recommendations
        </button>
        <button style={styles.tab(activeTab === 'health')} onClick={() => setActiveTab('health')}>
          Financial Health
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div style={styles.grid}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>₹{netWorth.toLocaleString()}</div>
              <div style={styles.statLabel}>Net Worth</div>
            </div>
            <div style={{ ...styles.statBox, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <div style={styles.statValue}>₹{totalAssets.toLocaleString()}</div>
              <div style={styles.statLabel}>Total Assets</div>
            </div>
            <div style={{ ...styles.statBox, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <div style={styles.statValue}>₹{totalLiabilities.toLocaleString()}</div>
              <div style={styles.statLabel}>Total Liabilities</div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Quick Actions</div>
            <button 
              style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
              onClick={analyzePortfolio} 
              disabled={loading}
            >
              {loading ? 'Analyzing...' : '📊 Analyze Portfolio'}
            </button>
          </div>

          {analysis?.asset_allocation && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>Asset Allocation</div>
              <div style={styles.grid}>
                {Object.entries(analysis.allocation_percent).map(([asset, percent]) => (
                  <div key={asset} style={{
                    padding: '1rem',
                    background: '#f5f5f5',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0070f3' }}>
                      {percent.toFixed(1)}%
                    </div>
                    <div style={{ color: '#666', marginTop: '0.25rem', textTransform: 'capitalize' }}>
                      {asset}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Assets & Liabilities Tab */}
      {activeTab === 'assets' && (
        <>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Your Assets</div>
            <ul style={styles.assetList}>
              {portfolio.assets.map((asset, idx) => (
                <li key={idx} style={styles.assetItem}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{asset.name}</div>
                    <span style={styles.tag}>{asset.asset_class}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600' }}>₹{asset.value_inr.toLocaleString()}</div>
                    <div style={{ color: '#666', fontSize: '0.875rem' }}>
                      {((asset.value_inr / totalAssets) * 100).toFixed(1)}% of assets
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eaeaea' }}>
              <div style={styles.cardTitle}>Add New Asset</div>
              <input
                style={styles.input}
                placeholder="Asset name (e.g., HDFC Bank)"
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
              />
              <input
                style={styles.input}
                placeholder="Value in ₹"
                type="number"
                value={newAssetValue}
                onChange={(e) => setNewAssetValue(e.target.value)}
              />
              <button onClick={addAsset} style={styles.button}>Add Asset</button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Your Liabilities</div>
            <ul style={styles.assetList}>
              {portfolio.liabilities.map((liability, idx) => (
                <li key={idx} style={styles.assetItem}>
                  <div style={{ fontWeight: '600' }}>{liability.name}</div>
                  <div style={{ fontWeight: '600' }}>₹{liability.amount.toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && analysis && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📈 Portfolio Analysis</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ color: '#666' }}>Net Worth</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0070f3' }}>
                  ₹{analysis.net_worth.toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ color: '#666' }}>Debt to Asset Ratio</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0070f3' }}>
                  {analysis.health_metrics?.debt_to_asset_ratio?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>💡 Recommendations</div>
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} style={styles.recommendation(rec.severity)}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{rec.type.toUpperCase()}</div>
                  <div>{rec.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Financial Health Tab */}
      {activeTab === 'health' && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>❤️ Financial Health Check</div>
          <div style={styles.grid}>
            <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '5px', borderLeft: '4px solid #0070f3' }}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Emergency Fund</div>
              <div style={{ color: '#666' }}>3-6 months of expenses recommended</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#0070f3', fontWeight: '600' }}>
                Status: Recommended
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#fff3f0', borderRadius: '5px', borderLeft: '4px solid #ff6b6b' }}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Term Insurance</div>
              <div style={{ color: '#666' }}>10x annual income coverage</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#0070f3', fontWeight: '600' }}>
                Status: Recommended
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#f3f0ff', borderRadius: '5px', borderLeft: '4px solid #7c3aed' }}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Health Insurance</div>
              <div style={{ color: '#666' }}>Family coverage recommended</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#0070f3', fontWeight: '600' }}>
                Status: Recommended
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '5px', borderLeft: '4px solid #22c55e' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Diversification Score</div>
            <div style={{ fontSize: '1.5rem', color: '#22c55e', fontWeight: 'bold' }}>
              {portfolio.assets.length} Asset Classes
            </div>
            <div style={{ color: '#666', marginTop: '0.5rem' }}>
              {portfolio.assets.length >= 5 ? '✓ Good diversification' : 'Consider adding more asset classes'}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}