 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const colors = {
  ink: '#16233F',
  chalk: '#F3F5F1',
  charcoal: '#1B2027',
  gold: '#C8912B',
  slate: '#5B6472',
  pine: '#2E7D5B'
};

const promoBanners = [
  { id: 1, title: 'JAMB 2027 Registration Now Open', subtitle: 'Guide plus Past Questions', color: colors.ink },
  { id: 2, title: 'WAEC Timetable Released', subtitle: 'Check your exam dates', color: colors.pine },
  { id: 3, title: 'Unlock Full Access', subtitle: 'One-time payment, no subscriptions', color: '#A9761C' }
];

const testCards = [
  { id: 1, label: 'JAMB Practice', desc: '4 subjects, objective only' },
  { id: 2, label: 'WAEC Practice', desc: 'Objective and Theory' },
  { id: 3, label: 'NECO Practice', desc: 'Objective and Theory' },
  { id: 4, label: 'GCE Practice', desc: 'Objective and Theory' }
];

const drawerLinks = ['Home', 'Study', 'Test', 'Chat', 'News', 'Connect', 'Dashboard'];

function StudentHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchVideos();
    fetchNotes();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % promoBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/videos');
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setVideos([]);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setNotes([]);
    }
  };

  const handleWatchVideo = async (video) => {
    try {
      await fetch(`http://localhost:5000/api/videos/${video._id}/view`, { method: 'POST' });
    } catch (err) {
      // ignore, still open the video
    }
    window.open(video.videoUrl, '_blank');
  };

  const handleDownloadNote = async (note) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${note._id}/download`, { method: 'POST' });
    } catch (err) {
      // ignore, still open the file
    }
    window.open(note.fileUrl, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDrawerLink = (link) => {
    setDrawerOpen(false);
    if (link === 'Study' || link === 'Test') navigate('/practice');
    else if (link === 'Chat') navigate('/ask-teacher');
    else if (link === 'Connect') navigate('/guidance');
    else if (link === 'News') {
      const el = document.getElementById('news-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: colors.chalk, fontFamily: 'Work Sans, sans-serif' }}>

      <div style={{
        background: '#FFFFFF',
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #E4E3DC',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button
          onClick={() => setDrawerOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: colors.ink }}
          aria-label="Open menu"
        >
          &#9776;
        </button>

        <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: colors.ink, fontSize: '17px' }}>
          HEROES SchoolGist
        </div>

        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: colors.slate }}
        >
          Log out
        </button>
      </div>

      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '240px', height: '100%', background: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: colors.ink, fontSize: '16px' }}>
                Menu
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: colors.slate }}
              >
                &#10005;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {drawerLinks.map((link) => (
                <div
                  key={link}
                  onClick={() => handleDrawerLink(link)}
                  style={{ padding: '11px 8px', fontSize: '14px', color: colors.charcoal, borderBottom: '1px solid #F0EFEA', cursor: 'pointer' }}
                >
                  {link}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '16px' }}>

        <h2 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '18px', marginBottom: '14px' }}>
          Welcome, {user.name}
        </h2>

        <div
          style={{
            background: promoBanners[activeBanner].color,
            borderRadius: '14px',
            padding: '22px 18px',
            color: '#fff',
            marginBottom: '10px',
            minHeight: '90px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', marginBottom: '6px' }}>
            {promoBanners[activeBanner].title}
          </h2>
          <p style={{ fontSize: '12.5px', opacity: 0.9 }}>
            {promoBanners[activeBanner].subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
          {promoBanners.map((banner, i) => (
            <div
              key={banner.id}
              style={{
                width: i === activeBanner ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === activeBanner ? colors.gold : '#D8D6CC'
              }}
            />
          ))}
        </div>

        <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '15px', marginBottom: '10px' }}>
          Take a Test
        </h3>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '26px' }}>
          {testCards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate('/practice')}
              style={{
                minWidth: '130px',
                background: '#fff',
                border: '1px solid #E4E3DC',
                borderRadius: '12px',
                padding: '14px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: colors.gold, marginBottom: '10px' }} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: colors.charcoal, marginBottom: '4px' }}>
                {card.label}
              </p>
              <p style={{ fontSize: '11px', color: colors.slate }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '15px', marginBottom: '10px' }}>
          Video Lessons
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
          {videos.length === 0 && (
            <p style={{ fontSize: '13px', color: colors.slate }}>No videos uploaded yet.</p>
          )}
          {videos.map((v) => (
            <div
              key={v._id}
              onClick={() => handleWatchVideo(v)}
              style={{ background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <p style={{ fontSize: '13.5px', color: colors.charcoal, fontWeight: 600, marginBottom: '4px' }}>{v.title}</p>
                <p style={{ fontSize: '11.5px', color: colors.slate }}>{v.subject} &middot; {v.teacherName} &middot; {v.views} views</p>
              </div>
              <span style={{ fontSize: '18px' }}>&#9654;</span>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '15px', marginBottom: '10px' }}>
          Lesson Notes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
          {notes.length === 0 && (
            <p style={{ fontSize: '13px', color: colors.slate }}>No notes uploaded yet.</p>
          )}
          {notes.map((n) => (
            <div
              key={n._id}
              onClick={() => handleDownloadNote(n)}
              style={{ background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <p style={{ fontSize: '13.5px', color: colors.charcoal, fontWeight: 600, marginBottom: '4px' }}>{n.title}</p>
                <p style={{ fontSize: '11.5px', color: colors.slate }}>{n.subject} &middot; {n.teacherName} &middot; {n.downloads} downloads</p>
              </div>
              <span style={{ fontSize: '16px' }}>&#8681;</span>
            </div>
          ))}
        </div>

        <h3 id="news-section" style={{ fontFamily: 'Fraunces, serif', color: colors.ink, fontSize: '15px', marginBottom: '10px' }}>
          Exam News
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontSize: '12px', color: colors.gold, fontWeight: 600, marginBottom: '4px' }}>JAMB</p>
            <p style={{ fontSize: '13.5px', color: colors.charcoal, marginBottom: '4px' }}>
              JAMB UTME registration dates and requirements
            </p>
            <p style={{ fontSize: '11.5px', color: colors.slate }}>Date to be announced</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E4E3DC', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontSize: '12px', color: colors.pine, fontWeight: 600, marginBottom: '4px' }}>WAEC</p>
            <p style={{ fontSize: '13.5px', color: colors.charcoal, marginBottom: '4px' }}>
              WAEC exam timetable and subject combinations
            </p>
            <p style={{ fontSize: '11.5px', color: colors.slate }}>Date to be announced</p>
          </div>
        </div>

      </div>

      <a
        href="https://wa.me/2347039618878?text=Hello%2C%20I%20need%20help"
        target="_blank"
        rel="noreferrer"
        style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          width: '52px',
          height: '52px',
          background: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
          textDecoration: 'none'
        }}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.887.525 3.65 1.436 5.153L2 22l4.982-1.393A9.953 9.953 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.176a8.153 8.153 0 01-4.412-1.29l-.316-.19-3.15.881.85-3.083-.207-.322A8.13 8.13 0 013.824 12c0-4.508 3.669-8.176 8.177-8.176 4.507 0 8.175 3.668 8.175 8.176 0 4.508-3.668 8.176-8.175 8.176z"/>
        </svg>
      </a>

    </div>
  );
}

export default StudentHome;