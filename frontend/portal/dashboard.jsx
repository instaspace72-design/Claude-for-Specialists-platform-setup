/* Dashboard — my courses + progress overview */
function StatCard({ label, value, suffix, delay }){
  return (
    <div className="surface reveal" style={{ padding:'20px 22px', animationDelay:delay }}>
      <div style={{ fontWeight:900, fontSize:34, letterSpacing:'-0.02em', lineHeight:1 }}>
        <CountUp to={value} suffix={suffix||''} />
      </div>
      <div className="eyebrow" style={{ marginTop:10 }}>{label}</div>
    </div>
  );
}

function Dashboard({ dept, course, pct, streak, exercisesPassed, go, resumeLesson, switchTrack, user }){
  const nextLesson = course.lessons.find(l => l.status === 'active') || course.lessons[0];
  const doneCount = course.lessons.filter(l => l.status === 'done').length;
  const minutesLearned = course.lessons.filter(l => l.status === 'done').reduce((sum, l) => sum + (l.mins || 0), 0);
  const firstName = (user && user.firstName) || 'there';

  return (
    <div className="screen scroll" style={{ padding:'44px 52px', height:'100%' }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <div className="eyebrow reveal">{new Date().toLocaleDateString('en-US',{weekday:'long', month:'long', day:'numeric'})}</div>
        <h1 className="reveal" style={{ fontWeight:900, fontSize:40, letterSpacing:'-0.03em', margin:'8px 0 4px', animationDelay:'.05s' }}>
          Good to see you, {firstName}.
        </h1>
        <p className="c70 reveal" style={{ fontSize:17, fontWeight:500, animationDelay:'.1s', margin:0 }}>
          You are {pct}% through <span style={{ color:'var(--accent)', fontWeight:700 }}>{course.title}</span>. Pick up where you left off.
        </p>

        {/* hero resume card */}
        <div className="reveal" style={{ animationDelay:'.16s', marginTop:30 }}>
          <div style={{ position:'relative', borderRadius:'var(--r-lg)', overflow:'hidden',
            background:'var(--aubergine-lift)', border:'1px solid rgba(245,239,232,.1)', padding:'32px 34px',
            display:'flex', gap:34, alignItems:'center' }}>
            <div className="grid-surface" style={{ position:'absolute', inset:0, pointerEvents:'none' }} />
            <div style={{ position:'relative', flexShrink:0 }}>
              <ProgressRing value={pct} size={132} />
            </div>
            <div style={{ position:'relative', flex:1 }}>
              <div className="pill" style={{ background:'rgba(242,98,46,.14)', color:'var(--accent)', marginBottom:12 }}>Continue · Lesson {nextLesson.n}</div>
              <h2 style={{ fontWeight:800, fontSize:24, letterSpacing:'-0.02em', margin:'0 0 6px' }}>{nextLesson.title}</h2>
              <p className="c70" style={{ fontSize:15, fontWeight:500, margin:'0 0 18px', maxWidth:440, lineHeight:1.5 }}>
                {nextLesson.concept.slice(0, 118)}…
              </p>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <button className="btn btn-primary" onClick={() => resumeLesson(nextLesson.id)}>Resume lesson <span>→</span></button>
                <span className="c50 mono" style={{ fontSize:12 }}>{nextLesson.mins} MIN · {nextLesson.difficulty.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginTop:20 }}>
          <StatCard label="Day Streak" value={streak} delay=".2s" />
          <StatCard label="Lessons Done" value={doneCount} delay=".26s" />
          <StatCard label="Minutes Learned" value={minutesLearned} delay=".32s" />
          <StatCard label="Exercises Passed" value={exercisesPassed} delay=".38s" />
        </div>

        {/* explore other tracks */}
        <div className="reveal" style={{ animationDelay:'.42s', marginTop:38 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:16 }}>
            <h3 style={{ fontWeight:800, fontSize:20, letterSpacing:'-0.02em', margin:0 }}>Explore other tracks</h3>
            <span className="eyebrow">Preview · 3 more</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
            {window.DEPARTMENTS.filter(d => d.id !== dept.id).map(d => {
              const c = window.COURSES[d.id];
              return (
                <div key={d.id} className="surface" style={{ padding:20, cursor:'pointer', transition:'transform .2s var(--ease), border-color .2s var(--ease)' }}
                  onClick={() => switchTrack(d)}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='var(--accent)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='rgba(245,239,232,.08)'; }}>
                  <DeptBadge dept={d} size={40} />
                  <div style={{ fontWeight:700, fontSize:15, marginTop:14 }}>{c.title}</div>
                  <div className="c50" style={{ fontSize:13, marginTop:4, lineHeight:1.45 }}>{d.tagline}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}>
                    <span className="mono c35" style={{ fontSize:11, letterSpacing:'.08em' }}>{c.days} DAYS · {c.level.toUpperCase()}</span>
                    <span style={{ color:'var(--accent)', fontSize:13, fontWeight:700 }}>Open →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
