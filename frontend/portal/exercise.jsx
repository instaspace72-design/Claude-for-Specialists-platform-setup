/* Exercise + LIVE Claude practice chat (wired to backend /api/chat) */

const API_BASE = (typeof window !== 'undefined' && typeof window.PORTAL_API === 'string') ? window.PORTAL_API : 'http://localhost:3001';
// Resolved at call time so it reflects whoever is currently signed in.
function currentStudentId(){
  return (typeof window !== 'undefined' && window.PORTAL_USER && window.PORTAL_USER.email) || 'demo_student';
}

function TypingDots(){
  return (
    <div style={{ display:'flex', gap:5, padding:'4px 2px' }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'var(--accent)',
          animation:`blink 1.2s infinite`, animationDelay:`${i*0.16}s` }} />
      ))}
    </div>
  );
}

function Bubble({ role, error, children }){
  const isClaude = role === 'claude';
  return (
    <div style={{ display:'flex', justifyContent: isClaude ? 'flex-start' : 'flex-end', animation:'rise .4s var(--ease) both' }}>
      <div style={{ maxWidth:'82%', display:'flex', gap:10, flexDirection: isClaude ? 'row' : 'row-reverse', alignItems:'flex-end' }}>
        {isClaude && (
          <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, background:'var(--accent-grad)',
            display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', fontWeight:700, fontSize:12, color:'var(--aubergine)' }}>C</div>
        )}
        <div style={{
          padding:'12px 16px', borderRadius: isClaude ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
          background: error ? 'rgba(209,30,76,.16)' : isClaude ? 'var(--aubergine-lift)' : 'var(--accent)',
          color: error ? 'var(--cream)' : isClaude ? 'var(--cream)' : 'var(--aubergine)',
          fontSize:15, lineHeight:1.55, fontWeight: isClaude ? 500 : 600,
          border: error ? '1px solid rgba(209,30,76,.4)' : isClaude ? '1px solid rgba(245,239,232,.08)' : 'none',
          whiteSpace:'pre-wrap',
        }}>{children}</div>
      </div>
    </div>
  );
}

function StreamingText({ text, onDone }){
  const [shown, setShown] = useState('');
  useEffect(() => {
    const mo = getMo();
    if (mo === 0){ setShown(text); onDone && onDone(); return; }
    let i = 0;
    const speed = 14 / (mo || 1);
    const id = setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length){ clearInterval(id); onDone && onDone(); }
    }, speed);
    return () => clearInterval(id);
  }, []);
  return <span>{shown}</span>;
}

