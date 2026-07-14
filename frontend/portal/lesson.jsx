/* Course overview (lessons list) + Lesson view (concepts + animated slides) */

/* Split a "Heading: detail" key concept into a headline and body. */
function splitConcept(k){
  const s = String(k || '');
  const idx = s.indexOf(': ');
  if (idx > 0 && idx < 64) return { head: s.slice(0, idx), body: s.slice(idx + 2) };
  return { head: '', body: s };
}

/* ===========================================================================
   Animated infographic library. Each scene is a looping SVG that TEACHES the
   lesson's core idea visually, not decoration. Scenes are assigned per lesson
   in ART_BY_LESSON below; unknown lessons fall back to a track variant.
=========================================================================== */
const CREAM_FADE = 'rgba(245,239,232,.28)';
const CREAM_SOFT = 'rgba(245,239,232,.16)';

function SlideArt({ variant }){
  const A = 'var(--accent)';
  const B = 'var(--accent-2)';
  const box = { maxWidth: 230, width: '100%' };

  /* leads pour into a funnel, only the scored ones exit bright */
  if (variant === 'funnel') return (
    <svg viewBox="0 0 180 160" style={box}>
      <path d="M30 30 L150 30 L108 88 L108 126 L72 126 L72 88 Z" fill="none" stroke={CREAM_FADE} strokeWidth="2"/>
      {[0,1,2,3].map(i=>(
        <circle key={i} r="5" fill={i===1?A:i===3?B:'rgba(245,239,232,.45)'}>
          <animateMotion dur="2.8s" begin={`${i*0.7}s`} repeatCount="indefinite"
            path={`M${44+i*28} 18 L${44+i*28} 34 L90 92 L90 140`}/>
          <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" begin={`${i*0.7}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      <rect x="66" y="132" width="48" height="14" rx="7" fill={A} opacity="0.9">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
      </rect>
      <text x="90" y="142" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fontWeight="700" fill="var(--aubergine)">SCORED</text>
    </svg>
  );

  /* a coin travels guest -> escrow shield -> host wallet */
  if (variant === 'moneyflow') return (
    <svg viewBox="0 0 180 160" style={box}>
      <circle cx="28" cy="80" r="14" fill="var(--aubergine-lift)" stroke={CREAM_FADE} strokeWidth="1.5"/>
      <text x="28" y="84" textAnchor="middle" fontSize="10" fontFamily="var(--mono)" fill="rgba(245,239,232,.7)">G</text>
      <path d="M90 52 l16 7 v14 c0 12 -8 19 -16 23 c-8 -4 -16 -11 -16 -23 v-14 Z" fill="var(--aubergine-lift)" stroke={A} strokeWidth="2">
        <animate attributeName="stroke-width" values="2;3;2" dur="2.4s" repeatCount="indefinite"/>
      </path>
      <path d="M84 76 l4.5 4.5 l8 -9" fill="none" stroke={A} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="138" y="66" width="28" height="22" rx="5" fill="var(--aubergine-lift)" stroke={CREAM_FADE} strokeWidth="1.5"/>
      <rect x="152" y="73" width="10" height="8" rx="2" fill={B}/>
      <line x1="44" y1="80" x2="70" y2="80" stroke={CREAM_FADE} strokeWidth="1.5" strokeDasharray="3 4"/>
      <line x1="110" y1="80" x2="136" y2="80" stroke={CREAM_FADE} strokeWidth="1.5" strokeDasharray="3 4"/>
      <circle r="6" fill={A}>
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M46 80 L90 80 L90 80 L134 80"/>
        <animate attributeName="opacity" values="0;1;1;1;0" dur="3.2s" repeatCount="indefinite"/>
      </circle>
      <text x="90" y="150" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="rgba(245,239,232,.5)" letterSpacing="2">GUEST · ESCROW · HOST</text>
    </svg>
  );

  /* four audience quadrants pulse in turn */
  if (variant === 'audiences') return (
    <svg viewBox="0 0 180 160" style={box}>
      {[['G',30,40],['H',122,40],['PM',30,104],['A',122,104]].map((q,i)=>(
        <g key={i}>
          <rect x={q[1]} y={q[2]-24} width="52" height="46" rx="9" fill="var(--aubergine-lift)" stroke={CREAM_SOFT} strokeWidth="1.5">
            <animate attributeName="stroke" values={`${CREAM_SOFT};var(--accent);${CREAM_SOFT}`} dur="4.8s" begin={`${i*1.2}s`} repeatCount="indefinite"/>
          </rect>
          <circle cx={q[1]+26} cy={q[2]-8} r="6" fill={CREAM_FADE}>
            <animate attributeName="fill" values={`${CREAM_FADE};var(--accent);${CREAM_FADE}`} dur="4.8s" begin={`${i*1.2}s`} repeatCount="indefinite"/>
          </circle>
          <text x={q[1]+26} y={q[2]+14} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="rgba(245,239,232,.6)">{q[0]}</text>
        </g>
      ))}
      <circle cx="90" cy="80" r="10" fill={A}/>
      <text x="90" y="84" textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fontWeight="700" fill="var(--aubergine)">iS</text>
    </svg>
  );

  /* architecture layers stack up, then a request dot rides through them */
  if (variant === 'stack') return (
    <svg viewBox="0 0 180 160" style={box}>
      {[['UI · 8000',36],['API · 3001',68],['SQLITE',100]].map((l,i)=>(
        <g key={i}>
          <rect x="40" y={l[1]} width="100" height="24" rx="6" fill="var(--aubergine-lift)" stroke={CREAM_SOFT} strokeWidth="1.5" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin={`${i*0.35}s`} fill="freeze"/>
          </rect>
          <text x="90" y={l[1]+15} textAnchor="middle" fontFamily="var(--mono)" fontSize="8.5" fill="rgba(245,239,232,.65)" letterSpacing="1.5" opacity="0">{l[0]}
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin={`${i*0.35}s`} fill="freeze"/>
          </text>
        </g>
      ))}
      <circle r="4.5" fill={A}>
        <animateMotion dur="2.6s" begin="1.4s" repeatCount="indefinite" path="M90 26 L90 128 L90 26"/>
      </circle>
    </svg>
  );

  /* a magnifier sweeps a grid and catches the one red cell */
  if (variant === 'bug') return (
    <svg viewBox="0 0 180 160" style={box}>
      {Array.from({length:12}).map((_,i)=>{
        const x = 34 + (i%4)*30, y = 40 + Math.floor(i/4)*28;
        const isBug = i === 6;
        return (
          <rect key={i} x={x} y={y} width="22" height="20" rx="4"
            fill={isBug ? 'rgba(209,30,76,.5)' : 'var(--aubergine-lift)'} stroke={CREAM_SOFT} strokeWidth="1">
            {isBug && <animate attributeName="fill" values="rgba(209,30,76,.35);rgba(209,30,76,.8);rgba(209,30,76,.35)" dur="1.6s" repeatCount="indefinite"/>}
          </rect>
        );
      })}
      <g>
        <animateMotion dur="4s" repeatCount="indefinite" path="M46 50 L136 50 L75 96 L46 50"/>
        <circle r="15" fill="none" stroke={A} strokeWidth="2.5"/>
        <line x1="11" y1="11" x2="21" y2="21" stroke={A} strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  );

  /* three gates on a path open in sequence, the dot only passes open ones */
  if (variant === 'gates') return (
    <svg viewBox="0 0 180 160" style={box}>
      <line x1="16" y1="80" x2="164" y2="80" stroke={CREAM_SOFT} strokeWidth="2"/>
      {[52,96,140].map((x,i)=>(
        <g key={i}>
          <line x1={x} y1="56" x2={x} y2="104" stroke={CREAM_FADE} strokeWidth="2.5">
            <animate attributeName="y2" values="104;60;104" keyTimes="0;0.4;1" dur="5s" begin={`${i*1.1}s`} repeatCount="indefinite"/>
            <animate attributeName="stroke" values={`${CREAM_FADE};var(--accent);${CREAM_FADE}`} keyTimes="0;0.4;1" dur="5s" begin={`${i*1.1}s`} repeatCount="indefinite"/>
          </line>
          <text x={x} y="122" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="rgba(245,239,232,.5)">G{i+1}</text>
        </g>
      ))}
      <circle r="6" fill={A}>
        <animateMotion dur="5s" repeatCount="indefinite" keyPoints="0;0.28;0.28;0.6;0.6;1" keyTimes="0;0.2;0.35;0.55;0.7;1" path="M20 80 L48 80 L48 80 L92 80 L92 80 L160 80"/>
      </circle>
    </svg>
  );

  /* message house: roof settles onto three pillars that rise with proof dots */
  if (variant === 'house') return (
    <svg viewBox="0 0 180 160" style={box}>
      {[48,84,120].map((x,i)=>(
        <g key={i}>
          <rect x={x} width="14" rx="3" fill="var(--aubergine-lift)" stroke={CREAM_SOFT} strokeWidth="1.2">
            <animate attributeName="y" values="118;66" dur="0.5s" begin={`${i*0.25}s`} fill="freeze"/>
            <animate attributeName="height" values="0;52" dur="0.5s" begin={`${i*0.25}s`} fill="freeze"/>
          </rect>
          <circle cx={x+7} cy="126" r="3.5" fill={A} opacity="0">
            <animate attributeName="opacity" values="0;1" dur="0.3s" begin={`${1.1+i*0.15}s`} fill="freeze"/>
          </circle>
        </g>
      ))}
      <path d="M36 62 L90 34 L146 62" fill="none" stroke={A} strokeWidth="3" strokeLinecap="round" opacity="0">
        <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.9s" fill="freeze"/>
        <animateTransform attributeName="transform" type="translate" values="0 -14; 0 0" dur="0.5s" begin="0.9s" fill="freeze"/>
      </path>
      <line x1="36" y1="130" x2="146" y2="130" stroke={CREAM_FADE} strokeWidth="2"/>
    </svg>
  );

  /* a spiky loud line is redrawn as a calm flat one */
  if (variant === 'voice') return (
    <svg viewBox="0 0 180 160" style={box}>
      <path d="M20 60 L32 30 L44 82 L56 24 L68 76 L80 36 L92 66 L104 30 L116 72 L128 40 L140 60 L160 52"
        fill="none" stroke="rgba(209,30,76,.55)" strokeWidth="2">
        <animate attributeName="opacity" values="1;1;0.15;0.15;1" keyTimes="0;0.35;0.5;0.85;1" dur="6s" repeatCount="indefinite"/>
      </path>
      <path d="M20 108 C55 100 70 112 90 106 C115 99 140 108 160 104" fill="none" stroke={A} strokeWidth="2.8" strokeLinecap="round"
        strokeDasharray="220" strokeDashoffset="220">
        <animate attributeName="stroke-dashoffset" values="220;220;0;0;220" keyTimes="0;0.35;0.6;0.9;1" dur="6s" repeatCount="indefinite"/>
      </path>
      <text x="24" y="48" fontFamily="var(--mono)" fontSize="9" fill="rgba(209,30,76,.7)">LOUD</text>
      <text x="24" y="128" fontFamily="var(--mono)" fontSize="9" fill={A}>CERTAIN</text>
    </svg>
  );

  /* envelopes launch along a timeline, the fourth one glows (the ask) */
  if (variant === 'emails') return (
    <svg viewBox="0 0 180 160" style={box}>
      <line x1="20" y1="118" x2="160" y2="118" stroke={CREAM_SOFT} strokeWidth="2"/>
      {[0,1,2,3,4].map(i=>{
        const x = 28 + i*28;
        const hot = i === 3;
        return (
          <g key={i}>
            <circle cx={x} cy="118" r="3" fill={CREAM_FADE}/>
            <g opacity="0">
              <animate attributeName="opacity" values="0;1" dur="0.4s" begin={`${i*0.5}s`} fill="freeze"/>
              <animateTransform attributeName="transform" type="translate" values={`${x-14} 96; ${x-14} ${hot?52:66}`} dur="0.5s" begin={`${i*0.5}s`} fill="freeze"/>
              <rect width="28" height="20" rx="4" fill={hot?A:'var(--aubergine-lift)'} stroke={hot?A:CREAM_FADE} strokeWidth="1.5"/>
              <path d="M2 4 L14 13 L26 4" fill="none" stroke={hot?'var(--aubergine)':CREAM_FADE} strokeWidth="1.5"/>
            </g>
            <text x={x} y="136" textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fill="rgba(245,239,232,.45)">D{[0,3,6,10,14][i]}</text>
          </g>
        );
      })}
    </svg>
  );

  /* a needle sweeps a gauge, the target zone glows */
  if (variant === 'gauge') return (
    <svg viewBox="0 0 180 160" style={box}>
      <path d="M30 120 A62 62 0 0 1 150 120" fill="none" stroke={CREAM_SOFT} strokeWidth="10" strokeLinecap="round"/>
      <path d="M113 66 A62 62 0 0 1 150 120" fill="none" stroke={A} strokeWidth="10" strokeLinecap="round" opacity="0.85">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite"/>
      </path>
      <line x1="90" y1="118" x2="90" y2="66" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round" transform="rotate(-52 90 118)">
        <animateTransform attributeName="transform" type="rotate" values="-52 90 118; 44 90 118; 20 90 118; 44 90 118" keyTimes="0;0.5;0.75;1" dur="4.5s" repeatCount="indefinite"/>
      </line>
      <circle cx="90" cy="118" r="7" fill={A}/>
      <text x="90" y="146" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="rgba(245,239,232,.5)" letterSpacing="2">MEASURE · ITERATE</text>
    </svg>
  );

  /* trigger -> condition -> action nodes light in order */
  if (variant === 'flow') return (
    <svg viewBox="0 0 180 160" style={box}>
      {[['⚡',30,'TRIGGER'],['?',90,'IF'],['✉',150,'ACT']].map((n,i)=>(
        <g key={i}>
          <circle cx={n[1]} cy="72" r="17" fill="var(--aubergine-lift)" stroke={CREAM_SOFT} strokeWidth="1.5">
            <animate attributeName="stroke" values={`${CREAM_SOFT};var(--accent);var(--accent);${CREAM_SOFT}`} keyTimes={`0;${0.15+i*0.22};${0.45+i*0.18};1`} dur="3.6s" repeatCount="indefinite"/>
          </circle>
          <text x={n[1]} y="77" textAnchor="middle" fontSize="13" fill="var(--cream)">{n[0]}</text>
          <text x={n[1]} y="104" textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fill="rgba(245,239,232,.5)">{n[2]}</text>
        </g>
      ))}
      {[52,112].map((x,i)=>(
        <line key={i} x1={x} y1="72" x2={x+16} y2="72" stroke={CREAM_FADE} strokeWidth="2" strokeDasharray="3 4">
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="1s" repeatCount="indefinite"/>
        </line>
      ))}
      <circle r="4" fill={A}>
        <animateMotion dur="3.6s" repeatCount="indefinite" path="M30 72 L90 72 L150 72"/>
      </circle>
    </svg>
  );

  /* ranked result bars rise under a magnifier, number one glows */
  if (variant === 'search') return (
    <svg viewBox="0 0 180 160" style={box}>
      <rect x="26" y="26" width="128" height="16" rx="8" fill="var(--aubergine-lift)" stroke={CREAM_SOFT} strokeWidth="1.5"/>
      <circle cx="38" cy="34" r="4" fill="none" stroke={CREAM_FADE} strokeWidth="1.5"/>
      {[0,1,2].map(i=>(
        <g key={i}>
          <rect x="26" y={56+i*26} height="16" rx="4" fill={i===0?A:'var(--aubergine-lift)'} stroke={i===0?A:CREAM_SOFT} strokeWidth="1" width="0">
            <animate attributeName="width" values={`0;${118-i*26}`} dur="0.6s" begin={`${0.3+i*0.25}s`} fill="freeze"/>
          </rect>
          <text x="20" y={68+i*26} textAnchor="end" fontFamily="var(--mono)" fontSize="9" fill={i===0?A:'rgba(245,239,232,.45)'}>{i+1}</text>
        </g>
      ))}
    </svg>
  );

  /* film frames slide past, each with a different scene sketch */
  if (variant === 'storyboard') return (
    <svg viewBox="0 0 180 160" style={box}>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; -136 0" dur="6s" repeatCount="indefinite"/>
        {[0,1,2,3,4].map(i=>(
          <g key={i} transform={`translate(${24+i*68} 0)`}>
            <rect x="0" y="52" width="56" height="44" rx="6" fill="var(--aubergine-lift)" stroke={CREAM_FADE} strokeWidth="1.5"/>
            {i%3===0 && <circle cx="28" cy="70" r="8" fill={A} opacity="0.8"/>}
            {i%3===1 && <rect x="12" y="64" width="32" height="5" rx="2.5" fill={A} opacity="0.8"/>}
            {i%3===2 && <path d="M12 84 L24 66 L34 76 L44 62" fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round"/>}
            <rect x="10" y="102" width="36" height="4" rx="2" fill={CREAM_SOFT}/>
          </g>
        ))}
      </g>
      <text x="90" y="34" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="rgba(245,239,232,.5)" letterSpacing="2">HOOK · BUILD · CLOSE</text>
    </svg>
  );

  /* a 14 day calendar grid lights day by day, two days stay hot */
  if (variant === 'calendar') return (
    <svg viewBox="0 0 180 160" style={box}>
      {Array.from({length:14}).map((_,i)=>{
        const x = 26 + (i%7)*19, y = 52 + Math.floor(i/7)*30;
        const hot = i===3 || i===10;
        return (
          <rect key={i} x={x} y={y} width="15" height="22" rx="4" fill={hot?A:'var(--aubergine-lift)'} stroke={CREAM_SOFT} strokeWidth="1" opacity={hot?1:0.4}>
            <animate attributeName="opacity" values={hot?'1':'0.35;1;0.35'} dur={hot?'1s':'4.2s'} begin={`${(i%7)*0.3}s`} repeatCount="indefinite"/>
          </rect>
        );
      })}
      <text x="90" y="38" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="rgba(245,239,232,.5)" letterSpacing="2">14 DAYS · ONE DRUMBEAT</text>
    </svg>
  );

  /* a document rebuilds: crossed out lines fall away, clean lines type in */
  if (variant === 'rewrite') return (
    <svg viewBox="0 0 180 160" style={box}>
      <rect x="40" y="24" width="100" height="116" rx="8" fill="var(--aubergine-lift)" stroke={CREAM_SOFT} strokeWidth="1.5"/>
      {[0,1].map(i=>(
        <g key={i}>
          <rect x="52" y={40+i*16} width={76-i*18} height="6" rx="3" fill="rgba(209,30,76,.45)">
            <animate attributeName="opacity" values="1;1;0.12;0.12;1" keyTimes="0;0.3;0.45;0.9;1" dur="5s" repeatCount="indefinite"/>
          </rect>
          <line x1="50" y1={43+i*16} x2={130-i*18} y2={43+i*16} stroke="var(--crimson)" strokeWidth="1.5">
            <animate attributeName="opacity" values="0;1;0.12;0.12;0" keyTimes="0;0.3;0.45;0.9;1" dur="5s" repeatCount="indefinite"/>
          </line>
        </g>
      ))}
      {[0,1,2].map(i=>(
        <rect key={i} x="52" y={84+i*14} height="6" rx="3" fill={A} width="0">
          <animate attributeName="width" values={`0;0;${72-i*14};${72-i*14};0`} keyTimes="0;0.45;0.62;0.92;1" dur="5s" begin={`${i*0.12}s`} repeatCount="indefinite"/>
        </rect>
      ))}
    </svg>
  );

  /* a shield stamps onto a document and a verified badge pops */
  if (variant === 'shield') return (
    <svg viewBox="0 0 180 160" style={box}>
      <rect x="46" y="30" width="88" height="104" rx="8" fill="var(--aubergine-lift)" stroke={CREAM_SOFT} strokeWidth="1.5"/>
      {[0,1,2].map(i=>(
        <rect key={i} x="58" y={44+i*13} width={64-i*12} height="5" rx="2.5" fill={CREAM_SOFT}/>
      ))}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 -26; 0 0; 0 0" keyTimes="0;0.25;1" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;1" keyTimes="0;0.25;1" dur="4s" repeatCount="indefinite"/>
        <path d="M90 88 l15 6.5 v13 c0 11 -7.5 17.5 -15 21 c-7.5 -3.5 -15 -10 -15 -21 v-13 Z" fill={A}/>
        <path d="M83.5 108 l4.5 4.5 l8.5 -9.5" fill="none" stroke="var(--aubergine)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );

  /* a report page with three ranked risk bars and a week one flag */
  if (variant === 'report') return (
    <svg viewBox="0 0 180 160" style={box}>
      <rect x="38" y="20" width="104" height="120" rx="8" fill="var(--aubergine-lift)" stroke={CREAM_SOFT} strokeWidth="1.5"/>
      <rect x="50" y="32" width="56" height="7" rx="3.5" fill="var(--cream)" opacity="0.85"/>
      {[['1',86,'rgba(209,30,76,.8)'],['2',66,A],['3',44,'rgba(245,239,232,.4)']].map((r,i)=>(
        <g key={i}>
          <text x="52" y={62+i*20} fontFamily="var(--mono)" fontSize="9" fill="rgba(245,239,232,.55)">{r[0]}</text>
          <rect x="62" y={54+i*20} height="9" rx="4.5" fill={r[2]} width="0">
            <animate attributeName="width" values={`0;${r[1]}`} dur="0.7s" begin={`${0.3+i*0.3}s`} fill="freeze"/>
          </rect>
        </g>
      ))}
      <rect x="50" y="118" width="44" height="13" rx="6.5" fill={A}>
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </rect>
      <text x="72" y="127" textAnchor="middle" fontFamily="var(--mono)" fontSize="7.5" fontWeight="700" fill="var(--aubergine)">WEEK ONE</text>
    </svg>
  );

  /* partner nodes shake hands: two circles meet, a link forms, trust flows both ways */
  if (variant === 'partners') return (
    <svg viewBox="0 0 180 160" style={box}>
      <circle cx="56" cy="80" r="20" fill="var(--aubergine-lift)" stroke={A} strokeWidth="2">
        <animate attributeName="cx" values="44;56;56;44" keyTimes="0;0.25;0.85;1" dur="4.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="124" cy="80" r="20" fill="var(--aubergine-lift)" stroke={CREAM_FADE} strokeWidth="2">
        <animate attributeName="cx" values="136;124;124;136" keyTimes="0;0.25;0.85;1" dur="4.5s" repeatCount="indefinite"/>
      </circle>
      <text x="56" y="85" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="rgba(245,239,232,.7)">iS
        <animate attributeName="x" values="44;56;56;44" keyTimes="0;0.25;0.85;1" dur="4.5s" repeatCount="indefinite"/>
      </text>
      <line x1="76" y1="80" x2="104" y2="80" stroke={A} strokeWidth="2.5" strokeDasharray="30" strokeDashoffset="30">
        <animate attributeName="stroke-dashoffset" values="30;30;0;0;30" keyTimes="0;0.25;0.4;0.85;1" dur="4.5s" repeatCount="indefinite"/>
      </line>
      <circle r="3.5" fill="var(--cream)" opacity="0.8">
        <animateMotion dur="4.5s" repeatCount="indefinite" keyPoints="0;0;1;0;0" keyTimes="0;0.4;0.6;0.8;1" path="M78 80 L102 80"/>
      </circle>
      <text x="90" y="128" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="rgba(245,239,232,.5)" letterSpacing="2">TRUST FLOWS BOTH WAYS</text>
    </svg>
  );

  /* legacy variants kept for track fallbacks */
  if (variant === 'links'){
    const sats = [[26,30],[152,26],[20,118],[154,126],[92,14]];
    return (
      <svg viewBox="0 0 180 160" style={box}>
        {sats.map((p,i)=>(
          <g key={i}>
            <line x1="90" y1="82" x2={p[0]} y2={p[1]} stroke={CREAM_FADE} strokeWidth="1.5" strokeDasharray="4 5">
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
          <rect key={i} x={20+i*38} width="30" rx="7" fill={c} stroke={CREAM_SOFT} strokeWidth="1">
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
            <rect x="54" y={46+i*36} width={i===1?66:92} height="7" rx="3.5" fill={CREAM_SOFT}/>
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

/* Which infographic teaches which lesson. Falls back to the track variant. */
const ART_BY_LESSON = {
  // SEO & Backlinks
  SEO001L01:'links',    SEO001L02:'search',   SEO001L03:'report',
  SEO001L04:'emails',   SEO001L05:'calendar',
  // Design & Video
  DSN001L01:'palette',  DSN001L02:'rewrite',  DSN001L03:'storyboard',
  DSN001L04:'storyboard', DSN001L05:'calendar',
  // QA & No-code
  QAN001L01:'checks',   QAN001L02:'bug',      QAN001L03:'flow',
  QAN001L04:'search',   QAN001L05:'report',
  // QA & SEO
  QAS001L01:'checks',   QAS001L02:'bug',      QAS001L03:'checks',
  QAS001L04:'search',   QAS001L05:'gauge',
  // InstaSpace App Mastery
  WPM001L01:'audiences', WPM001L02:'moneyflow', WPM001L03:'stack',
  WPM001L04:'bug',      WPM001L05:'report',
  // Growth
  GRW001L01:'audiences', GRW001L02:'funnel',   GRW001L03:'emails',
  GRW001L04:'gauge',    GRW001L05:'report',
  // Marketing
  MKT001L01:'house',    MKT001L02:'rewrite',  MKT001L03:'emails',
  MKT001L04:'calendar', MKT001L05:'report',
  // GTM
  GTM001L01:'shield',   GTM001L02:'gates',    GTM001L03:'voice',
  GTM001L04:'partners', GTM001L05:'gates',
  // Brand
  BRD001L01:'voice',    BRD001L02:'rewrite',  BRD001L03:'voice',
  BRD001L04:'checks',   BRD001L05:'house',
  // LinkedIn Marketing Mastery
  LNKD001L01:'search',  LNKD001L02:'voice',   LNKD001L03:'calendar',
  LNKD001L04:'funnel',  LNKD001L05:'report',
};

/* Animated, interactive lesson slides (replaces the old video placeholder). */
function LessonSlides({ lesson, track, practice, onStart }){
  const trackFallback = ({ seo:'links', design:'palette', 'qa-nocode':'checks', 'qa-seo':'checks', 'webapp-portal':'checks', linkedin:'links' })[track] || 'rings';
  const variant = ART_BY_LESSON[lesson.id] || trackFallback;
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
            <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}><SlideArt variant={variant} /></div>
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
              {lesson.videoUrl ? 'A recorded walkthrough from your mentor.' : 'An animated walkthrough: the key ideas, the traps to avoid, then your turn. Use the arrows or let it play.'}
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
