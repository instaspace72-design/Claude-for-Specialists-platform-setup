/* Root app: routing, shared state, Tweaks (accent + motion) */

const ACCENTS = {
  orange:   { a:'#F2622E', a2:'#D11E4C', grad:'linear-gradient(135deg,#F2622E,#D11E4C)' },
  crimson:  { a:'#D11E4C', a2:'#F2622E', grad:'linear-gradient(135deg,#D11E4C,#F2622E)' },
  gradient: { a:'#E5433D', a2:'#F2622E', grad:'linear-gradient(135deg,#F2622E,#D11E4C)' },
};
const MOTION = { off:0, subtle:0.7, lively:1, maximal:1.4 };

const MENTORS = [
  { initials:'JB', name:'Mr. Jybran', role:'Program Lead' },
  { initials:'AY', name:'Ms. Ayesha', role:'Mentor' },
];

function pctFor(d){
  const c = window.COURSES[d.id]; if (!c || !c.lessons.length) return 0;
  const done = c.lessons.filter(l => l.status === 'done').length;
  return Math.round((done / c.lessons.length) * 100);
}

// The track an intern lands on: their specialty if they have one, else a default.
function initialDept(){
  const a = window.loadAuth ? window.loadAuth() : null;
  const u = a && a.user;
  if (u && u.role === 'intern' && window.SPECIALTY_BY_TRACK && window.SPECIALTY_BY_TRACK[u.track]) {
    return window.SPECIALTY_BY_TRACK[u.track];
  }
  return window.DEPARTMENTS[0];
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "orange",
  "motion": "maximal",
  "autoReport": true
}/*EDITMODE-END*/;

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [auth, setAuth] = useState(() => (window.loadAuth ? window.loadAuth() : null));
  const user = auth && auth.user;
  const [screen, setScreen] = useState('dashboard');
  const [dept, setDept] = useState(() => initialDept());
  const [lessonId, setLessonId] = useState(null);
  const [pct, setPct] = useState(() => pctFor(initialDept()));
  const [streak, setStreak] = useState(0);
  const [exercisesPassed, setExercisesPassed] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [activeDays, setActiveDays] = useState([]);
  const [report, setReport] = useState(null);
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [, setContentVersion] = useState(0);

  const course = window.COURSES[dept.id] || window.COURSES.growth;
  const deptRef = useRef(dept);
  useEffect(() => { deptRef.current = dept; }, [dept]);

  // Load the student's real progress from the server and derive every lesson
  // status from it. This is the single source of truth; nothing is assumed.
  const refreshProgress = () => {
    if (!user || user.role !== 'intern' || !window.authFetch) return;
    window.authFetch('/api/progress/me')
      .then((r) => r.json())
      .then((p) => {
        if (!p || p.error) return;
        const done = new Set((p.completions || []).map((c) => c.lesson_id));
        Object.values(window.COURSES).forEach((c) => {
          let activeSet = false;
          c.lessons.forEach((l) => {
            if (done.has(l.id)) l.status = 'done';
            else if (!activeSet) { l.status = 'active'; activeSet = true; }
            else l.status = 'locked';
          });
        });
        setStreak(p.streak || 0);
        setExercisesPassed(p.exercisesPassed || 0);
        setMinutes(p.activeMinutesTotal || 0);
        setActiveDays(p.activeDays || []);
        setPct(pctFor(deptRef.current));
        setContentVersion((v) => v + 1);
      })
      .catch(() => {});
  };
  useEffect(() => { refreshProgress(); }, [user && user.email]);

  // Time on task: while a lesson or exercise is open, keep a learn session
  // alive with a 30s ping whenever the tab is actually visible.
  useEffect(() => {
    if (!user || user.role !== 'intern' || !window.authFetch) return;
    if (screen !== 'lesson' && screen !== 'exercise') return;
    let sessionId = null, stopped = false;
    window.authFetch('/api/sessions/start', {
      method: 'POST',
      body: JSON.stringify({ lessonId: lessonId || null, courseId: course.id, screen }),
    })
      .then((r) => r.json())
      .then((d) => { if (!stopped && d && d.sessionId) sessionId = d.sessionId; })
      .catch(() => {});
    const timer = setInterval(() => {
      if (sessionId && document.visibilityState === 'visible') {
        window.authFetch('/api/sessions/ping', { method: 'POST', body: JSON.stringify({ sessionId }) }).catch(() => {});
      }
    }, 30000);
    return () => {
      stopped = true;
      clearInterval(timer);
      if (sessionId) window.authFetch('/api/sessions/end', { method: 'POST', body: JSON.stringify({ sessionId }) }).catch(() => {});
    };
  }, [user && user.email, screen, lessonId]);

  // apply accent + motion to :root
  useEffect(() => {
    const ac = ACCENTS[t.accent] || ACCENTS.orange;
    const root = document.documentElement;
    root.style.setProperty('--accent', ac.a);
    root.style.setProperty('--accent-2', ac.a2);
    root.style.setProperty('--accent-grad', ac.grad);
    const mo = MOTION[t.motion] ?? 1;
    root.style.setProperty('--mo', String(mo));
    root.setAttribute('data-mo', mo === 0 ? '0' : '1');
  }, [t.accent, t.motion]);

  // route each intern to their specialty track the moment they sign in
  useEffect(() => {
    if (user && user.role === 'intern') {
      const sp = window.SPECIALTY_BY_TRACK[user.track];
      if (sp) { setDept(sp); setPct(pctFor(sp)); }
      setScreen('dashboard');
    }
  }, [user && user.email]);

  // hydrate courses from Airtable if the backend has it configured (no-op otherwise)
  useEffect(() => {
    if (!window.loadAirtableCourses) return;
    window.loadAirtableCourses().then((d) => { if (d) setContentVersion((v) => v + 1); });
  }, []);

  const enter = (d) => { setDept(d); setPct(pctFor(d)); setScreen('dashboard'); };
  const switchTrack = (d) => { setDept(d); setPct(pctFor(d)); setLessonId(null); setScreen('course'); };
  const openLesson = (id) => { setLessonId(id); setScreen('lesson'); };
  const startExercise = () => setScreen('exercise');

  const completeExercise = () => {
    // called only after a graded, passed submission: persist the completion,
    // advance the local statuses, then refresh the real numbers from the server
    const lessons = course.lessons;
    const active = lessons.find(l => l.status === 'active');
    if (active){
      active.status = 'done';
      const next = lessons.find(l => l.status === 'locked');
      if (next) next.status = 'active';
      if (user && window.authFetch){
        window.authFetch('/api/lessons/complete', {
          method: 'POST',
          body: JSON.stringify({ lessonId: active.id, courseId: course.id }),
        }).catch(() => {});
      }
    }
    const newPct = pctFor(dept);
    setPct(newPct);
    setExercisesPassed(n => n + 1);
    setTimeout(refreshProgress, 800); // pick up the real streak + minutes

    // keep the completion snapshot in sync for the leadership dashboard
    if (user && window.authFetch){
      const nextActive = lessons.find(l => l.status === 'active');
      window.authFetch('/api/progress', {
        method: 'POST',
        body: JSON.stringify({
          studentId: user.email,
          studentName: user.name,
          courseId: course.id,
          currentLesson: nextActive ? nextActive.n : lessons.length,
          completionPercentage: newPct,
          exercisesSubmitted: exercisesPassed + 1,
          streakDays: streak,
        }),
      }).catch(() => {});
    }

    if (t.autoReport){
      setReport({
        pct: newPct,
        courseTitle: course.title,
        exercise: course.exercise.title,
        complete: newPct >= 100,
      });
    }

    // Course fully cleared: open the reward certificate for the learner.
    if (newPct >= 100) {
      setTimeout(() => setCertificateOpen(true), 700);
    }
  };

  const lesson = course.lessons.find(l => l.id === lessonId) || course.lessons.find(l => l.status === 'active') || course.lessons[0];
  // A lesson's practice is either its own (new intern courses) or the course level
  // exercise attached to it (department courses).
  const activePractice = (lesson && lesson.practice) ||
    (course.exercise && lesson && course.exercise.lessonId === lesson.id ? course.exercise : null);
  const go = (id) => {
    if (id === 'course') setScreen('course');
    else setScreen(id);
  };

  const logout = async () => {
    try { await window.authFetch('/api/auth/logout', { method: 'POST' }); } catch (e) { /* best effort */ }
    window.clearAuth();
    setAuth(null);
    setScreen('dashboard');
  };

  // --- auth gate (all hooks above run unconditionally) ---
  if (!user){
    return (
      <React.Fragment>
        <Login onAuthed={setAuth} />
        <PortalTweaks t={t} setTweak={setTweak} />
      </React.Fragment>
    );
  }
  if (user.mustChangePassword){
    return (
      <React.Fragment>
        <ChangePassword user={user} onLogout={logout} onDone={(u) => setAuth(a => Object.assign({}, a, { user: u }))} />
        <PortalTweaks t={t} setTweak={setTweak} />
      </React.Fragment>
    );
  }
  if (user.role !== 'intern'){
    return (
      <React.Fragment>
        <LeadershipDashboard user={user} onLogout={logout} />
        <PortalTweaks t={t} setTweak={setTweak} />
      </React.Fragment>
    );
  }

  // onboarding is full-bleed, no sidebar
  if (screen === 'onboarding'){
    return (
      <React.Fragment>
        <Onboarding user={user} onEnter={enter} />
        <PortalTweaks t={t} setTweak={setTweak} />
      </React.Fragment>
    );
  }

  return (
    <div style={{ display:'flex', height:'100vh', width:'100vw' }}>
      <Sidebar screen={screen} go={go} dept={dept} streak={streak} pct={pct} user={user} onLogout={logout} />
      <main style={{ flex:1, minWidth:0, height:'100%', position:'relative' }}>
        {screen === 'dashboard' && <Dashboard key={"d"+dept.id} dept={dept} course={course} pct={pct} streak={streak} exercisesPassed={exercisesPassed} minutes={minutes} go={go} resumeLesson={openLesson} switchTrack={switchTrack} user={user} />}
        {screen === 'course' && <CourseOverview key="c" course={course} dept={dept} go={go} openLesson={openLesson} pct={pct} />}
        {screen === 'lesson' && <LessonView key={"l"+lessonId} course={course} lesson={lesson} go={go} startExercise={startExercise} backToCourse={() => setScreen('course')} />}
        {screen === 'exercise' && <Exercise key={"e"+(lesson && lesson.id)} course={course} lesson={lesson} practice={activePractice} backToLesson={() => setScreen('lesson')} onComplete={completeExercise} />}
        {screen === 'portfolio' && <Portfolio key="pf" />}
        {screen === 'progress' && <Progress key="p" course={course} pct={pct} streak={streak} exercisesPassed={exercisesPassed} minutes={minutes} activeDays={activeDays} onViewCertificate={() => setCertificateOpen(true)} />}
      </main>
      <PortalTweaks t={t} setTweak={setTweak} />
      {report && <ReportToast data={report} userName={(user.firstName || user.name || 'Learner').toUpperCase()} onClose={() => setReport(null)} />}
      {certificateOpen && <Certificate user={user} course={course} onClose={() => setCertificateOpen(false)} />}
    </div>
  );
}

