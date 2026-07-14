/* Admin panel: super admin control room. Dashboard, course upload with AI
   conversion, prompt library, full user management, CSV exports, audit log.
   Everything talks to /api/admin/* and every mutation lands in the audit log. */

const ADMIN_TABS = [
  { id:'dashboard', label:'Dashboard' },
  { id:'courses',   label:'Courses' },
  { id:'prompts',   label:'Prompts' },
  { id:'users',     label:'Users' },
  { id:'export',    label:'Export' },
  { id:'audit',     label:'Audit' },
];

function fmtWhen(ts){
  const d = new Date(String(ts).replace(' ', 'T') + 'Z');
  if (isNaN(d.getTime())) return String(ts || '');
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' }) + ' · ' +
         d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
}

function AdminField({ label, value, onChange, placeholder, area, mono }){
  const [focus, setFocus] = useState(false);
  const style = {
    width:'100%', background:'var(--ground)', color:'var(--cream)', fontSize:13.5,
    border:`1px solid ${focus ? 'var(--accent)' : 'rgba(245,239,232,.14)'}`, borderRadius:'var(--r-md)',
    padding:'10px 12px', outline:'none', fontFamily: mono ? 'var(--mono)' : 'var(--sans)', resize:'vertical',
  };
  return (
    <label style={{ display:'block', marginBottom:12, flex:1 }}>
      <span className="eyebrow" style={{ display:'block', marginBottom:6, letterSpacing:'.12em', fontSize:10 }}>{label}</span>
      {area
        ? <textarea rows={area} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={style} />
        : <input type="text" value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={style} />}
    </label>
  );
}

function AdminMsg({ kind, text }){
  if (!text) return null;
  const bad = kind === 'error';
  return (
    <div style={{ display:'flex', gap:9, alignItems:'flex-start', padding:'10px 13px', marginBottom:14, borderRadius:'var(--r-md)',
      background: bad ? 'rgba(209,30,76,.14)' : 'rgba(31,138,91,.14)', border:`1px solid ${bad ? 'rgba(209,30,76,.4)' : 'rgba(31,138,91,.4)'}` }}>
      <span style={{ color: bad ? 'var(--crimson)' : '#4fd18b', fontWeight:900, fontSize:13 }}>{bad ? '!' : '✓'}</span>
      <span className="c94" style={{ fontSize:13, fontWeight:600, lineHeight:1.5, whiteSpace:'pre-wrap' }}>{text}</span>
    </div>
  );
}

async function adminCall(path, opts){
  const res = await window.authFetch(path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.hint ? `${data.error}. ${data.hint}` : (data.error || `Failed (${res.status})`));
  return data;
}

