import React from 'react';
import { Moon, Monitor, Smile, Target } from 'lucide-react';

const LifestyleCard = ({ scores }) => {
  if (!scores) return null;

  return (
    <div className="glass-card">
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h3>Lifestyle</h3>
        <Smile color="var(--primary-color)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="flex-between" style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Moon size={18} color="var(--secondary-color)" />
            <span>Sleep Score</span>
          </div>
          <span style={{ fontWeight: 600 }}>{scores.sleep_score}/100</span>
        </div>
        <div className="flex-between" style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Monitor size={18} color="var(--warning-color)" />
            <span>Screen Time</span>
          </div>
          <span style={{ fontWeight: 600 }}>{scores.screen_score}/100</span>
        </div>
        <div className="flex-between" style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} color="var(--primary-color)" />
            <span>Habits</span>
          </div>
          <span style={{ fontWeight: 600 }}>{scores.habit_score}/100</span>
        </div>
      </div>
    </div>
  );
};
export default LifestyleCard;
