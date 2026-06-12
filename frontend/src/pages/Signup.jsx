import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '',
    age: '', gender: 'Male', height: '', weight: '', goal: 'Maintain',
    wake_up_time: '07:00:00', sleep_time: '23:00:00', work_hours: '8', exercise_preference: false
  });
  const { setTokens, api } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleStep1 = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/register/step1/', {
        username: formData.username, email: formData.email, password: formData.password
      });
      setTokens(res.data.tokens);
      setStep(2);
    } catch (err) {
      alert("Error: " + JSON.stringify(err.response?.data));
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/register/step2/', {
        age: formData.age, gender: formData.gender, height: formData.height, weight: formData.weight, goal: formData.goal
      });
      setStep(3);
    } catch (err) {
      alert("Error: " + JSON.stringify(err.response?.data));
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/register/step3/', {
        wake_up_time: formData.wake_up_time, sleep_time: formData.sleep_time, 
        work_hours: formData.work_hours, exercise_preference: formData.exercise_preference
      });
      navigate('/');
    } catch (err) {
      alert("Error: " + JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '100vh' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>AI Life Optimizer</h2>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <span className={`status-badge ${step >= 1 ? 'status-good' : 'status-average'}`}>1. Account</span>
            <span className={`status-badge ${step >= 2 ? 'status-good' : 'status-average'}`}>2. Physical</span>
            <span className={`status-badge ${step >= 3 ? 'status-good' : 'status-average'}`}>3. Lifestyle</span>
        </div>
        
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" name="username" className="form-input" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Next Step</button>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>Already have an account? <Link to="/login" style={{color: 'var(--primary-color)'}}>Login</Link></p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2}>
            <div className="flex-between" style={{ gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Age (10-100)</label>
                <input type="number" name="age" className="form-input" min="10" max="100" value={formData.age} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Gender</label>
                <select name="gender" className="form-input" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex-between" style={{ gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Height (cm)</label>
                <input type="number" name="height" className="form-input" min="100" max="250" value={formData.height} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Weight (kg)</label>
                <input type="number" name="weight" className="form-input" min="30" max="200" value={formData.weight} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Primary Goal</label>
              <select name="goal" className="form-input" value={formData.goal} onChange={handleChange}>
                <option value="Lose">Lose Weight</option>
                <option value="Maintain">Maintain Weight</option>
                <option value="Gain">Gain Muscle/Weight</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Next Step</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3}>
            <div className="flex-between" style={{ gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Wake Up Time</label>
                <input type="time" name="wake_up_time" className="form-input" value={formData.wake_up_time} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Sleep Time</label>
                <input type="time" name="sleep_time" className="form-input" value={formData.sleep_time} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Work/Study Hours (1-16)</label>
              <input type="number" name="work_hours" className="form-input" min="1" max="16" value={formData.work_hours} onChange={handleChange} required />
            </div>
            <div className="form-group flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input type="checkbox" name="exercise_preference" id="exercise" checked={formData.exercise_preference} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <label htmlFor="exercise" className="form-label" style={{ marginBottom: 0 }}>I exercise regularly</label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Complete Profile</button>
          </form>
        )}
      </div>
    </div>
  );
};
export default Signup;