function ReportToast({ data, userName, onClose }){
  useEffect(() => {
    const ms = 8000;
    const id = setTimeout(onClose, ms);
    return () => clearTimeout(id);
  }, []);
  return (
    <div style={{ position:'fixed', top:22, right:22, zIndex:60, width:360, maxWidth:'calc(100vw - 44px)',
      animation:`slideInR .45s var(--ease) both` }}>
      <div className="surface" style={{ padding:'18px 20px', background:'var(--aubergine-lift)', boxShadow:'0 24px 60px -18px rgba(0,0,0,.6)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <span style={{ width:26, height:26, borderRadius:'50%', background:'var(--accent-grad)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--aubergine)', fontSize:14, fontWeight:900 }}>✓</span>
          <div className="eyebrow" style={{ color:'var(--accent)', flex:1 }}>Progress report sent</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(245,239,232,.5)', cursor:'pointer', fontSize:16, padding:0, lineHeight:1 }}>✕</button>
        </div>
        <div className="c82" style={{ fontSize:14, fontWeight:500, lineHeight:1.5, marginBottom:14 }}>
          {data.complete
            ? <span>You finished <b style={{ color:'var(--cream)' }}>{data.courseTitle}</b>. A completion report was auto sent to your mentors.</span>
            : <span>Passed <b style={{ color:'var(--cream)' }}>{data.exercise}</b>. Your updated progress was auto sent to your mentors.</span>}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:14 }}>
          {MENTORS.map(m => (
            <div key={m.initials} style={{ display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--aubergine-deep)', border:'1px solid rgba(245,239,232,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12 }}>{m.initials}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{m.name}</div>
                <div className="c50" style={{ fontSize:11 }}>{m.role}</div>
              </div>
              <span className="mono" style={{ fontSize:10, letterSpacing:'.08em', color:'#4fd18b' }}>DELIVERED</span>
            </div>
          ))}
        </div>
        <div style={{ padding:'11px 13px', borderRadius:'var(--r-md)', background:'var(--aubergine-deep)', border:'1px solid rgba(245,239,232,.08)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, marginBottom:7 }}>
            <span className="mono c50" style={{ fontSize:10, letterSpacing:'.1em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userName || 'LEARNER'} · {data.courseTitle.toUpperCase()}</span>
            <span className="mono" style={{ fontSize:10, color:'var(--accent)', fontWeight:700, flexShrink:0 }}>{data.pct}%</span>
          </div>
          <div style={{ height:6, background:'rgba(245,239,232,.1)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${data.pct}%`, background:'var(--accent-grad)', borderRadius:99, transformOrigin:'left', animation:`barGrow .7s var(--ease) both` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalTweaks({ t, setTweak }){
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent" />
      <TweakRadio label="Color" value={t.accent} options={['orange','crimson','gradient']} onChange={v => setTweak('accent', v)} />
      <TweakSection label="Motion" />
      <TweakRadio label="Intensity" value={t.motion} options={['off','subtle','lively','maximal']} onChange={v => setTweak('motion', v)} />
      <TweakSection label="Mentors" />
      <TweakToggle label="Auto report on completion" value={t.autoReport} onChange={v => setTweak('autoReport', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
