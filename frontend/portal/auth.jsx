/* Auth: login, forced first-login password change, leadership landing.
   Token + user are kept in localStorage. authFetch() attaches the bearer
   token so any screen can call the API as the signed in user. */

const AUTH_BASE = (typeof window !== 'undefined' && typeof window.PORTAL_API === 'string') ? window.PORTAL_API : 'http://localhost:3001';
const AUTH_KEY = 'ifs_auth';

function loadAuth(){
  try { const raw = localStorage.getItem(AUTH_KEY); return raw ? JSON.parse(raw) : null; }
  catch (e) { return null; }
}
function saveAuth(a){
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(a)); } catch (e) { /* private mode */ }
  window.PORTAL_USER = a && a.user;
  window.PORTAL_TOKEN = a && a.token;
}
function clearAuth(){
  try { localStorage.removeItem(AUTH_KEY); } catch (e) { /* ignore */ }
  window.PORTAL_USER = null;
  window.PORTAL_TOKEN = null;
}
async function authFetch(pathname, opts){
  opts = opts || {};
  const a = loadAuth();
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  if (a && a.token) headers['Authorization'] = 'Bearer ' + a.token;
  return fetch(AUTH_BASE + pathname, Object.assign({}, opts, { headers }));
}
// keep the global identity in sync as soon as the module loads
(function(){ const a = loadAuth(); if (a){ window.PORTAL_USER = a.user; window.PORTAL_TOKEN = a.token; } })();

function initials(name){
  return String(name || '').trim().split(/\s+/).map(w => w[0]).slice(0,2).join('').toUpperCase() || 'IS';
}

/* Shared framed shell used by the sign in + change password screens. */
function AuthShell({ eyebrow, title, subtitle, children, footer }){
  return (
    <div style={{
      height:'100%', width:'100%', background:'var(--ground)', position:'relative',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'40px', overflow:'hidden',
    }}>
      <div className="grid-surface" style={{ position:'absolute', inset:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'-18%', right:'-8%', width:520, height:520, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(242,98,46,.16), transparent 65%)', filter:'blur(30px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-22%', left:'-10%', width:460, height:460, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(209,30,76,.12), transparent 65%)', filter:'blur(34px)', pointerEvents:'none' }} />

      <div className="reveal surface" style={{
        position:'relative', width:'100%', maxWidth:428, padding:'38px 38px 32px',
        background:'var(--aubergine-lift)', boxShadow:'0 40px 90px -30px rgba(0,0,0,.7)',
      }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:22 }}><Wordmark size={26} /></div>
        <div className="eyebrow" style={{ color:'var(--accent)', textAlign:'center' }}>{eyebrow}</div>
        <h1 style={{ fontWeight:900, fontSize:27, letterSpacing:'-0.02em', textAlign:'center', margin:'10px 0 6px' }}>{title}</h1>
        {subtitle && <p className="c70" style={{ fontSize:14, textAlign:'center', lineHeight:1.5, fontWeight:500, margin:'0 auto 24px', maxWidth:320 }}>{subtitle}</p>}
        {children}
        {footer}
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, autoFocus, onEnter }){
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display:'block', marginBottom:16 }}>
      <span className="eyebrow" style={{ display:'block', marginBottom:8, letterSpacing:'.14em' }}>{label}</span>
      <input
        type={type} value={value} autoFocus={autoFocus} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && onEnter) onEnter(); }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width:'100%', background:'var(--ground)', color:'var(--cream)', fontSize:15,
          border:`1px solid ${focus ? 'var(--accent)' : 'rgba(245,239,232,.14)'}`, borderRadius:'var(--r-md)',
          padding:'13px 15px', outline:'none', transition:'border-color .18s var(--ease)',
        }}
      />
    </label>
  );
}

function ErrorLine({ text }){
  if (!text) return null;
  return (
    <div className="reveal" style={{ display:'flex', gap:9, alignItems:'center', padding:'10px 13px', marginBottom:16,
      borderRadius:'var(--r-md)', background:'rgba(209,30,76,.14)', border:'1px solid rgba(209,30,76,.4)' }}>
      <span style={{ color:'var(--crimson)', fontSize:15, fontWeight:900 }}>!</span>
      <span className="c94" style={{ fontSize:13, fontWeight:600 }}>{text}</span>
    </div>
  );
}

