 import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const colors = {
  ink: '#16233F',
  chalk: '#F3F5F1',
  charcoal: '#1B2027',
  gold: '#C8912B',
  slate: '#5B6472'
};

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    teacherCode: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      navigate('/login');
    } catch (err) {
      setError('Could not connect to server');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid #E4E3DC`,
    fontFamily: 'Work Sans, sans-serif',
    fontSize: '14px',
    marginTop: '4px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontFamily: 'Work Sans, sans-serif',
    fontSize: '13px',
    fontWeight: 600,
    color: colors.charcoal
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.chalk,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Work Sans, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '32px 28px',
        boxShadow: '0 10px 30px rgba(22, 35, 63, 0.08)'
      }}>
        <h2 style={{
          fontFamily: 'Fraunces, serif',
          color: colors.ink,
          fontSize: '22px',
          marginBottom: '20px'
        }}>
          Create your HEROES SchoolGist account
        </h2>

        {error && (
          <p style={{ color: '#B3261E', fontSize: '13px', marginBottom: '12px' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {formData.role === 'teacher' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Teacher Code (from admin)</label>
              <input
                type="text"
                name="teacherCode"
                value={formData.teacherCode}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: colors.gold,
              color: colors.charcoal,
              fontFamily: 'Work Sans, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: '16px', fontSize: '13px', color: colors.slate, textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: colors.ink, fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;