/* ---------------- Dashboard ---------------- */
function AdminDashboard(){
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { adminCall('/api/admin/overview').then(setData).catch(e => setError(e.message)); }, []);
  if (error) return <AdminMsg kind="error" text={error} />;
  if (!data) return <div className="c50" style={{ fontSize:14 }}>Loading…</div>;
  const s = data.stats;
  const tiles = [
    ['Interns', s.interns], ['Leadership', s.leadership], ['Custom courses', s.customCourses],
    ['Active prompts', s.prompts], ['Exercises passed', s.exercisesPassed],
    ['Certificates', s.certificates], ['Artefacts', s.artefacts], ['Active hours (all)', s.totalActiveHours],
  ];
  const icons = { submission:'✎', lesson:'✓', certificate:'★', artefact:'▣', note:'✉' };
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
        {tiles.map(([label, v]) => (
          <div key={label} className="surface" style={{ padding:'16px 18px' }}>
            <div style={{ fontWeight:900, fontSize:26, letterSpacing:'-0.02em', color:'var(--cream)' }}>{v}</div>
            <div className="eyebrow" style={{ marginTop:6, fontSize:10 }}>{label}</div>
          </div>
        ))}
      </div>
      <div className="eyebrow" style={{ margin:'26px 0 12px' }}>Recent activity · live from the database</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {data.activity.length === 0 && <div className="c50" style={{ fontSize:13 }}>No activity yet.</div>}
        {data.activity.map((a, i) => (
          <div key={i} className="surface" style={{ padding:'11px 16px', display:'flex', gap:12, alignItems:'center', background:'var(--aubergine-deep)' }}>
            <span style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, background:'var(--aubergine-lift)', border:'1px solid rgba(245,239,232,.12)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'var(--accent)' }}>{icons[a.type] || '·'}</span>
            <span className="c82" style={{ fontSize:13, fontWeight:500, flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              <b>{String(a.who || '').split('@')[0]}</b> {a.outcome} <span className="mono" style={{ fontSize:11.5 }}>{a.what}</span>
            </span>
            <span className="mono c35" style={{ fontSize:10.5, flexShrink:0 }}>{fmtWhen(a.at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Courses ---------------- */
function AdminCourses(){
  const [stats, setStats] = useState(null);
  const [md, setMd] = useState('');
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);

  const load = () => adminCall('/api/admin/course-stats').then(setStats).catch(e => setMsg({ kind:'error', text:e.message }));
  useEffect(() => { load(); }, []);

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setMd(String(reader.result || ''));
    reader.readAsText(f);
  };

  const convert = async () => {
    setBusy(true); setMsg(null); setDraft(null);
    try {
      const d = await adminCall('/api/admin/courses/convert', { method:'POST', body: JSON.stringify({ markdown: md }) });
      setDraft(d.draft);
      setMsg({ kind:'ok', text:`Converted: "${d.draft.course.title}" · ${d.draft.course.lessons.length} lessons · track ${d.draft.specialty.id}. Review below, then publish.` });
    } catch (e) {
      // allow direct JSON paste as the no-AI fallback
      const direct = (() => { try { return JSON.parse(md); } catch (_) { return null; } })();
      if (direct && direct.course) { setDraft(direct); setMsg({ kind:'ok', text:'Parsed pasted JSON directly. Review below, then publish.' }); }
      else setMsg({ kind:'error', text:e.message });
    } finally { setBusy(false); }
  };

  const publish = async () => {
    setBusy(true); setMsg(null);
    try {
      const r = await adminCall('/api/admin/courses', { method:'POST', body: JSON.stringify({ payload: draft, publish: true }) });
      setMsg({ kind:'ok', text:`Published. The course is live on track "${r.deptId}". Assign an intern to that track in the Users tab and it appears on their next sign in.` });
      setDraft(null); setMd(''); load();
    } catch (e) { setMsg({ kind:'error', text:e.message }); }
    finally { setBusy(false); }
  };

  const removeCustom = async (deptId) => {
    if (!confirm(`Unpublish and delete the custom course "${deptId}"? Built in courses are unaffected.`)) return;
    try { await adminCall(`/api/admin/courses/${encodeURIComponent(deptId)}`, { method:'DELETE' }); load(); }
    catch (e) { setMsg({ kind:'error', text:e.message }); }
  };

  const courses = Object.values(window.COURSES || {});
  const trackCounts = {};
  ((stats && stats.byTrack) || []).forEach(t => { trackCounts[t.track] = t.interns; });
  const customIds = new Set(((stats && stats.custom) || []).map(c => c.dept_id));

  return (
    <div>
      <AdminMsg kind={msg && msg.kind} text={msg && msg.text} />
      <div className="eyebrow" style={{ marginBottom:12 }}>All courses in the portal</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:28 }}>
        {courses.map(c => (
          <div key={c.id} className="surface" style={{ padding:'13px 18px', display:'flex', gap:14, alignItems:'center' }}>
            <span className="mono" style={{ fontSize:11, color:'var(--accent)', width:64, flexShrink:0 }}>{c.id}</span>
            <span style={{ fontWeight:700, fontSize:14, flex:1, minWidth:0 }}>{c.title}</span>
            <span className="c50" style={{ fontSize:12, flexShrink:0 }}>{c.instructor}</span>
            <span className="mono c50" style={{ fontSize:11, flexShrink:0 }}>{c.lessons.length} lessons</span>
            <span className="pill" style={{ background:'rgba(242,98,46,.14)', color:'var(--accent)', fontSize:9, flexShrink:0 }}>
              {trackCounts[c.dept] || 0} enrolled
            </span>
            {customIds.has(c.dept) && (
              <button onClick={() => removeCustom(c.dept)} className="mono" style={{ background:'none', border:'1px solid rgba(209,30,76,.4)', color:'var(--crimson)',
                borderRadius:'var(--r-pill)', padding:'4px 10px', fontSize:10, cursor:'pointer', flexShrink:0 }}>REMOVE</button>
            )}
          </div>
        ))}
      </div>

      <div className="eyebrow" style={{ marginBottom:12 }}>Upload a new course</div>
      <div className="surface" style={{ padding:'18px 20px' }}>
        <div className="c70" style={{ fontSize:13, lineHeight:1.55, marginBottom:14 }}>
          Upload or paste a course document (markdown or plain text). AI converts it into a portal course with lessons,
          practices, and grading criteria. You review the draft before anything goes live. Course JSON can also be pasted directly.
        </div>
        <div style={{ display:'flex', gap:10, marginBottom:10 }}>
          <button className="btn btn-ghost" onClick={() => fileRef.current && fileRef.current.click()} style={{ padding:'8px 16px', fontSize:12 }}>
            Choose .md file
          </button>
          <input ref={fileRef} type="file" accept=".md,.txt,.markdown,.json" onChange={onFile} style={{ display:'none' }} />
          <span className="mono c35" style={{ fontSize:11, alignSelf:'center' }}>{md ? `${md.length.toLocaleString()} chars loaded` : 'or paste below'}</span>
        </div>
        <AdminField label="Course document" value={md} onChange={setMd} area={8} mono placeholder="# Course title..." />
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-primary" onClick={convert} disabled={busy || md.trim().length < 20} style={{ padding:'9px 20px', fontSize:13, opacity: busy ? .6 : 1 }}>
            {busy ? 'Converting…' : 'Convert with AI'}
          </button>
          {draft && (
            <button className="btn btn-primary" onClick={publish} disabled={busy} style={{ padding:'9px 20px', fontSize:13, background:'#4fd18b' }}>
              Publish "{draft.course.title}"
            </button>
          )}
        </div>
        {draft && (
          <div style={{ marginTop:14, background:'var(--ground)', border:'1px solid rgba(245,239,232,.12)', borderRadius:'var(--r-md)', padding:'14px 16px' }}>
            <div className="eyebrow" style={{ marginBottom:8, fontSize:10 }}>Draft preview</div>
            <div style={{ fontWeight:800, fontSize:15 }}>{draft.course.title} <span className="mono c50" style={{ fontSize:11 }}>· {draft.course.id} · track {draft.specialty.id} · {draft.course.days} days · {draft.course.instructor}</span></div>
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:4 }}>
              {draft.course.lessons.map(l => (
                <div key={l.id} className="c70" style={{ fontSize:12.5 }}>
                  <span className="mono" style={{ color:'var(--accent)' }}>{l.id}</span> {l.title}
                  {l.practice && l.practice.capstone ? <span className="mono" style={{ color:'var(--crimson)', fontSize:10 }}> CAPSTONE</span> : ''}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Prompts ---------------- */
function AdminPrompts(){
  const [prompts, setPrompts] = useState([]);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ name:'', code:'', category:'', difficulty:'3', body:'', tags:'', lessonId:'' });
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const load = () => adminCall('/api/admin/prompts').then(d => setPrompts(d.prompts)).catch(e => setMsg({ kind:'error', text:e.message }));
  useEffect(() => { load(); }, []);

  const create = async () => {
    setMsg(null);
    try {
      await adminCall('/api/admin/prompts', { method:'POST', body: JSON.stringify({
        name: form.name, code: form.code, category: form.category, difficulty: Number(form.difficulty) || 3,
        body: form.body, tags: form.tags, lessonId: form.lessonId.trim() || null,
      })});
      setMsg({ kind:'ok', text: form.lessonId.trim()
        ? `Prompt saved and assigned to ${form.lessonId.trim()}. It now overrides that lesson's practice prompt in the portal.`
        : 'Prompt saved to the library.' });
      setForm({ name:'', code:'', category:'', difficulty:'3', body:'', tags:'', lessonId:'' });
      load();
    } catch (e) { setMsg({ kind:'error', text:e.message }); }
  };

  const toggle = async (p) => { try { await adminCall(`/api/admin/prompts/${p.id}`, { method:'PATCH', body: JSON.stringify({ active: !p.active }) }); load(); } catch (e) { setMsg({ kind:'error', text:e.message }); } };
  const remove = async (p) => { if (!confirm(`Delete prompt "${p.name}"?`)) return; try { await adminCall(`/api/admin/prompts/${p.id}`, { method:'DELETE' }); load(); } catch (e) { setMsg({ kind:'error', text:e.message }); } };

  return (
    <div>
      <AdminMsg kind={msg && msg.kind} text={msg && msg.text} />
      <div className="eyebrow" style={{ marginBottom:12 }}>Create a prompt</div>
      <div className="surface" style={{ padding:'18px 20px', marginBottom:26 }}>
        <div style={{ display:'flex', gap:12 }}>
          <AdminField label="Name" value={form.name} onChange={set('name')} placeholder="LinkedIn Algorithm Mastery" />
          <AdminField label="Code" value={form.code} onChange={set('code')} placeholder="LNKD-E1.1" />
          <AdminField label="Category" value={form.category} onChange={set('category')} placeholder="Strategy" />
          <AdminField label="Difficulty 1-5" value={form.difficulty} onChange={set('difficulty')} placeholder="3" />
        </div>
        <AdminField label="Prompt body" value={form.body} onChange={set('body')} area={6} mono placeholder="You are a..." />
        <div style={{ display:'flex', gap:12 }}>
          <AdminField label="Tags" value={form.tags} onChange={set('tags')} placeholder="#linkedin #b2b" />
          <AdminField label="Assign to lesson id (optional, overrides its prompt)" value={form.lessonId} onChange={set('lessonId')} placeholder="LNKD001L01" />
        </div>
        <button className="btn btn-primary" onClick={create} disabled={!form.name.trim() || !form.body.trim()} style={{ padding:'9px 20px', fontSize:13 }}>Save prompt</button>
      </div>

      <div className="eyebrow" style={{ marginBottom:12 }}>Library · {prompts.length}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {prompts.map(p => (
          <div key={p.id} className="surface" style={{ padding:'12px 16px', display:'flex', gap:12, alignItems:'center', opacity: p.active ? 1 : .5 }}>
            <span style={{ fontWeight:700, fontSize:13.5, flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
            {p.code && <span className="mono c50" style={{ fontSize:10.5, flexShrink:0 }}>{p.code}</span>}
            {p.category && <span className="pill" style={{ background:'rgba(245,239,232,.07)', color:'rgba(245,239,232,.6)', fontSize:9, flexShrink:0 }}>{p.category}</span>}
            {p.lesson_id && <span className="pill" style={{ background:'rgba(242,98,46,.14)', color:'var(--accent)', fontSize:9, flexShrink:0 }}>→ {p.lesson_id}</span>}
            <button onClick={() => toggle(p)} className="mono" style={{ background:'none', border:'1px solid rgba(245,239,232,.2)', color:'rgba(245,239,232,.7)', borderRadius:'var(--r-pill)', padding:'4px 10px', fontSize:10, cursor:'pointer', flexShrink:0 }}>{p.active ? 'DISABLE' : 'ENABLE'}</button>
            <button onClick={() => remove(p)} className="mono" style={{ background:'none', border:'1px solid rgba(209,30,76,.4)', color:'var(--crimson)', borderRadius:'var(--r-pill)', padding:'4px 10px', fontSize:10, cursor:'pointer', flexShrink:0 }}>DELETE</button>
          </div>
        ))}
        {prompts.length === 0 && <div className="c50" style={{ fontSize:13 }}>No prompts yet. The library starts here.</div>}
      </div>
    </div>
  );
}

/* ---------------- Users ---------------- */
function AdminUsers({ me }){
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ email:'', name:'', role:'intern', title:'', track:'' });
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
  const tracks = (window.SPECIALTIES || []).map(s => s.id);

  const load = () => adminCall('/api/admin/users').then(d => setUsers(d.users)).catch(e => setMsg({ kind:'error', text:e.message }));
  useEffect(() => { load(); }, []);

  const create = async () => {
    setMsg(null);
    try {
      const r = await adminCall('/api/admin/users', { method:'POST', body: JSON.stringify({
        email: form.email, name: form.name, role: form.role, title: form.title, track: form.track.trim() || null,
      })});
      setMsg({ kind:'ok', text:`Created ${form.email}. Share the default password ${r.defaultPassword}; they set their own on first sign in.` });
      setForm({ email:'', name:'', role:'intern', title:'', track:'' });
      load();
    } catch (e) { setMsg({ kind:'error', text:e.message }); }
  };

  const patch = async (email, body, okText) => {
    setMsg(null);
    try { await adminCall(`/api/admin/users/${encodeURIComponent(email)}`, { method:'PATCH', body: JSON.stringify(body) }); if (okText) setMsg({ kind:'ok', text: okText }); load(); }
    catch (e) { setMsg({ kind:'error', text:e.message }); }
  };
  const resetPw = async (email) => {
    if (!confirm(`Reset ${email} to the default password and sign them out everywhere?`)) return;
    try { const r = await adminCall(`/api/admin/users/${encodeURIComponent(email)}/reset-password`, { method:'POST' }); setMsg({ kind:'ok', text:`${email} reset. Default password: ${r.defaultPassword}` }); load(); }
    catch (e) { setMsg({ kind:'error', text:e.message }); }
  };
  const remove = async (email) => {
    if (!confirm(`Delete ${email}? Their learning history stays in the database, the account goes away.`)) return;
    try { await adminCall(`/api/admin/users/${encodeURIComponent(email)}`, { method:'DELETE' }); load(); }
    catch (e) { setMsg({ kind:'error', text:e.message }); }
  };

  const selStyle = { background:'var(--ground)', color:'var(--cream)', border:'1px solid rgba(245,239,232,.14)', borderRadius:6, padding:'4px 6px', fontSize:11, fontFamily:'var(--mono)' };

  return (
    <div>
      <AdminMsg kind={msg && msg.kind} text={msg && msg.text} />
      <div className="eyebrow" style={{ marginBottom:12 }}>Add a user</div>
      <div className="surface" style={{ padding:'18px 20px', marginBottom:26 }}>
        <div style={{ display:'flex', gap:12 }}>
          <AdminField label="Email" value={form.email} onChange={set('email')} placeholder="name@myinstaspace.com" />
          <AdminField label="Full name" value={form.name} onChange={set('name')} placeholder="Full Name" />
          <AdminField label="Title" value={form.title} onChange={set('title')} placeholder="LinkedIn Marketing Specialist" />
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'flex-end' }}>
          <label style={{ display:'block', marginBottom:12 }}>
            <span className="eyebrow" style={{ display:'block', marginBottom:6, fontSize:10 }}>Role</span>
            <select value={form.role} onChange={e => set('role')(e.target.value)} style={{ ...selStyle, padding:'9px 10px', fontSize:13 }}>
              <option value="intern">intern</option><option value="leadership">leadership</option><option value="admin">admin</option>
            </select>
          </label>
          <label style={{ display:'block', marginBottom:12 }}>
            <span className="eyebrow" style={{ display:'block', marginBottom:6, fontSize:10 }}>Track (interns)</span>
            <select value={form.track} onChange={e => set('track')(e.target.value)} style={{ ...selStyle, padding:'9px 10px', fontSize:13 }}>
              <option value="">none</option>
              {tracks.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <button className="btn btn-primary" onClick={create} disabled={!form.email.trim() || !form.name.trim()} style={{ padding:'9px 20px', fontSize:13, marginBottom:12 }}>Create user</button>
        </div>
      </div>

      <div className="eyebrow" style={{ marginBottom:12 }}>All users · {users.length}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {users.map(u => (
          <div key={u.email} className="surface" style={{ padding:'11px 16px', display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ flex:1, minWidth:0 }}>
              <span style={{ fontWeight:700, fontSize:13.5 }}>{u.name}</span>
              <span className="mono c50" style={{ fontSize:11, marginLeft:8 }}>{u.email}</span>
            </div>
            <select value={u.role} onChange={e => patch(u.email, { role: e.target.value }, `${u.email} is now ${e.target.value}.`)} style={selStyle} disabled={u.email === me.email}>
              <option value="intern">intern</option><option value="leadership">leadership</option><option value="admin">admin</option>
            </select>
            <select value={u.track || ''} onChange={e => patch(u.email, { track: e.target.value || null })} style={selStyle}>
              <option value="">no track</option>
              {tracks.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {!!u.must_change_password && <span className="pill" style={{ background:'rgba(245,239,232,.06)', color:'rgba(245,239,232,.5)', fontSize:8 }}>DEFAULT PW</span>}
            <button onClick={() => resetPw(u.email)} className="mono" style={{ background:'none', border:'1px solid rgba(245,239,232,.2)', color:'rgba(245,239,232,.7)', borderRadius:'var(--r-pill)', padding:'4px 10px', fontSize:10, cursor:'pointer' }}>RESET PW</button>
            <button onClick={() => remove(u.email)} disabled={u.email === me.email} className="mono" style={{ background:'none', border:'1px solid rgba(209,30,76,.4)', color:'var(--crimson)', borderRadius:'var(--r-pill)', padding:'4px 10px', fontSize:10, cursor:'pointer', opacity: u.email === me.email ? .3 : 1 }}>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Export ---------------- */
function AdminExport(){
  const [msg, setMsg] = useState(null);
  const kinds = [
    ['users', 'All accounts with roles and tracks'],
    ['submissions', 'Every graded submission with feedback'],
    ['progress', 'Lesson completions per student'],
    ['time', 'Learn sessions with measured active time'],
    ['ratings', 'Monthly KPI ratings by leader'],
  ];
  const download = async (what) => {
    setMsg(null);
    try {
      const res = await window.authFetch(`/api/admin/export/${what}`);
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `Failed (${res.status})`); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${what}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) { setMsg({ kind:'error', text:e.message }); }
  };
  return (
    <div>
      <AdminMsg kind={msg && msg.kind} text={msg && msg.text} />
      <div className="eyebrow" style={{ marginBottom:12 }}>Download CSV exports</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {kinds.map(([k, desc]) => (
          <div key={k} className="surface" style={{ padding:'13px 18px', display:'flex', gap:14, alignItems:'center' }}>
            <span className="mono" style={{ fontSize:12, color:'var(--accent)', width:110, flexShrink:0 }}>{k}.csv</span>
            <span className="c70" style={{ fontSize:13, flex:1 }}>{desc}</span>
            <button className="btn btn-primary" onClick={() => download(k)} style={{ padding:'7px 16px', fontSize:12 }}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Audit ---------------- */
function AdminAudit(){
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { adminCall('/api/admin/audit').then(d => setRows(d.audit)).catch(e => setError(e.message)); }, []);
  if (error) return <AdminMsg kind="error" text={error} />;
  if (!rows) return <div className="c50" style={{ fontSize:14 }}>Loading…</div>;
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom:12 }}>Every admin action, most recent first · {rows.length}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {rows.length === 0 && <div className="c50" style={{ fontSize:13 }}>Nothing logged yet.</div>}
        {rows.map(r => (
          <div key={r.id} className="surface" style={{ padding:'9px 14px', display:'flex', gap:12, alignItems:'center', background:'var(--aubergine-deep)' }}>
            <span className="mono" style={{ fontSize:10.5, color:'var(--accent)', width:150, flexShrink:0 }}>{r.action}</span>
            <span className="c70" style={{ fontSize:12.5, flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.detail}</span>
            <span className="mono c35" style={{ fontSize:10, flexShrink:0 }}>{String(r.admin_email).split('@')[0]} · {fmtWhen(r.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Shell ---------------- */
function AdminPanel({ user, onLogout }){
  const [tab, setTab] = useState('dashboard');
  return (
    <div className="scroll" style={{ height:'100%', width:'100%', background:'var(--ground)', position:'relative' }}>
      <div className="grid-surface" style={{ position:'absolute', inset:0, height:300, pointerEvents:'none' }} />
      <div style={{ position:'relative', maxWidth:1060, margin:'0 auto', padding:'36px 40px 60px' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:12 }}>
            <Wordmark size={22} />
            <span className="eyebrow" style={{ color:'var(--accent)' }}>Admin</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span className="mono c50" style={{ fontSize:11 }}>{user.email}</span>
            <button onClick={onLogout} className="btn btn-ghost" style={{ padding:'8px 15px', fontSize:12 }}>Sign out</button>
          </div>
        </div>

        <h1 className="reveal" style={{ fontWeight:900, fontSize:32, letterSpacing:'-0.03em', margin:'22px 0 4px' }}>Portal control room</h1>
        <p className="c70 reveal" style={{ fontSize:14.5, fontWeight:500, margin:'0 0 22px' }}>
          Courses, prompts, people, and the numbers. Every action here is audit logged.
        </p>

        <div className="reveal" style={{ display:'flex', gap:6, marginBottom:26, borderBottom:'1px solid rgba(245,239,232,.1)', paddingBottom:0 }}>
          {ADMIN_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background:'none', border:'none', cursor:'pointer', padding:'10px 16px', fontFamily:'var(--sans)',
              fontWeight:700, fontSize:13.5, color: tab === t.id ? 'var(--cream)' : 'rgba(245,239,232,.5)',
              borderBottom:`2px solid ${tab === t.id ? 'var(--accent)' : 'transparent'}`, marginBottom:-1,
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'dashboard' && <AdminDashboard key="d" />}
        {tab === 'courses' && <AdminCourses key="c" />}
        {tab === 'prompts' && <AdminPrompts key="p" />}
        {tab === 'users' && <AdminUsers key="u" me={user} />}
        {tab === 'export' && <AdminExport key="e" />}
        {tab === 'audit' && <AdminAudit key="a" />}
      </div>
    </div>
  );
}

window.AdminPanel = AdminPanel;
