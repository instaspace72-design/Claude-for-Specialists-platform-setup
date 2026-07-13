/**
 * seed-airtable.js — one-time content seeder for Claude for Specialists.
 *
 * Reads your credentials from .env (AIRTABLE_API_KEY + AIRTABLE_BASE_ID),
 * creates the Courses / Lessons / Exercises tables in your base if they are
 * missing, and fills them with the portal's built-in courses. Safe to re-run:
 * it skips tables that already hold records.
 *
 *   node seed-airtable.js
 *
 * The Airtable token needs these scopes:
 *   data.records:read, data.records:write, schema.bases:read, schema.bases:write
 * and access to the target base.
 *
 * The "Course" / "Lesson" reference fields are stored as plain ID text on
 * purpose. The backend assembler (/api/content/courses) already resolves them,
 * so we avoid the ordering headaches of true linked-record fields.
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const API_KEY = process.env.AIRTABLE_API_KEY || '';
const BASE_ID = process.env.AIRTABLE_BASE_ID || '';

const isPlaceholder = (v) => !v || /XXXX|YOUR_|placeholder/i.test(v);
if (isPlaceholder(API_KEY) || isPlaceholder(BASE_ID)) {
  console.error('\n  Missing credentials. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in .env first.\n');
  process.exit(1);
}

const META = `https://api.airtable.com/v0/meta/bases/${BASE_ID}`;
const DATA = `https://api.airtable.com/v0/${BASE_ID}`;
const headers = { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' };

// ---------------------------------------------------------------------------
// Load the built-in courses out of the frontend data module (no duplication).
// data.jsx is plain JS that assigns to window; we run it with a stub window.
// ---------------------------------------------------------------------------
function loadCourses() {
  const file = path.join(__dirname, 'frontend', 'portal', 'data.jsx');
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {}, fetch: () => {}, console };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  if (!sandbox.window.COURSES) throw new Error('Could not read COURSES from data.jsx');
  return sandbox.window.COURSES;
}

// ---------------------------------------------------------------------------
// Table definitions (first field is the primary field)
// ---------------------------------------------------------------------------
const NUM = { type: 'number', options: { precision: 0 } };
const TEXT = { type: 'singleLineText' };
const LONG = { type: 'multilineText' };

const TABLES = {
  Courses: [
    { name: 'Course ID', ...TEXT },
    { name: 'Course Title', ...TEXT },
    { name: 'Department', ...TEXT },
    { name: 'Level', ...TEXT },
    { name: 'Duration (Days)', ...NUM },
    { name: 'Instructor Name', ...TEXT },
    { name: 'Description', ...LONG },
    { name: 'Learning Objectives', ...LONG },
    { name: 'Status', ...TEXT },
  ],
  Lessons: [
    { name: 'Lesson ID', ...TEXT },
    { name: 'Course', ...TEXT },
    { name: 'Lesson Number', ...NUM },
    { name: 'Lesson Title', ...TEXT },
    { name: 'Concept Summary', ...LONG },
    { name: 'Key Concepts', ...LONG },
    { name: 'Time to Complete (mins)', ...NUM },
    { name: 'Difficulty', ...TEXT },
    { name: 'Video Link', ...TEXT },
  ],
  Exercises: [
    { name: 'Exercise ID', ...TEXT },
    { name: 'Lesson', ...TEXT },
    { name: 'Exercise Title', ...TEXT },
    { name: 'Difficulty', ...TEXT },
    { name: 'Estimated Time (mins)', ...NUM },
    { name: 'Scenario Description', ...LONG },
    { name: 'Starter Prompt', ...LONG },
    { name: 'Task Steps', ...LONG },
    { name: 'Success Criteria', ...LONG },
    { name: 'Capstone', ...TEXT },
    { name: 'Submission Type', ...TEXT },
  ],
};

async function api(url, opts) {
  const res = await fetch(url, { headers, ...opts });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (body.error && (body.error.message || body.error.type)) || JSON.stringify(body);
    throw new Error(`${res.status} ${msg}`);
  }
  return body;
}

async function listTables() {
  const body = await api(`${META}/tables`, { method: 'GET' });
  return body.tables || [];
}

async function createTable(name, fields) {
  await api(`${META}/tables`, { method: 'POST', body: JSON.stringify({ name, fields }) });
  console.log(`  created table: ${name}`);
}

// Add any columns that a pre-existing table is missing (schema evolves over time).
async function ensureFields(table, wantedFields) {
  const have = new Set((table.fields || []).map((f) => f.name));
  for (const f of wantedFields) {
    if (have.has(f.name)) continue;
    await api(`${META}/tables/${table.id}/fields`, { method: 'POST', body: JSON.stringify(f) });
    console.log(`  added field "${f.name}" to ${table.name}`);
  }
}

// Delete every record in a table so a re-seed is a clean refresh, not a duplicate.
async function clearTable(name) {
  const ids = [];
  let offset;
  do {
    const url = `${DATA}/${encodeURIComponent(name)}?pageSize=100${offset ? `&offset=${offset}` : ''}`;
    const body = await api(url, { method: 'GET' });
    (body.records || []).forEach((r) => ids.push(r.id));
    offset = body.offset;
  } while (offset);
  for (let i = 0; i < ids.length; i += 10) {
    const qs = ids.slice(i, i + 10).map((id) => `records[]=${encodeURIComponent(id)}`).join('&');
    await api(`${DATA}/${encodeURIComponent(name)}?${qs}`, { method: 'DELETE' });
  }
  if (ids.length) console.log(`  cleared ${ids.length} record(s) from ${name}`);
}

async function insertRecords(name, records) {
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10).map((fields) => ({ fields }));
    await api(`${DATA}/${encodeURIComponent(name)}`, {
      method: 'POST',
      body: JSON.stringify({ records: batch, typecast: true }),
    });
  }
  console.log(`  inserted ${records.length} record(s) into ${name}`);
}

function buildRows(COURSES) {
  const courses = [];
  const lessons = [];
  const exercises = [];
  const join = (a) => (Array.isArray(a) ? a.join('\n') : String(a || ''));

  Object.values(COURSES).forEach((c) => {
    courses.push({
      'Course ID': c.id,
      'Course Title': c.title,
      Department: c.dept,
      Level: c.level,
      'Duration (Days)': c.days,
      'Instructor Name': c.instructor || '',
      Description: c.summary || '',
      'Learning Objectives': join(c.objectives),
      Status: 'Active',
    });
    (c.lessons || []).forEach((l) => {
      lessons.push({
        'Lesson ID': l.id,
        Course: c.id,
        'Lesson Number': l.n,
        'Lesson Title': l.title,
        'Concept Summary': l.concept || '',
        'Key Concepts': join(l.keyConcepts),
        'Time to Complete (mins)': l.mins,
        Difficulty: l.difficulty,
        'Video Link': '',
      });
      // per lesson practice (rich intern courses)
      if (l.practice) {
        const p = l.practice;
        exercises.push({
          'Exercise ID': l.id + 'X',
          Lesson: l.id,
          'Exercise Title': p.title || '',
          Difficulty: p.difficulty || 'Beginner',
          'Estimated Time (mins)': p.mins || 0,
          'Scenario Description': p.brief || '',
          'Starter Prompt': p.promptTemplate || '',
          'Task Steps': join(p.task),
          'Success Criteria': join(p.success),
          Capstone: p.capstone ? 'Yes' : '',
          'Submission Type': 'Live Claude',
        });
      }
    });
    // course level exercise (department courses)
    if (c.exercise) {
      const ex = c.exercise;
      exercises.push({
        'Exercise ID': ex.id,
        Lesson: ex.lessonId,
        'Exercise Title': ex.title,
        Difficulty: ex.difficulty,
        'Estimated Time (mins)': ex.mins,
        'Scenario Description': ex.scenario || '',
        'Success Criteria': join(ex.success),
        'Submission Type': 'Live Claude',
      });
    }
  });

  return { courses, lessons, exercises };
}

async function main() {
  console.log(`\n  Seeding Airtable base ${BASE_ID}\n`);
  const COURSES = loadCourses();
  const rows = buildRows(COURSES);

  const tables = await listTables();
  const byName = {};
  tables.forEach((t) => { byName[t.name] = t; });

  // create missing tables, or add any missing columns to existing ones
  for (const [name, fields] of Object.entries(TABLES)) {
    if (byName[name]) {
      console.log(`  table exists: ${name}`);
      await ensureFields(byName[name], fields);
    } else {
      await createTable(name, fields);
    }
  }

  // clean refresh: wipe then re-insert so content always matches the source
  const plan = [
    ['Courses', rows.courses],
    ['Lessons', rows.lessons],
    ['Exercises', rows.exercises],
  ];
  for (const [name, records] of plan) {
    await clearTable(name);
    await insertRecords(name, records);
  }

  console.log(`\n  Done. ${rows.courses.length} courses, ${rows.lessons.length} lessons, ${rows.exercises.length} exercises.`);
  console.log('  Restart the backend and the portal will load courses from Airtable.\n');
}

main().catch((err) => {
  console.error('\n  Seed failed:', err.message);
  if (/NOT_FOUND|403|forbidden|scope/i.test(err.message)) {
    console.error('  Check the token scopes (schema.bases:write needed to create tables) and that it has access to this base.\n');
  }
  process.exit(1);
});
