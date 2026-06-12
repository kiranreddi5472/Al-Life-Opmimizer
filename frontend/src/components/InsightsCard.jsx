import React from 'react';
import { Sparkles } from 'lucide-react';

const InsightsCard = ({ status, overallScore, insights }) => {
  return (
    <div className="glass-card">
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h3>AI Insights</h3>
        <Sparkles color="var(--primary-color)" />
      </div>
      
      <div className="flex-between" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
        <div>
          <p className="form-label">Overall Health Score</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-color)' }}>{overallScore}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <span className={`status-badge ${status === 'Good' ? 'status-good' : status === 'Average' ? 'status-average' : 'status-poor'}`}>
            Status: {status}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {insights && insights.map((insight, idx) => (
          <div key={idx} style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', margin: 0 }}>{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InsightsCard;
