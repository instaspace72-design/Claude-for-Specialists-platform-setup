/* Reward Certificate — shown when an intern finishes a course.
   Full screen modal, printable single page, personalised to the learner. */

function formatCertDate(d){
  d = d || new Date();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function certificateId(name, courseId){
  const seed = String(name || '') + '|' + String(courseId || '');
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const suffix = (h.toString(36).toUpperCase() + '00000').slice(0, 6);
  return `IS-${new Date().getFullYear()}-${suffix}`;
}

/* Print CSS is injected once so window.print() prints the certificate cleanly. */
function usePrintStyles(){
  useEffect(() => {
    if (document.getElementById('cert-print-styles')) return;
    const el = document.createElement('style');
    el.id = 'cert-print-styles';
    el.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        #cert-print, #cert-print * { visibility: visible !important; }
        #cert-print { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
        .cert-hide-on-print { display: none !important; }
        @page { size: A4 landscape; margin: 0; }
      }
    `;
    document.head.appendChild(el);
  }, []);
}

function CertificateSeal({ size = 108 }){
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background:'var(--accent-grad)',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:'0 20px 40px -18px rgba(242,98,46,.55), inset 0 0 0 4px rgba(245,239,232,.12)',
      position:'relative',
    }}>
      <div style={{
        position:'absolute', inset:6, borderRadius:'50%',
        border:'1.5px dashed rgba(42,18,64,.35)',
      }} />
      <div style={{ textAlign:'center', color:'var(--aubergine)', fontFamily:'var(--sans)', fontWeight:900, lineHeight:1 }}>
        <div style={{ fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.18em', opacity:.75 }}>INSTA</div>
        <div style={{ fontSize:26, letterSpacing:'-0.02em', margin:'2px 0' }}>SPACE</div>
        <div style={{ fontFamily:'var(--mono)', fontSize:8, letterSpacing:'.18em', opacity:.75 }}>ACADEMY</div>
      </div>
    </div>
  );
}

function Certificate({ user, course, onClose }){
  usePrintStyles();
  const name = String((user && user.name) || 'Learner').trim();
  const first = (user && user.firstName) || name.split(/\s+/)[0] || 'Learner';
  const courseTitle = (course && course.title) || 'InstaSpace Course';
  const badge = (course && course.lessons && course.lessons.find(l => l.practice && l.practice.reward)?.practice.reward.badge) || 'Specialist';
  const dateStr = formatCertDate(new Date());
  const certId = certificateId(name, course && course.id);

  const print = () => { try { window.print(); } catch (e) { /* ignore */ } };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:80,
      background:'rgba(18,8,34,.86)', backdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'32px',
      overflowY:'auto',
      animation:'fadein .35s var(--ease) both',
    }}>
      {/* Close button (top right) — hidden on print */}
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

      {/* Confetti burst (decorative, motion aware) */}
      <div className="cert-hide-on-print" aria-hidden="true" style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        {Array.from({ length: 24 }).map((_, i) => {
          const left = (i * 4.1 + (i % 3) * 7) % 100;
          const delay = (i % 8) * 0.12;
          const size = 6 + (i % 4) * 3;
          const bg = i % 3 === 0 ? 'var(--accent)' : (i % 3 === 1 ? 'var(--crimson)' : 'var(--cream)');
          return (
            <span key={i} style={{
              position:'absolute', top:-20, left:`${left}%`,
              width:size, height:size, borderRadius: i % 2 ? '2px' : '50%',
              background:bg, opacity:.85,
              animation:`confettiFall calc(2.4s * var(--mo,1)) var(--ease) ${delay}s both`,
            }} />
          );
        })}
      </div>

      {/* Certificate card */}
      <div id="cert-print" style={{
        position:'relative', width:'min(960px, 100%)',
        background:'var(--cream)', color:'var(--aubergine)',
        borderRadius:'22px',
        boxShadow:'0 40px 90px -30px rgba(0,0,0,.7)',
        overflow:'hidden',
        animation:'spinIn .55s var(--ease) both',
      }}>
        {/* Aubergine top band */}
        <div style={{
          background:'var(--aubergine)', color:'var(--cream)',
          padding:'22px 44px', display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <Wordmark size={22} />
          <span className="mono" style={{ fontSize:11, letterSpacing:'.18em', opacity:.7 }}>ACADEMY · CERTIFICATE OF COMPLETION</span>
        </div>

        {/* Inner frame */}
        <div style={{
          margin:'20px', padding:'40px 48px 46px',
          border:'1.5px solid rgba(42,18,64,.18)', borderRadius:'14px',
          position:'relative',
        }}>
          {/* Decorative corner ticks */}
          {[[8,8],[8,'auto',8,'auto'],['auto',8,8],['auto','auto',8,8]].map((c,i) => (
            <span key={i} aria-hidden="true" style={{
              position:'absolute', top:c[0], right:c[1], bottom:c[2], left:c[3],
              width:22, height:22, borderTop:'2px solid var(--accent)',
              borderLeft: i === 0 ? '2px solid var(--accent)' : 'none',
              borderRight: i === 1 ? '2px solid var(--accent)' : 'none',
              transform: i === 2 ? 'rotate(-90deg)' : (i === 3 ? 'rotate(180deg)' : 'none'),
            }} />
          ))}

          <div style={{ textAlign:'center' }}>
            <div className="mono" style={{ fontSize:11, letterSpacing:'.28em', color:'var(--crimson)', marginBottom:8 }}>PRESENTED TO</div>
            <div style={{
              fontFamily:'var(--sans)', fontWeight:900, fontSize:56, letterSpacing:'-0.02em',
              lineHeight:1.05, margin:'8px 0 6px',
            }}>{name}</div>
            <div className="mono" style={{ fontSize:11, letterSpacing:'.22em', color:'rgba(42,18,64,.55)' }}>
              INSTASPACE SPECIALIST · COHORT {new Date().getFullYear()}
            </div>

            <div style={{
              margin:'26px auto 22px', width:120, height:2,
              background:'linear-gradient(90deg, transparent, var(--accent), transparent)',
            }} />

            <p style={{
              fontFamily:'var(--sans)', fontSize:16, fontWeight:500, lineHeight:1.55,
              maxWidth:640, margin:'0 auto', color:'rgba(42,18,64,.82)',
            }}>
              For successfully completing every lesson and hands on exercise of
            </p>
            <div style={{
              fontWeight:800, fontSize:22, letterSpacing:'-0.01em',
              margin:'10px auto 4px', maxWidth:640,
              fontStyle:'italic', color:'var(--aubergine)',
            }}>
              {courseTitle}
            </div>
            <p style={{
              fontFamily:'var(--sans)', fontSize:14, fontWeight:500, lineHeight:1.6,
              maxWidth:620, margin:'14px auto 0', color:'rgba(42,18,64,.7)',
            }}>
              {first}, you showed up every day, ran every prompt, and shipped work leadership can actually use.
              This is only the start. Keep going, keep asking sharp questions, and keep building things worth trusting.
            </p>

            {/* Seal + meta row */}
            <div style={{
              display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:24,
              alignItems:'center', marginTop:34,
            }}>
              <div style={{ textAlign:'left' }}>
                <div className="mono" style={{ fontSize:10, letterSpacing:'.22em', color:'rgba(42,18,64,.5)' }}>AWARDED</div>
                <div style={{ fontWeight:800, fontSize:16, marginTop:4 }}>{dateStr}</div>
                <div className="mono" style={{ fontSize:11, letterSpacing:'.16em', color:'rgba(42,18,64,.55)', marginTop:10 }}>
                  BADGE EARNED
                </div>
                <div style={{ fontWeight:700, fontSize:15, marginTop:2, color:'var(--crimson)' }}>{badge}</div>
              </div>

              <CertificateSeal size={112} />

              <div style={{ textAlign:'right' }}>
                <div className="mono" style={{ fontSize:10, letterSpacing:'.22em', color:'rgba(42,18,64,.5)' }}>CERTIFICATE ID</div>
                <div className="mono" style={{ fontWeight:700, fontSize:14, marginTop:4, letterSpacing:'.08em' }}>{certId}</div>
                <div style={{ marginTop:12, borderTop:'1.5px solid var(--aubergine)', paddingTop:6, display:'inline-block', minWidth:180 }}>
                  <div style={{ fontStyle:'italic', fontWeight:700, fontSize:15 }}>Talha Asif</div>
                  <div className="mono" style={{ fontSize:10, letterSpacing:'.14em', color:'rgba(42,18,64,.55)' }}>CPO · INSTASPACE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action row (screen only) */}
        <div className="cert-hide-on-print" style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          gap:14, padding:'16px 32px 22px',
        }}>
          <div className="mono" style={{ fontSize:11, letterSpacing:'.14em', color:'rgba(42,18,64,.55)' }}>
            Print or save as PDF for your portfolio.
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button
              onClick={onClose}
              style={{
                background:'transparent', color:'var(--aubergine)',
                border:'1.5px solid rgba(42,18,64,.25)', borderRadius:'var(--r-pill)',
                padding:'11px 20px', fontSize:14, fontWeight:700, cursor:'pointer',
              }}
            >Back to portal</button>
            <button
              onClick={print}
              style={{
                background:'var(--aubergine)', color:'var(--cream)',
                border:'none', borderRadius:'var(--r-pill)',
                padding:'11px 22px', fontSize:14, fontWeight:800, cursor:'pointer',
                boxShadow:'0 12px 26px -12px rgba(42,18,64,.6)',
              }}
            >Print / Save PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Certificate = Certificate;
