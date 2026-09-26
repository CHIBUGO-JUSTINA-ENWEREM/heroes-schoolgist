 import { useNavigate } from 'react-router-dom';

const colors = {
  ink: '#16233F',
  ink2: '#223258',
  chalk: '#F3F5F1',
  charcoal: '#1B2027',
  gold: '#C8912B',
  goldDeep: '#A9761C',
  slate: '#5B6472',
  pine: '#2E7D5B',
  line: '#E4E3DC'
};

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Work Sans, sans-serif', color: colors.charcoal, background: '#fff' }}>

      <div style={{
        position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)',
        borderBottom: `1px solid ${colors.line}`
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '19px', color: colors.ink }}>
              HEROES<span style={{ color: colors.goldDeep }}>.</span>
            </div>
            <div style={{ fontSize: '10px', color: colors.slate }}>SCHOOLGIST</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/login')} style={{ fontSize: '13.5px', fontWeight: 600, padding: '9px 18px', borderRadius: '8px', border: `1px solid ${colors.ink}`, color: colors.ink, background: 'none', cursor: 'pointer' }}>
              Log in
            </button>
            <button onClick={() => navigate('/signup')} style={{ fontSize: '13.5px', fontWeight: 600, padding: '9px 18px', borderRadius: '8px', border: 'none', background: colors.gold, color: colors.charcoal, cursor: 'pointer' }}>
              Sign up free
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: colors.chalk }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '56px 20px 40px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '36px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', border: `1px solid ${colors.line}`, borderRadius: '20px', padding: '6px 14px', fontSize: '12.5px', color: colors.pine, fontWeight: 600, marginBottom: '18px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.pine }} />
              Built for WAEC, JAMB, NECO and GCE candidates
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', lineHeight: 1.15, color: colors.ink, fontWeight: 700, marginBottom: '16px', maxWidth: '520px' }}>
              Walk into your exam hall already knowing what to expect.
            </h1>
            <p style={{ fontSize: '15.5px', color: colors.slate, lineHeight: 1.6, maxWidth: '460px', marginBottom: '26px' }}>
              Real past questions, timed CBT practice, and teachers who actually answer your questions, all in one place built for Nigerian students chasing their next big result.
            </p>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '30px' }}>
              <button onClick={() => navigate('/signup')} style={{ background: colors.gold, color: colors.charcoal, padding: '13px 24px', fontSize: '14.5px', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                Start practicing free
              </button>
            </div>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: colors.ink }}>4</div>
                <div style={{ fontSize: '11.5px', color: colors.slate }}>Exam boards covered</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: colors.ink }}>3</div>
                <div style={{ fontSize: '11.5px', color: colors.slate }}>Departments: Science, Arts, Commercial</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: colors.ink }}>24/7</div>
                <div style={{ fontSize: '11.5px', color: colors.slate }}>Practice anytime</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${colors.line}`, borderRadius: '16px', padding: '20px', boxShadow: '0 24px 48px rgba(22,35,63,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: colors.pine, background: '#E8F2ED', padding: '4px 10px', borderRadius: '12px' }}>
                JAMB - Mathematics
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', background: colors.ink, padding: '5px 12px', borderRadius: '12px' }}>
                28:41
              </span>
            </div>
            <p style={{ fontSize: '14px', marginBottom: '14px' }}>If 2x + 3 = 11, find the value of x.</p>
            <div style={{ border: `1px solid ${colors.line}`, borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '8px' }}>A. 3</div>
            <div style={{ border: `1px solid ${colors.pine}`, background: '#F1F8F4', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '8px' }}>B. 4</div>
            <div style={{ border: `1px solid ${colors.line}`, borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '8px' }}>C. 5</div>
            <div style={{ border: `1px solid ${colors.line}`, borderRadius: '8px', padding: '10px 12px', fontSize: '13px' }}>D. 6</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '64px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto 40px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: colors.goldDeep, textTransform: 'uppercase', marginBottom: '8px' }}>Departments</div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: colors.ink, marginBottom: '8px' }}>Study the way your class already works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ background: colors.pine, color: '#fff', borderRadius: '14px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>Science</h3>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>Physics, Chemistry, Biology, Further Maths and more.</p>
          </div>
          <div style={{ background: colors.goldDeep, color: '#fff', borderRadius: '14px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>Arts</h3>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>Literature, Government, CRS/IRS and more.</p>
          </div>
          <div style={{ background: colors.ink, color: '#fff', borderRadius: '14px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>Commercial</h3>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>Financial Accounting, Commerce, Economics and more.</p>
          </div>
        </div>
      </div>

      <div style={{ background: colors.ink, color: '#fff', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto 40px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: colors.gold, textTransform: 'uppercase', marginBottom: '8px' }}>Why HEROES SchoolGist</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px' }}>Everything you need, nothing you don't</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '14.5px', marginBottom: '8px' }}>Real past questions</h4>
              <p style={{ fontSize: '12.5px', color: '#B9C2D6' }}>Organised by exam board, subject and year.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14.5px', marginBottom: '8px' }}>Timed CBT practice</h4>
              <p style={{ fontSize: '12.5px', color: '#B9C2D6' }}>Choose 30 minutes to 2 hours, real exam conditions.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14.5px', marginBottom: '8px' }}>Ask a teacher</h4>
              <p style={{ fontSize: '12.5px', color: '#B9C2D6' }}>Stuck on a topic? A real teacher answers you.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14.5px', marginBottom: '8px' }}>Registration guidance</h4>
              <p style={{ fontSize: '12.5px', color: '#B9C2D6' }}>Direct help with WAEC, JAMB, NECO and GCE registration.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ background: colors.gold, borderRadius: '18px', padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: colors.charcoal, marginBottom: '10px' }}>Ready to start practicing for free?</h2>
          <p style={{ fontSize: '13.5px', color: '#4A3A1E', marginBottom: '20px' }}>No card required. Create your account in under a minute.</p>
          <button onClick={() => navigate('/signup')} style={{ background: colors.ink, color: '#fff', padding: '13px 24px', fontSize: '14.5px', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
            Create free account
          </button>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${colors.line}`, padding: '30px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: colors.slate }}>© 2027 HEROES SchoolGist. All rights reserved.</p>
      </div>

    </div>
  );
}

export default HomePage;