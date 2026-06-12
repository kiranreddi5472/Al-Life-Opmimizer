import React from 'react';
import { Activity, Flame } from 'lucide-react';

const HealthCard = ({ dietPlan }) => {
  if (!dietPlan) return <div className="glass-card">Loading health data...</div>;

  return (
    <div className="glass-card">
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h3>Health & Diet</h3>
        <Activity color="var(--primary-color)" />
      </div>
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <div>
          <p className="form-label">BMI</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-color)' }}>{dietPlan.bmi}</p>
        </div>
        <span className={`status-badge ${dietPlan.category === 'Normal' ? 'status-good' : 'status-average'}`}>
          {dietPlan.category}
        </span>
      </div>
      <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }}>
        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
          <p className="form-label" style={{ marginBottom: 0 }}>Daily Target</p>
          <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
            <Flame size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
            {dietPlan.daily_calorie_target} kcal
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>P: {dietPlan.protein}g</span> &bull; 
          <span>C: {dietPlan.carbs}g</span> &bull; 
          <span>F: {dietPlan.fats}g</span>
        </div>
      </div>
    </div>
  );
};
export default HealthCard;
