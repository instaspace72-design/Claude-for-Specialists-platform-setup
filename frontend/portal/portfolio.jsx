/* Portfolio: the learner's saved deliverables. Every artefact here was
   produced during a graded exercise and saved by the mentor, so this page is
   real evidence of work, the thing an intern shows in their next interview. */

function fmtArtefactDate(ts){
  const d = new Date(String(ts).replace(' ', 'T') + 'Z');
  if (isNaN(d.getTime())) return String(ts || '');
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function ArtefactCard({ a, i }){
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    try { navigator.clipboard.writeText(a.body); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch (e) { /* blocked */ }
  };
  const download = () => {
    const blob = new Blob([a.body], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const el = document.createElement('a');
    el.href = url;
    el.download = `${String(a.name).replace(/[^\w\d· -]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'artefact'}.md`;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="surface reveal" style={{ padding:0, overflow:'hidden', animationDelay:`${i*0.05}s` }}>
      <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:16, cursor:'pointer' }} onClick={() => setOpen(o => !o)}>
        <div style={{ width:44, height:44, borderRadius:'var(--r-md)', flexShrink:0, background:'var(--accent-grad)',
          color:'var(--aubergine)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', fontWeight:700, fontSize:13 }}>
          {String(i + 1).padStart(2, '0')}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:16, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.name}</div>
          <div className="c50 mono" style={{ fontSize:11, letterSpacing:'.06em', marginTop:3 }}>
            {a.exercise_id || 'exercise'} · {fmtArtefactDate(a.created_at)} · {a.body.length.toLocaleString()} chars
          </div>
        </div>
        <span className="mono c50" style={{ fontSize:12, transform: open ? 'rotate(90deg)' : 'none', transition:'transform .2s var(--ease)' }}>▶</span>
      </div>
      {open && (
        <div style={{ borderTop:'1px solid rgba(245,239,232,.08)' }}>
          <pre className="mono scroll" style={{ margin:0, padding:'18px 22px', fontSize:12.5, lineHeight:1.6, whiteSpace:'pre-wrap',
            color:'rgba(245,239,232,.85)', maxHeight:360, overflowY:'auto', background:'var(--ground)' }}>{a.body}</pre>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', padding:'12px 22px', background:'var(--aubergine-deep)' }}>
            <button onClick={copy} className="btn btn-ghost" style={{ padding:'8px 16px', fontSize:12 }}>{copied ? 'Copied' : 'Copy'}</button>
            <button onClick={download} className="btn btn-primary" style={{ padding:'8px 16px', fontSize:12 }}>Download .md</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Portfolio(){
  const [artefacts, setArtefacts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    window.authFetch('/api/artefacts/me')
      .then(r => r.json())
      .then(d => { if (d && Array.isArray(d.artefacts)) setArtefacts(d.artefacts); else setError(d.error || 'Could not load'); })
      .catch(() => setError('Cannot reach the portal API.'));
  }, []);

  return (
    <div className="screen scroll" style={{ padding:'44px 52px', height:'100%' }}>
      <div style={{ maxWidth:860, margin:'0 auto' }}>
        <div className="eyebrow reveal">Your portfolio</div>
        <h1 className="reveal" style={{ fontWeight:900, fontSize:40, letterSpacing:'-0.03em', margin:'8px 0 4px', animationDelay:'.05s' }}>
          Work you can show.
        </h1>
        <p className="c70 reveal" style={{ fontSize:17, fontWeight:500, animationDelay:'.1s', margin:0, maxWidth:560, lineHeight:1.55 }}>
          Every artefact here was produced in a graded exercise and saved by your mentor.
          This is the page you open in your next interview.
        </p>

        <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:12 }}>
          {error && (
            <div className="reveal" style={{ display:'flex', gap:10, alignItems:'center', padding:'14px 18px',
              borderRadius:'var(--r-md)', background:'rgba(209,30,76,.14)', border:'1px solid rgba(209,30,76,.4)' }}>
              <span style={{ color:'var(--crimson)', fontWeight:900 }}>!</span>
              <span className="c94" style={{ fontSize:14, fontWeight:600 }}>{error}</span>
            </div>
          )}
          {artefacts === null && !error && <div className="c50 reveal" style={{ fontSize:15 }}>Loading your artefacts…</div>}
          {artefacts && artefacts.length === 0 && (
            <div className="reveal surface" style={{ padding:'28px', textAlign:'center', background:'var(--aubergine-deep)' }}>
              <div style={{ fontWeight:800, fontSize:17, marginBottom:6 }}>Nothing saved yet, and that is normal on day one.</div>
              <div className="c70" style={{ fontSize:14, lineHeight:1.55, maxWidth:440, margin:'0 auto' }}>
                When you finalise a deliverable in an exercise, your mentor saves it here.
                Finish today's exercise and this page starts filling up.
              </div>
            </div>
          )}
          {artefacts && artefacts.map((a, i) => <ArtefactCard key={a.id} a={a} i={i} />)}
        </div>
        <div style={{ height:30 }} />
      </div>
    </div>
  );
}

window.Portfolio = Portfolio;