function Exercise({ course, lesson, practice, backToLesson, onComplete }){
  const ex = practice || course.exercise;
  const brief = ex.brief || ex.scenario || '';
  const records = ex.records || [];
  const task = ex.task || [];
  // Structured exercise context; the server builds the mentor prompt from it,
  // adding InstaSpace product ground truth and the learner's real history.
  const exerciseContext = {
    courseTitle: course.title,
    lessonTitle: lesson && lesson.title,
    exerciseTitle: ex.title,
    instructor: course.instructor,
    brief,
    promptTemplate: ex.promptTemplate || '',
    task,
    success: ex.success || [],
    records: records.map(r => ({ title: r.title, meta: r.meta })),
  };

  const [msgs, setMsgs] = useState([]);         // displayed bubbles: {role:'claude'|'user', text, stream?, error?}
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [userTurns, setUserTurns] = useState(0);
  const [done, setDone] = useState(false);
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState(null);     // {passed, criteria:[{criterion,pass,reason}], feedback}
  const historyRef = useRef([]);                // true API history: {role:'user'|'assistant', content}
  const scrollRef = useRef(null);
  const startedRef = useRef(false);

  const canSubmit = userTurns >= 2;

  // one live turn: send current history to Claude, append the reply
  async function ask(){
    setTyping(true);
    try {
      const res = await window.authFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ exerciseId: ex.id, exercise: exerciseContext, messages: historyRef.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok){
        throw new Error(data.hint || data.error || `Request failed (${res.status})`);
      }
      const reply = data.text || '(empty response)';
      historyRef.current.push({ role: 'assistant', content: reply });
      setMsgs(m => {
        const next = [...m];
        (data.toolEvents || []).forEach(ev => next.push({ role: 'tool', text: ev.label }));
        next.push({ role: 'claude', text: reply, stream: true });
        return next;
      });
    } catch (err) {
      const offline = /Failed to fetch|NetworkError/i.test(err.message);
      const text = offline
        ? 'Cannot reach the backend on port 3001. Start it with "npm run dev", then reply again.'
        : `Claude is not connected. ${err.message}`;
      setMsgs(m => [...m, { role: 'claude', text, error: true }]);
    } finally {
      setTyping(false);
    }
  }

  // kick off: mentor opens the session (seed user turn is sent to the API but not shown)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    historyRef.current = [{ role: 'user', content: 'I am ready to begin this exercise. Ask me your first guiding question.' }];
    ask();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', text }]);
    historyRef.current.push({ role: 'user', content: text });
    setUserTurns(n => n + 1);
    ask();
  };

  // Real grading: a strict second Claude pass judges the transcript against
  // the success criteria. Pass only when every criterion is met.
  const submit = async () => {
    if (grading || typing) return;
    setGrading(true);
    try {
      const res = await window.authFetch('/api/grade', {
        method: 'POST',
        body: JSON.stringify({
          exerciseId: ex.id || (lesson && lesson.id) || 'practice',
          context: {
            courseTitle: course.title,
            lessonTitle: lesson && lesson.title,
            exerciseTitle: ex.title,
            brief,
            criteria: ex.success || [],
          },
          transcript: historyRef.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hint || data.error || `Grading failed (${res.status})`);
      setGrade(data);
      if (data.passed){
        setDone(true);
        onComplete && onComplete();
      } else {
        const failed = (data.criteria || []).filter(c => !c.pass);
        const text = [
          `Not yet. ${data.feedback || 'Some criteria are not met.'}`,
          '',
          ...failed.map(c => `✗ ${c.criterion}${c.reason ? ` , ${c.reason}` : ''}`),
          '',
          'Revise your work in the chat, then submit again.',
        ].join('\n');
        setMsgs(m => [...m, { role: 'claude', text }]);
      }
    } catch (err) {
      const offline = /Failed to fetch|NetworkError/i.test(err.message);
      setMsgs(m => [...m, { role: 'claude', error: true, text: offline
        ? 'Cannot reach the backend on port 3001, so your work cannot be graded yet.'
        : `Grading is unavailable. ${err.message}` }]);
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="screen" style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      {/* header */}
      <div style={{ padding:'22px 40px', borderBottom:'1px solid rgba(245,239,232,.08)', display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
        <button onClick={backToLesson} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(245,239,232,.6)', fontSize:20, padding:0 }}>←</button>
        <div style={{ flex:1 }}>
          <div className="eyebrow">{ex.id || (lesson && lesson.id) || 'PRACTICE'} · {ex.capstone ? 'Capstone' : 'Exercise'} · {ex.difficulty}</div>
          <div style={{ fontWeight:800, fontSize:20, letterSpacing:'-0.02em' }}>{ex.title}</div>
        </div>
        <div className="pill" style={{ background:'rgba(242,98,46,.14)', color:'var(--accent)' }}>{ex.mins} MIN</div>
      </div>

      {/* split body */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'minmax(340px, 42%) 1fr', minHeight:0 }}>
        {/* left: brief */}
        <div className="scroll" style={{ padding:'28px 34px', borderRight:'1px solid rgba(245,239,232,.08)' }}>
          <div className="eyebrow reveal" style={{ marginBottom:10 }}>{ex.capstone ? 'The Capstone' : 'The Brief'}</div>
          <p className="c94 reveal" style={{ animationDelay:'.05s', fontSize:16, lineHeight:1.6, fontWeight:500, marginTop:0 }}>{brief}</p>

          {ex.promptTemplate && (
            <React.Fragment>
              <div className="eyebrow reveal" style={{ animationDelay:'.1s', margin:'24px 0 10px' }}>Prompt to run</div>
              <pre className="mono reveal" style={{ animationDelay:'.12s', margin:0, background:'var(--ground)', border:'1px solid rgba(245,239,232,.1)', borderRadius:'var(--r-md)',
                padding:'14px 16px', fontSize:12, lineHeight:1.6, color:'rgba(245,239,232,.8)', whiteSpace:'pre-wrap', maxHeight:210, overflowY:'auto' }}>{ex.promptTemplate}</pre>
            </React.Fragment>
          )}

          {task.length > 0 && (
            <React.Fragment>
              <div className="eyebrow reveal" style={{ animationDelay:'.16s', margin:'24px 0 10px' }}>Your task</div>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {task.map((s, i) => (
                  <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <span className="mono" style={{ color:'var(--accent)', fontSize:12, fontWeight:700, marginTop:2 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="c82" style={{ fontSize:14, fontWeight:500, lineHeight:1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}

          {records.length > 0 && (
            <React.Fragment>
              <div className="eyebrow reveal" style={{ animationDelay:'.1s', margin:'26px 0 12px' }}>{ex.recordsLabel || 'Reference'} · {records.length}</div>
              <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {records.map((h,i) => (
                  <div key={i} className="surface" style={{ padding:'13px 15px', animationDelay:`${.14+i*0.05}s` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
                      <span style={{ fontWeight:700, fontSize:14 }}>{h.title}</span>
                      <span className="pill" style={{ background: h.ok ? 'rgba(31,138,91,.16)' : 'rgba(209,30,76,.16)', color: h.ok ? '#4fd18b' : 'var(--crimson)', fontSize:9, padding:'3px 8px', flexShrink:0 }}>
                        {h.ok ? h.okLabel : h.badLabel}
                      </span>
                    </div>
                    <div className="c50 mono" style={{ fontSize:11, marginTop:6, letterSpacing:'.04em', lineHeight:1.6 }}>
                      {h.meta}
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}

          <div className="eyebrow reveal" style={{ animationDelay:'.3s', margin:'26px 0 12px' }}>
            Success Criteria {grade ? '· graded' : '· graded on submit'}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {ex.success.map((s,i) => {
              const g = grade && grade.criteria && grade.criteria[i];
              const state = g ? (g.pass ? 'pass' : 'fail') : 'pending';
              return (
                <div key={i} className="reveal" style={{ animationDelay:`${.34+i*0.05}s`, display:'flex', gap:11, alignItems:'flex-start' }}>
                  <span style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, transition:'all .3s var(--ease)', marginTop:1,
                    background: state==='pass' ? 'var(--accent)' : 'transparent',
                    border:`2px solid ${state==='pass' ? 'var(--accent)' : state==='fail' ? 'var(--crimson)' : 'rgba(245,239,232,.25)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: state==='pass' ? 'var(--aubergine)' : 'var(--crimson)', fontSize:11, fontWeight:900 }}>
                    {state==='pass' ? '✓' : state==='fail' ? '✗' : ''}
                  </span>
                  <span style={{ minWidth:0 }}>
                    <span className="c82" style={{ fontSize:14, fontWeight:500, display:'block' }}>{s}</span>
                    {state==='fail' && g.reason && (
                      <span style={{ fontSize:12, color:'var(--crimson)', display:'block', marginTop:3, lineHeight:1.45 }}>{g.reason}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* right: chat */}
        <div style={{ display:'flex', flexDirection:'column', minHeight:0, background:'var(--aubergine-deep)' }}>
          <div ref={scrollRef} className="scroll" style={{ flex:1, padding:'26px 30px', display:'flex', flexDirection:'column', gap:16 }}>
            <div className="mono c35" style={{ fontSize:11, letterSpacing:'.1em', textAlign:'center', marginBottom:4 }}>LIVE PRACTICE SESSION · CLAUDE</div>
            {msgs.map((m,i) => (
              m.role === 'tool' ? (
                <div key={i} className="mono" style={{ textAlign:'center', fontSize:11, letterSpacing:'.1em', color:'var(--accent)',
                  padding:'4px 0', animation:'fadein .3s var(--ease) both' }}>
                  ⚙ {m.text.toUpperCase()}
                </div>
              ) : (
                <Bubble key={i} role={m.role} error={m.error}>
                  {m.stream && i === msgs.length-1 && !m.streamed
                    ? <StreamingText text={m.text} onDone={() => { m.streamed = true; if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }} />
                    : m.text}
                </Bubble>
              )
            ))}
            {typing && (
              <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
                <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, background:'var(--accent-grad)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', fontWeight:700, fontSize:12, color:'var(--aubergine)' }}>C</div>
                <div style={{ padding:'10px 14px', borderRadius:'4px 16px 16px 16px', background:'var(--aubergine-lift)', border:'1px solid rgba(245,239,232,.08)' }}><TypingDots /></div>
              </div>
            )}
          </div>

          {/* composer */}
          <div style={{ padding:'16px 24px 20px', borderTop:'1px solid rgba(245,239,232,.08)' }}>
            {canSubmit && !grade && (
              <div className="reveal" style={{ marginBottom:12, display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:'var(--r-md)', background:'rgba(245,239,232,.05)', border:'1px solid rgba(245,239,232,.14)' }}>
                <span style={{ color:'var(--accent)', fontSize:16 }}>i</span>
                <span className="c82" style={{ fontSize:13, fontWeight:600 }}>When you believe your work meets every success criterion, submit it for grading. Claude grades strictly.</span>
              </div>
            )}
            {grade && !grade.passed && (
              <div className="reveal" style={{ marginBottom:12, display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:'var(--r-md)', background:'rgba(209,30,76,.12)', border:'1px solid rgba(209,30,76,.35)' }}>
                <span style={{ color:'var(--crimson)', fontSize:16, fontWeight:900 }}>!</span>
                <span className="c82" style={{ fontSize:13, fontWeight:600 }}>
                  {grade.criteria.filter(c=>c.pass).length} of {grade.criteria.length} criteria met. Fix the failed ones and resubmit.
                </span>
              </div>
            )}
            <div style={{ display:'flex', gap:12, alignItems:'flex-end' }}>
              <textarea value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
                placeholder={ typing ? 'Claude is thinking…' : 'Reply to Claude…'} rows={1}
                style={{ flex:1, resize:'none', background:'var(--ground)', border:'1px solid rgba(245,239,232,.14)', borderRadius:'var(--r-md)',
                  color:'var(--cream)', padding:'13px 16px', fontSize:15, outline:'none', maxHeight:120, fontFamily:'var(--sans)' }}
                onFocus={e=>e.target.style.borderColor='var(--accent)'} onBlur={e=>e.target.style.borderColor='rgba(245,239,232,.14)'} />
              <button className="btn btn-primary" onClick={send} disabled={typing || grading || !input.trim()} style={{ opacity:(typing||grading||!input.trim())?.4:1 }}>Send</button>
              {canSubmit && (
                <button className="btn btn-primary" onClick={submit} disabled={grading || typing}
                  style={{ opacity: grading || typing ? .5 : 1, animation: grading ? 'none' : 'glowPulse 2.4s ease-in-out infinite', whiteSpace:'nowrap' }}>
                  {grading ? 'Grading…' : grade && !grade.passed ? 'Resubmit' : 'Submit for grading'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {done && <SuccessOverlay reward={ex.reward} grade={grade} onNext={backToLesson} />}
    </div>
  );
}

function SuccessOverlay({ reward, grade, onNext }){
  reward = reward || { badge:'Exercise', note:'Nicely done.' };
  const colors = ['#F2622E','#D11E4C','#F5EFE8','#4fd18b'];
  const pieces = Array.from({length:28});
  const criteria = (grade && grade.criteria) || [];
  return (
    <div className="scroll" style={{ position:'absolute', inset:0, zIndex:40, background:'rgba(18,8,34,.9)', backdropFilter:'blur(6px)',
      display:'flex', alignItems:'center', justifyContent:'center', animation:'fadein .3s ease both', padding:'30px' }}>
      {getMo() > 0 && pieces.map((_,i) => (
        <span key={i} style={{ position:'absolute', top:'30%', left:`${50 + (Math.random()*50-25)}%`,
          width:8, height:12, background:colors[i%colors.length], borderRadius:2,
          animation:`confettiFall ${1.1+Math.random()*0.8}s var(--ease) ${Math.random()*0.3}s both` }} />
      ))}
      <div style={{ textAlign:'center', animation:'pop .5s var(--ease) both', position:'relative', maxWidth:520 }}>
        <div style={{ width:88, height:88, borderRadius:'50%', margin:'0 auto 20px', background:'var(--accent-grad)',
          display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 20px 60px -12px rgba(242,98,46,.7)' }}>
          <span style={{ fontSize:40, color:'var(--aubergine)' }}>✓</span>
        </div>
        <div className="eyebrow" style={{ color:'var(--accent)' }}>
          Graded and passed · {criteria.length ? `${criteria.filter(c=>c.pass).length} of ${criteria.length} criteria met` : 'All criteria met'}
        </div>
        <h2 style={{ fontWeight:900, fontSize:32, letterSpacing:'-0.03em', margin:'10px 0 8px' }}>{reward.badge} unlocked.</h2>
        {grade && grade.feedback && (
          <p className="c82" style={{ fontSize:15, fontWeight:500, margin:'0 auto 16px', lineHeight:1.55, textAlign:'left',
            background:'var(--aubergine-lift)', border:'1px solid rgba(245,239,232,.1)', borderRadius:'var(--r-md)', padding:'14px 18px' }}>
            <span className="eyebrow" style={{ display:'block', marginBottom:6, color:'var(--accent)' }}>Grader feedback</span>
            {grade.feedback}
          </p>
        )}
        {criteria.length > 0 && (
          <div style={{ textAlign:'left', margin:'0 auto 18px', display:'flex', flexDirection:'column', gap:7 }}>
            {criteria.map((c,i) => (
              <div key={i} style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
                <span style={{ color:'#4fd18b', fontWeight:900, fontSize:13, marginTop:1 }}>✓</span>
                <span className="c70" style={{ fontSize:13, fontWeight:500, lineHeight:1.45 }}>{c.criterion}</span>
              </div>
            ))}
          </div>
        )}
        <p className="c70" style={{ fontSize:15, fontWeight:500, maxWidth:400, margin:'0 auto 24px' }}>
          {reward.note}
        </p>
        <button className="btn btn-primary" onClick={onNext} style={{ fontSize:16, padding:'14px 32px' }}>Continue <span>→</span></button>
      </div>
    </div>
  );
}

window.Exercise = Exercise;
