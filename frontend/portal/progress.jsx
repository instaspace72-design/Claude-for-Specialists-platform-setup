/* Progress / achievements screen */

function Progress({ course, pct, streak, exercisesPassed, minutes, activeDays, onViewCertificate }){
  const doneCount = course.lessons.filter(l => l.status === 'done').length;
  const passed = exercisesPassed || 0;
  const courseCleared = pct >= 100;
  // Real last 7 days from the server; falls back to an empty week before load.
  const week = (activeDays && activeDays.length === 7) ? activeDays
    : Array.from({ length: 7 }, () => ({ weekday: '·', active: false }));
  // Badges are earned from real progress, not pre-filled.
  const earnedMap = {
    'first-lesson': doneCount >= 1,
    'prompt-smith': passed >= 1,
    'streak-3': streak >= 3,
    'chat-master': passed >= 3,
    'course-clear': pct >= 100,
    'top-scorer': passed >= 1,
  };
  const achievements = window.ACHIEVEMENTS.map(a => ({ ...a, earned: !!earnedMap[a.id] }));
  const earned = achievements.filter(a => a.earned).length;

  return (
    <div className="screen scroll" style={{ padding:'44px 52px', height:'100%' }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <div className="eyebrow reveal">Your progress</div>
        <h1 className="reveal" style={{ fontWeight:900, fontSize:40, letterSpacing:'-0.03em', margin:'8px 0 4px', animationDelay:'.05s' }}>
          You are building momentum.
        </h1>
        <p className="c70 reveal" style={{ fontSize:17, fontWeight:500, animationDelay:'.1s', margin:0 }}>
          {earned} of {achievements.length} badges earned. Keep the streak alive.
        </p>

        {courseCleared && onViewCertificate && (
          <div className="reveal surface" style={{
            marginTop:22, padding:'18px 22px', display:'flex', alignItems:'center', gap:16,
            background:'linear-gradient(135deg, rgba(242,98,46,.18), rgba(209,30,76,.12))',
            border:'1px solid rgba(242,98,46,.32)', animationDelay:'.14s',
          }}>
            <div style={{
              width:44, height:44, borderRadius:'var(--r-md)', flexShrink:0,
              background:'var(--accent-grad)', color:'var(--aubergine)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--mono)', fontWeight:900, fontSize:15, letterSpacing:'.05em',
            }}>iS</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="eyebrow" style={{ color:'var(--accent)', marginBottom:4 }}>Course cleared</div>
              <div style={{ fontWeight:800, fontSize:16, letterSpacing:'-0.01em' }}>Your Reward Certificate is ready.</div>
              <div className="c70" style={{ fontSize:13, marginTop:2 }}>Personalised to you, printable, and yours to keep.</div>
            </div>
            <button
              onClick={onViewCertificate}
              className="btn btn-primary"
              style={{ padding:'11px 20px', fontSize:14 }}
            >View Certificate <span style={{ fontSize:16 }}>→</span></button>
          </div>
        )}

        {/* top row: ring + streak */}
        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:16, marginTop:30 }}>
          <div className="surface" style={{ padding:'28px', display:'flex', gap:24, alignItems:'center', animationDelay:'.16s' }}>
            <ProgressRing value={pct} size={130} />
            <div>
              <div className="eyebrow" style={{ marginBottom:6 }}>Course Progress</div>
              <div style={{ fontWeight:800, fontSize:18, letterSpacing:'-0.02em', lineHeight:1.3 }}>{course.title}</div>
              <div className="c50" style={{ fontSize:13, marginTop:6 }}>{course.lessons.filter(l=>l.status==='done').length} of {course.lessons.length} lessons done</div>
            </div>
          </div>

          <div className="surface" style={{ padding:'28px', animationDelay:'.22s' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom:6 }}>Current Streak</div>
                <div style={{ fontWeight:900, fontSize:44, letterSpacing:'-0.03em', lineHeight:1, color:'var(--accent)' }}>
                  <CountUp to={streak} /> <span style={{ fontSize:20, color:'var(--cream)' }}>days</span>
                </div>
              </div>
              <div className="pill" style={{ background:'rgba(242,98,46,.14)', color:'var(--accent)' }}>
                {minutes || 0} active min total
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:24 }}>
              {week.map((d,i) => (
                <div key={i} style={{ flex:1, textAlign:'center' }}>
                  <div style={{ height:46, borderRadius:'var(--r-md)', display:'flex', alignItems:'flex-end', justifyContent:'center',
                    background: d.active ? 'var(--accent-grad)' : 'var(--aubergine-deep)',
                    border:'1px solid rgba(245,239,232,.08)',
                    animation: d.active ? `rise .5s var(--ease) ${.3+i*0.06}s both` : 'none' }}>
                    {d.active && <span style={{ color:'var(--aubergine)', fontWeight:900, fontSize:16, marginBottom:6 }}>✓</span>}
                  </div>
                  <div className="mono c50" style={{ fontSize:11, marginTop:6 }}>{d.weekday}</div>
                </div>
              ))}
            </div>
            <div className="mono c35" style={{ fontSize:10.5, letterSpacing:'.08em', marginTop:12, textAlign:'center' }}>
              Last 7 days · a day counts when you actually worked in the portal
            </div>
          </div>
        </div>

        {/* achievements grid */}
        <div className="reveal" style={{ animationDelay:'.3s', marginTop:38 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:16 }}>
            <h3 style={{ fontWeight:800, fontSize:20, letterSpacing:'-0.02em', margin:0 }}>Badges</h3>
            <span className="eyebrow">{earned} / {achievements.length} earned</span>
          </div>
          <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
            {achievements.map((a,i) => (
              <div key={a.id} className="surface" style={{ padding:'22px', display:'flex', gap:16, alignItems:'center',
                animationDelay:`${.34+i*0.05}s`, opacity: a.earned ? 1 : .5, position:'relative', overflow:'hidden' }}>
                {a.earned && <div style={{ position:'absolute', top:-30, right:-30, width:90, height:90, borderRadius:'50%', background:'radial-gradient(circle, rgba(242,98,46,.2), transparent 70%)' }} />}
                <div style={{ width:52, height:52, borderRadius:'var(--r-md)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--mono)', fontWeight:700, fontSize:17,
                  background: a.earned ? 'var(--accent-grad)' : 'var(--aubergine-deep)',
                  color: a.earned ? 'var(--aubergine)' : 'rgba(245,239,232,.4)',
                  border:'1px solid rgba(245,239,232,.1)' }}>{a.icon}</div>
                <div style={{ position:'relative' }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>{a.label}</div>
                  <div className="c50" style={{ fontSize:13, marginTop:3 }}>{a.note}</div>
                </div>
                {!a.earned && <span className="mono c35" style={{ position:'absolute', top:14, right:16, fontSize:10, letterSpacing:'.1em' }}>LOCKED</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:30 }} />
      </div>
    </div>
  );
}

window.Progress = Progress;
