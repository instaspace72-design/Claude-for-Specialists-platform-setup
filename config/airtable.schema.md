# Airtable schema (reference)

The backend reads from an Airtable base with these tables. Create them in your
base (names are case-sensitive) and set `AIRTABLE_API_KEY` / `AIRTABLE_BASE_ID`
in `.env`. Until then, the frontend runs on its built-in courses.

Once configured, the frontend calls `GET /api/content/courses`, which assembles
Courses, Lessons, and Exercises into the nested shape the portal renders and
merges them over the built-in courses (any course you leave out keeps its
built-in version). A 503 or empty response leaves the built-in courses in place,
so the portal never shows a blank screen.

## Courses
Course ID (primary), Course Title, Department, Level, Duration (Days),
Description, Status, Start Date, Instructor Name, Learning Objectives

`Department` must hold the track id the frontend keys on, one of:
`growth`, `marketing`, `gtm`, `brand` (department tracks) or
`seo`, `design`, `qa-nocode`, `qa-seo` (intern specialty tracks).
`Learning Objectives` and `Key Concepts` / `Success Criteria` are newline
separated (one item per line). `Course` / `Lesson` link fields may be true
Airtable links or plain ID text; the assembler handles both.

## Lessons
Lesson ID (primary), Course (link), Lesson Number, Lesson Title,
Concept Summary, Key Concepts, Video Link, Time to Complete (mins),
Difficulty, Published Date

## Exercises
Exercise ID (primary), Lesson (link), Exercise Title, Difficulty,
Estimated Time (mins), Scenario Description, Starter Prompt,
Task Steps, Success Criteria, Capstone, Submission Type

Each Exercise is one lesson's live practice, linked to that lesson. Field mapping
the portal reads: `Scenario Description` = the brief, `Starter Prompt` = the
day's Claude prompt shown in the prompt block, `Task Steps` = the numbered task
(one step per line), `Success Criteria` = the success checklist (one per line),
`Capstone` = `Yes` to mark the Day 5 capstone. To edit a lesson's teaching, edit
the linked **Lessons** row (`Concept Summary`, `Key Concepts` one point per line).

## Student Progress
Student ID (primary), Student Name, Course (link), Enrollment Date,
Current Lesson, Completion %, Exercises Submitted, Exercises Passed,
Time Spent (mins), Last Active, Streak (Days), Grade, Notes, Status

## Resources
Resource ID (primary), Resource Title, Resource Type, Category, Content,
Related Courses (link), Related Exercises (link), Created By, Last Updated,
Usage Instructions

## Departments
Department Name (primary), Owner, Focus Areas, Active Courses,
Total Students, Launch Date

See `docs/DEVELOPER_SETUP_GUIDE.md` for full setup and sample data.
