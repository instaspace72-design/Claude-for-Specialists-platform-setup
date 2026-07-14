/* Leadership panels: Add Intern modal, Intern Detail drawer (KPI sliders +
   remarks), and the printable Performance Report. All talk to /api/leadership.
   Each leader keeps their own scores per intern per month; averages roll up
   into the Star of the Month card in leadership.jsx. */

const KPI_FIELDS = [
  { key:'time_score',    label:'Time',                hint:'Turns up when they said they would.' },
  { key:'discipline',    label:'Discipline',          hint:'Follows through without being nudged.' },
  { key:'dedication',    label:'Dedication',          hint:'Puts real hours behind the work.' },
  { key:'willingness',   label:'Willingness',         hint:'Says yes to hard tasks, not just easy ones.' },
  { key:'attention',     label:'Attention to Detail', hint:'Spots what other people miss.' },
  { key:'reporting',     label:'Reporting Habits',    hint:'Sends updates without being chased.' },
  { key:'communication', label:'Communication',       hint:'Clear, calm, on brand across channels.' },
];
const KPI_LABEL_BY_KEY = KPI_FIELDS.reduce((m, f) => { m[f.key] = f.label; return m; }, {});
const EMPTY_SCORES = KPI_FIELDS.reduce((o, f) => { o[f.key] = 5; return o; }, {});

function periodLabel(p){
  const [y, m] = String(p || '').split('-');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const i = Math.max(0, Math.min(11, Number(m) - 1));
  return `${months[i]} ${y || ''}`.trim();
}

function currentPeriod(){
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/* ==================================================================
   Modal shell: shared frosted-cover surface used by every panel.
================================================================== */
function ModalShell({ onClose, width, children }){
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:70,
      background:'rgba(18,8,34,.78)', backdropFilter:'blur(6px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'28px',
      overflowY:'auto', animation:'fadein .28s var(--ease) both',
    }} onClick={onClose}>
      <div className="surface" onClick={(e) => e.stopPropagation()} style={{
        width: `min(${width || 640}px, 100%)`, background:'var(--aubergine-lift)',
        boxShadow:'0 40px 90px -30px rgba(0,0,0,.7)', padding:0, overflow:'hidden',
        animation:'rise .35s var(--ease) both', maxHeight:'calc(100vh - 56px)',
        display:'flex', flexDirection:'column',
      }}>{children}</div>
    </div>
  );
}

