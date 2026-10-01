 import { useEffect, useState } from 'react';
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

const departments = ['Science', 'Arts', 'Commercial'];

function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const navigate = useNavigate();

  const [myVideos, setMyVideos] = useState([]);
  const [myNotes, setMyNotes] = useState([]);

  const [videoTitle, setVideoTitle] = useState('');
  const [videoSubject, setVideoSubject] = useState('');
  const [videoDept, setVideoDept] = useState(departments[0]);
  const [videoDesc, setVideoDesc] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [noteDept, setNoteDept] = useState(departments[0]);
  const [noteDesc, setNoteDesc] = useState('');
  const [noteFile, setNoteFile] = useState(null);
  const [uploadingNote, setUploadingNote] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchQuestions();
    fetchMyVideos(parsedUser.id);
    fetchMyNotes(parsedUser.id);
  }, [navigate]);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API}/api/asked-questions`, {
        headers: authHeaders()
      });
      if (!response.ok) {
        setQuestions([]);
        return;
      }
      const data = await response.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setQuestions([]);
    }
  };

  const fetchMyVideos = async (teacherId) => {
    try {
      const response = await fetch(`${API}/api/videos/teacher/${teacherId}`);
      if (!response.ok) {
        setMyVideos([]);
        return;
      }
      const data = await response.json();
      setMyVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      setMyVideos([]);
    }
  };

  const fetchMyNotes = async (teacherId) => {
    try {
      const response = await fetch(`${API}/api/notes/teacher/${teacherId}`);
      if (!response.ok) {
        setMyNotes([]);
        return;
      }
      const data = await response.json();
      setMyNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setMyNotes([]);
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
      await fetch(`${API}/api/asked-questions/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ answerText, answeredBy: user.name })
      });
      fetchQuestions();
    } catch (err) {
      alert('Could not submit answer, check your connection');
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoSubject.trim() || !videoFile) {
      alert('Fill in the title, subject, and choose a video file');
      return;
    }

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('title', videoTitle);
      formData.append('subject', videoSubject);
      formData.append('department', videoDept);
      formData.append('description', videoDesc);
      formData.append('teacherId', user.id);
      formData.append('teacherName', user.name);
      formData.append('video', videoFile);

      await fetch(`${API}/api/videos`, {
        method: 'POST',
        body: formData
      });

      setVideoTitle('');
      setVideoSubject('');
      setVideoDesc('');
      setVideoFile(null);
      await fetchMyVideos(user.id);
      alert('Video uploaded successfully');
    } catch (err) {
      alert('Could not upload video, check your connection');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleUploadNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteSubject.trim() || !noteFile) {
      alert('Fill in the title, subject, and choose a file');
      return;
    }

    setUploadingNote(true);
    try {
      const formData = new FormData();
      formData.append('title', noteTitle);
      formData.append('subject', noteSubject);
      formData.append('department', noteDept);
      formData.append('description', noteDesc);
      formData.append('teacherId', user.id);
      formData.append('teacherName', user.name);
      formData.append('note', noteFile);

      await fetch(`${API}/api/notes`, {
        method: 'POST',
        body: formData
      });

      setNoteTitle('');
      setNoteSubject('');
      setNoteDesc('');
      setNoteFile(null);
      await fetchMyNotes(user.id);
      alert('Notes uploaded successfully');
    } catch (err) {
      alert('Could not upload notes, check your connection');
    } finally {
      setUploadingNote(false);
    }
  };

  const deleteVideo = async (id) => {
    try {
      await fetch(`${API}/api/videos/${id}`, { method: 'DELETE' });
      fetchMyVideos(user.id);
    } catch (err) {
      alert('Could not delete video');
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`${API}/api/notes/${id}`, { method: 'DELETE' });
      fetchMyNotes(user.id);
    } catch (err) {
      alert('Could not delete note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const pending = questions.filter((q) => q.status === 'pending');
  const answered = questions.filter((q) => q.status === 'answered');

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #E4E3DC',
    fontFamily: 'Work Sans, sans-serif',
    fontSize: '13.5px',
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
          HEROES SchoolGist
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
          Upload lessons, answer questions, and track your content below.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div style={{ flex: '1 1 140px', background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: colors.ink }}>{myVideos.length}</p>
            <p style={{ fontSize: '12px', color: colors.slate }}>Videos Uploaded</p>
          </div>
          <div style={{ flex: '1 1 140px', background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: colors.ink }}>
              {myVideos.reduce((sum, v) => sum + (v.views || 0), 0)}
            </p>
            <p style={{ fontSize: '12px', color: colors.slate }}>Total Views</p>
          </div>
          <div style={{ flex: '1 1 140px', background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: colors.ink }}>{myNotes.length}</p>
            <p style={{ fontSize: '12px', color: colors.slate }}>Notes Uploaded</p>
          </div>
          <div style={{ flex: '1 1 140px', background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: colors.ink }}>{answered.length}</p>
            <p style={{ fontSize: '12px', color: colors.slate }}>Questions Answered</p>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '14px' }}>
            Upload a Lesson Video
          </h3>
          <form onSubmit={handleUploadVideo}>
            <input
              type="text"
              placeholder="Video title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Subject (e.g. Physics)"
              value={videoSubject}
              onChange={(e) => setVideoSubject(e.target.value)}
              style={inputStyle}
            />
            <select value={videoDept} onChange={(e) => setVideoDept(e.target.value)} style={inputStyle}>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <textarea
              placeholder="Short description (optional)"
              value={videoDesc}
              onChange={(e) => setVideoDesc(e.target.value)}
              rows={2}
              style={inputStyle}
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              style={{ marginBottom: '12px' }}
            />
            <button
              type="submit"
              disabled={uploadingVideo}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: colors.ink,
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                cursor: uploadingVideo ? 'default' : 'pointer',
                opacity: uploadingVideo ? 0.7 : 1
              }}
            >
              {uploadingVideo ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>

          {myVideos.length > 0 && (
            <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myVideos.map((v) => (
                <div key={v._id} style={{ background: colors.chalk, borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: colors.charcoal, fontWeight: 600 }}>{v.title}</p>
                    <p style={{ fontSize: '11.5px', color: colors.slate }}>{v.subject} &middot; {v.views} views</p>
                  </div>
                  <button
                    onClick={() => deleteVideo(v._id)}
                    style={{ background: 'none', border: 'none', color: '#B3261E', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '14px' }}>
            Upload Lesson Notes
          </h3>
          <form onSubmit={handleUploadNote}>
            <input
              type="text"
              placeholder="Notes title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Subject (e.g. Physics)"
              value={noteSubject}
              onChange={(e) => setNoteSubject(e.target.value)}
              style={inputStyle}
            />
            <select value={noteDept} onChange={(e) => setNoteDept(e.target.value)} style={inputStyle}>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <textarea
              placeholder="Short description (optional)"
              value={noteDesc}
              onChange={(e) => setNoteDesc(e.target.value)}
              rows={2}
              style={inputStyle}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setNoteFile(e.target.files[0])}
              style={{ marginBottom: '12px' }}
            />
            <button
              type="submit"
              disabled={uploadingNote}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: colors.gold,
                color: colors.charcoal,
                fontWeight: 600,
                fontSize: '13px',
                cursor: uploadingNote ? 'default' : 'pointer',
                opacity: uploadingNote ? 0.7 : 1
              }}
            >
              {uploadingNote ? 'Uploading...' : 'Upload Notes'}
            </button>
          </form>

          {myNotes.length > 0 && (
            <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myNotes.map((n) => (
                <div key={n._id} style={{ background: colors.chalk, borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: colors.charcoal, fontWeight: 600 }}>{n.title}</p>
                    <p style={{ fontSize: '11.5px', color: colors.slate }}>{n.subject} &middot; {n.downloads} downloads</p>
                  </div>
                  <button
                    onClick={() => deleteNote(n._id)}
                    style={{ background: 'none', border: 'none', color: '#B3261E', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '16px', marginBottom: '10px' }}>
          Pending Questions ({pending.length})
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
          Answered ({answered.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {answered.map((q) => (
            <div key={q._id} style={{ background: '#FFFFFF', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '14px' }}>
              <p style={{ fontSize: '13px', color: colors.charcoal, marginBottom: '4px' }}>
                <strong>{q.studentName}</strong> asked: {q.questionText}
              </p>
              <p style={{ fontSize: '13px', color: colors.pine }}>
                {q.answeredBy} answered: {q.answerText}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default TeacherDashboard;