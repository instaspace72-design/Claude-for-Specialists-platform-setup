/* Onboarding — pick your department. Full-screen, animated. */
const { useState: useStateOb } = React;

function Onboarding({ onEnter, user }){
  const [picked, setPicked] = useStateOb(null);
  const [leaving, setLeaving] = useStateOb(false);
  const firstName = (user && user.firstName) || 'there';

  const enter = () => {
    if (!picked) return;
    setLeaving(true);
    const dept = window.DEPARTMENTS.find(d => d.id === picked);
    setTimeout(() => onEnter(dept), 380 * (getMo() || 0.001));
  };

  return (
    <div style={{
      height:'100%', width:'100%', background:'var(--ground)', position:'relative',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'40px', opacity: leaving ? 0 : 1, transform: leaving ? 'translateY(-14px)' : 'none',
      transition:'opacity .38s var(--ease), transform .38s var(--ease)', overflow:'hidden',
    }}>
      <div className="grid-surface" style={{ position:'absolute', inset:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'-20%', right:'-10%', width:520, height:520, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(242,98,46,.16), transparent 65%)', filter:'blur(30px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', width:'100%', maxWidth:860, textAlign:'center' }}>
        <div className="reveal" style={{ display:'flex', justifyContent:'center', marginBottom:26, animationDelay:'.05s' }}>
          <Wordmark size={30} />
        </div>
        <div className="eyebrow reveal" style={{ animationDelay:'.1s' }}>Claude for Beginners · Intern Program</div>
        <h1 className="reveal" style={{ fontWeight:900, fontSize:52, letterSpacing:'-0.03em', lineHeight:1.05, margin:'14px 0 12px', animationDelay:'.16s' }}>
          Welcome, {firstName}.<br />Where do you work?
        </h1>
        <p className="c70 reveal" style={{ fontSize:18, maxWidth:520, margin:'0 auto 40px', lineHeight:1.5, fontWeight:500, animationDelay:'.22s' }}>
          Pick your track. We tailor every course, exercise, and Claude session to the work your team actually does.
        </p>

        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16, marginBottom:36 }}>
          {window.DEPARTMENTS.map((d, i) => {
            const on = picked === d.id;
            return (
              <button key={d.id} onClick={() => setPicked(d.id)} style={{
                animationDelay:`${.28 + i*0.07}s`,
                textAlign:'left', cursor:'pointer', padding:'22px 22px', borderRadius:'var(--r-lg)',
                background: on ? 'var(--aubergine-lift)' : 'var(--aubergine-deep)',
                border:`1.5px solid ${on ? 'var(--accent)' : 'rgba(245,239,232,.1)'}`,
                display:'flex', gap:16, alignItems:'flex-start', position:'relative',
                transition:'transform .2s var(--ease), border-color .2s var(--ease), background .2s var(--ease)',
                transform: on ? 'translateY(-3px)' : 'none',
                boxShadow: on ? '0 16px 40px -16px rgba(242,98,46,.5)' : 'none',
              }}
              onMouseEnter={e=>{ if(!on){ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='rgba(245,239,232,.28)'; } }}
              onMouseLeave={e=>{ if(!on){ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='rgba(245,239,232,.1)'; } }}>
                <DeptBadge dept={d} size={48} active={on} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:19, marginBottom:4 }}>{d.name}</div>
                  <div className="c70" style={{ fontSize:14, lineHeight:1.45, fontWeight:500 }}>{d.tagline}</div>
                </div>
                <div style={{
                  width:22, height:22, borderRadius:'50%', border:`2px solid ${on?'var(--accent)':'rgba(245,239,232,.25)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', marginTop:2,
                  background: on ? 'var(--accent)' : 'transparent', transition:'all .2s var(--ease)',
                }}>
                  {on && <span style={{ color:'var(--aubergine)', fontSize:13, fontWeight:900 }}>✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary reveal" onClick={enter} disabled={!picked} style={{
          animationDelay:'.6s', fontSize:16, padding:'15px 34px',
          opacity: picked ? 1 : .4, cursor: picked ? 'pointer':'not-allowed',
          animation: picked ? 'glowPulse 2.4s ease-in-out infinite' : undefined,
        }}>
          Start learning
          <span style={{ fontSize:18 }}>→</span>
        </button>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
