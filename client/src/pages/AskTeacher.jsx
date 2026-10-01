 import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://heroes-schoolgist.onrender.com';

const colors = {
  ink: '#16233F',
  chalk: '#F3F5F1',
  charcoal: '#1B2027',
  gold: '#C8912B',
  slate: '#5B6472',
  pine: '#2E7D5B'
};

function AskTeacher() {
  const [user, setUser] = useState(null);
  const [myQuestions, setMyQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const navigate = useNavigate();

  const fetchMyQuestions = useCallback(async (studentId) => {
    try {
      const response = await fetch(`${API}/api/asked-questions/student/${studentId}`);
      const data = await response.json();
      setMyQuestions(data);
    } catch (err) {
      setMyQuestions([]);
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
    fetchMyQuestions(parsedUser.id);
  }, [navigate, fetchMyQuestions]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    try {
      await fetch(`${API}/api/asked-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          studentName: user.name,
          questionText
        })
      });
      setQuestionText('');
      fetchMyQuestions(user.id);
    } catch (err) {
      alert('Could not send question, check your connection');
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
          Ask a Teacher
        </h3>

        <form onSubmit={handleAskQuestion}>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your academic question here..."
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
              background: colors.gold,
              color: colors.charcoal,
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Send Question
          </button>
        </form>

        {myQuestions.length > 0 && (
          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myQuestions.map((q) => (
              <div key={q._id} style={{ background: colors.chalk, borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontSize: '13px', color: colors.charcoal, marginBottom: '6px' }}>
                  You asked: {q.questionText}
                </p>
                {q.status === 'answered' ? (
                  <p style={{ fontSize: '13px', color: colors.pine }}>
                    {q.answeredBy} answered: {q.answerText}
                  </p>
                ) : (
                  <p style={{ fontSize: '12px', color: colors.slate, fontStyle: 'italic' }}>
                    Waiting for a teacher to respond...
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

export default AskTeacher;