/* ==================================================================
   Add Intern modal
================================================================== */
function AddInternModal({ onClose, onCreated }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('InstaSpace App Mastery');
  const [track, setTrack] = useState('webapp-portal');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(null);

  const submit = async () => {
    if (busy) return;
    if (!name.trim() || !email.trim()){ setError('Name and email are required.'); return; }
    setBusy(true); setError('');
    try {
      const res = await window.authFetch('/api/leadership/interns', {
        method:'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), title: title.trim(), track: track.trim() || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Could not add intern (${res.status})`);
      setOk({ email: data.intern.email, defaultPassword: data.defaultPassword });
      onCreated && onCreated(data.intern);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell onClose={onClose} width={520}>
      <div style={{ padding:'22px 26px 6px', borderBottom:'1px solid rgba(245,239,232,.08)' }}>
        <div className="eyebrow" style={{ color:'var(--accent)' }}>Leadership · Provision</div>
        <h3 style={{ fontWeight:900, fontSize:22, letterSpacing:'-0.02em', margin:'6px 0 12px' }}>Add a new intern</h3>
      </div>
      <div className="scroll" style={{ padding:'20px 26px 6px', flex:1 }}>
        {ok ? (
          <div className="surface" style={{ padding:'18px', background:'rgba(31,138,91,.12)', border:'1px solid rgba(31,138,91,.35)' }}>
            <div className="eyebrow" style={{ color:'#4fd18b' }}>Intern provisioned</div>
            <div style={{ fontWeight:800, fontSize:16, marginTop:8 }}>{ok.email}</div>
            <div className="c70" style={{ fontSize:13, marginTop:10, lineHeight:1.5 }}>
              Share the default password <span className="mono" style={{ color:'var(--accent)', fontWeight:700 }}>{ok.defaultPassword}</span>.
              They will be asked to set a new one on first sign in.
            </div>
          </div>
        ) : (
          <React.Fragment>
            {error && (
              <div style={{ display:'flex', gap:8, alignItems:'center', padding:'10px 13px', marginBottom:14,
                borderRadius:'var(--r-md)', background:'rgba(209,30,76,.14)', border:'1px solid rgba(209,30,76,.4)' }}>
                <span style={{ color:'var(--crimson)', fontWeight:900 }}>!</span>
                <span className="c94" style={{ fontSize:13 }}>{error}</span>
              </div>
            )}
            <PanelField label="Full name"        value={name}  onChange={setName}  placeholder="e.g. Aiman Khan" autoFocus />
            <PanelField label="Work email"       value={email} onChange={setEmail} placeholder="firstname@myinstaspace.com" />
            <PanelField label="Title"            value={title} onChange={setTitle} placeholder="InstaSpace App Mastery" />
            <PanelField label="Track"            value={track} onChange={setTrack} placeholder="webapp-portal · seo · design · qa-nocode · qa-seo" />
            <div className="mono c50" style={{ fontSize:11, letterSpacing:'.08em', marginTop:6, lineHeight:1.6 }}>
              First sign in forces a password change. Track determines which course they land on.
            </div>
          </React.Fragment>
        )}
      </div>
      <div style={{ padding:'16px 26px', display:'flex', justifyContent:'flex-end', gap:10, borderTop:'1px solid rgba(245,239,232,.08)' }}>
        <button className="btn btn-ghost" onClick={onClose} style={{ padding:'9px 18px', fontSize:13 }}>
          {ok ? 'Done' : 'Cancel'}
        </button>
        {!ok && (
          <button className="btn btn-primary" onClick={submit} disabled={busy}
            style={{ padding:'9px 20px', fontSize:13, opacity: busy ? .6 : 1 }}>
            {busy ? 'Adding…' : 'Provision intern'}
          </button>
        )}
      </div>
    </ModalShell>
  );
}

function PanelField({ label, value, onChange, placeholder, autoFocus, multiline }){
  const [focus, setFocus] = useState(false);
  const style = {
    width:'100%', background:'var(--ground)', color:'var(--cream)', fontSize:14,
    border:`1px solid ${focus ? 'var(--accent)' : 'rgba(245,239,232,.14)'}`, borderRadius:'var(--r-md)',
    padding:'11px 13px', outline:'none', transition:'border-color .18s var(--ease)',
    fontFamily:'var(--sans)', resize:'vertical',
  };
  return (
    <label style={{ display:'block', marginBottom:14 }}>
      <span className="eyebrow" style={{ display:'block', marginBottom:7, letterSpacing:'.14em' }}>{label}</span>
      {multiline ? (
        <textarea rows={3} autoFocus={autoFocus} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={style} />
      ) : (
        <input type="text" autoFocus={autoFocus} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={style} />
      )}
    </label>
  );
}

/* ==================================================================
   KPI slider + Notes drawer (per intern)
================================================================== */
function KpiSlider({ label, hint, value, onChange }){
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:14 }}>{label}</div>
          <div className="c50" style={{ fontSize:11.5, marginTop:2 }}>{hint}</div>
        </div>
        <div style={{
          fontFamily:'var(--mono)', fontWeight:800, fontSize:16,
          color: value >= 8 ? 'var(--accent)' : (value >= 5 ? 'var(--cream)' : 'rgba(245,239,232,.5)'),
          minWidth:44, textAlign:'right',
        }}>{value}/10</div>
      </div>
      <input type="range" min={1} max={10} step={1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width:'100%', accentColor:'var(--accent)' }} />
    </div>
  );
}

