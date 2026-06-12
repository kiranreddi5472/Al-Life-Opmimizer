import React, { useState } from 'react';
import { Target, Plus, Check } from 'lucide-react';

const HabitTracker = ({ habits, api, onHabitUpdate }) => {
  const [newHabit, setNewHabit] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    try {
      const res = await api.post('habits/', { name: newHabit });
      onHabitUpdate([...habits, res.data]);
      setNewHabit('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (habit) => {
    try {
      const res = await api.post(`habits/${habit.id}/log/`, { completed: true });
      const updatedHabits = habits.map(h => 
        h.id === habit.id ? { ...h, streak_count: res.data.streak } : h
      );
      onHabitUpdate(updatedHabits);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h3>Habit Tracker</h3>
        <Target color="var(--primary-color)" />
      </div>

      <form onSubmit={handleAdd} className="flex-between" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="New habit (e.g. Drink Water)" 
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
          <Plus size={20} />
        </button>
      </form>

      {habits.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '1rem' }}>No habits added yet. Start tracking!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {habits.map(habit => (
            <div key={habit.id} className="flex-between" style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <div>
                <p style={{ fontWeight: 500, color: 'var(--text-color)' }}>{habit.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🔥 Streak: {habit.streak_count} days</p>
              </div>
              <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }} onClick={() => handleComplete(habit)} title="Mark Complete">
                <Check size={18} color="var(--secondary-color)" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default HabitTracker;
