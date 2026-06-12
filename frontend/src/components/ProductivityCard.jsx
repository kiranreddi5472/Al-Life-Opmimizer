import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

const ProductivityCard = ({ habits }) => {
  const totalHabits = habits?.length || 0;
  const activeStreaks = habits?.filter(h => h.streak_count > 0).length || 0;
  const completionPercentage = totalHabits > 0 ? Math.round((activeStreaks / totalHabits) * 100) : 0;

  return (
    <div className="glass-card">
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h3>Productivity</h3>
        <TrendingUp color="var(--primary-color)" />
      </div>
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <div>
          <p className="form-label">Habit Consistency</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-color)' }}>{completionPercentage}%</p>
        </div>
      </div>
      <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          You have <strong>{activeStreaks}</strong> active streaks out of {totalHabits} total habits.
        </p>
      </div>
    </div>
  );
};
export default ProductivityCard;
