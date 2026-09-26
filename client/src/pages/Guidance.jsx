import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const colors = {
  ink: '#16233F',
  chalk: '#F3F5F1',
  charcoal: '#1B2027',
  gold: '#C8912B',
  slate: '#5B6472',
  pine: '#2E7D5B'
};

const guidanceTypes = ['WAEC Registration', 'JAMB Registration', 'NECO Registration', 'GCE Registration', 'Admission Guidance', 'Other'];

function Guidance() {
  const [user, setUser] = useState(null);
  const [myGuidance, setMyGuidance] = useState([]);
  const [guidanceType, setGuidanceType] = useState(guidanceTypes[0]);
  const [guidanceMessage, setGuidanceMessage] = useState('');
  const navigate = useNavigate();

  const fetchMyGuidance = useCallback(async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/guidance/student/${studentId}`);
      const data = await response.json();
      setMyGuidance(data);
    } catch (err) {
      setMyGuidance([]);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchMyGuidance(parsedUser.id);
  }, [navigate, fetchMyGuidance]);

  const handleGuidanceSubmit = async (e) => {
    e.preventDefault();
    if (!guidanceMessage.trim()) return;

    try {
      await fetch('http://localhost:5000/api/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          studentName: user.name,
          requestType: guidanceType,
          message: guidanceMessage
        })
      });
      setGuidanceMessage('');
      fetchMyGuidance(user.id);
    } catch (err) {
      alert('Could not send request, check your connection');
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: colors.chalk, fontFamily: 'Work Sans, sans-serif', padding: '20px' }}>

      <button
        onClick={() => navigate('/student-dashboard')}
        style={{ background: 'none', border: 'none', color: colors.slate, fontSize: '13px', marginBottom: '16px', cursor: 'pointer' }}
      >
        Back to Home
      </button>

      <div style={{ background: '#FFFFFF', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '18px' }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '10px' }}>
          Registration and Admission Guidance
        </h3>

        <form onSubmit={handleGuidanceSubmit}>
          <select
            value={guidanceType}
            onChange={(e) => setGuidanceType(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E4E3DC', marginBottom: '10px' }}
          >
            {guidanceTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <textarea
            value={guidanceMessage}
            onChange={(e) => setGuidanceMessage(e.target.value)}
            placeholder="Describe what you need help with..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #E4E3DC',
              fontFamily: 'Work Sans, sans-serif',
              fontSize: '13.5px',
              marginBottom: '10px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              background: colors.ink,
              color: '#fff',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Send Request
          </button>
        </form>

        {myGuidance.length > 0 && (
          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myGuidance.map((g) => (
              <div key={g._id} style={{ background: colors.chalk, borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontSize: '12px', color: colors.gold, fontWeight: 600, marginBottom: '2px' }}>{g.requestType}</p>
                <p style={{ fontSize: '13px', color: colors.charcoal, marginBottom: '6px' }}>{g.message}</p>
                {g.status === 'answered' ? (
                  <p style={{ fontSize: '13px', color: colors.pine }}>
                    {g.respondedBy}: {g.response}
                  </p>
                ) : (
                  <p style={{ fontSize: '12px', color: colors.slate, fontStyle: 'italic' }}>
                    Waiting for a response...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Guidance;