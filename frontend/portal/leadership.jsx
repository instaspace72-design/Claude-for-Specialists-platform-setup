/* Leadership dashboard: live per-intern progress for the CEO, COO, and CPO.
   Pulls /api/leadership/overview through authFetch and renders real data,
   with honest loading, error, and not-started states. */

function SummaryTile({ label, value, accent }){
  return (
    <div className="surface reveal" style={{ padding:'20px 22px' }}>
      <div style={{ fontWeight:900, fontSize:34, letterSpacing:'-0.02em', lineHeight:1, color: accent ? 'var(--accent)' : 'var(--cream)' }}>
        {value}
      </div>
      <div className="eyebrow" style={{ marginTop:10 }}>{label}</div>
    </div>
  );
}

function fmtLast(ts){
  if (!ts) return 'No activity yet';
  // SQLite CURRENT_TIMESTAMP is 'YYYY-MM-DD HH:MM:SS' in UTC
  const d = new Date(String(ts).replace(' ', 'T') + 'Z');
  if (isNaN(d.getTime())) return String(ts);
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' }) + ' · ' +
         d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
}

function InternRow({ it, i }){
  const started = it.status === 'Active';
  return (
    <div className="surface reveal" style={{ padding:'18px 22px', animationDelay:`${i*0.05}s` }}>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ width:46, height:46, borderRadius:'var(--r-md)', flexShrink:0, background: started ? 'var(--accent-grad)' : 'var(--aubergine-deep)',
          color: started ? 'var(--aubergine)' : 'rgba(245,239,232,.6)', display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'var(--mono)', fontWeight:700, fontSize:15, border:'1px solid rgba(245,239,232,.1)' }}>
          {window.initials ? window.initials(it.name) : '··'}
        </div>
        <div style={{ minWidth:170 }}>
          <div style={{ fontWeight:800, fontSize:16 }}>{it.name}</div>
          <div className="c50" style={{ fontSize:13 }}>{it.title}</div>
        </div>

        <div style={{ flex:1, minWidth:120 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span className="eyebrow" style={{ letterSpacing:'.1em' }}>Course progress</span>
            <span className="mono" style={{ fontSize:12, color:'var(--accent)', fontWeight:700 }}>{it.completion}%</span>
          </div>
          <ProgressBar value={it.completion} height={8} />
        </div>

        <div style={{ textAlign:'center', minWidth:74 }}>
          <div style={{ fontWeight:800, fontSize:20 }}>{it.exercisesPassed}</div>
          <div className="eyebrow" style={{ marginTop:4 }}>Passed</div>
        </div>
        <div style={{ textAlign:'center', minWidth:64 }}>
          <div style={{ fontWeight:800, fontSize:20, color: it.streak > 0 ? 'var(--accent)' : 'var(--cream)' }}>{it.streak}</div>
          <div className="eyebrow" style={{ marginTop:4 }}>Streak</div>
        </div>

        <div style={{ minWidth:150, textAlign:'right' }}>
          <span className="pill" style={{
            background: started ? 'rgba(31,138,91,.16)' : 'rgba(245,239,232,.06)',
            color: started ? '#4fd18b' : 'rgba(245,239,232,.5)' }}>
            {started ? 'Active' : 'Not started'}
          </span>
          <div className="mono c35" style={{ fontSize:11, marginTop:7, letterSpacing:'.06em' }}>{fmtLast(it.lastActive)}</div>
        </div>
      </div>
    </div>
  );
}

function LeadershipDashboard({ user, onLogout }){
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true); setError('');
    window.authFetch('/api/leadership/overview')
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || `Failed to load (${res.status})`);
        setData(body);
      })
      .catch((err) => {
        const offline = /Failed to fetch|NetworkError/i.test(err.message);
        setError(offline ? 'Cannot reach the portal API on port 3001.' : err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const summary = data && data.summary;
  const interns = (data && data.interns) || [];

  return (
    <div className="scroll" style={{ height:'100%', width:'100%', background:'var(--ground)', position:'relative' }}>
      <div className="grid-surface" style={{ position:'absolute', inset:0, height:360, pointerEvents:'none' }} />
      <div style={{ position:'relative', maxWidth:1000, margin:'0 auto', padding:'40px 40px 60px' }}>

        {/* header */}
        <div className="reveal" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <Wordmark size={24} />
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{user.name}</div>
              <div className="c50 mono" style={{ fontSize:11, letterSpacing:'.08em' }}>{user.title}</div>
            </div>
            <div style={{ width:40, height:40, borderRadius:'var(--r-pill)', background:'var(--aubergine-lift)', border:'1px solid rgba(245,239,232,.1)',
              display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14 }}>{window.initials ? window.initials(user.name) : ''}</div>
            <button onClick={load} className="btn btn-ghost" style={{ padding:'9px 16px', fontSize:13 }}>Refresh</button>
            <button onClick={onLogout} className="btn btn-ghost" style={{ padding:'9px 16px', fontSize:13 }}>Sign out</button>
          </div>
        </div>

        <div className="eyebrow reveal" style={{ color:'var(--accent)', marginTop:26 }}>Leadership · {user.title}</div>
        <h1 className="reveal" style={{ fontWeight:900, fontSize:38, letterSpacing:'-0.03em', lineHeight:1.08, margin:'12px 0 6px' }}>
          Intern progress
        </h1>
        <p className="c70 reveal" style={{ fontSize:16, fontWeight:500, margin:0 }}>
          Live view of where every intern stands today. Updates as they complete lessons and exercises.
        </p>

        {loading && (
          <div className="c50 reveal" style={{ marginTop:40, fontSize:15 }}>Loading team progress…</div>
        )}

        {error && !loading && (
          <div className="reveal" style={{ marginTop:30, display:'flex', gap:10, alignItems:'center', padding:'14px 18px',
            borderRadius:'var(--r-md)', background:'rgba(209,30,76,.14)', border:'1px solid rgba(209,30,76,.4)' }}>
            <span style={{ color:'var(--crimson)', fontSize:16, fontWeight:900 }}>!</span>
            <span className="c94" style={{ fontSize:14, fontWeight:600 }}>{error}</span>
            <button onClick={load} className="btn btn-ghost" style={{ marginLeft:'auto', padding:'7px 14px', fontSize:12 }}>Retry</button>
          </div>
        )}

        {!loading && !error && summary && (
          <React.Fragment>
            <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginTop:30 }}>
              <SummaryTile label="Interns" value={summary.total} />
              <SummaryTile label="Active" value={summary.active} accent />
              <SummaryTile label="Exercises Passed" value={summary.exercisesPassed} />
              <SummaryTile label="Avg Completion" value={summary.avgCompletion + '%'} />
            </div>

            <div className="eyebrow reveal" style={{ marginTop:40, marginBottom:16 }}>The Team · {interns.length}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {interns.map((it, i) => <InternRow key={it.email} it={it} i={i} />)}
            </div>

            {summary.active === 0 && (
              <div className="reveal surface" style={{ marginTop:20, padding:'16px 20px', display:'flex', gap:12, alignItems:'center', background:'var(--aubergine-deep)' }}>
                <span style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, background:'var(--accent-grad)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--aubergine)', fontWeight:900, fontSize:13 }}>i</span>
                <span className="c70" style={{ fontSize:13, fontWeight:500 }}>No intern activity yet. Numbers will fill in as the team starts their courses.</span>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LeadershipDashboard });
