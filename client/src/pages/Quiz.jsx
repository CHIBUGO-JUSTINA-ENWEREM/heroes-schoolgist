 import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const colors = {
  ink: '#16233F',
  chalk: '#F3F5F1',
  charcoal: '#1B2027',
  gold: '#C8912B',
  slate: '#5B6472',
  pine: '#2E7D5B'
};

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examType, subjects, duration } = location.state || {};

  const [selectedSubject, setSelectedSubject] = useState(subjects ? subjects[0] : '');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState((duration || 30) * 60);
  const timerRef = useRef(null);

  const fetchQuestions = useCallback(async (subject) => {
    setLoading(true);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);

    try {
      const response = await fetch(`http://localhost:5000/api/questions?examType=${examType}&subject=${subject}`);
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setQuestions([]);
    }
    setLoading(false);
  }, [examType]);

  useEffect(() => {
    if (!examType || !subjects) {
      navigate('/practice');
      return;
    }
    fetchQuestions(selectedSubject);
  }, [examType, subjects, selectedSubject, navigate, fetchQuestions]);

  useEffect(() => {
    if (showResult) return undefined;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [showResult]);

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);
    fetchQuestions(subject);
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!examType || !subjects) return null;

  return (
    <div style={{ minHeight: '100vh', background: colors.chalk, fontFamily: 'Work Sans, sans-serif', padding: '20px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={() => navigate('/practice')}
          style={{ background: 'none', border: 'none', color: colors.slate, fontSize: '13px', cursor: 'pointer' }}
        >
          Back to setup
        </button>
        {!showResult && (
          <div style={{
            background: secondsLeft <= 60 ? '#B3261E' : colors.ink,
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600
          }}>
            {formatTime(secondsLeft)}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Subject</label><br />
        <select value={selectedSubject} onChange={handleSubjectChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E4E3DC', marginTop: '4px' }}>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <p style={{ color: colors.slate, fontSize: '13px' }}>Loading questions...</p>}

      {!loading && questions.length === 0 && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '18px' }}>
          <p style={{ fontSize: '13px', color: colors.slate }}>
            No questions available yet for {selectedSubject} ({examType}). More will be added soon.
          </p>
        </div>
      )}

      {!loading && questions.length > 0 && !showResult && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '18px' }}>
          <p style={{ fontSize: '12px', color: colors.slate, marginBottom: '8px' }}>
            Question {currentIndex + 1} of {questions.length}
          </p>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '16px' }}>
            {questions[currentIndex].questionText}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {questions[currentIndex].options.map((option, index) => {
              let bg = '#FFFFFF';
              let border = '#E4E3DC';
              if (selectedAnswer !== null) {
                if (index === questions[currentIndex].correctAnswerIndex) {
                  bg = '#E8F2ED';
                  border = colors.pine;
                } else if (index === selectedAnswer) {
                  bg = '#FBEAEA';
                  border = '#B3261E';
                }
              }
              return (
                <div
                  key={option}
                  onClick={() => handleAnswer(index)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${border}`,
                    background: bg,
                    fontSize: '13.5px',
                    cursor: selectedAnswer === null ? 'pointer' : 'default'
                  }}
                >
                  {option}
                </div>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div style={{ marginTop: '14px' }}>
              {questions[currentIndex].explanation && (
                <p style={{ fontSize: '12.5px', color: colors.slate, marginBottom: '10px' }}>
                  {questions[currentIndex].explanation}
                </p>
              )}
              <button
                onClick={nextQuestion}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: colors.ink,
                  color: '#fff',
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                {currentIndex + 1 < questions.length ? 'Next question' : 'See result'}
              </button>
            </div>
          )}
        </div>
      )}

      {showResult && (
        <div style={{ background: colors.pine, color: '#fff', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>Result</h3>
          <p style={{ fontSize: '14px' }}>You scored {score} out of {questions.length}</p>
          {secondsLeft === 0 && (
            <p style={{ fontSize: '12.5px', marginTop: '6px', opacity: 0.9 }}>Time ran out.</p>
          )}
        </div>
      )}

    </div>
  );
}

export default Quiz;