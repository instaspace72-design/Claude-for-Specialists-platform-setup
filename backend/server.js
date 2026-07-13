/**
 * Claude for Specialists - Learning Portal API
 *
 * Express backend that:
 *   - serves course / lesson / exercise data from Airtable (when configured)
 *   - proxies chat requests to the Claude API (keeps the API key server side)
 *   - persists student progress and chat history in a local SQLite database
 *
 * The server is designed to boot and stay healthy even when credentials are
 * missing. Endpoints that need a key return a clear 503 instead of crashing,
 * so the frontend (which ships with a scripted demo) keeps working offline.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');
const Airtable = require('airtable');
const sqlite3 = require('sqlite3').verbose();

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || '';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5';

const isPlaceholder = (v) => !v || /XXXX|YOUR_|placeholder/i.test(v);
const airtableReady = !isPlaceholder(AIRTABLE_API_KEY) && !isPlaceholder(AIRTABLE_BASE_ID);
const claudeReady = !isPlaceholder(CLAUDE_API_KEY);

// ---------------------------------------------------------------------------
// Clients (created lazily so bad/placeholder keys never crash boot)
// ---------------------------------------------------------------------------
let base = null;
if (airtableReady) {
  try {
    Airtable.configure({ apiKey: AIRTABLE_API_KEY });
    base = Airtable.base(AIRTABLE_BASE_ID);
  } catch (err) {
    console.warn('[airtable] failed to initialise:', err.message);
    base = null;
  }
}

let anthropic = null;
if (claudeReady) {
  try {
    anthropic = new Anthropic({ apiKey: CLAUDE_API_KEY });
  } catch (err) {
    console.warn('[claude] failed to initialise:', err.message);
    anthropic = null;
  }
}

// ---------------------------------------------------------------------------
// SQLite (local progress + chat history)
// ---------------------------------------------------------------------------
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'local.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('[db] open error:', err.message);
  else console.log(`[db] connected: ${DB_PATH}`);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS student_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    student_name TEXT,
    course_id TEXT,
    current_lesson INTEGER DEFAULT 1,
    completion_percentage INTEGER DEFAULT 0,
    exercises_submitted INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS exercise_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    content TEXT,
    passed INTEGER DEFAULT 0,
    submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    exercise_id TEXT,
    role TEXT,
    content TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    first_name TEXT,
    role TEXT NOT NULL DEFAULT 'intern',
    title TEXT,
    track TEXT,
    salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    must_change_password INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
  )`, () => seedUsers());

  // Leadership ratings: one row per (intern, leader, month). KPI scores are 1-10.
  db.run(`CREATE TABLE IF NOT EXISTS intern_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    intern_email TEXT NOT NULL,
    leader_email TEXT NOT NULL,
    period TEXT NOT NULL,
    time_score INTEGER,
    discipline INTEGER,
    dedication INTEGER,
    willingness INTEGER,
    attention INTEGER,
    reporting INTEGER,
    communication INTEGER,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(intern_email, leader_email, period)
  )`);

  // Leadership remarks/notes: many per intern from any leader, timestamped.
  db.run(`CREATE TABLE IF NOT EXISTS intern_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    intern_email TEXT NOT NULL,
    leader_email TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

// ---------------------------------------------------------------------------
// Auth helpers (scrypt password hashing, no external dependency)
// ---------------------------------------------------------------------------
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'Instaspace@123';

function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(expectedHash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function userPublic(u) {
  return {
    email: u.email,
    name: u.name,
    firstName: u.first_name,
    role: u.role,
    title: u.title,
    track: u.track,
    mustChangePassword: !!u.must_change_password,
  };
}

// The team the chat asked us to provision. Interns get a specialty track;
// leadership gets the CEO/COO/CPO dashboard (built next). Seeded once, only
// when the users table is empty, so it never clobbers changed passwords.
const SEED_USERS = [
  { email: 'mesum@myinstaspace.com',    name: 'Mesum',         first: 'Mesum',    role: 'intern',     title: 'SEO & Backlinks',         track: 'seo' },
  { email: 'shahzaib@myinstaspace.com', name: 'Shahzaib Nasir', first: 'Shahzaib', role: 'intern',     title: 'Design & Video',          track: 'design' },
  { email: 'umair@myinstaspace.com',    name: 'Umair Aziz',    first: 'Umair',    role: 'intern',     title: 'InstaSpace App Mastery',  track: 'webapp-portal' },
  { email: 'abdullah@myinstaspace.com', name: 'Abdullah',      first: 'Abdullah', role: 'intern',     title: 'InstaSpace App Mastery',  track: 'webapp-portal' },
  { email: 'osman@myinstaspace.com',    name: 'Osman',         first: 'Osman',    role: 'leadership', title: 'CEO',                     track: null },
  { email: 'jybran@myinstaspace.com',   name: 'Jybran',        first: 'Jybran',   role: 'leadership', title: 'COO',                     track: null },
  { email: 'talha@myinstaspace.com',    name: 'Talha',         first: 'Talha',    role: 'leadership', title: 'CPO',                     track: null },
  { email: 'ayesha@myinstaspace.com',   name: 'Ayesha',        first: 'Ayesha',   role: 'leadership', title: 'Project Manager',         track: null },
];

function seedUsers() {
  // Idempotent and additive: ensure every seed account exists on each boot.
  // INSERT OR IGNORE keys on the unique email, so existing users (and any
  // password they have already changed) are left untouched, while a newly
  // added seed account appears on the next deploy without wiping the database.
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO users (email, name, first_name, role, title, track, salt, password_hash, must_change_password)
     VALUES (?,?,?,?,?,?,?,?,1)`
  );
  for (const u of SEED_USERS) {
    const { salt, hash } = hashPassword(DEFAULT_PASSWORD);
    stmt.run(u.email, u.name, u.first, u.role, u.title, u.track, salt, hash);
  }
  stmt.finalize((e) => {
    if (e) console.error('[seed] error:', e.message);
    else console.log(`[seed] ensured ${SEED_USERS.length} accounts (default password: ${DEFAULT_PASSWORD})`);
  });

  // Second pass: sync role/title/track for existing accounts so track changes
  // (e.g. moving Umair + Abdullah onto the InstaSpace App Mastery course)
  // land on the next boot without touching passwords or session tokens.
  const sync = db.prepare('UPDATE users SET role = ?, title = ?, track = ? WHERE email = ?');
  for (const u of SEED_USERS) sync.run(u.role, u.title, u.track, u.email);
  sync.finalize((e) => {
    if (e) console.error('[seed] sync error:', e.message);
    else console.log('[seed] synced role/title/track for existing accounts');
  });
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const app = express();
app.use(express.json({ limit: '1mb' }));

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:8000,http://localhost:3000')
  .split(',')
  .map((s) => s.trim());
app.use(
  cors({
    origin(origin, cb) {
      // allow tools with no origin (curl) and any whitelisted origin
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, true); // permissive in dev; tighten for production
    },
    credentials: true,
  })
);

// small helper to map an Airtable record to a plain object
const rec = (r) => ({ id: r.id, ...r.fields });

// ---------------------------------------------------------------------------
// Auth (token in the Authorization: Bearer header, sessions in SQLite)
// ---------------------------------------------------------------------------
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  db.get('SELECT * FROM sessions WHERE token = ?', [token], (err, session) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!session || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Session expired', code: 'expired' });
    }
    db.get('SELECT * FROM users WHERE email = ?', [session.email], (e2, user) => {
      if (e2) return res.status(500).json({ error: e2.message });
      if (!user) return res.status(401).json({ error: 'User not found' });
      req.user = user;
      req.token = token;
      next();
    });
  });
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  db.get('SELECT * FROM users WHERE email = ?', [String(email).trim().toLowerCase()], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    // Same generic message whether the email or the password is wrong.
    if (!user || !verifyPassword(password, user.salt, user.password_hash)) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }
    const token = crypto.randomBytes(24).toString('hex');
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.run('INSERT INTO sessions (token, email, expires_at) VALUES (?,?,?)', [token, user.email, expires], (e2) => {
      if (e2) return res.status(500).json({ error: e2.message });
      res.json({ token, user: userPublic(user) });
    });
  });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: userPublic(req.user) });
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!newPassword || String(newPassword).length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  if (newPassword === DEFAULT_PASSWORD) {
    return res.status(400).json({ error: 'Choose a password different from the default' });
  }
  // On a forced first-login change we do not demand the current password,
  // since the user just authenticated with it. Elsewhere we verify it.
  if (!req.user.must_change_password) {
    if (!currentPassword || !verifyPassword(currentPassword, req.user.salt, req.user.password_hash)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
  }
  const { salt, hash } = hashPassword(newPassword);
  db.run(
    'UPDATE users SET salt = ?, password_hash = ?, must_change_password = 0 WHERE email = ?',
    [salt, hash, req.user.email],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ user: userPublic({ ...req.user, salt, password_hash: hash, must_change_password: 0 }) });
    }
  );
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  db.run('DELETE FROM sessions WHERE token = ?', [req.token], () => res.json({ ok: true }));
});

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
    airtable: airtableReady ? 'configured' : 'not_configured',
    claude: claudeReady ? 'configured' : 'not_configured',
    model: CLAUDE_MODEL,
  });
});

// ---------------------------------------------------------------------------
// Courses / Lessons / Exercises (Airtable)
// ---------------------------------------------------------------------------
function requireAirtable(res) {
  if (!base) {
    res.status(503).json({
      error: 'Airtable is not configured',
      hint: 'Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in .env, then restart.',
    });
    return false;
  }
  return true;
}

app.get('/api/courses', async (req, res) => {
  if (!requireAirtable(res)) return;
  try {
    const records = await base('Courses').select({ view: 'Grid view' }).all();
    res.json(records.map(rec));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses', detail: err.message });
  }
});

app.get('/api/courses/:courseId/lessons', async (req, res) => {
  if (!requireAirtable(res)) return;
  try {
    const records = await base('Lessons')
      .select({ filterByFormula: `{Course} = '${req.params.courseId}'` })
      .all();
    res.json(records.map(rec));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons', detail: err.message });
  }
});

app.get('/api/lessons/:lessonId/exercises', async (req, res) => {
  if (!requireAirtable(res)) return;
  try {
    const records = await base('Exercises')
      .select({ filterByFormula: `{Lesson} = '${req.params.lessonId}'` })
      .all();
    res.json(records.map(rec));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercises', detail: err.message });
  }
});

// Assemble the full nested course shape (Courses + Lessons + Exercises) that the
// frontend consumes, keyed by department/track id. Tolerant of Airtable link
// fields that come back either as linked record ids or as the ID text.
app.get('/api/content/courses', async (req, res) => {
  if (!base) {
    return res.status(503).json({
      error: 'Airtable is not configured',
      hint: 'Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in .env, then restart. The frontend falls back to its built-in courses.',
    });
  }
  try {
    const [courseRecs, lessonRecs, exRecs] = await Promise.all([
      base('Courses').select().all(),
      base('Lessons').select().all(),
      base('Exercises').select().all(),
    ]);

    const split = (v) =>
      Array.isArray(v)
        ? v.map((s) => String(s).trim()).filter(Boolean)
        : String(v || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

    const recToCourseId = {};
    const courseIdToDept = {};
    const courses = {};

    courseRecs.forEach((c) => {
      const f = c.fields;
      const courseId = f['Course ID'];
      const deptId = String(f['Department'] || '').toLowerCase().trim() || String(courseId || '').toLowerCase();
      recToCourseId[c.id] = courseId;
      courseIdToDept[courseId] = deptId;
      courses[deptId] = {
        id: courseId,
        dept: deptId,
        title: f['Course Title'] || '',
        level: f['Level'] || 'Beginner',
        days: Number(f['Duration (Days)']) || 0,
        instructor: f['Instructor Name'] || '',
        summary: f['Description'] || '',
        objectives: split(f['Learning Objectives']),
        lessons: [],
        exercise: null,
      };
    });

    // link field may be [recId], 'CourseID', ['CourseID'], or a bare recId
    const resolveCourseKey = (link) => {
      const raw = Array.isArray(link) ? link[0] : link;
      if (raw == null) return null;
      const courseId = recToCourseId[raw] || raw;
      return courseIdToDept[courseId] || null;
    };

    const lessonKeyById = {};
    const lessonRecMap = {};
    lessonRecs.forEach((l) => { lessonRecMap[l.id] = l.fields['Lesson ID']; });

    lessonRecs
      .map((l) => l.fields)
      .sort((a, b) => (Number(a['Lesson Number']) || 0) - (Number(b['Lesson Number']) || 0))
      .forEach((f) => {
        const key = resolveCourseKey(f['Course']);
        if (!key || !courses[key]) return;
        const lessonId = f['Lesson ID'];
        lessonKeyById[lessonId] = key;
        courses[key].lessons.push({
          id: lessonId,
          n: Number(f['Lesson Number']) || courses[key].lessons.length + 1,
          title: f['Lesson Title'] || '',
          mins: Number(f['Time to Complete (mins)']) || 0,
          difficulty: f['Difficulty'] || 'Novice',
          status: courses[key].lessons.length === 0 ? 'active' : 'locked',
          concept: f['Concept Summary'] || '',
          keyConcepts: split(f['Key Concepts']),
          videoLabel: 'Lesson walkthrough',
        });
      });

    // attach each exercise to its lesson as that lesson's practice
    exRecs.forEach((e) => {
      const f = e.fields;
      const rawLesson = Array.isArray(f['Lesson']) ? f['Lesson'][0] : f['Lesson'];
      const lessonId = lessonRecMap[rawLesson] || rawLesson;
      const key = lessonKeyById[lessonId];
      if (!key || !courses[key]) return;
      const lesson = courses[key].lessons.find((l) => l.id === lessonId);
      if (!lesson) return;
      const scenario = f['Scenario Description'] || '';
      lesson.practice = {
        id: f['Exercise ID'],
        title: f['Exercise Title'] || '',
        difficulty: f['Difficulty'] || 'Beginner',
        mins: Number(f['Estimated Time (mins)']) || 0,
        brief: scenario,
        scenario,
        promptTemplate: f['Starter Prompt'] || '',
        task: split(f['Task Steps']),
        success: split(f['Success Criteria']),
        capstone: /^y/i.test(String(f['Capstone'] || '')),
        records: [],
        reward: { badge: 'Exercise Passed', note: 'Nicely done. That is real work.' },
      };
    });

    // drop incomplete course rows (no lessons)
    Object.keys(courses).forEach((k) => { if (!courses[k].lessons.length) delete courses[k]; });

    res.json({ source: 'airtable', count: Object.keys(courses).length, courses });
  } catch (err) {
    console.error('[content] error:', err.message);
    res.status(500).json({ error: 'Failed to assemble courses from Airtable', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// Claude chat proxy
// ---------------------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  const { studentId, exerciseId, messages, system } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array' });
  }

  if (!anthropic) {
    return res.status(503).json({
      error: 'Claude is not configured',
      hint: 'Set CLAUDE_API_KEY in .env, then restart. The portal falls back to its scripted mentor.',
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system:
        system ||
        'You are a warm, precise mentor inside the InstaSpace "Claude for Specialists" learning portal. Guide the learner with short, concrete steps. Never use dashes as punctuation.',
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    // best-effort persistence of the exchange
    if (studentId) {
      const last = messages[messages.length - 1];
      db.run('INSERT INTO chat_history (student_id, exercise_id, role, content) VALUES (?,?,?,?)', [
        studentId,
        exerciseId || null,
        last.role,
        typeof last.content === 'string' ? last.content : JSON.stringify(last.content),
      ]);
      db.run('INSERT INTO chat_history (student_id, exercise_id, role, content) VALUES (?,?,?,?)', [
        studentId,
        exerciseId || null,
        'assistant',
        text,
      ]);
    }

    res.json({ role: 'assistant', text, usage: response.usage });
  } catch (err) {
    console.error('[chat] error:', err.message);
    res.status(502).json({ error: 'Claude request failed', detail: err.message });
  }
});

// ---------------------------------------------------------------------------
// Progress + submissions (SQLite)
// ---------------------------------------------------------------------------
app.get('/api/progress/:studentId', (req, res) => {
  db.all('SELECT * FROM student_progress WHERE student_id = ?', [req.params.studentId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

app.post('/api/progress', (req, res) => {
  const {
    studentId,
    studentName = null,
    courseId = null,
    currentLesson = 1,
    completionPercentage = 0,
    exercisesSubmitted = 0,
    streakDays = 0,
  } = req.body || {};

  if (!studentId) return res.status(400).json({ error: 'studentId is required' });

  db.run(
    `INSERT INTO student_progress
       (student_id, student_name, course_id, current_lesson, completion_percentage, exercises_submitted, streak_days, last_active)
     VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
     ON CONFLICT(student_id, course_id) DO UPDATE SET
       student_name=excluded.student_name,
       current_lesson=excluded.current_lesson,
       completion_percentage=excluded.completion_percentage,
       exercises_submitted=excluded.exercises_submitted,
       streak_days=excluded.streak_days,
       last_active=CURRENT_TIMESTAMP`,
    [studentId, studentName, courseId, currentLesson, completionPercentage, exercisesSubmitted, streakDays],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true, id: this.lastID });
    }
  );
});

app.post('/api/submissions', (req, res) => {
  const { studentId, exerciseId, content = '', passed = false } = req.body || {};
  if (!studentId || !exerciseId) {
    return res.status(400).json({ error: 'studentId and exerciseId are required' });
  }
  db.run(
    'INSERT INTO exercise_submissions (student_id, exercise_id, content, passed) VALUES (?,?,?,?)',
    [studentId, exerciseId, content, passed ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true, id: this.lastID });
    }
  );
});

// ---------------------------------------------------------------------------
// Leadership overview: live per-intern progress for CEO / COO / CPO
// ---------------------------------------------------------------------------
app.get('/api/leadership/overview', requireAuth, (req, res) => {
  if (req.user.role !== 'leadership') {
    return res.status(403).json({ error: 'Leadership access only' });
  }

  db.all("SELECT email, name, first_name, title, track FROM users WHERE role = 'intern' ORDER BY name", [], (err, interns) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!interns.length) return res.json({ interns: [], summary: { total: 0, active: 0, notStarted: 0, exercisesPassed: 0, avgCompletion: 0 } });

    const order = interns.map((i) => i.email);
    const rows = [];
    let pending = interns.length;

    interns.forEach((it) => {
      db.get('SELECT COUNT(*) AS passed FROM exercise_submissions WHERE student_id = ? AND passed = 1', [it.email], (e1, sub) => {
        db.get(
          `SELECT MAX(completion_percentage) AS pct, MAX(streak_days) AS streak,
                  MAX(current_lesson) AS lesson, MAX(last_active) AS last
             FROM student_progress WHERE student_id = ?`,
          [it.email],
          (e2, prog) => {
            const passed = (sub && sub.passed) || 0;
            const pct = (prog && prog.pct) || 0;
            const streak = (prog && prog.streak) || 0;
            rows.push({
              email: it.email,
              name: it.name,
              firstName: it.first_name,
              title: it.title,
              track: it.track,
              exercisesPassed: passed,
              completion: pct,
              streak,
              lastActive: (prog && prog.last) || null,
              status: passed > 0 || pct > 0 ? 'Active' : 'Not started',
            });
            if (--pending === 0) finalize();
          }
        );
      });
    });

    function finalize() {
      rows.sort((a, b) => order.indexOf(a.email) - order.indexOf(b.email));
      const active = rows.filter((r) => r.status === 'Active').length;
      const exercisesPassed = rows.reduce((a, r) => a + r.exercisesPassed, 0);
      const avgCompletion = rows.length ? Math.round(rows.reduce((a, r) => a + r.completion, 0) / rows.length) : 0;
      res.json({
        interns: rows,
        summary: { total: rows.length, active, notStarted: rows.length - active, exercisesPassed, avgCompletion },
      });
    }
  });
});

// ---------------------------------------------------------------------------
// Leadership: create intern, KPI ratings, remarks, one-click performance report
// ---------------------------------------------------------------------------
const KPI_FIELDS = ['time_score', 'discipline', 'dedication', 'willingness', 'attention', 'reporting', 'communication'];
const KPI_LABELS = {
  time_score: 'Time',
  discipline: 'Discipline',
  dedication: 'Dedication',
  willingness: 'Willingness',
  attention: 'Attention to Detail',
  reporting: 'Reporting Habits',
  communication: 'Communication',
};

function requireLeadership(req, res, next) {
  if (req.user && req.user.role === 'leadership') return next();
  return res.status(403).json({ error: 'Leadership access only' });
}

function currentPeriod() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function clampKpi(v) {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return null;
  return Math.max(1, Math.min(10, n));
}

// Create a new intern account. Leadership only. Ships with the default password
// and forces a change on first login, matching the seed flow.
app.post('/api/leadership/interns', requireAuth, requireLeadership, (req, res) => {
  const { email, name, firstName, title, track } = req.body || {};
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanName = String(name || '').trim();
  if (!cleanEmail || !cleanName) return res.status(400).json({ error: 'Email and name are required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ error: 'Enter a valid email' });

  const first = String(firstName || cleanName.split(/\s+/)[0]).trim();
  const cleanTitle = String(title || 'Intern').trim();
  const cleanTrack = track ? String(track).trim() : null;
  const { salt, hash } = hashPassword(DEFAULT_PASSWORD);

  db.run(
    `INSERT INTO users (email, name, first_name, role, title, track, salt, password_hash, must_change_password)
     VALUES (?,?,?,?,?,?,?,?,1)`,
    [cleanEmail, cleanName, first, 'intern', cleanTitle, cleanTrack, salt, hash],
    function (err) {
      if (err) {
        if (/UNIQUE/.test(err.message)) return res.status(409).json({ error: 'An account with that email already exists' });
        return res.status(500).json({ error: err.message });
      }
      res.json({
        ok: true,
        intern: { email: cleanEmail, name: cleanName, firstName: first, role: 'intern', title: cleanTitle, track: cleanTrack },
        defaultPassword: DEFAULT_PASSWORD,
      });
    }
  );
});

// All ratings + averages for a period, plus the star of the month (highest
// overall average across leaders). Leadership only.
app.get('/api/leadership/ratings', requireAuth, requireLeadership, (req, res) => {
  const period = String(req.query.period || currentPeriod());
  db.all(
    `SELECT r.*, u.name AS leader_name, u.title AS leader_title
       FROM intern_ratings r
       LEFT JOIN users u ON u.email = r.leader_email
       WHERE r.period = ?`,
    [period],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const byIntern = {};
      rows.forEach((r) => {
        const list = byIntern[r.intern_email] || (byIntern[r.intern_email] = []);
        list.push(r);
      });
      const summary = Object.keys(byIntern).map((email) => {
        const list = byIntern[email];
        const kpi = {};
        KPI_FIELDS.forEach((f) => {
          const vals = list.map((r) => r[f]).filter((v) => Number.isFinite(v));
          kpi[f] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null;
        });
        const scored = KPI_FIELDS.map((f) => kpi[f]).filter((v) => v !== null);
        const overall = scored.length ? +(scored.reduce((a, b) => a + b, 0) / scored.length).toFixed(2) : null;
        return { intern_email: email, kpi, overall, leaders: list.length };
      });
      summary.sort((a, b) => (b.overall || 0) - (a.overall || 0));
      const star = summary.length && summary[0].overall !== null ? summary[0] : null;
      res.json({ period, ratings: rows, summary, star });
    }
  );
});

// Upsert one leader's KPI slider values for one intern for the period.
app.post('/api/leadership/ratings', requireAuth, requireLeadership, (req, res) => {
  const { internEmail, period, scores } = req.body || {};
  const email = String(internEmail || '').trim().toLowerCase();
  const per = String(period || currentPeriod());
  if (!email || !scores || typeof scores !== 'object') {
    return res.status(400).json({ error: 'internEmail and scores are required' });
  }
  const values = KPI_FIELDS.map((f) => clampKpi(scores[f]));
  const placeholders = KPI_FIELDS.map(() => '?').join(', ');
  const updates = KPI_FIELDS.map((f) => `${f}=excluded.${f}`).join(', ');
  db.run(
    `INSERT INTO intern_ratings (intern_email, leader_email, period, ${KPI_FIELDS.join(', ')}, updated_at)
     VALUES (?, ?, ?, ${placeholders}, CURRENT_TIMESTAMP)
     ON CONFLICT(intern_email, leader_email, period) DO UPDATE SET
       ${updates}, updated_at=CURRENT_TIMESTAMP`,
    [email, req.user.email, per, ...values],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

// All notes for one intern, from any leader, newest first.
app.get('/api/leadership/notes/:internEmail', requireAuth, requireLeadership, (req, res) => {
  const email = String(req.params.internEmail || '').trim().toLowerCase();
  db.all(
    `SELECT n.id, n.intern_email, n.leader_email, n.body, n.created_at,
            u.name AS leader_name, u.title AS leader_title
       FROM intern_notes n
       LEFT JOIN users u ON u.email = n.leader_email
       WHERE n.intern_email = ?
       ORDER BY n.created_at DESC`,
    [email],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ notes: rows || [] });
    }
  );
});

// Add a note.
app.post('/api/leadership/notes', requireAuth, requireLeadership, (req, res) => {
  const { internEmail, body } = req.body || {};
  const email = String(internEmail || '').trim().toLowerCase();
  const text = String(body || '').trim();
  if (!email || !text) return res.status(400).json({ error: 'internEmail and body are required' });
  if (text.length > 2000) return res.status(400).json({ error: 'Note too long (max 2000 chars)' });
  db.run(
    'INSERT INTO intern_notes (intern_email, leader_email, body) VALUES (?, ?, ?)',
    [email, req.user.email, text],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true, id: this.lastID });
    }
  );
});

// One-click performance report: progress + KPI avg per leader + notes + star.
app.get('/api/leadership/report/:internEmail', requireAuth, requireLeadership, (req, res) => {
  const email = String(req.params.internEmail || '').trim().toLowerCase();
  const period = String(req.query.period || currentPeriod());

  db.get('SELECT email, name, first_name, title, track FROM users WHERE email = ? AND role = "intern"', [email], (e0, intern) => {
    if (e0) return res.status(500).json({ error: e0.message });
    if (!intern) return res.status(404).json({ error: 'Intern not found' });

    db.get(
      `SELECT COUNT(*) AS passed FROM exercise_submissions WHERE student_id = ? AND passed = 1`,
      [email],
      (e1, sub) => {
        db.get(
          `SELECT MAX(completion_percentage) AS pct, MAX(streak_days) AS streak,
                  MAX(current_lesson) AS lesson, MAX(last_active) AS last, MAX(course_id) AS course
             FROM student_progress WHERE student_id = ?`,
          [email],
          (e2, prog) => {
            db.all(
              `SELECT r.*, u.name AS leader_name, u.title AS leader_title
                 FROM intern_ratings r
                 LEFT JOIN users u ON u.email = r.leader_email
                 WHERE r.intern_email = ? AND r.period = ?`,
              [email, period],
              (e3, ratings) => {
                db.all(
                  `SELECT n.id, n.body, n.created_at, u.name AS leader_name, u.title AS leader_title
                     FROM intern_notes n
                     LEFT JOIN users u ON u.email = n.leader_email
                     WHERE n.intern_email = ?
                     ORDER BY n.created_at DESC`,
                  [email],
                  (e4, notes) => {
                    if (e3 || e4) return res.status(500).json({ error: (e3 || e4).message });
                    const kpi = {};
                    KPI_FIELDS.forEach((f) => {
                      const vals = (ratings || []).map((r) => r[f]).filter((v) => Number.isFinite(v));
                      kpi[f] = {
                        label: KPI_LABELS[f],
                        avg: vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null,
                        count: vals.length,
                      };
                    });
                    const scored = KPI_FIELDS.map((f) => kpi[f].avg).filter((v) => v !== null);
                    const overall = scored.length ? +(scored.reduce((a, b) => a + b, 0) / scored.length).toFixed(2) : null;

                    // determine star-of-the-month across ALL interns for this period
                    db.all(
                      `SELECT intern_email, ${KPI_FIELDS.map((f) => `AVG(${f}) AS ${f}`).join(', ')}
                         FROM intern_ratings WHERE period = ? GROUP BY intern_email`,
                      [period],
                      (e5, all) => {
                        let isStar = false;
                        let starEmail = null;
                        let starScore = -1;
                        (all || []).forEach((row) => {
                          const vals = KPI_FIELDS.map((f) => Number(row[f])).filter((v) => Number.isFinite(v));
                          if (!vals.length) return;
                          const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
                          if (avg > starScore) { starScore = avg; starEmail = row.intern_email; }
                        });
                        isStar = starEmail === email && starScore > 0;

                        res.json({
                          period,
                          intern: {
                            email: intern.email,
                            name: intern.name,
                            firstName: intern.first_name,
                            title: intern.title,
                            track: intern.track,
                          },
                          progress: {
                            exercisesPassed: (sub && sub.passed) || 0,
                            completion: (prog && prog.pct) || 0,
                            streak: (prog && prog.streak) || 0,
                            currentLesson: (prog && prog.lesson) || 0,
                            lastActive: (prog && prog.last) || null,
                            courseId: (prog && prog.course) || null,
                          },
                          kpi,
                          overall,
                          leaderRatings: (ratings || []).map((r) => ({
                            leader: r.leader_name,
                            leaderTitle: r.leader_title,
                            scores: KPI_FIELDS.reduce((o, f) => { o[f] = r[f]; return o; }, {}),
                            updatedAt: r.updated_at,
                          })),
                          notes: notes || [],
                          isStar,
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// ---------------------------------------------------------------------------
// Static frontend (single service in production) + fallback + boot
// ---------------------------------------------------------------------------
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

app.use((req, res) => {
  // unknown API routes 404 as JSON; everything else serves the single page app
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found', path: req.path });
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('  Claude for Specialists - Learning Portal API');
  console.log(`  Server running on http://localhost:${PORT}`);
  console.log(`  Health check:     http://localhost:${PORT}/api/health`);
  console.log(`  Airtable: ${airtableReady ? 'configured' : 'NOT configured (set keys in .env)'}`);
  console.log(`  Claude:   ${claudeReady ? 'configured' : 'NOT configured (set key in .env)'}`);
  console.log('');
});