function InternDetailDrawer({ user, intern, onClose, onOpenReport }){
  const period = currentPeriod();
  const [scores, setScores] = useState(EMPTY_SCORES);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const setScore = (k, v) => setScores((s) => Object.assign({}, s, { [k]: v }));

  const load = async () => {
    setError('');
    try {
      const [ratingsRes, notesRes] = await Promise.all([
        window.authFetch(`/api/leadership/ratings?period=${period}`),
        window.authFetch(`/api/leadership/notes/${encodeURIComponent(intern.email)}`),
      ]);
      const ratingsData = await ratingsRes.json().catch(() => ({}));
      const notesData = await notesRes.json().catch(() => ({}));
      // pre-fill the current leader's slider values for this intern, if any
      const mine = (ratingsData.ratings || []).find((r) => r.intern_email === intern.email && r.leader_email === user.email);
      if (mine) {
        const next = {};
        KPI_FIELDS.forEach((f) => { next[f.key] = mine[f.key] || 5; });
        setScores(next);
      }
      setNotes(notesData.notes || []);
    } catch (e) {
      setError('Could not load this intern’s ratings. Check the API.');
    }
  };

  useEffect(() => { load(); }, [intern && intern.email]);

  const saveScores = async () => {
    if (busy) return;
    setBusy(true); setError(''); setStatus('');
    try {
      const res = await window.authFetch('/api/leadership/ratings', {
        method:'POST',
        body: JSON.stringify({ internEmail: intern.email, period, scores }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || `Save failed (${res.status})`);
      }
      setStatus('Ratings saved for ' + periodLabel(period));
      setTimeout(() => setStatus(''), 2400);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const addNote = async () => {
    const body = newNote.trim();
    if (!body) return;
    setBusy(true); setError('');
    try {
      const res = await window.authFetch('/api/leadership/notes', {
        method:'POST',
        body: JSON.stringify({ internEmail: intern.email, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Note failed (${res.status})`);
      setNewNote('');
      // optimistic prepend, real refresh follows
      setNotes((prev) => [{ id: data.id, body, leader_name: user.name, leader_title: user.title, created_at: new Date().toISOString().replace('T', ' ').slice(0, 19) }].concat(prev));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell onClose={onClose} width={760}>
      <div style={{ padding:'22px 26px 6px', borderBottom:'1px solid rgba(245,239,232,.08)' }}>
        <div className="eyebrow" style={{ color:'var(--accent)' }}>Leadership · {intern.title}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, marginTop:4 }}>
          <h3 style={{ fontWeight:900, fontSize:24, letterSpacing:'-0.02em', margin:'2px 0 12px' }}>{intern.name}</h3>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-ghost" onClick={() => onOpenReport(intern)} style={{ padding:'8px 14px', fontSize:12 }}>
              One click report →
            </button>
          </div>
        </div>
      </div>

      <div className="scroll" style={{ padding:'18px 26px 4px', flex:1 }}>
        {error && (
          <div style={{ display:'flex', gap:8, alignItems:'center', padding:'10px 13px', marginBottom:14,
            borderRadius:'var(--r-md)', background:'rgba(209,30,76,.14)', border:'1px solid rgba(209,30,76,.4)' }}>
            <span style={{ color:'var(--crimson)', fontWeight:900 }}>!</span>
            <span className="c94" style={{ fontSize:13 }}>{error}</span>
          </div>
        )}

        <div className="eyebrow" style={{ marginBottom:10, color:'rgba(245,239,232,.55)' }}>
          Your ratings · {periodLabel(period)}
        </div>
        {KPI_FIELDS.map((f) => (
          <KpiSlider key={f.key} label={f.label} hint={f.hint} value={scores[f.key]} onChange={(v) => setScore(f.key, v)} />
        ))}
        <div style={{ display:'flex', gap:10, alignItems:'center', marginTop:10, marginBottom:22 }}>
          <button className="btn btn-primary" onClick={saveScores} disabled={busy}
            style={{ padding:'10px 22px', fontSize:13, opacity: busy ? .6 : 1 }}>
            {busy ? 'Saving…' : 'Save ratings'}
          </button>
          {status && <span className="mono" style={{ color:'#4fd18b', fontSize:12 }}>{status}</span>}
          <span className="mono c35" style={{ fontSize:11, marginLeft:'auto' }}>
            Each leader keeps their own scores. The team average decides the Star of the Month.
          </span>
        </div>

        <div className="eyebrow" style={{ marginTop:8, marginBottom:10, color:'rgba(245,239,232,.55)' }}>
          Remarks and notes
        </div>
        <div className="surface" style={{ padding:'12px 14px', marginBottom:14, background:'var(--aubergine-deep)' }}>
          <textarea
            rows={3}
            value={newNote}
            placeholder="What did you observe this week? Improvements, blockers, one behaviour to reinforce."
            onChange={(e) => setNewNote(e.target.value)}
            style={{
              width:'100%', background:'transparent', color:'var(--cream)',
              border:'none', outline:'none', fontSize:14, fontFamily:'var(--sans)', resize:'vertical',
            }}
          />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, marginTop:6 }}>
            <span className="mono c35" style={{ fontSize:11 }}>Posting as {user.name} · {user.title}</span>
            <button className="btn btn-primary" onClick={addNote} disabled={busy || !newNote.trim()}
              style={{ padding:'8px 16px', fontSize:12, opacity: busy || !newNote.trim() ? .5 : 1 }}>
              Add note
            </button>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="c50" style={{ fontSize:13, padding:'14px 4px 4px' }}>No notes yet. The first observation goes here.</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10, paddingBottom:12 }}>
            {notes.map((n) => (
              <div key={n.id} className="surface" style={{ padding:'12px 14px', background:'var(--aubergine-deep)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap:10, marginBottom:4 }}>
                  <div style={{ fontWeight:700, fontSize:13 }}>{n.leader_name || 'Leader'}</div>
                  <div className="mono c35" style={{ fontSize:10.5 }}>
                    {n.leader_title ? n.leader_title + ' · ' : ''}{String(n.created_at || '').slice(0, 16).replace('T', ' ')}
                  </div>
                </div>
                <div className="c82" style={{ fontSize:13.5, lineHeight:1.55, whiteSpace:'pre-wrap' }}>{n.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding:'14px 26px', display:'flex', justifyContent:'flex-end', gap:10, borderTop:'1px solid rgba(245,239,232,.08)' }}>
        <button className="btn btn-ghost" onClick={onClose} style={{ padding:'9px 18px', fontSize:13 }}>Close</button>
      </div>
    </ModalShell>
  );
}

/* ==================================================================
   One-click Performance Report
================================================================== */
function KpiBar({ label, avg, count }){
  const pct = avg ? (avg / 10) * 100 : 0;
  const color = avg == null ? 'rgba(245,239,232,.2)' : (avg >= 8 ? 'var(--accent-grad)' : (avg >= 5 ? 'linear-gradient(135deg,#F2622E,#F2622E)' : 'linear-gradient(135deg,#D11E4C,#8b1738)'));
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
        <span style={{ fontWeight:700, fontSize:13.5, color:'var(--aubergine)' }}>{label}</span>
        <span className="mono" style={{ fontSize:12, color: avg == null ? 'rgba(42,18,64,.4)' : 'var(--aubergine)', fontWeight:700 }}>
          {avg == null ? 'No ratings' : `${avg.toFixed(1)} / 10`}
          {avg != null && count > 1 && <span style={{ color:'rgba(42,18,64,.5)' }}> · {count} leaders</span>}
        </span>
      </div>
      <div style={{ height:8, background:'rgba(42,18,64,.1)', borderRadius:99, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background: color, borderRadius:99 }} />
      </div>
    </div>
  );
}

function PerformanceReport({ intern, onClose }){
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const period = currentPeriod();

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    window.authFetch(`/api/leadership/report/${encodeURIComponent(intern.email)}?period=${period}`)
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || `Report failed (${res.status})`);
        if (!cancelled) setData(body);
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [intern.email]);

  const print = () => { try { window.print(); } catch (e) { /* ignore */ } };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:75,
      background:'rgba(18,8,34,.86)', backdropFilter:'blur(6px)',
      display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'32px',
      overflowY:'auto', animation:'fadein .28s var(--ease) both',
    }}>
      <button
        onClick={onClose}
        className="cert-hide-on-print"
        style={{
          position:'fixed', top:20, right:24, zIndex:2,
          background:'rgba(245,239,232,.08)', color:'var(--cream)',
          border:'1px solid rgba(245,239,232,.18)', borderRadius:'var(--r-pill)',
          padding:'9px 16px', fontSize:13, fontWeight:700, cursor:'pointer',
        }}
      >Close</button>

      <div id="cert-print" style={{
        width:'min(900px, 100%)', background:'var(--cream)', color:'var(--aubergine)',
        borderRadius:'18px', boxShadow:'0 40px 90px -30px rgba(0,0,0,.7)', overflow:'hidden',
        animation:'rise .4s var(--ease) both',
      }}>
        {/* Header band */}
        <div style={{
          background:'var(--aubergine)', color:'var(--cream)',
          padding:'22px 34px', display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <Wordmark size={20} />
          <div className="mono" style={{ fontSize:11, letterSpacing:'.18em', opacity:.75 }}>
            PERFORMANCE REPORT · {periodLabel(period).toUpperCase()}
          </div>
        </div>

        <div style={{ padding:'30px 40px 20px' }}>
          {loading && <div style={{ fontSize:14 }}>Loading report…</div>}
          {error && <div style={{ color:'var(--crimson)', fontWeight:700 }}>{error}</div>}

          {data && !loading && !error && (
            <React.Fragment>
              {/* Identity + headline */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:24, marginBottom:24 }}>
                <div>
                  <div className="mono" style={{ fontSize:11, letterSpacing:'.22em', color:'rgba(42,18,64,.55)' }}>PERFORMANCE OF</div>
                  <div style={{ fontWeight:900, fontSize:36, letterSpacing:'-0.02em', lineHeight:1.1, margin:'6px 0 4px' }}>
                    {data.intern.name}
                    {data.isStar && (
                      <span style={{
                        display:'inline-flex', alignItems:'center', gap:6, marginLeft:12,
                        padding:'4px 12px', borderRadius:'var(--r-pill)', background:'var(--accent-grad)',
                        color:'var(--aubergine)', fontFamily:'var(--mono)', fontSize:11, fontWeight:800, letterSpacing:'.12em',
                        verticalAlign:'middle',
                      }}>★ STAR OF THE MONTH</span>
                    )}
                  </div>
                  <div className="mono" style={{ fontSize:12, letterSpacing:'.14em', color:'rgba(42,18,64,.6)' }}>
                    {data.intern.title} · {data.intern.email}
                  </div>
                </div>
                <div style={{
                  textAlign:'center', padding:'12px 18px', borderRadius:'14px',
                  background: data.overall != null ? 'var(--aubergine)' : 'rgba(42,18,64,.1)',
                  color: data.overall != null ? 'var(--cream)' : 'rgba(42,18,64,.5)', minWidth:120,
                }}>
                  <div className="mono" style={{ fontSize:10, letterSpacing:'.2em', opacity:.7 }}>OVERALL</div>
                  <div style={{ fontWeight:900, fontSize:32, letterSpacing:'-0.02em', lineHeight:1, marginTop:4 }}>
                    {data.overall != null ? data.overall.toFixed(1) : '—'}
                  </div>
                  <div className="mono" style={{ fontSize:10, letterSpacing:'.18em', opacity:.7, marginTop:4 }}>OF 10</div>
                </div>
              </div>

              {/* Progress row */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:24 }}>
                <ProgressTile label="Course completion" value={`${data.progress.completion || 0}%`} />
                <ProgressTile label="Exercises passed"  value={data.progress.exercisesPassed || 0} />
                <ProgressTile label="Artefacts"         value={(data.artefacts || []).length} />
                <ProgressTile label="Leaders rating"    value={data.leaderRatings.length} />
              </div>

              {/* Portfolio evidence */}
              {(data.artefacts || []).length > 0 && (
                <React.Fragment>
                  <h4 style={{ fontWeight:800, fontSize:16, letterSpacing:'-0.01em', margin:'0 0 12px' }}>Portfolio artefacts</h4>
                  <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:24 }}>
                    {data.artefacts.map((a) => (
                      <div key={a.id} style={{ display:'flex', justifyContent:'space-between', gap:12, fontSize:13, padding:'8px 12px',
                        border:'1px solid rgba(42,18,64,.12)', borderRadius:8, background:'rgba(42,18,64,.03)' }}>
                        <span style={{ fontWeight:700 }}>{a.name}</span>
                        <span className="mono" style={{ fontSize:11, color:'rgba(42,18,64,.55)', flexShrink:0 }}>
                          {a.exercise_id || ''} · {String(a.created_at || '').slice(0, 10)}
                        </span>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}
              {(data.defences || []).length > 0 && (
                <React.Fragment>
                  <h4 style={{ fontWeight:800, fontSize:16, letterSpacing:'-0.01em', margin:'0 0 12px' }}>Capstone defence recordings</h4>
                  <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:24 }}>
                    {data.defences.map((d, i) => (
                      <div key={i} style={{ fontSize:13, padding:'8px 12px', border:'1px solid rgba(42,18,64,.12)', borderRadius:8, background:'rgba(42,18,64,.03)' }}>
                        <span style={{ fontWeight:700 }}>{d.exercise_id}</span>{' · '}
                        <a href={d.defence_url} target="_blank" rel="noopener noreferrer" style={{ color:'var(--crimson)', fontWeight:600, wordBreak:'break-all' }}>{d.defence_url}</a>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}

              {/* KPI bars */}
              <h4 style={{ fontWeight:800, fontSize:16, letterSpacing:'-0.01em', margin:'0 0 14px' }}>Team average · KPIs</h4>
              {KPI_FIELDS.map((f) => {
                const k = data.kpi[f.key] || { avg: null, count: 0 };
                return <KpiBar key={f.key} label={f.label} avg={k.avg} count={k.count} />;
              })}

              {/* Per-leader detail */}
              {data.leaderRatings.length > 0 && (
                <React.Fragment>
                  <h4 style={{ fontWeight:800, fontSize:16, letterSpacing:'-0.01em', margin:'24px 0 12px' }}>
                    By leader · {periodLabel(period)}
                  </h4>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:10 }}>
                    {data.leaderRatings.map((r, i) => {
                      const vals = KPI_FIELDS.map((f) => r.scores[f.key]).filter((v) => Number.isFinite(v));
                      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
                      return (
                        <div key={i} style={{ border:'1px solid rgba(42,18,64,.15)', borderRadius:10, padding:'12px 14px', background:'rgba(42,18,64,.03)' }}>
                          <div style={{ fontWeight:800, fontSize:14 }}>{r.leader}</div>
                          <div className="mono" style={{ fontSize:11, letterSpacing:'.12em', color:'rgba(42,18,64,.55)' }}>
                            {r.leaderTitle || ''}
                          </div>
                          <div style={{ marginTop:8, display:'flex', alignItems:'baseline', gap:6 }}>
                            <span style={{ fontWeight:900, fontSize:22, color:'var(--crimson)' }}>{avg != null ? avg.toFixed(1) : '—'}</span>
                            <span className="mono" style={{ fontSize:11, color:'rgba(42,18,64,.5)' }}>overall</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              )}

              {/* Notes */}
              <h4 style={{ fontWeight:800, fontSize:16, letterSpacing:'-0.01em', margin:'24px 0 12px' }}>
                Remarks and observations
              </h4>
              {data.notes.length === 0 ? (
                <div style={{ fontSize:13, color:'rgba(42,18,64,.55)' }}>No remarks recorded yet.</div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {data.notes.map((n) => (
                    <div key={n.id} style={{ borderLeft:'3px solid var(--accent)', padding:'6px 12px', background:'rgba(242,98,46,.06)', borderRadius:'0 8px 8px 0' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', gap:10, marginBottom:2 }}>
                        <span style={{ fontWeight:700, fontSize:13 }}>{n.leader_name}</span>
                        <span className="mono" style={{ fontSize:10.5, letterSpacing:'.12em', color:'rgba(42,18,64,.55)' }}>
                          {String(n.created_at || '').slice(0, 16).replace('T', ' ')}
                        </span>
                      </div>
                      <div style={{ fontSize:13.5, lineHeight:1.55, color:'rgba(42,18,64,.85)', whiteSpace:'pre-wrap' }}>{n.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          )}
        </div>

        <div className="cert-hide-on-print" style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          gap:14, padding:'14px 34px 20px', borderTop:'1px solid rgba(42,18,64,.1)',
        }}>
          <div className="mono" style={{ fontSize:11, letterSpacing:'.14em', color:'rgba(42,18,64,.55)' }}>
            One click. Print or save as PDF for the file.
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={onClose} style={{
              background:'transparent', color:'var(--aubergine)',
              border:'1.5px solid rgba(42,18,64,.25)', borderRadius:'var(--r-pill)',
              padding:'10px 18px', fontSize:13, fontWeight:700, cursor:'pointer',
            }}>Close</button>
            <button onClick={print} style={{
              background:'var(--aubergine)', color:'var(--cream)',
              border:'none', borderRadius:'var(--r-pill)',
              padding:'10px 20px', fontSize:13, fontWeight:800, cursor:'pointer',
              boxShadow:'0 12px 26px -12px rgba(42,18,64,.6)',
            }}>Print / Save PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressTile({ label, value }){
  return (
    <div style={{ padding:'12px 14px', borderRadius:10, border:'1px solid rgba(42,18,64,.12)', background:'rgba(42,18,64,.03)' }}>
      <div className="mono" style={{ fontSize:10, letterSpacing:'.2em', color:'rgba(42,18,64,.55)' }}>{label.toUpperCase()}</div>
      <div style={{ fontWeight:900, fontSize:22, letterSpacing:'-0.02em', marginTop:4 }}>{value}</div>
    </div>
  );
}

Object.assign(window, {
  AddInternModal, InternDetailDrawer, PerformanceReport,
  KPI_FIELDS, KPI_LABEL_BY_KEY, currentPeriod, periodLabel,
});
