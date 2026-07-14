/* Shared components: logo, badges, progress ring, sidebar, small motion helpers */
const { useState, useEffect, useRef } = React;

/* Gapless "Insta" + italic "Space" wordmark */
function Wordmark({ size = 24, mono = false }){
  return (
    <span style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:size, letterSpacing:'-0.02em', lineHeight:1, color: mono ? 'var(--cream)' : 'var(--cream)', whiteSpace:'nowrap' }}>
      Insta<span style={{ fontStyle:'italic', color:'var(--accent)' }}>Space</span>
    </span>
  );
}

function DeptBadge({ dept, size = 40, active = false }){
  return (
    <div style={{
      width:size, height:size, minWidth:size, borderRadius:'var(--r-md)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--mono)', fontWeight:700, fontSize:size*0.34, letterSpacing:'0.02em',
      background: active ? 'var(--accent-grad)' : 'var(--aubergine-deep)',
      color: active ? 'var(--aubergine)' : 'rgba(245,239,232,.7)',
      border:'1px solid rgba(245,239,232,.1)',
      transition:'all .2s var(--ease)',
    }}>{dept.badge}</div>
  );
}

/* animated circular progress ring */
function ProgressRing({ value, size = 128, stroke = 10, showLabel = true }){
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const mo = getMo();
    if (mo === 0){ setShown(value); return; }
    let raf, start;
    const dur = 900 * mo;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const offset = circ - (shown / 100) * circ;
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(245,239,232,.1)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition:'stroke-dashoffset .1s linear', filter:'drop-shadow(0 0 6px rgba(242,98,46,.4))' }} />
      </svg>
      {showLabel && (
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontWeight:900, fontSize:size*0.26, letterSpacing:'-0.02em' }}>{shown}<span style={{ fontSize:size*0.12 }}>%</span></span>
        </div>
      )}
    </div>
  );
}

/* linear progress bar with animated fill */
function ProgressBar({ value, height = 8 }){
  return (
    <div style={{ width:'100%', height, background:'rgba(245,239,232,.1)', borderRadius:99, overflow:'hidden' }}>
      <div style={{ width:`${value}%`, height:'100%', background:'var(--accent-grad)', borderRadius:99,
        transition:'width .8s var(--ease)' }} />
    </div>
  );
}

function getMo(){
  const v = getComputedStyle(document.documentElement).getPropertyValue('--mo').trim();
  const n = parseFloat(v);
  return isNaN(n) ? 1 : n;
}

/* count-up number */
function CountUp({ to, dur = 900, suffix = '' }){
  const [n, setN] = useState(0);
  useEffect(() => {
    const mo = getMo();
    if (mo === 0){ setN(to); return; }
    let raf, start;
    const d = dur * mo;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / d, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n}{suffix}</span>;
}

const NAV = [
  { id:'dashboard', label:'Dashboard', icon:'▦' },
  { id:'course', label:'My Course', icon:'▤' },
  { id:'portfolio', label:'Portfolio', icon:'▣' },
  { id:'progress', label:'Progress', icon:'◈' },
];

function Sidebar({ screen, go, dept, streak, pct, user, onLogout }){
  const uName = (user && user.name) || 'Learner';
  const uRole = (user && user.title) || 'Intern';
  const uInit = (window.initials ? window.initials(uName) : 'IS');
  const navActive = (id) => {
    if (id === 'course') return ['course','lesson','exercise'].includes(screen);
    return screen === id;
  };
  return (
    <aside style={{
      width:264, minWidth:264, height:'100%', background:'var(--aubergine-deep)',
      borderRight:'1px solid rgba(245,239,232,.08)', display:'flex', flexDirection:'column',
      padding:'26px 20px', position:'relative', overflow:'hidden',
    }}>
      <div className="grid-surface" style={{ position:'absolute', inset:0, pointerEvents:'none' }} />
      <div style={{ position:'relative', display:'flex', flexDirection:'column', height:'100%' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, paddingLeft:6 }}>
          <Wordmark size={22} />
        </div>
        <div className="eyebrow" style={{ paddingLeft:6, marginTop:6, marginBottom:32 }}>Learning Portal</div>

        <nav style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {NAV.map(item => {
            const on = navActive(item.id);
            return (
              <button key={item.id} onClick={() => go(item.id)} style={{
                display:'flex', alignItems:'center', gap:13, padding:'12px 14px',
                borderRadius:'var(--r-md)', border:'none', cursor:'pointer', textAlign:'left',
                background: on ? 'var(--aubergine-lift)' : 'transparent',
                color: on ? 'var(--cream)' : 'rgba(245,239,232,.6)',
                fontFamily:'var(--sans)', fontWeight:600, fontSize:15,
                transition:'all .18s var(--ease)', position:'relative',
              }}
              onMouseEnter={e=>{ if(!on) e.currentTarget.style.background='rgba(245,239,232,.05)'; }}
              onMouseLeave={e=>{ if(!on) e.currentTarget.style.background='transparent'; }}>
                {on && <span style={{ position:'absolute', left:0, top:10, bottom:10, width:3, borderRadius:99, background:'var(--accent)' }} />}
                <span style={{ fontSize:16, width:18, textAlign:'center', color: on ? 'var(--accent)' : 'inherit' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop:28 }}>
          <div className="eyebrow" style={{ paddingLeft:14, marginBottom:12 }}>Enrolled Track</div>
          <div className="surface" style={{ padding:14, display:'flex', gap:12, alignItems:'center', background:'var(--aubergine-lift)' }}>
            <DeptBadge dept={dept} size={38} active />
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{dept.name}</div>
              <div className="c50" style={{ fontSize:12 }}>{pct}% complete</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop:'auto', display:'flex', alignItems:'center', gap:12, padding:'12px 8px', borderTop:'1px solid rgba(245,239,232,.08)' }}>
          <div style={{ width:38, height:38, borderRadius:'var(--r-pill)', background:'var(--aubergine-lift)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14 }}>{uInit}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{uName}</div>
            <div className="c50" style={{ fontSize:11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{uRole}</div>
          </div>
          <div className="pill" style={{ background:'rgba(242,98,46,.14)', color:'var(--accent)', gap:5 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)' }} />{streak}d
          </div>
        </div>
        {onLogout && (
          <button onClick={onLogout} style={{ marginTop:8, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            background:'none', border:'1px solid rgba(245,239,232,.1)', borderRadius:'var(--r-md)', cursor:'pointer',
            color:'rgba(245,239,232,.55)', fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.08em', padding:'9px 10px',
            transition:'all .18s var(--ease)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(245,239,232,.28)'; e.currentTarget.style.color='var(--cream)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(245,239,232,.1)'; e.currentTarget.style.color='rgba(245,239,232,.55)'; }}>
            SIGN OUT
          </button>
        )}
      </div>
    </aside>
  );
}

Object.assign(window, { Wordmark, DeptBadge, ProgressRing, ProgressBar, CountUp, Sidebar, getMo });