function Login({ onAuthed }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (busy) return;
    if (!email.trim() || !password){ setError('Enter your email and password.'); return; }
    setBusy(true); setError('');
    try {
      const res = await fetch(`${AUTH_BASE}/api/auth/login`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Sign in failed (${res.status})`);
      saveAuth(data);
      onAuthed(data);
    } catch (err) {
      const offline = /Failed to fetch|NetworkError/i.test(err.message);
      setError(offline ? 'Cannot reach the portal API on port 3001. Start it with "npm run dev".' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Learning Portal · Sign in"
      title="Welcome back"
      subtitle="Sign in with your InstaSpace account to reach today's course and your live Claude practice."
      footer={
        <div className="mono c35" style={{ fontSize:11, textAlign:'center', marginTop:18, lineHeight:1.6, letterSpacing:'.04em' }}>
          Accounts are provisioned by your program lead.<br/>First sign in asks you to set a new password.
        </div>
      }
    >
      <ErrorLine text={error} />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="firstname@myinstaspace.com" autoFocus onEnter={submit} />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" onEnter={submit} />
      <button className="btn btn-primary" onClick={submit} disabled={busy}
        style={{ width:'100%', justifyContent:'center', marginTop:6, opacity: busy ? .6 : 1, cursor: busy ? 'progress' : 'pointer' }}>
        {busy ? 'Signing in…' : 'Sign in'} {!busy && <span style={{ fontSize:18 }}>→</span>}
      </button>
    </AuthShell>
  );
}

function ChangePassword({ user, onDone, onLogout }){
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (busy) return;
    if (pw.length < 8){ setError('Use at least 8 characters.'); return; }
    if (pw === 'Instaspace@123'){ setError('Choose a password different from the default.'); return; }
    if (pw !== confirm){ setError('The two passwords do not match.'); return; }
    setBusy(true); setError('');
    try {
      const res = await authFetch('/api/auth/change-password', { method:'POST', body: JSON.stringify({ newPassword: pw }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Could not update password (${res.status})`);
      const a = loadAuth() || {};
      const next = Object.assign({}, a, { user: data.user });
      saveAuth(next);
      onDone(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Secure your account"
      title={`Set a new password`}
      subtitle={`Hi ${user.firstName || user.name}. Before you start, replace the default password with one only you know.`}
      footer={
        <button onClick={onLogout} style={{ display:'block', margin:'16px auto 0', background:'none', border:'none',
          color:'rgba(245,239,232,.45)', cursor:'pointer', fontSize:12, fontFamily:'var(--mono)', letterSpacing:'.06em' }}>
          Sign out
        </button>
      }
    >
      <ErrorLine text={error} />
      <Field label="New password" type="password" value={pw} onChange={setPw} placeholder="At least 8 characters" autoFocus onEnter={submit} />
      <Field label="Confirm password" type="password" value={confirm} onChange={setConfirm} placeholder="Type it again" onEnter={submit} />
      <button className="btn btn-primary" onClick={submit} disabled={busy}
        style={{ width:'100%', justifyContent:'center', marginTop:6, opacity: busy ? .6 : 1, cursor: busy ? 'progress' : 'pointer' }}>
        {busy ? 'Saving…' : 'Save and continue'} {!busy && <span style={{ fontSize:18 }}>→</span>}
      </button>
    </AuthShell>
  );
}

/* Leadership + mentor landing. Honest placeholder: the live intern progress
   dashboard is the next build. Shows the roster we provisioned, no fake data. */
const INTERN_ROSTER = [
  { name:'Mesum',          title:'SEO & Backlinks',        badge:'ME' },
  { name:'Shahzaib Nasir', title:'Design & Video',         badge:'SN' },
  { name:'Umair Aziz',     title:'InstaSpace App Mastery', badge:'UA' },
  { name:'Abdullah',       title:'InstaSpace App Mastery', badge:'AB' },
  { name:'Hamza Butt',     title:'LinkedIn Marketing',     badge:'HB' },
];

function LeadershipLanding({ user, onLogout }){
  return (
    <div className="scroll" style={{ height:'100%', width:'100%', background:'var(--ground)', position:'relative', padding:'0' }}>
      <div className="grid-surface" style={{ position:'absolute', inset:0, height:360, pointerEvents:'none' }} />
      <div style={{ position:'relative', maxWidth:920, margin:'0 auto', padding:'56px 40px 60px' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, marginBottom:8 }}>
          <Wordmark size={24} />
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{user.name}</div>
              <div className="c50 mono" style={{ fontSize:11, letterSpacing:'.08em' }}>{user.title}</div>
            </div>
            <div style={{ width:40, height:40, borderRadius:'var(--r-pill)', background:'var(--aubergine-lift)', border:'1px solid rgba(245,239,232,.1)',
              display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14 }}>{initials(user.name)}</div>
            <button onClick={onLogout} className="btn btn-ghost" style={{ padding:'9px 16px', fontSize:13 }}>Sign out</button>
          </div>
        </div>

        <div className="eyebrow reveal" style={{ color:'var(--accent)', marginTop:26 }}>Leadership · {user.title}</div>
        <h1 className="reveal" style={{ fontWeight:900, fontSize:40, letterSpacing:'-0.03em', lineHeight:1.08, margin:'12px 0 12px' }}>
          Good to see you, {user.firstName || user.name}.
        </h1>
        <p className="c70 reveal" style={{ fontSize:17, maxWidth:560, lineHeight:1.55, fontWeight:500, marginTop:0 }}>
          Your team is provisioned and ready. The live daily progress dashboard, lesson completion, exercise quality,
          streaks, and blockers, is the next build. Here is the intern roster it will track.
        </p>

        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14, marginTop:34 }}>
          {INTERN_ROSTER.map((m, i) => (
            <div key={m.name} className="surface" style={{ padding:'18px 20px', display:'flex', alignItems:'center', gap:15, animationDelay:`${i*0.06}s` }}>
              <div style={{ width:46, height:46, borderRadius:'var(--r-md)', background:'var(--aubergine-deep)', border:'1px solid rgba(245,239,232,.1)',
                display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', fontWeight:700, fontSize:15 }}>{m.badge}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:16 }}>{m.name}</div>
                <div className="c50" style={{ fontSize:13 }}>{m.title}</div>
              </div>
              <span className="pill" style={{ background:'rgba(245,239,232,.06)', color:'rgba(245,239,232,.5)', fontSize:9 }}>Awaiting first login</span>
            </div>
          ))}
        </div>

        <div className="reveal surface" style={{ marginTop:20, padding:'16px 20px', display:'flex', gap:12, alignItems:'center', background:'var(--aubergine-deep)' }}>
          <span style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, background:'var(--accent-grad)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--aubergine)', fontWeight:900, fontSize:13 }}>i</span>
          <span className="c70" style={{ fontSize:13, fontWeight:500, lineHeight:1.5 }}>
            Next build: a live dashboard here for the CEO, COO, and CPO showing each intern's daily progress in real time.
          </span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { loadAuth, saveAuth, clearAuth, authFetch, initials, Login, ChangePassword, LeadershipLanding });
