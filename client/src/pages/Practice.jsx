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

const compulsory = ['English Language', 'Mathematics', 'Civic Education', 'Data Processing'];

const departmentSubjects = {
  Science: ['Biology', 'Chemistry', 'Physics', 'Further Mathematics', 'Agricultural Science', 'Geography', 'Computer Studies', 'Technical Drawing', 'Animal Husbandry'],
  Arts: ['Literature-in-English', 'Government', 'CRS/IRS', 'History', 'Hausa/Igbo/Yoruba', 'Economics', 'Geography', 'French', 'Visual Arts', 'Music'],
  Commercial: ['Financial Accounting', 'Commerce', 'Economics', 'Marketing', 'Office Practice', 'Insurance', 'Business Methods', 'Store Management']
};

const examLimits = {
  JAMB: 4,
  WAEC: 9,
  NECO: 9,
  GCE: 9
};

const durationOptions = [
  { label: '30 mins', value: 30 },
  { label: '1hr', value: 60 },
  { label: '1hr 30mins', value: 90 },
  { label: '2hrs', value: 120 }
];

function Practice() {
  const [department, setDepartment] = useState('Science');
  const [examType, setExamType] = useState('JAMB');
  const [duration, setDuration] = useState(30);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const navigate = useNavigate();

  const maxAllowed = examLimits[examType];
  const availableSubjects = [...compulsory, ...departmentSubjects[department]];

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      if (selectedSubjects.length >= maxAllowed) {
        alert(`${examType} only allows ${maxAllowed} subjects. Remove one before adding another.`);
        return;
      }
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setSelectedSubjects([]);
  };

  const handleExamChange = (e) => {
    setExamType(e.target.value);
    setSelectedSubjects([]);
  };

  const startPractice = () => {
    if (selectedSubjects.length === 0) {
      alert('Select at least one subject first.');
      return;
    }
    navigate('/quiz', { state: { examType, subjects: selectedSubjects, duration } });
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.chalk, fontFamily: 'Work Sans, sans-serif', padding: '20px' }}>

      <button
        onClick={() => navigate('/student-dashboard')}
        style={{ background: 'none', border: 'none', color: colors.slate, fontSize: '13px', marginBottom: '16px', cursor: 'pointer' }}
      >
        ← Back to dashboard
      </button>

      <h2 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '20px', marginBottom: '16px' }}>
        Set up your practice
      </h2>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Exam type</label><br />
        <select value={examType} onChange={handleExamChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E4E3DC', marginTop: '4px' }}>
          <option value="JAMB">JAMB (max 4 subjects)</option>
          <option value="WAEC">WAEC (max 9 subjects)</option>
          <option value="NECO">NECO (max 9 subjects)</option>
          <option value="GCE">GCE (max 9 subjects)</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Department</label><br />
        <select value={department} onChange={handleDepartmentChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E4E3DC', marginTop: '4px' }}>
          <option value="Science">Science</option>
          <option value="Arts">Arts</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Time allowed</label><br />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
          {durationOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setDuration(opt.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                cursor: 'pointer',
                border: `1px solid ${duration === opt.value ? colors.gold : '#E4E3DC'}`,
                background: duration === opt.value ? colors.gold : '#FFFFFF',
                color: duration === opt.value ? colors.charcoal : colors.slate
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: '12.5px', color: colors.slate, marginBottom: '10px' }}>
        Selected {selectedSubjects.length} of {maxAllowed} allowed for {examType}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {availableSubjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject);
          return (
            <div
              key={subject}
              onClick={() => toggleSubject(subject)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                cursor: 'pointer',
                border: `1px solid ${isSelected ? colors.gold : '#E4E3DC'}`,
                background: isSelected ? colors.gold : '#FFFFFF',
                color: isSelected ? colors.charcoal : colors.slate
              }}
            >
              {subject}
            </div>
          );
        })}
      </div>

      <button
        onClick={startPractice}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          background: colors.ink,
          color: '#fff',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        Start Practice
      </button>

    </div>
  );
}

export default Practice;