# Claude for Beginners: Developer Setup Guide

**For:** Junaid (Tech Lead) + Development Team  
**Duration:** 2-3 hours (end-to-end)  
**Complexity:** Intermediate  
**Prerequisites:** Node.js 16+, npm 8+, Git, terminal access

---

## Table of Contents

1. [Pre-Flight Checklist](#pre-flight-checklist)
2. [Environment Setup](#environment-setup)
3. [Project Initialization](#project-initialization)
4. [Airtable Configuration](#airtable-configuration)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Local Development](#local-development)
8. [Testing Workflow](#testing-workflow)
9. [Deployment to Vercel](#deployment-to-vercel)
10. [Monitoring & Maintenance](#monitoring--maintenance)
11. [Troubleshooting](#troubleshooting)

---

## Pre-Flight Checklist

Before you start, verify these are installed and working:

### 1.1 Check Node.js & npm

```bash
# Check Node version (need 16+)
node --version
# Expected output: v16.x.x or higher

# Check npm version (need 8+)
npm --version
# Expected output: 8.x.x or higher
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### 1.2 Install Git (if needed)

```bash
git --version
# Expected output: git version 2.x.x or higher
```

### 1.3 Create Accounts (if not already done)

| Service | URL | What You Need |
|---------|-----|---------------|
| Airtable | https://airtable.com | Account + free workspace |
| Anthropic (Claude) | https://console.anthropic.com | API key |
| GitHub | https://github.com | Account for version control |
| Vercel | https://vercel.com | Account for deployment |

### 1.4 Gather Credentials

You'll need these before starting:

```
AIRTABLE_API_KEY: pat_XXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID: appXXXXXXXXXXXXXX
CLAUDE_API_KEY: sk-ant-XXXXXXXXXXXXXXXXXXXXXX
```

**Don't have these yet?** Go to Step 2.

---

## Environment Setup

### 2.1 Get Airtable Credentials

**Step 1: Create Airtable Workspace**

1. Go to https://airtable.com
2. Sign up or log in
3. Click "Create a workspace"
4. Name it: "Claude for Beginners"
5. Click "Add a base"
6. Start with blank base

**Step 2: Get API Token**

1. Go to https://airtable.com/developers
2. Click "Create a new token"
3. Name it: "Claude for Beginners Portal"
4. Grant these permissions:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
5. Click "Create token"
6. **Copy and save this token somewhere safe** (you won't see it again)

```
AIRTABLE_API_KEY=pat_XXXXXXXXXXXXXXXXXXXXXX
```

**Step 3: Get Base ID**

1. Open your Airtable base
2. Look at the URL: `https://airtable.com/[BASE_ID]/...`
3. Copy the BASE_ID part

```
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### 2.2 Get Claude API Key

**Step 1: Access Anthropic Console**

1. Go to https://console.anthropic.com
2. Sign in (or create account)
3. Verify email if prompted

**Step 2: Create API Key**

1. Click "API Keys" in left sidebar
2. Click "Create Key"
3. Give it a name: "Claude for Beginners"
4. Copy the key

```
CLAUDE_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXX
```

**Step 3: Set Up Billing (Required)**

1. Click "Settings" → "Billing"
2. Add a payment method (credit/debit card)
3. Note: Usage will be ~$30-50/month during testing

**Verify your key works:**

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: sk-ant-XXXXXXXXXXXXXXXXXXXXXX" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-3-5-sonnet-20241022", "max_tokens": 10, "messages": [{"role": "user", "content": "test"}]}' 

# Should return a valid JSON response (not an error)
```

### 2.3 Set Up GitHub (Optional but Recommended)

```bash
# Configure git with your info
git config --global user.name "Junaid"
git config --global user.email "junaid@instaspace.com"

# Verify
git config --global user.name
git config --global user.email
```

---

## Project Initialization

### 3.1 Create Project Directory

```bash
# Navigate to where you want the project
cd ~/projects

# Create project folder
mkdir claude-for-beginners
cd claude-for-beginners

# Initialize git (optional)
git init
```

### 3.2 Create Project Structure

```bash
# Create folders
mkdir backend
mkdir frontend
mkdir scripts
mkdir config

# Create initial files
touch .gitignore
touch README.md
touch package.json
```

**Your structure should look like:**

```
claude-for-beginners/
├── backend/
│   └── server.js (we'll create this)
├── frontend/
│   ├── index.html (we'll create this)
│   └── public/
├── config/
├── scripts/
├── .env (create manually with secrets)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### 3.3 Create .gitignore

Create `.gitignore` file:

```bash
# Node
node_modules/
npm-debug.log
yarn-error.log

# Environment variables (NEVER commit secrets!)
.env
.env.local
.env.production.local

# Database
*.db
*.sqlite3
local.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/

# Logs
logs/
*.log
```

### 3.4 Copy Configuration Files

Copy these files to your project root:

**From the delivery package:**
- Copy `package.json` to project root
- Copy `.env.example` to project root

**Verify:**

```bash
ls -la
# Should show: package.json, .env.example, .gitignore, etc.
```

---

## Airtable Configuration

### 4.1 Create Tables in Airtable

Open your Airtable base and create these 6 tables:

**Table 1: Courses**

```
Columns:
- Course ID (text) - primary field
- Course Title (text)
- Department (single select) - options: Growth, Marketing, Fundraising, Investments, Brand, Product, GTM
- Level (single select) - options: Beginner, Intermediate, Advanced
- Duration (Days) (number)
- Description (long text)
- Status (single select) - options: Draft, Active, Archive
- Start Date (date)
- Instructor Name (text)
- Learning Objectives (long text)
```

**Table 2: Lessons**

```
Columns:
- Lesson ID (text) - primary field
- Course (link to Courses table)
- Lesson Number (number)
- Lesson Title (text)
- Concept Summary (long text)
- Key Concepts (long text)
- Video Link (url)
- Time to Complete (mins) (number)
- Difficulty (single select) - options: Novice, Intermediate, Advanced
- Published Date (date)
```

**Table 3: Exercises**

```
Columns:
- Exercise ID (text) - primary field
- Lesson (link to Lessons table)
- Exercise Title (text)
- Difficulty (single select)
- Estimated Time (mins) (number)
- Scenario Description (long text)
- Starter Prompt (long text)
- Success Criteria (long text)
- Expected Output (long text)
- Live Claude Practice (checkbox)
- Submission Type (single select) - options: Free-form text, JSON, Markdown
```

**Table 4: Student Progress**

```
Columns:
- Student ID (text) - primary field
- Student Name (text)
- Course (link to Courses table)
- Enrollment Date (date)
- Current Lesson (number)
- Completion % (percent)
- Exercises Submitted (count)
- Exercises Passed (count)
- Time Spent (mins) (number)
- Last Active (date)
- Streak (Days) (number)
- Grade (single select) - options: A, B, C, N/A
- Notes (long text)
- Status (single select) - options: Active, Paused, Completed
```

**Table 5: Resources**

```
Columns:
- Resource ID (text) - primary field
- Resource Title (text)
- Resource Type (single select) - options: Prompt, Template, Data, Guide
- Category (single select) - options: Growth, Marketing, Product, Fundraising
- Content (long text)
- Related Courses (link to Courses table)
- Related Exercises (link to Exercises table)
- Created By (text)
- Last Updated (date)
- Usage Instructions (long text)
```

**Table 6: Departments**

```
Columns:
- Department Name (text) - primary field
- Owner (text)
- Focus Areas (long text)
- Active Courses (count)
- Total Students (count)
- Launch Date (date)
```

### 4.2 Add Sample Data (Optional)

Add one sample course to test:

**In Courses table:**

| Course ID | Course Title | Department | Level | Duration | Status |
|-----------|--------------|-----------|-------|----------|--------|
| GRW001 | Claude for Growth Lead Generation | Growth | Beginner | 14 | Active |

**In Lessons table:**

| Lesson ID | Course | Lesson # | Lesson Title | Time | Difficulty |
|-----------|--------|---------|--------------|------|-----------|
| GRW001L01 | GRW001 | 1 | Understanding Real Estate Buyer Psychology | 45 | Novice |

**In Exercises table:**

| Exercise ID | Lesson | Exercise Title | Difficulty | Time | Live Claude |
|-------------|--------|----------------|-----------|------|-------------|
| GRW001E01 | GRW001L01 | Build a Lead Scoring Prompt | Beginner | 30 | ✓ |

### 4.3 Verify Airtable Connection

Test that the API works:

```bash
# Replace with your actual credentials
curl https://api.airtable.com/v0/appXXXXXXXXXXXXXX/Courses \
  -H "Authorization: Bearer pat_XXXXXXXXXXXXXXXXXXXXXX"

# Expected output: JSON with course records
# If error, verify: API key is correct, Base ID is correct, table name matches exactly
```

---

## Backend Setup

### 5.1 Install Dependencies

```bash
# Install all packages listed in package.json
npm install

# Expected output:
# added 50 packages in 8s

# Verify installation
npm list

# Should show your dependencies:
# ├── @anthropic-ai/sdk@0.21.0
# ├── airtable@2.1.0
# ├── cors@2.8.5
# ├── dotenv@16.0.0
# ├── express@4.18.0
# └── sqlite3@5.1.6
```

### 5.2 Create Backend Server File

Create `backend/server.js` and copy the contents from `04_Backend_Claude_API_Integration.js`

```bash
# Copy the backend code
cp ../04_Backend_Claude_API_Integration.js backend/server.js

# Verify file exists
ls -la backend/server.js
```

### 5.3 Create Environment File

Create `.env` in project root with your credentials:

```bash
# Copy template
cp .env.example .env

# Edit .env with your actual values (use your favorite editor)
nano .env

# Should contain:
# AIRTABLE_API_KEY=pat_XXXXXXXXXXXXXXXXXXXXXX
# AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
# CLAUDE_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXX
# PORT=3001
# NODE_ENV=development
# FRONTEND_URL=http://localhost:3000
```

**Important:** Never commit `.env` to git. The `.gitignore` should already exclude it.

### 5.4 Verify Backend Configuration

```bash
# Test that Node can read your environment
node -e "require('dotenv').config(); console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID)"

# Expected output:
# AIRTABLE_BASE_ID: appXXXXXXXXXXXXXX

# If you see "undefined", check your .env file for typos
```

---

## Frontend Setup

### 6.1 Create Frontend Portal

Create `frontend/index.html` and copy contents from `02_Learning_Portal_Interactive.html`

```bash
# Copy the frontend code
cp ../02_Learning_Portal_Interactive.html frontend/index.html

# Verify file exists
ls -la frontend/index.html
```

### 6.2 Configure Frontend

Update the API endpoints in `frontend/index.html` to use your local backend.

Find these lines in the HTML:

```javascript
// Around line 300-320 in the JavaScript section
const AIRTABLE_BASE_ID = 'YOUR_AIRTABLE_BASE_ID';
const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY';
const CLAUDE_API_KEY = 'YOUR_CLAUDE_API_KEY';
```

Replace with:

```javascript
// These will come from the backend, not directly from frontend
// The backend will proxy all requests
const API_BASE_URL = 'http://localhost:3001';
```

### 6.3 Create Public Folder (Optional)

```bash
mkdir -p frontend/public

# Create a simple README
echo "Static assets go here" > frontend/public/README.md
```

---

## Local Development

### 7.1 Start Backend Server

Open **Terminal 1:**

```bash
# Navigate to project root
cd claude-for-beginners

# Start development server
npm run dev

# Expected output:
# Claude for Beginners Learning Portal API
# Server running on http://localhost:3001
# Health check: http://localhost:3001/api/health
```

**Keep this terminal open.** The server runs continuously with `nodemon` (auto-reloads on file changes).

### 7.2 Verify Backend is Running

Open **Terminal 2:**

```bash
# Test health check endpoint
curl http://localhost:3001/api/health

# Expected output:
# {
#   "status": "healthy",
#   "timestamp": "2026-07-10T...",
#   "airtable": "configured",
#   "claude": "configured"
# }
```

### 7.3 Test API Endpoints

**Get Courses:**

```bash
curl http://localhost:3001/api/courses

# Expected output (JSON array of courses from Airtable):
# [
#   {
#     "id": "rec...",
#     "courseId": "GRW001",
#     "title": "Claude for Growth Lead Generation",
#     ...
#   }
# ]
```

**Get Lessons for a Course:**

```bash
# Replace GRW001 with your actual course ID
curl http://localhost:3001/api/courses/GRW001/lessons

# Expected output (JSON array of lessons):
# [
#   {
#     "id": "rec...",
#     "lessonId": "GRW001L01",
#     "title": "Understanding Real Estate Buyer Psychology",
#     ...
#   }
# ]
```

**Get Exercises:**

```bash
# Replace GRW001L01 with your actual lesson ID
curl http://localhost:3001/api/lessons/GRW001L01/exercises

# Expected output (JSON array of exercises):
# [
#   {
#     "id": "rec...",
#     "exerciseId": "GRW001E01",
#     "title": "Build a Lead Scoring Prompt",
#     ...
#   }
# ]
```

### 7.4 Start Frontend Server

Open **Terminal 3:**

```bash
# Navigate to frontend folder
cd claude-for-beginners/frontend

# Start simple HTTP server
python3 -m http.server 8000

# Expected output:
# Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### 7.5 Open Portal in Browser

Open your browser and visit:

```
http://localhost:8000
```

**You should see:**
- InstaSpace Learning Portal header ✓
- "Claude for Growth Lead Generation" in sidebar ✓
- Lesson 1 content displayed ✓
- Chat interface ready to use ✓

---

## Testing Workflow

### 8.1 End-to-End Test Flow

**Step 1: View Course & Lesson**

1. Navigate to http://localhost:8000
2. See "Claude for Growth Lead Generation" in sidebar
3. Click on it
4. See Lesson 1 card in main area
5. Lesson 1 content loads with key concepts

**Step 2: Practice with Claude**

1. Scroll down to exercise section
2. Read the scenario
3. Type a test message in chat: "Help me think about this"
4. Click "Send"
5. Wait 2-3 seconds
6. Claude response appears in chat

**Expected response:** Something like "Great question! Let me think through this with you..."

**Step 3: Submit Solution**

1. Type your response or prompt
2. Click "Submit Solution"
3. See success message: "Exercise submitted!"
4. Chat clears for next exercise

**Step 4: Check Progress**

1. Look at sidebar progress widget
2. Should show increasing percentage
3. Try refreshing page — progress should persist

### 8.2 Test Database Persistence

```bash
# Check if student progress was saved
sqlite3 ./local.db "SELECT * FROM student_progress LIMIT 5;"

# Expected output: One row with your test submission
```

### 8.3 Test Claude API Integration

```bash
# Test Claude chat endpoint
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "test_001",
    "exerciseId": "GRW001E01",
    "messages": [
      {
        "role": "user",
        "content": "How do I build a lead scoring prompt?"
      }
    ]
  }'

# Expected: Streaming response (or JSON response if not streaming in curl)
```

### 8.4 Automated Health Check

Create a simple health check script:

```bash
# Create file
cat > scripts/health-check.sh << 'EOF'
#!/bin/bash

echo "🏥 Claude for Beginners Health Check"
echo "====================================="
echo ""

# Check backend
echo "1️⃣  Backend Health..."
BACKEND=$(curl -s http://localhost:3001/api/health)
if echo $BACKEND | grep -q "healthy"; then
  echo "✅ Backend is running"
else
  echo "❌ Backend is not responding"
fi

# Check frontend
echo ""
echo "2️⃣  Frontend Server..."
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000)
if [ $FRONTEND -eq 200 ]; then
  echo "✅ Frontend is running"
else
  echo "❌ Frontend is not responding (code: $FRONTEND)"
fi

# Check Airtable
echo ""
echo "3️⃣  Airtable Connection..."
AIRTABLE=$(curl -s http://localhost:3001/api/courses)
if echo $AIRTABLE | grep -q "courseId"; then
  echo "✅ Airtable is connected"
else
  echo "❌ Airtable connection failed"
fi

# Check Claude API
echo ""
echo "4️⃣  Claude API..."
if [ -z "$CLAUDE_API_KEY" ]; then
  echo "❌ Claude API key not set"
else
  echo "✅ Claude API key is configured"
fi

echo ""
echo "====================================="
echo "Health check complete!"
EOF

chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

---

## Deployment to Vercel

### 9.1 Prepare for Production

**Step 1: Update Configuration**

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "buildCommand": "npm install",
  "env": {
    "AIRTABLE_API_KEY": "@airtable_api_key",
    "AIRTABLE_BASE_ID": "@airtable_base_id",
    "CLAUDE_API_KEY": "@claude_api_key"
  },
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/index.html"
    }
  ]
}
```

**Step 2: Update Environment for Production**

Edit `.env` or create `.env.production`:

```bash
NODE_ENV=production
PORT=3001
AIRTABLE_API_KEY=pat_XXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
CLAUDE_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXX
FRONTEND_URL=https://learning.instaspace.com
VERCEL_DEPLOYMENT_URL=https://instaspace-learning.vercel.app
```

### 9.2 Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Claude for Beginners MVP"

# Create main branch (if needed)
git branch -M main

# Add remote (replace with your repo URL)
git remote add origin https://github.com/instaspace/claude-for-beginners.git

# Push to GitHub
git push -u origin main

# Verify
git log --oneline
# Should show your commit
```

### 9.3 Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo
4. Configure build settings:
   - Framework Preset: Other
   - Build Command: `npm run build` (or leave empty)
   - Output Directory: (leave empty)
5. Add Environment Variables:
   - `AIRTABLE_API_KEY`: paste your key
   - `AIRTABLE_BASE_ID`: paste your ID
   - `CLAUDE_API_KEY`: paste your key
6. Click "Deploy"
7. Wait 3-5 minutes for build

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd claude-for-beginners
vercel

# Follow prompts:
# - Link to existing project? No
# - Set project name: claude-for-beginners
# - Set directory: ./
# - Override settings? No

# After deployment, you'll see:
# ✅ Production: https://instaspace-learning.vercel.app
```

### 9.4 Verify Deployment

```bash
# Test production health check
curl https://instaspace-learning.vercel.app/api/health

# Expected output:
# {
#   "status": "healthy",
#   "timestamp": "2026-07-10T...",
#   "airtable": "configured",
#   "claude": "configured"
# }

# Test production API
curl https://instaspace-learning.vercel.app/api/courses

# Should return courses from Airtable
```

### 9.5 Set Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add custom domain: learning.instaspace.com
4. Add DNS records to your domain registrar
5. Vercel will auto-generate SSL certificate

---

## Monitoring & Maintenance

### 10.1 View Logs

**Local Development:**

```bash
# Backend logs appear in Terminal 1 where you ran `npm run dev`
# Watch for errors or warnings

# Frontend errors in browser console (F12)
```

**Production (Vercel):**

```bash
# View deployment logs
vercel logs claude-for-beginners

# Real-time monitoring
vercel logs claude-for-beginners --follow
```

### 10.2 Database Maintenance

```bash
# Check database size
ls -lh local.db

# Backup database
cp local.db local.db.backup

# View student progress
sqlite3 local.db "SELECT student_name, completion_percentage FROM student_progress;"

# View submissions
sqlite3 local.db "SELECT COUNT(*) as total_submissions FROM exercise_submissions;"

# Clean up old chat history (if needed)
sqlite3 local.db "DELETE FROM chat_history WHERE timestamp < datetime('now', '-30 days');"
```

### 10.3 Monitor API Usage

**Claude API:**

```bash
# Check Anthropic dashboard for:
# - Total requests
# - Tokens used
# - Cost
# - Error rates

# https://console.anthropic.com/overview
```

**Airtable:**

```bash
# Check Airtable workspace for:
# - Records created
# - API requests made
# - Storage used

# https://airtable.com/account
```

### 10.4 Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Commit changes
git add package-lock.json
git commit -m "Update dependencies"
git push
```

---

## Troubleshooting

### Issue: "Cannot find module 'express'"

**Symptom:** `Error: Cannot find module 'express'`

**Solution:**

```bash
# Reinstall dependencies
npm install

# Or install specific package
npm install express
```

### Issue: "ENOENT: no such file or directory, open '.env'"

**Symptom:** Server won't start, .env error

**Solution:**

```bash
# Create .env file
cp .env.example .env

# Edit with your credentials
nano .env

# Restart server
npm run dev
```

### Issue: "AIRTABLE_API_KEY is undefined"

**Symptom:** Airtable endpoints return 401 error

**Solution:**

```bash
# Verify .env file exists
cat .env

# Should show non-empty values

# Check that server loaded env vars
node -e "require('dotenv').config(); console.log(process.env.AIRTABLE_API_KEY)"

# If undefined, check for typos in .env

# Restart server
npm run dev
```

### Issue: "CORS error in browser console"

**Symptom:** Frontend can't reach backend

**Solution:**

```bash
# Verify backend is running
curl http://localhost:3001/api/health

# Check CORS configuration in backend/server.js
# Should have: app.use(cors());

# Verify frontend URL in backend
# .env should have: FRONTEND_URL=http://localhost:3000 (or 8000)

# Restart both servers
```

### Issue: "Claude chat is frozen/slow"

**Symptom:** Send message, nothing happens

**Solution:**

```bash
# Check Claude API key is valid
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: sk-ant-XXXXXXXXXXXXXXXXXXXXXX" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-3-5-sonnet-20241022", "max_tokens": 10, "messages": [{"role": "user", "content": "test"}]}'

# Should return valid JSON, not an error

# If error, regenerate API key at https://console.anthropic.com

# Check backend logs for errors
# Restart server: npm run dev
```

### Issue: "Airtable endpoints return 404"

**Symptom:** GET /api/courses returns 404

**Solution:**

```bash
# Verify base ID is correct
echo $AIRTABLE_BASE_ID

# Verify table names exactly match (case-sensitive)
# Should be: Courses, Lessons, Exercises, Student Progress, Resources, Departments

# Test API key directly
curl https://api.airtable.com/v0/appXXXXXXXXXXXXXX/Courses \
  -H "Authorization: Bearer pat_XXXXXXXXXXXXXXXXXXXXXX"

# If 401, regenerate API key
# If 404, table name is wrong
```

### Issue: "Deployment fails on Vercel"

**Symptom:** Vercel build fails with error

**Solution:**

```bash
# Check build logs in Vercel dashboard
# Look for specific error message

# Common fixes:

# 1. Missing environment variables
# Verify all 3 variables in Vercel Settings → Environment Variables

# 2. Node version incompatibility
# In vercel.json, specify Node version:
{
  "build": {
    "env": {
      "NODE_VERSION": "18.17.0"
    }
  }
}

# 3. npm install fails
# Try clearing cache:
vercel env pull
npm install --force
git add package-lock.json
git commit -m "Update lockfile"
git push

# 4. Redeploy after fixes
vercel --prod
```

### Issue: "Database locked error"

**Symptom:** `database is locked` in logs

**Solution:**

```bash
# SQLite uses file locking
# Usually temporary, but can fix by:

# 1. Restart server
npm run dev

# 2. If persistent, check if multiple processes access DB
lsof local.db

# 3. Delete lock file if stuck
rm local.db-shm
rm local.db-wal

# 4. Consider moving to remote DB (PostgreSQL) for production
```

---

## Testing & QA Checklist

Before declaring setup complete, verify:

- [ ] Backend starts with `npm run dev` (no errors)
- [ ] Frontend loads at `localhost:8000` (portal visible)
- [ ] Health check returns 200: `curl localhost:3001/api/health`
- [ ] GET /api/courses returns course data
- [ ] GET /api/courses/:id/lessons returns lesson data
- [ ] GET /api/lessons/:id/exercises returns exercise data
- [ ] Chat sends message and receives Claude response
- [ ] Student progress saves to database
- [ ] Refresh page and progress persists
- [ ] Portal is mobile responsive (test on phone)
- [ ] No console errors in browser (F12)
- [ ] No errors in backend logs
- [ ] Deployed to Vercel successfully
- [ ] Production health check returns 200
- [ ] Custom domain resolves (if configured)

---

## Development Workflow

### Daily Development

```bash
# Terminal 1: Backend
cd claude-for-beginners
npm run dev

# Terminal 2: Frontend
cd claude-for-beginners/frontend
python3 -m http.server 8000

# Terminal 3: Editing
cd claude-for-beginners
# Use VS Code or editor of choice
code .

# Terminal 4: Git commands
cd claude-for-beginners
git status
git add .
git commit -m "Your message"
git push
```

### Before Committing

```bash
# Run health checks
./scripts/health-check.sh

# Review changes
git diff

# Make sure no secrets in files
grep -r "sk-ant" .
grep -r "pat_" .
# Should return nothing (those should only be in .env)

# Verify .env is in .gitignore
cat .gitignore | grep .env
# Should show: .env
```

### Deployment Process

```bash
# 1. Commit locally
git add .
git commit -m "Fix: issue description"

# 2. Push to GitHub
git push origin main

# 3. Vercel auto-deploys from main branch
# Monitor at: https://vercel.com/dashboard

# 4. Verify production
curl https://instaspace-learning.vercel.app/api/health

# 5. If issues, roll back
git revert HEAD
git push
# Vercel will redeploy previous version
```

---

## Performance Optimization

### Backend Optimization

```javascript
// In backend/server.js, add caching headers
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});

// Add request compression
const compression = require('compression');
app.use(compression());

// Add request timeout
app.set('request timeout', 30000); // 30 seconds
```

### Frontend Optimization

```html
<!-- In frontend/index.html -->

<!-- Preload critical resources -->
<link rel="preload" as="font" href="urbanist-font.woff2">

<!-- Lazy load images -->
<img src="logo.png" loading="lazy">

<!-- Minimize JavaScript -->
<!-- Bundle with webpack if needed (optional for MVP) -->
```

### Database Optimization

```sql
-- Add indexes for faster queries
CREATE INDEX idx_student_course ON student_progress(student_id, course_id);
CREATE INDEX idx_exercise_lesson ON exercises(lesson_id);
CREATE INDEX idx_chat_exercise ON chat_history(exercise_id);
```

---

## Security Best Practices

### 1. Environment Variables

```bash
# ✅ CORRECT: Use environment variables for secrets
CLAUDE_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXX

# ❌ WRONG: Never hardcode secrets
const claudeKey = "sk-ant-XXXXXXXXXXXXXXXXXXXXXX";
```

### 2. CORS Configuration

```javascript
// ✅ CORRECT: Whitelist specific origins
app.use(cors({
  origin: ['http://localhost:8000', 'https://learning.instaspace.com'],
  credentials: true
}));

// ❌ WRONG: Allow all origins
app.use(cors());
```

### 3. Input Validation

```javascript
// ✅ CORRECT: Validate and sanitize input
app.post('/api/chat', (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  // Process...
});
```

### 4. Rate Limiting

```javascript
// Add rate limiting to prevent abuse
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per windowMs
});
app.use('/api/', limiter);
```

### 5. HTTPS in Production

```bash
# Vercel auto-enables HTTPS
# Verify with:
curl -v https://learning.instaspace.com/api/health

# Should show: SSL/TLS certificate is valid
```

---

## Useful Commands Reference

```bash
# NPM & Node
npm install                 # Install dependencies
npm run dev                # Start development server
npm start                  # Start production server
npm list                   # Show installed packages
npm outdated               # Check for outdated packages
npm update                 # Update packages
npm prune                  # Remove unused dependencies

# Git
git clone <url>            # Clone repository
git add .                  # Stage all changes
git commit -m "msg"        # Commit with message
git push origin main       # Push to main branch
git pull origin main       # Pull latest changes
git log --oneline          # View commit history
git status                 # Check status

# Curl (API Testing)
curl http://localhost:3001/api/health                    # Test backend
curl http://localhost:3001/api/courses                   # Get courses
curl -X POST http://localhost:3001/api/chat -H "Content-Type: application/json" -d '{"studentId":"test","exerciseId":"ex1","messages":[{"role":"user","content":"test"}]}' # Test chat

# Database
sqlite3 local.db           # Open database
sqlite3 local.db ".tables" # List tables
sqlite3 local.db "SELECT * FROM student_progress;" # Query data

# System
lsof -i :3001              # Check what's running on port 3001
kill -9 <PID>              # Kill process
ps aux | grep node         # List Node processes
```

---

## Final Verification Checklist

Before considering setup complete:

```bash
✅ Development Environment
□ Node.js 16+ installed
□ npm 8+ installed
□ Git configured
□ All dependencies installed (npm install)

✅ Credentials
□ AIRTABLE_API_KEY in .env
□ AIRTABLE_BASE_ID in .env
□ CLAUDE_API_KEY in .env
□ All are non-empty and valid

✅ Database
□ Airtable base created with 6 tables
□ Sample data added (at least 1 course)
□ API connection tested

✅ Backend
□ backend/server.js exists
□ npm run dev starts without errors
□ Health check responds: curl localhost:3001/api/health
□ All API endpoints respond with data
□ No console errors

✅ Frontend
□ frontend/index.html exists
□ Loads at localhost:8000
□ Shows courses and lessons
□ Chat sends messages
□ Claude responds

✅ Integration
□ Frontend can reach backend
□ No CORS errors
□ Database saves student progress
□ Progress persists after refresh

✅ Deployment
□ .env.example created
□ .gitignore excludes secrets
□ GitHub repo created
□ Vercel deployment successful
□ Production health check responds

✅ Documentation
□ README.md updated
□ Deployment steps documented
□ Troubleshooting guide available
```

---

## Quick Reference Card

**For When You're in a Hurry:**

```bash
# Setup (first time only)
git clone https://github.com/instaspace/claude-for-beginners.git
cd claude-for-beginners
cp .env.example .env
# Edit .env with your credentials
npm install

# Daily workflow
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend && python3 -m http.server 8000

# Terminal 3: Open browser
# Visit http://localhost:8000

# Deploy to production
git add .
git commit -m "Your message"
git push origin main
# Vercel auto-deploys

# Check production
curl https://instaspace-learning.vercel.app/api/health
```

---

**Ready to start? Run `npm install` and `npm run dev` now!** 🚀

For questions, check the troubleshooting section above or reach out to Hamza.
