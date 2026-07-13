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

function fmtMins(mins){
  const m = Math.max(0, Math.round(mins || 0));
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
}

function fmtLast(ts){
  if (!ts) return 'No activity yet';
  // SQLite CURRENT_TIMESTAMP is 'YYYY-MM-DD HH:MM:SS' in UTC
  const d = new Date(String(ts).replace(' ', 'T') + 'Z');
  if (isNaN(d.getTime())) return String(ts);
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' }) + ' · ' +
         d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
}

function InternRow({ it, i, onOpen, isStar }){
  const started = it.status === 'Active';
  return (
    <div
      className="surface reveal"
      onClick={() => onOpen && onOpen(it)}
      style={{ padding:'18px 22px', animationDelay:`${i*0.05}s`, cursor: onOpen ? 'pointer' : 'default', transition:'transform .18s var(--ease), border-color .18s var(--ease)', borderColor: isStar ? 'rgba(242,98,46,.35)' : undefined }}
      onMouseEnter={(e) => { if (onOpen) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { if (onOpen) e.currentTarget.style.transform = 'none'; }}
    >
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
        <div style={{ textAlign:'center', minWidth:70 }}>
          <div style={{ fontWeight:800, fontSize:20, color: (it.activeMinutes7d || 0) > 0 ? 'var(--accent)' : 'var(--cream)' }}>{fmtMins(it.activeMinutes7d)}</div>
          <div className="eyebrow" style={{ marginTop:4 }}>Time · 7d</div>
        </div>
        <div style={{ textAlign:'center', minWidth:60 }}>
          <div style={{ fontWeight:800, fontSize:20, color: it.streak > 0 ? 'var(--accent)' : 'var(--cream)' }}>{it.streak}</div>
          <div className="eyebrow" style={{ marginTop:4 }}>Streak</div>
        </div>

        <div style={{ minWidth:150, textAlign:'right' }}>
          {isStar && (
            <span className="pill" style={{
              background:'var(--accent-grad)', color:'var(--aubergine)', fontWeight:800, marginRight:6,
            }}>★ Star</span>
          )}
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
  const [ratings, setRatings] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [detailIntern, setDetailIntern] = useState(null);
  const [reportIntern, setReportIntern] = useState(null);

  const load = () => {
    setLoading(true); setError('');
    const period = window.currentPeriod ? window.currentPeriod() : '';
    Promise.all([
      window.authFetch('/api/leadership/overview'),
      window.authFetch(`/api/leadership/ratings?period=${period}`),
    ])
      .then(async ([overviewRes, ratingsRes]) => {
        const overview = await overviewRes.json().catch(() => ({}));
        if (!overviewRes.ok) throw new Error(overview.error || `Failed to load (${overviewRes.status})`);
        const ratingsBody = await ratingsRes.json().catch(() => ({}));
        setData(overview);
        setRatings(ratingsRes.ok ? ratingsBody : null);
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
  const starEmail = ratings && ratings.star && ratings.star.intern_email;
  const starIntern = starEmail && interns.find((i) => i.email === starEmail);
  const openReport = (it) => { setDetailIntern(null); setReportIntern(it); };

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
            <button onClick={() => setAddOpen(true)} className="btn btn-primary" style={{ padding:'9px 18px', fontSize:13 }}>+ Add intern</button>
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

            {starIntern && ratings.star.overall != null && (
              <div className="reveal surface" style={{
                marginTop:26, padding:'18px 22px', display:'flex', alignItems:'center', gap:16,
                background:'linear-gradient(135deg, rgba(242,98,46,.16), rgba(209,30,76,.10))',
                border:'1px solid rgba(242,98,46,.32)',
              }}>
                <div style={{
                  width:56, height:56, borderRadius:'50%', flexShrink:0,
                  background:'var(--accent-grad)', color:'var(--aubergine)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:26, fontWeight:900,
                }}>★</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="eyebrow" style={{ color:'var(--accent)' }}>
                    Star of the Month · {window.periodLabel ? window.periodLabel(ratings.period) : ratings.period}
                  </div>
                  <div style={{ fontWeight:900, fontSize:22, letterSpacing:'-0.02em', marginTop:4 }}>{starIntern.name}</div>
                  <div className="c70" style={{ fontSize:13, marginTop:2 }}>
                    {starIntern.title} · rated by {ratings.star.leaders} leader{ratings.star.leaders === 1 ? '' : 's'}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="mono" style={{ fontSize:10, letterSpacing:'.2em', color:'rgba(245,239,232,.5)' }}>OVERALL</div>
                  <div style={{ fontWeight:900, fontSize:32, letterSpacing:'-0.02em', color:'var(--accent)' }}>
                    {ratings.star.overall.toFixed(1)}
                  </div>
                </div>
                <button
                  onClick={() => openReport(starIntern)}
                  className="btn btn-primary"
                  style={{ padding:'9px 18px', fontSize:13 }}
                >Open report</button>
              </div>
            )}

            <div className="eyebrow reveal" style={{ marginTop:40, marginBottom:16 }}>The Team · {interns.length}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {interns.map((it, i) => (
                <InternRow
                  key={it.email}
                  it={it}
                  i={i}
                  isStar={starEmail === it.email}
                  onOpen={setDetailIntern}
                />
              ))}
            </div>
            <div className="mono c35 reveal" style={{ fontSize:11, textAlign:'center', marginTop:14, letterSpacing:'.08em' }}>
              Click any intern to rate them, add remarks, or open the one click report.
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

      {addOpen && window.AddInternModal && (
        <AddInternModal
          onClose={() => setAddOpen(false)}
          onCreated={() => { setAddOpen(false); load(); }}
        />
      )}
      {detailIntern && window.InternDetailDrawer && (
        <InternDetailDrawer
          user={user}
          intern={detailIntern}
          onClose={() => { setDetailIntern(null); load(); }}
          onOpenReport={(it) => openReport(it)}
        />
      )}
      {reportIntern && window.PerformanceReport && (
        <PerformanceReport
          intern={reportIntern}
          onClose={() => setReportIntern(null)}
        />
      )}
    </div>
  );
}

Object.assign(window, { LeadershipDashboard });
