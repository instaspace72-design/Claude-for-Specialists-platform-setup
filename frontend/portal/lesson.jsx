/* Course overview (lessons list) + Lesson view (concepts + animated slides) */

/* Split a "Heading: detail" key concept into a headline and body. */
function splitConcept(k){
  const s = String(k || '');
  const idx = s.indexOf(': ');
  if (idx > 0 && idx < 64) return { head: s.slice(0, idx), body: s.slice(idx + 2) };
  return { head: '', body: s };
}

/* Track themed animated infographic for a slide. */
function SlideArt({ variant }){
  const A = 'var(--accent)';
  const box = { maxWidth: 210, width: '100%' };
  if (variant === 'links'){
    const sats = [[26,30],[152,26],[20,118],[154,126],[92,14]];
    return (
      <svg viewBox="0 0 180 160" style={box}>
        {sats.map((p,i)=>(
          <g key={i}>
            <line x1="90" y1="82" x2={p[0]} y2={p[1]} stroke="rgba(245,239,232,.28)" strokeWidth="1.5" strokeDasharray="4 5">
              <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.6s" begin={`${i*0.2}s`} repeatCount="indefinite"/>
            </line>
            <circle cx={p[0]} cy={p[1]} r="7" fill="var(--aubergine-lift)" stroke="rgba(245,239,232,.35)" strokeWidth="1">
              <animate attributeName="r" values="6;8;6" dur="2.4s" begin={`${i*0.3}s`} repeatCount="indefinite"/>
            </circle>
          </g>
        ))}
        <circle cx="90" cy="82" r="21" fill={A}>
          <animate attributeName="r" values="20;23;20" dur="2.6s" repeatCount="indefinite"/>
        </circle>
        <text x="90" y="87" textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fontWeight="700" fill="var(--aubergine)">iS</text>
      </svg>
    );
  }
  if (variant === 'palette'){
    const cols = ['var(--cream)', A, 'var(--accent-2)', 'var(--aubergine-lift)'];
    return (
      <svg viewBox="0 0 180 160" style={box}>
        {cols.map((c,i)=>(
          <rect key={i} x={20+i*38} width="30" rx="7" fill={c} stroke="rgba(245,239,232,.16)" strokeWidth="1">
            <animate attributeName="y" values="116;48" dur="0.55s" begin={`${i*0.14}s`} fill="freeze"/>
            <animate attributeName="height" values="0;66" dur="0.55s" begin={`${i*0.14}s`} fill="freeze"/>
            <animate attributeName="opacity" values="0;1" dur="0.4s" begin={`${i*0.14}s`} fill="freeze"/>
          </rect>
        ))}
      </svg>
    );
  }
  if (variant === 'checks'){
    return (
      <svg viewBox="0 0 180 160" style={box}>
        {[0,1,2].map(i=>(
          <g key={i}>
            <rect x="24" y={40+i*36} width="20" height="20" rx="5" fill="none" stroke="rgba(245,239,232,.3)" strokeWidth="1.5"/>
            <path d={`M29 ${50+i*36} l4.5 4.5 l8 -9`} fill="none" stroke={A} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0">
              <animate attributeName="opacity" values="0;1" dur="0.3s" begin={`${0.4+i*0.55}s`} fill="freeze"/>
            </path>
            <rect x="54" y={46+i*36} width={i===1?66:92} height="7" rx="3.5" fill="rgba(245,239,232,.16)"/>
          </g>
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 180 160" style={box}>
      {[34,25,16].map((r,i)=>(
        <circle key={i} cx="90" cy="80" r={r} fill="none" stroke={i===0?A:'rgba(245,239,232,.22)'} strokeWidth="2">
          <animate attributeName="r" values={`${r};${r+6};${r}`} dur="3s" begin={`${i*0.4}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" begin={`${i*0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      <circle cx="90" cy="80" r="6" fill={A}/>
    </svg>
  );
}

/* Animated, interactive lesson slides (replaces the old video placeholder). */
function LessonSlides({ lesson, track, practice, onStart }){
  const variant = ({ seo:'links', design:'palette', 'qa-nocode':'checks', 'qa-seo':'checks', 'webapp-portal':'checks' })[track] || 'rings';
  const concepts = lesson.keyConcepts || [];
  const mistakes = lesson.mistakes || [];
  const slides = [{ kind:'intro' }].concat(concepts.map((k, n) => Object.assign({ kind:'concept', n: n + 1 }, splitConcept(k))));
  mistakes.forEach((m, n) => slides.push(Object.assign({ kind:'mistake', n: n + 1, count: mistakes.length }, splitConcept(m))));
  if (practice) slides.push({ kind:'outro' });
  const total = slides.length;

  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [tick, setTick] = useState(0);

  const go = (n) => { setI(((n % total) + total) % total); setTick(0); };

  useEffect(() => {
    if (!playing) return;
    if (getMo() === 0) return; // no auto advance when motion is off
    const DUR = 5400;
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / DUR, 1);
      setTick(p);
      if (p < 1) raf = requestAnimationFrame(step);
      else { setTick(0); setI(v => (v + 1) % total); }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, i, total]);

  const slide = slides[i];
  const isCap = practice && practice.capstone;
  const ctrl = { background:'rgba(245,239,232,.1)', border:'1px solid rgba(245,239,232,.16)', color:'var(--cream)', width:32, height:32,
    borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, lineHeight:1 };

  return (
    <div className="reveal" style={{ animationDelay:'.12s', position:'relative', borderRadius:'var(--r-lg)', overflow:'hidden',
      aspectRatio:'16/9', background:'var(--aubergine-deep)', border:'1px solid rgba(245,239,232,.1)' }}>
      <div className="grid-surface" style={{ position:'absolute', inset:0 }} />
      <div style={{ position:'absolute', top:'-32%', right:'-12%', width:340, height:340, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(242,98,46,.16), transparent 65%)', filter:'blur(30px)' }} />

      {/* progress segments */}
      <div style={{ position:'absolute', top:14, left:18, right:18, display:'flex', gap:5, zIndex:4 }}>
        {slides.map((_,k)=>(
          <div key={k} onClick={()=>go(k)} style={{ flex:1, height:3, borderRadius:99, background:'rgba(245,239,232,.18)', overflow:'hidden', cursor:'pointer' }}>
            <div style={{ height:'100%', background:'var(--accent)', width: k<i?'100%':(k===i?`${Math.round(tick*100)}%`:'0%'), transition: k===i?'none':'width .3s var(--ease)' }} />
          </div>
        ))}
      </div>

      {/* slide body */}
      <div key={i} className="screen" style={{ position:'absolute', inset:0, padding:'46px 46px 62px', display:'flex', alignItems:'center', gap:34 }}>
        {slide.kind === 'concept' ? (
          <React.Fragment>
            <div style={{ width:'40%', display:'flex', justifyContent:'center', flexShrink:0 }}><SlideArt variant={variant} /></div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="eyebrow" style={{ color:'var(--accent)' }}>Key idea {String(slide.n).padStart(2,'0')} / {concepts.length}</div>
              {slide.head && <h3 style={{ fontWeight:900, fontSize:23, letterSpacing:'-0.02em', margin:'10px 0 10px', lineHeight:1.15 }}>{slide.head}</h3>}
              <p className="c82" style={{ fontSize:16, lineHeight:1.55, fontWeight:500, margin:0 }}>{slide.body}</p>
            </div>
          </React.Fragment>
        ) : slide.kind === 'mistake' ? (
          <React.Fragment>
            <div style={{ width:'40%', display:'flex', justifyContent:'center', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:110, height:110, borderRadius:'50%', background:'rgba(209,30,76,.14)', border:'2px solid rgba(209,30,76,.5)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--crimson)', fontWeight:900 }}>✗</div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="eyebrow" style={{ color:'var(--crimson)' }}>How this goes wrong {String(slide.n).padStart(2,'0')} / {slide.count}</div>
              {slide.head && <h3 style={{ fontWeight:900, fontSize:23, letterSpacing:'-0.02em', margin:'10px 0 10px', lineHeight:1.15 }}>{slide.head}</h3>}
              <p className="c82" style={{ fontSize:16, lineHeight:1.55, fontWeight:500, margin:0 }}>{slide.body}</p>
            </div>
          </React.Fragment>
        ) : slide.kind === 'intro' ? (
          <div style={{ width:'100%', textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}><SlideArt variant="rings" /></div>
            <div className="eyebrow" style={{ color:'var(--accent)' }}>Lesson {String(lesson.n).padStart(2,'0')} · {lesson.mins} min</div>
            <h2 style={{ fontWeight:900, fontSize:29, letterSpacing:'-0.03em', margin:'10px 0 6px', lineHeight:1.1 }}>{lesson.title}</h2>
            <p className="c70" style={{ fontSize:15, fontWeight:500, margin:0 }}>
              {concepts.length} key ideas{mistakes.length ? `, ${mistakes.length} traps to avoid` : ''}, then live practice with Claude
            </p>
          </div>
        ) : (
          <div style={{ width:'100%', textAlign:'center' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', margin:'0 auto 16px', background:'var(--accent-grad)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 16px 44px -10px rgba(242,98,46,.6)', animation:'glowPulse 2.6s ease-in-out infinite' }}>
              <span style={{ fontSize:30, color:'var(--aubergine)' }}>{isCap ? '★' : '→'}</span>
            </div>
            <div className="eyebrow" style={{ color:'var(--accent)' }}>{isCap ? 'Capstone' : 'Your turn'}</div>
            <h2 style={{ fontWeight:900, fontSize:25, letterSpacing:'-0.02em', margin:'8px 0 14px' }}>{practice ? practice.title : 'Practice with Claude'}</h2>
            {onStart && <button className="btn btn-primary" onClick={onStart}>{isCap ? 'Start capstone' : 'Start exercise'} <span>→</span></button>}
          </div>
        )}
      </div>

      {/* controls */}
      <div style={{ position:'absolute', bottom:14, left:18, right:18, display:'flex', alignItems:'center', gap:12, zIndex:4 }}>
        <button onClick={()=>setPlaying(p=>!p)} style={ctrl} title={playing?'Pause':'Play'}>{playing ? '❚❚' : '▶'}</button>
        <span className="mono c50" style={{ fontSize:11, letterSpacing:'.08em' }}>{i+1} / {total}</span>
        <div style={{ flex:1 }} />
        <button onClick={()=>go(i-1)} style={ctrl} title="Previous">←</button>
        <button onClick={()=>go(i+1)} style={ctrl} title="Next">→</button>
      </div>
    </div>
  );
}

function CourseOverview({ course, dept, go, openLesson, pct }){
  return (
    <div className="screen scroll" style={{ padding:'44px 52px', height:'100%' }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
          <DeptBadge dept={dept} size={54} active />
          <div style={{ flex:1 }}>
            <div className="eyebrow">{course.id} · {course.level} · {course.days} days</div>
            <h1 style={{ fontWeight:900, fontSize:36, letterSpacing:'-0.03em', margin:'6px 0 8px' }}>{course.title}</h1>
            <p className="c70" style={{ fontSize:16, fontWeight:500, margin:0, lineHeight:1.5, maxWidth:560 }}>{course.summary}</p>
          </div>
        </div>

        <div className="reveal" style={{ animationDelay:'.08s', marginTop:24, display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ flex:1 }}><ProgressBar value={pct} height={10} /></div>
          <span className="mono" style={{ fontSize:13, color:'var(--accent)', fontWeight:700 }}>{pct}%</span>
        </div>

        {/* objectives */}
        <div className="surface reveal" style={{ animationDelay:'.12s', marginTop:24, padding:'22px 26px' }}>
          <div className="eyebrow" style={{ marginBottom:14 }}>What you will be able to do</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {course.objectives.map((o,i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ width:24, height:24, borderRadius:'50%', background:'rgba(242,98,46,.16)', color:'var(--accent)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', fontSize:12, fontWeight:700, flexShrink:0 }}>{i+1}</span>
                <span className="c82" style={{ fontSize:15, fontWeight:500 }}>{o}</span>
              </div>
            ))}
          </div>
        </div>

        {/* lessons list */}
        <div style={{ marginTop:32 }}>
          <div className="eyebrow reveal" style={{ animationDelay:'.16s', marginBottom:16 }}>{course.lessons.length} Lessons</div>
          <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {course.lessons.map((l, i) => {
              const locked = l.status === 'locked';
              const done = l.status === 'done';
              return (
                <button key={l.id} disabled={locked} onClick={() => openLesson(l.id)} style={{
                  animationDelay:`${.2 + i*0.06}s`,
                  textAlign:'left', cursor: locked ? 'not-allowed' : 'pointer',
                  background:'var(--aubergine-lift)', border:'1px solid rgba(245,239,232,.08)', borderRadius:'var(--r-lg)',
                  padding:'20px 24px', display:'flex', gap:18, alignItems:'center', opacity: locked ? .5 : 1,
                  transition:'transform .2s var(--ease), border-color .2s var(--ease)',
                }}
                onMouseEnter={e=>{ if(!locked){ e.currentTarget.style.transform='translateX(4px)'; e.currentTarget.style.borderColor='var(--accent)'; } }}
                onMouseLeave={e=>{ if(!locked){ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='rgba(245,239,232,.08)'; } }}>
                  <div style={{
                    width:44, height:44, borderRadius:'var(--r-md)', flexShrink:0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background: done ? 'var(--accent)' : 'var(--aubergine-deep)',
                    color: done ? 'var(--aubergine)' : 'rgba(245,239,232,.6)',
                    fontFamily:'var(--mono)', fontWeight:700, fontSize:16,
                  }}>{done ? '✓' : locked ? '🔒'.replace('🔒','·') : String(l.n).padStart(2,'0')}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontWeight:700, fontSize:16 }}>{l.title}</span>
                      {l.status==='active' && <span className="pill" style={{ background:'rgba(242,98,46,.16)', color:'var(--accent)', fontSize:10, padding:'3px 9px' }}>In progress</span>}
                    </div>
                    <div className="c50 mono" style={{ fontSize:12, marginTop:5, letterSpacing:'.06em' }}>{l.mins} MIN · {l.difficulty.toUpperCase()}</div>
                  </div>
                  {!locked && <span className="c50" style={{ fontSize:20 }}>→</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==== Stage based lesson (Read → Walkthrough → Worked example → Do it) ====
   Used when a lesson carries a `worked` example. Old lessons without one
   render the classic single scroll layout below, unchanged. */

const STAGES = [
  { id:'read',    n:'01', label:'Read',           hint:'The concept' },
  { id:'watch',   n:'02', label:'Walkthrough',    hint:'See it move' },
  { id:'worked',  n:'03', label:'Worked example', hint:'Study a pro version' },
  { id:'do',      n:'04', label:'Do it',          hint:'Graded practice' },
];

function StageTabs({ stage, setStage, visited }){
  return (
    <div className="reveal" style={{ display:'flex', gap:8, marginBottom:26 }}>
      {STAGES.map((s) => {
        const on = stage === s.id;
        const seen = visited.has(s.id);
        return (
          <button key={s.id} onClick={() => setStage(s.id)} style={{
            flex:1, textAlign:'left', cursor:'pointer', padding:'12px 15px',
            background: on ? 'var(--aubergine-lift)' : 'transparent',
            border:`1px solid ${on ? 'var(--accent)' : seen ? 'rgba(245,239,232,.2)' : 'rgba(245,239,232,.1)'}`,
            borderRadius:'var(--r-md)', transition:'all .18s var(--ease)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span className="mono" style={{ fontSize:11, fontWeight:700, color: on ? 'var(--accent)' : seen ? '#4fd18b' : 'rgba(245,239,232,.4)' }}>
                {seen && !on ? '✓' : s.n}
              </span>
              <span style={{ fontWeight:700, fontSize:13.5, color: on ? 'var(--cream)' : 'rgba(245,239,232,.65)' }}>{s.label}</span>
            </div>
            <div className="c35" style={{ fontSize:11, marginTop:3, paddingLeft:19 }}>{s.hint}</div>
          </button>
        );
      })}
    </div>
  );
}

/* The traps section. Twenty years of teaching says the fastest way to make a
   junior professional is to show them exactly how the work goes wrong. */
function CommonMistakes({ mistakes }){
  return (
    <div className="reveal" style={{ marginTop:26 }}>
      <div className="eyebrow" style={{ marginBottom:14, color:'var(--crimson)' }}>How this goes wrong · avoid these</div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {mistakes.map((m, i) => {
          const parts = String(m).split(/:\s+(.+)/s);
          const head = parts.length > 1 ? parts[0] : null;
          const body = parts.length > 1 ? parts[1] : m;
          return (
            <div key={i} className="surface" style={{ padding:'16px 20px', display:'flex', gap:14, alignItems:'flex-start',
              background:'rgba(209,30,76,.07)', borderColor:'rgba(209,30,76,.28)' }}>
              <span style={{ width:24, height:24, borderRadius:'50%', flexShrink:0, marginTop:1,
                border:'2px solid var(--crimson)', color:'var(--crimson)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900 }}>✗</span>
              <span style={{ minWidth:0 }}>
                {head && <span style={{ display:'block', fontWeight:800, fontSize:15, marginBottom:3 }}>{head}</span>}
                <span className="c82" style={{ fontSize:14.5, fontWeight:500, lineHeight:1.55 }}>{body}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkedExample({ worked }){
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <p className="c94 reveal" style={{ fontSize:16.5, lineHeight:1.6, fontWeight:500, marginTop:0 }}>{worked.intro}</p>
      {worked.setup && (
        <div className="surface reveal" style={{ padding:'16px 20px', marginTop:18, background:'var(--aubergine-deep)' }}>
          <div className="eyebrow" style={{ marginBottom:8 }}>The setup</div>
          <p className="c82" style={{ fontSize:14.5, lineHeight:1.55, fontWeight:500, margin:0 }}>{worked.setup}</p>
        </div>
      )}
      <div className="reveal" style={{ marginTop:22 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div className="eyebrow" style={{ margin:0 }}>The professional version</div>
          {!revealed && (
            <button onClick={() => setRevealed(true)} className="btn btn-primary" style={{ padding:'8px 16px', fontSize:12 }}>
              Attempt it first, then reveal
            </button>
          )}
        </div>
        <pre className="mono" style={{
          margin:0, background:'var(--ground)', border:'1px solid rgba(245,239,232,.12)', borderRadius:'var(--r-md)',
          padding:'18px 20px', fontSize:12.5, lineHeight:1.65, color:'rgba(245,239,232,.85)', whiteSpace:'pre-wrap',
          maxHeight: revealed ? 520 : 120, overflowY:'auto', position:'relative',
          filter: revealed ? 'none' : 'blur(5px)', userSelect: revealed ? 'auto' : 'none',
          transition:'filter .3s var(--ease), max-height .3s var(--ease)',
        }}>{worked.example}</pre>
        {!revealed && (
          <div className="mono c50" style={{ fontSize:11, letterSpacing:'.08em', textAlign:'center', marginTop:8 }}>
            Blurred on purpose. Sketch your own version before you peek, the comparison is the lesson.
          </div>
        )}
      </div>
      {revealed && worked.notes && worked.notes.length > 0 && (
        <div className="reveal" style={{ marginTop:22 }}>
          <div className="eyebrow" style={{ marginBottom:12 }}>Why this version works</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {worked.notes.map((n, i) => (
              <div key={i} className="surface" style={{ padding:'14px 18px', display:'flex', gap:13, alignItems:'flex-start' }}>
                <span className="mono" style={{ color:'var(--accent)', fontSize:13, fontWeight:700, marginTop:1 }}>{String(i+1).padStart(2,'0')}</span>
                <span className="c82" style={{ fontSize:14.5, fontWeight:500, lineHeight:1.5 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StagedLesson({ course, lesson, practice, startExercise, backToCourse }){
  const [stage, setStage] = useState('read');
  const [visited] = useState(() => new Set(['read']));
  const [copied, setCopied] = useState(false);
  const isCapstone = !!(practice && practice.capstone);
  const goStage = (id) => { visited.add(id); setStage(id); };
  const idx = STAGES.findIndex(s => s.id === stage);
  const next = STAGES[idx + 1];
  const copyPrompt = () => {
    if (!practice || !practice.promptTemplate) return;
    try { navigator.clipboard.writeText(practice.promptTemplate); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch (e) { /* clipboard blocked */ }
  };

  return (
    <div className="screen scroll" style={{ padding:'40px 52px', height:'100%' }}>
      <div style={{ maxWidth:860, margin:'0 auto' }}>
        <button className="reveal" onClick={backToCourse} style={{ background:'none', border:'none', cursor:'pointer',
          color:'rgba(245,239,232,.6)', fontFamily:'var(--sans)', fontWeight:600, fontSize:14, display:'flex', alignItems:'center', gap:8, padding:0, marginBottom:18 }}>
          <span style={{ fontSize:16 }}>←</span> {course.title}
        </button>

        <div className="eyebrow reveal">Lesson {String(lesson.n).padStart(2,'0')} · {lesson.difficulty} · {lesson.mins} min</div>
        <h1 className="reveal" style={{ fontWeight:900, fontSize:36, letterSpacing:'-0.03em', margin:'8px 0 22px' }}>{lesson.title}</h1>

        <StageTabs stage={stage} setStage={goStage} visited={visited} />

        {stage === 'read' && (
          <div key="read" className="screen" style={{ height:'auto' }}>
            <p className="c94 reveal" style={{ fontSize:19, lineHeight:1.6, fontWeight:500, marginTop:0 }}>{lesson.concept}</p>
            <div className="eyebrow reveal" style={{ margin:'26px 0 14px' }}>Key Concepts</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {lesson.keyConcepts.map((k,i) => (
                <div key={i} className="surface" style={{ padding:'17px 21px', display:'flex', gap:15, alignItems:'flex-start' }}>
                  <span className="mono" style={{ color:'var(--accent)', fontSize:13.5, fontWeight:700, marginTop:2 }}>{String(i+1).padStart(2,'0')}</span>
                  <span className="c82" style={{ fontSize:15.5, fontWeight:500, lineHeight:1.5 }}>{k}</span>
                </div>
              ))}
            </div>
            {lesson.mistakes && lesson.mistakes.length > 0 && <CommonMistakes mistakes={lesson.mistakes} />}
          </div>
        )}

        {stage === 'watch' && (
          <div key="watch" className="screen" style={{ height:'auto' }}>
            {lesson.videoUrl ? (
              <div className="reveal" style={{ position:'relative', borderRadius:'var(--r-lg)', overflow:'hidden', aspectRatio:'16/9', background:'var(--aubergine-deep)', border:'1px solid rgba(245,239,232,.1)' }}>
                <iframe src={lesson.videoUrl} title="Lesson walkthrough" allowFullScreen
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }} />
              </div>
            ) : (
              <LessonSlides lesson={lesson} track={course.dept} practice={practice} onStart={() => goStage('do')} />
            )}
            <p className="c50 reveal" style={{ fontSize:13.5, fontWeight:500, marginTop:14, lineHeight:1.5 }}>
              {lesson.videoUrl ? 'A recorded walkthrough from your mentor.' : 'An animated pass over the key ideas. A recorded mentor walkthrough will land here when it is filmed.'}
            </p>
          </div>
        )}

        {stage === 'worked' && (
          <div key="worked" className="screen" style={{ height:'auto' }}>
            <WorkedExample worked={lesson.worked} />
          </div>
        )}

        {stage === 'do' && practice && (
          <div key="do" className="screen" style={{ height:'auto' }}>
            {practice.promptTemplate && (
              <React.Fragment>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <div className="eyebrow reveal" style={{ margin:0 }}>{isCapstone ? 'Capstone prompt' : "Today's Claude prompt"}</div>
                  <button onClick={copyPrompt} className="mono" style={{ background:'none', border:'1px solid rgba(245,239,232,.18)', color:'rgba(245,239,232,.7)',
                    borderRadius:'var(--r-pill)', padding:'6px 14px', fontSize:11, letterSpacing:'.08em', cursor:'pointer' }}>{copied ? 'COPIED' : 'COPY'}</button>
                </div>
                <pre className="mono reveal" style={{ margin:0, background:'var(--aubergine-deep)', border:'1px solid rgba(245,239,232,.1)', borderRadius:'var(--r-md)',
                  padding:'18px 20px', fontSize:13, lineHeight:1.65, color:'rgba(245,239,232,.85)', whiteSpace:'pre-wrap', maxHeight:260, overflowY:'auto' }}>{practice.promptTemplate}</pre>
              </React.Fragment>
            )}
            {practice.task && practice.task.length > 0 && (
              <React.Fragment>
                <div className="eyebrow reveal" style={{ margin:'24px 0 14px' }}>Your task</div>
                <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
                  {practice.task.map((s, i) => (
                    <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                      <span style={{ width:25, height:25, borderRadius:'50%', flexShrink:0, background:'rgba(242,98,46,.16)', color:'var(--accent)',
                        display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', fontSize:12, fontWeight:700, marginTop:1 }}>{i+1}</span>
                      <span className="c82" style={{ fontSize:15.5, fontWeight:500, lineHeight:1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )}
            <div className="reveal" style={{ marginTop:28, position:'relative', borderRadius:'var(--r-lg)', overflow:'hidden',
              background:'var(--accent-grad)', padding:'26px 28px', display:'flex', alignItems:'center', gap:20 }}>
              <div style={{ flex:1 }}>
                <div className="mono" style={{ fontSize:11, letterSpacing:'.16em', color:'rgba(42,18,64,.7)', fontWeight:700 }}>{isCapstone ? 'CAPSTONE · GRADED BY CLAUDE' : 'GRADED PRACTICE WITH CLAUDE'}</div>
                <h3 style={{ fontWeight:900, fontSize:21, letterSpacing:'-0.02em', margin:'6px 0 4px', color:'var(--aubergine)' }}>{practice.title}</h3>
                <p style={{ margin:0, color:'rgba(42,18,64,.8)', fontSize:14, fontWeight:600 }}>{practice.mins} min · strict grading, every criterion must pass</p>
              </div>
              <button className="btn" onClick={startExercise} style={{ background:'var(--aubergine)', color:'var(--cream)' }}>{isCapstone ? 'Start capstone' : 'Start exercise'} <span>→</span></button>
            </div>
          </div>
        )}

        {next && stage !== 'do' && (
          <div className="reveal" style={{ display:'flex', justifyContent:'flex-end', marginTop:26 }}>
            <button className="btn btn-ghost" onClick={() => goStage(next.id)} style={{ padding:'11px 22px', fontSize:14 }}>
              Next · {next.label} <span style={{ fontSize:16 }}>→</span>
            </button>
          </div>
        )}
        <div style={{ height:36 }} />
      </div>
    </div>
  );
}

function LessonView({ course, lesson, go, startExercise, backToCourse }){
  const [copied, setCopied] = useState(false);
  // A lesson's practice is either its own (intern courses) or the course level exercise.
  const practice = lesson.practice || (course.exercise && course.exercise.lessonId === lesson.id ? course.exercise : null);
  const isCapstone = !!(practice && practice.capstone);
  const copyPrompt = () => {
    if (!practice || !practice.promptTemplate) return;
    try { navigator.clipboard.writeText(practice.promptTemplate); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch (e) { /* clipboard blocked */ }
  };

  // Lessons authored with a worked example use the staged Read → Walkthrough →
  // Worked example → Do it experience. Older lessons keep the classic layout.
  if (lesson.worked){
    return <StagedLesson course={course} lesson={lesson} practice={practice} startExercise={startExercise} backToCourse={backToCourse} />;
  }

  return (
    <div className="screen scroll" style={{ padding:'40px 52px', height:'100%' }}>
      <div style={{ maxWidth:820, margin:'0 auto' }}>
        <button className="reveal" onClick={backToCourse} style={{ background:'none', border:'none', cursor:'pointer',
          color:'rgba(245,239,232,.6)', fontFamily:'var(--sans)', fontWeight:600, fontSize:14, display:'flex', alignItems:'center', gap:8, padding:0, marginBottom:20 }}>
          <span style={{ fontSize:16 }}>←</span> {course.title}
        </button>

        <div className="eyebrow reveal" style={{ animationDelay:'.04s' }}>Lesson {String(lesson.n).padStart(2,'0')} · {lesson.difficulty} · {lesson.mins} min</div>
        <h1 className="reveal" style={{ fontWeight:900, fontSize:38, letterSpacing:'-0.03em', margin:'8px 0 24px', animationDelay:'.08s' }}>{lesson.title}</h1>

        {/* animated lesson slides */}
        <LessonSlides lesson={lesson} track={course.dept} practice={practice} onStart={startExercise} />

        {/* concept */}
        <div className="reveal" style={{ animationDelay:'.18s', marginTop:32 }}>
          <div className="eyebrow" style={{ marginBottom:12 }}>The Concept</div>
          <p className="c94" style={{ fontSize:19, lineHeight:1.6, fontWeight:500, margin:0 }}>{lesson.concept}</p>
        </div>

        {/* key concepts */}
        <div className="reveal" style={{ animationDelay:'.24s', marginTop:32 }}>
          <div className="eyebrow" style={{ marginBottom:16 }}>Key Concepts</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {lesson.keyConcepts.map((k,i) => (
              <div key={i} className="surface" style={{ padding:'18px 22px', display:'flex', gap:16, alignItems:'flex-start' }}>
                <span className="mono" style={{ color:'var(--accent)', fontSize:14, fontWeight:700, marginTop:2 }}>{String(i+1).padStart(2,'0')}</span>
                <span className="c82" style={{ fontSize:16, fontWeight:500, lineHeight:1.5 }}>{k}</span>
              </div>
            ))}
          </div>
          {lesson.mistakes && lesson.mistakes.length > 0 && <CommonMistakes mistakes={lesson.mistakes} />}
        </div>

        {/* today's Claude prompt */}
        {practice && practice.promptTemplate && (
          <div className="reveal" style={{ animationDelay:'.28s', marginTop:36 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div className="eyebrow" style={{ margin:0 }}>{isCapstone ? 'Capstone prompt' : "Today's Claude prompt"}</div>
              <button onClick={copyPrompt} className="mono" style={{ background:'none', border:'1px solid rgba(245,239,232,.18)', color:'rgba(245,239,232,.7)',
                borderRadius:'var(--r-pill)', padding:'6px 14px', fontSize:11, letterSpacing:'.08em', cursor:'pointer' }}>{copied ? 'COPIED' : 'COPY'}</button>
            </div>
            <pre className="mono" style={{ margin:0, background:'var(--aubergine-deep)', border:'1px solid rgba(245,239,232,.1)', borderRadius:'var(--r-md)',
              padding:'18px 20px', fontSize:13, lineHeight:1.65, color:'rgba(245,239,232,.85)', whiteSpace:'pre-wrap', maxHeight:300, overflowY:'auto' }}>{practice.promptTemplate}</pre>
          </div>
        )}

        {/* your task */}
        {practice && practice.task && practice.task.length > 0 && (
          <div className="reveal" style={{ animationDelay:'.32s', marginTop:32 }}>
            <div className="eyebrow" style={{ marginBottom:16 }}>Your task</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {practice.task.map((s, i) => (
                <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <span style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, background:'rgba(242,98,46,.16)', color:'var(--accent)',
                    display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', fontSize:12, fontWeight:700, marginTop:1 }}>{i+1}</span>
                  <span className="c82" style={{ fontSize:16, fontWeight:500, lineHeight:1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA to live practice */}
        {practice && (
          <div className="reveal" style={{ animationDelay:'.36s', marginTop:34, position:'relative', borderRadius:'var(--r-lg)', overflow:'hidden',
            background:'var(--accent-grad)', padding:'28px 30px', display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ flex:1 }}>
              <div className="mono" style={{ fontSize:11, letterSpacing:'.16em', color:'rgba(42,18,64,.7)', fontWeight:700 }}>{isCapstone ? 'CAPSTONE · PRACTICE WITH CLAUDE' : 'PRACTICE WITH CLAUDE'}</div>
              <h3 style={{ fontWeight:900, fontSize:22, letterSpacing:'-0.02em', margin:'6px 0 4px', color:'var(--aubergine)' }}>{practice.title}</h3>
              <p style={{ margin:0, color:'rgba(42,18,64,.8)', fontSize:14, fontWeight:600 }}>{practice.mins} min · Live Claude session</p>
            </div>
            <button className="btn" onClick={startExercise} style={{ background:'var(--aubergine)', color:'var(--cream)' }}>{isCapstone ? 'Start capstone' : 'Start exercise'} <span>→</span></button>
          </div>
        )}
        <div style={{ height:40 }} />
      </div>
    </div>
  );
}

Object.assign(window, { CourseOverview, LessonView });
