 import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const colors = {
  ink: '#16233F',
  chalk: '#F3F5F1',
  charcoal: '#1B2027',
  gold: '#C8912B',
  slate: '#5B6472',
  pine: '#2E7D5B'
};

const examTypes = ['General', 'JAMB', 'WAEC', 'NECO', 'GCE'];

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [guidanceRequests, setGuidanceRequests] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [guidanceDrafts, setGuidanceDrafts] = useState({});
  const [importForm, setImportForm] = useState({ examType: 'JAMB', subject: '', year: '' });
  const [importMessage, setImportMessage] = useState('');
  const [importing, setImporting] = useState(false);
  const navigate = useNavigate();

  const [newsList, setNewsList] = useState([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsMessage, setNewsMessage] = useState('');
  const [newsExamType, setNewsExamType] = useState(examTypes[0]);
  const [newsImage, setNewsImage] = useState(null);
  const [postingNews, setPostingNews] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'admin') {
      navigate('/login');
      return;
    }
    setUser(parsedUser);
    fetchUsers();
    fetchQuestions();
    fetchGuidance();
    fetchNews();
  }, [navigate]);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: authHeaders()
      });
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/asked-questions', {
        headers: authHeaders()
      });
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setQuestions([]);
    }
  };

  const fetchGuidance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/guidance', {
        headers: authHeaders()
      });
      const data = await response.json();
      setGuidanceRequests(data);
    } catch (err) {
      setGuidanceRequests([]);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news');
      const data = await response.json();
      setNewsList(data);
    } catch (err) {
      setNewsList([]);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      fetchUsers();
    } catch (err) {
      alert('Could not delete user, check your connection');
    }
  };

  const handleDraftChange = (id, value) => {
    setDrafts({ ...drafts, [id]: value });
  };

  const submitAnswer = async (id) => {
    const answerText = drafts[id];
    if (!answerText || !answerText.trim()) {
      alert('Type an answer first');
      return;
    }
    try {
      await fetch(`http://localhost:5000/api/asked-questions/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ answerText, answeredBy: user.name + ' (Admin)' })
      });
      fetchQuestions();
    } catch (err) {
      alert('Could not submit answer, check your connection');
    }
  };

  const handleGuidanceDraftChange = (id, value) => {
    setGuidanceDrafts({ ...guidanceDrafts, [id]: value });
  };

  const submitGuidanceResponse = async (id) => {
    const response = guidanceDrafts[id];
    if (!response || !response.trim()) {
      alert('Type a response first');
      return;
    }
    try {
      await fetch(`http://localhost:5000/api/guidance/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ response, respondedBy: user.name + ' (Admin)' })
      });
      fetchGuidance();
    } catch (err) {
      alert('Could not submit response, check your connection');
    }
  };

  const handleImportChange = (e) => {
    setImportForm({ ...importForm, [e.target.name]: e.target.value });
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importForm.subject.trim()) {
      alert('Type a subject first, e.g. Mathematics');
      return;
    }
    setImporting(true);
    setImportMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/aloc/import', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(importForm)
      });
      const data = await response.json();
      setImportMessage(data.message || 'Done');
    } catch (err) {
      setImportMessage('Could not connect to server');
    }
    setImporting(false);
  };

  const handlePostNews = async (e) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsMessage.trim()) {
      alert('Fill in the title and message');
      return;
    }

    setPostingNews(true);
    try {
      const formData = new FormData();
      formData.append('title', newsTitle);
      formData.append('message', newsMessage);
      formData.append('examType', newsExamType);
      formData.append('postedById', user.id);
      formData.append('postedByName', user.name);
      formData.append('postedByRole', 'admin');
      if (newsImage) formData.append('image', newsImage);

      await fetch('http://localhost:5000/api/news', {
        method: 'POST',
        body: formData
      });

      setNewsTitle('');
      setNewsMessage('');
      setNewsImage(null);
      fetchNews();
      alert('News posted successfully');
    } catch (err) {
      alert('Could not post news, check your connection');
    } finally {
      setPostingNews(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Delete this news post?')) return;
    try {
      await fetch(`http://localhost:5000/api/news/${id}`, { method: 'DELETE' });
      fetchNews();
    } catch (err) {
      alert('Could not delete news post');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const pending = questions.filter((q) => q.status === 'pending');
  const pendingGuidance = guidanceRequests.filter((g) => g.status === 'pending');

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #E4E3DC',
    fontFamily: 'Work Sans, sans-serif',
    fontSize: '13.5px',
    marginTop: '4px',
    marginBottom: '10px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.chalk, fontFamily: 'Work Sans, sans-serif' }}>

      <div style={{
        background: '#FFFFFF',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #E4E3DC'
      }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: colors.ink, fontSize: '18px' }}>
          HEROES SchoolGist — Admin
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: `1px solid ${colors.slate}`,
            color: colors.slate,
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12.5px',
            cursor: 'pointer'
          }}
        >
          Log out
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '20px', marginBottom: '4px' }}>
          Welcome, {user.name}
        </h2>
        <p style={{ color: colors.slate, fontSize: '13px', marginBottom: '20px' }}>
          Full control panel for HEROES SchoolGist.
        </p>

        <div style={{ background: '#FFFFFF', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '10px' }}>
            Post Exam News
          </h3>
          <form onSubmit={handlePostNews}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Exam Type</label>
            <select value={newsExamType} onChange={(e) => setNewsExamType(e.target.value)} style={inputStyle}>
              {examTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Title</label>
            <input
              type="text"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="e.g. JAMB 2027 Registration Now Open"
              style={inputStyle}
            />

            <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Message</label>
            <textarea
              value={newsMessage}
              onChange={(e) => setNewsMessage(e.target.value)}
              placeholder="Write the full news update here..."
              rows={3}
              style={inputStyle}
            />

            <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Attach an image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewsImage(e.target.files[0])}
              style={{ marginTop: '4px', marginBottom: '12px', display: 'block' }}
            />

            <button
              type="submit"
              disabled={postingNews}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: colors.ink,
                color: '#fff',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: postingNews ? 'default' : 'pointer',
                opacity: postingNews ? 0.7 : 1
              }}
            >
              {postingNews ? 'Posting...' : 'Post News'}
            </button>
          </form>

          {newsList.length > 0 && (
            <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {newsList.map((n) => (
                <div key={n._id} style={{ background: colors.chalk, borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: colors.gold, fontWeight: 600, marginBottom: '4px' }}>{n.examType}</p>
                    <p style={{ fontSize: '13px', color: colors.charcoal, fontWeight: 600 }}>{n.title}</p>
                    <p style={{ fontSize: '11.5px', color: colors.slate }}>By {n.postedByName}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNews(n._id)}
                    style={{ background: 'none', border: 'none', color: '#B3261E', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '10px' }}>
            Import Questions from ALOC
          </h3>
          <form onSubmit={handleImport}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Exam Type</label>
            <select name="examType" value={importForm.examType} onChange={handleImportChange} style={inputStyle}>
              <option value="JAMB">JAMB</option>
              <option value="WAEC">WAEC</option>
              <option value="NECO">NECO</option>
              <option value="GCE">GCE</option>
            </select>

            <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Subject</label>
            <input
              type="text"
              name="subject"
              value={importForm.subject}
              onChange={handleImportChange}
              placeholder="e.g. Mathematics, English, Chemistry"
              style={inputStyle}
            />

            <label style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal }}>Year (optional)</label>
            <input
              type="number"
              name="year"
              value={importForm.year}
              onChange={handleImportChange}
              placeholder="e.g. 2015"
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={importing}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: colors.pine,
                color: '#fff',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              {importing ? 'Importing...' : 'Import Questions'}
            </button>
          </form>
          {importMessage && <p style={{ fontSize: '13px', color: colors.ink, marginTop: '10px' }}>{importMessage}</p>}
        </div>

        <button
          onClick={() => navigate('/add-question')}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            background: colors.ink,
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          + Add Past Question Manually
        </button>

        <div style={{
          background: colors.gold,
          color: colors.charcoal,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '15px', marginBottom: '4px' }}>Teacher Signup Code</h3>
          <p style={{ fontSize: '13px' }}>
            Give this code only to real teachers: check your server's .env file for TEACHER_SIGNUP_CODE.
          </p>
        </div>

        <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '10px' }}>
          Manage Users ({users.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {users.map((u) => (
            <div key={u._id} style={{
              background: '#FFFFFF',
              border: '1px solid #E4E3DC',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ fontSize: '13.5px', color: colors.charcoal, fontWeight: 600 }}>{u.name}</p>
                <p style={{ fontSize: '12px', color: colors.slate }}>{u.email} — {u.role}</p>
              </div>
              <button
                onClick={() => handleDeleteUser(u._id)}
                style={{
                  background: 'none',
                  border: '1px solid #B3261E',
                  color: '#B3261E',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '10px' }}>
          Pending Student Questions ({pending.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {pending.length === 0 && (
            <p style={{ fontSize: '13px', color: colors.slate }}>No pending questions right now.</p>
          )}
          {pending.map((q) => (
            <div key={q._id} style={{ background: '#FFFFFF', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '13px', color: colors.charcoal, marginBottom: '8px' }}>
                <strong>{q.studentName}</strong> asked: {q.questionText}
              </p>
              <textarea
                value={drafts[q._id] || ''}
                onChange={(e) => handleDraftChange(q._id, e.target.value)}
                placeholder="Type your answer..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #E4E3DC',
                  fontFamily: 'Work Sans, sans-serif',
                  fontSize: '13px',
                  marginBottom: '8px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => submitAnswer(q._id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: colors.pine,
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Submit Answer
              </button>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '10px' }}>
          Registration &amp; Guidance Requests ({pendingGuidance.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingGuidance.length === 0 && (
            <p style={{ fontSize: '13px', color: colors.slate }}>No pending requests right now.</p>
          )}
          {pendingGuidance.map((g) => (
            <div key={g._id} style={{ background: '#FFFFFF', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '12px', color: colors.gold, fontWeight: 600, marginBottom: '4px' }}>{g.requestType}</p>
              <p style={{ fontSize: '13px', color: colors.charcoal, marginBottom: '8px' }}>
                <strong>{g.studentName}</strong>: {g.message}
              </p>
              <textarea
                value={guidanceDrafts[g._id] || ''}
                onChange={(e) => handleGuidanceDraftChange(g._id, e.target.value)}
                placeholder="Type your response..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #E4E3DC',
                  fontFamily: 'Work Sans, sans-serif',
                  fontSize: '13px',
                  marginBottom: '8px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => submitGuidanceResponse(g._id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: colors.pine,
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Submit Response
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;