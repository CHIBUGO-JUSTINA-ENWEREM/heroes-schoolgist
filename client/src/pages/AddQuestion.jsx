 import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const colors = {
  ink: '#16233F',
  chalk: '#F3F5F1',
  charcoal: '#1B2027',
  gold: '#C8912B',
  slate: '#5B6472',
  pine: '#2E7D5B'
};

function AddQuestion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    examType: 'JAMB',
    questionMode: 'Objective',
    subject: '',
    year: '',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const addOptionSlot = () => {
    if (form.options.length >= 5) return;
    setForm({ ...form, options: [...form.options, ''] });
  };

  const removeOptionSlot = () => {
    if (form.options.length <= 2) return;
    setForm({ ...form, options: form.options.slice(0, -1) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('https://heroes-schoolgist.onrender.com/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          correctAnswerIndex: Number(form.correctAnswerIndex)
        })
      });

      if (!response.ok) {
        setMessage('Something went wrong, question not saved.');
        return;
      }

      setMessage('Question saved successfully.');
      setForm({
        examType: form.examType,
        questionMode: form.questionMode,
        subject: form.subject,
        year: form.year,
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      });
    } catch (err) {
      setMessage('Could not connect to server.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #E4E3DC',
    fontFamily: 'Work Sans, sans-serif',
    fontSize: '14px',
    marginTop: '4px',
    marginBottom: '14px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: colors.charcoal
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.chalk, fontFamily: 'Work Sans, sans-serif', padding: '20px' }}>

      <button
        onClick={() => navigate('/admin-dashboard')}
        style={{ background: 'none', border: 'none', color: colors.slate, fontSize: '13px', marginBottom: '16px', cursor: 'pointer' }}
      >
        ← Back to admin dashboard
      </button>

      <h2 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '20px', marginBottom: '16px' }}>
        Add a Past Question
      </h2>

      {message && <p style={{ color: colors.pine, fontSize: '13px', marginBottom: '12px' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '18px' }}>

        <label style={labelStyle}>Exam Type</label>
        <select name="examType" value={form.examType} onChange={handleChange} style={inputStyle}>
          <option value="JAMB">JAMB</option>
          <option value="WAEC">WAEC</option>
          <option value="NECO">NECO</option>
          <option value="GCE">GCE</option>
        </select>

        <label style={labelStyle}>Question Mode</label>
        <select name="questionMode" value={form.questionMode} onChange={handleChange} style={inputStyle}>
          <option value="Objective">Objective</option>
          <option value="Theory">Theory</option>
        </select>

        <label style={labelStyle}>Subject</label>
        <input type="text" name="subject" value={form.subject} onChange={handleChange} required style={inputStyle} placeholder="e.g. Mathematics" />

        <label style={labelStyle}>Year</label>
        <input type="number" name="year" value={form.year} onChange={handleChange} required style={inputStyle} placeholder="e.g. 2023" />

        <label style={labelStyle}>Question Text</label>
        <textarea name="questionText" value={form.questionText} onChange={handleChange} required rows={3} style={inputStyle} />

        <label style={labelStyle}>Options</label>
        {form.options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
            style={inputStyle}
            placeholder={`Option ${String.fromCharCode(65 + index)}`}
          />
        ))}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <button type="button" onClick={addOptionSlot} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${colors.slate}`, background: 'none', color: colors.slate, fontSize: '12px', cursor: 'pointer' }}>
            + Add option
          </button>
          <button type="button" onClick={removeOptionSlot} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${colors.slate}`, background: 'none', color: colors.slate, fontSize: '12px', cursor: 'pointer' }}>
            - Remove option
          </button>
        </div>

        <label style={labelStyle}>Correct Option</label>
        <select name="correctAnswerIndex" value={form.correctAnswerIndex} onChange={handleChange} style={inputStyle}>
          {form.options.map((_, index) => (
            <option key={index} value={index}>{String.fromCharCode(65 + index)}</option>
          ))}
        </select>

        <label style={labelStyle}>Explanation (optional)</label>
        <textarea name="explanation" value={form.explanation} onChange={handleChange} rows={2} style={inputStyle} />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: colors.gold,
            color: colors.charcoal,
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Save Question
        </button>
      </form>
    </div>
  );
}

export default AddQuestion;