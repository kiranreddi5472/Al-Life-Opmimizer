import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import HealthCard from '../components/HealthCard';
import ProductivityCard from '../components/ProductivityCard';
import LifestyleCard from '../components/LifestyleCard';
import InsightsCard from '../components/InsightsCard';
import HabitTracker from '../components/HabitTracker';

const Dashboard = () => {
  const { user, api, logoutUser } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('dashboard/');
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard", err);
      }
    };
    fetchDashboard();
  }, [api]);

  const handleHabitUpdate = (updatedHabits) => {
    setData(prev => ({ ...prev, habits: updatedHabits }));
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Hello, {user?.first_name || user?.username}!</h2>
          <p>Welcome back to your AI Life Optimizer.</p>
        </div>
        <button className="btn btn-outline" onClick={logoutUser}>Logout</button>
      </div>

      {!data ? (
        <div className="flex-center" style={{ height: '50vh' }}>
          <p>Loading your personalized insights...</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          <HealthCard dietPlan={data.diet_plan} />
          <ProductivityCard habits={data.habits} />
          <LifestyleCard scores={data.intelligence?.scores} />
          <InsightsCard 
            status={data.intelligence?.status} 
            overallScore={data.intelligence?.scores?.overall_score} 
            insights={data.intelligence?.insights} 
          />
          <HabitTracker habits={data.habits || []} api={api} onHabitUpdate={handleHabitUpdate} />
        </div>
      )}
    </div>
  );
};
export default Dashboard;
