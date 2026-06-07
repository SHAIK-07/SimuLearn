# Phase 2: Course Content Sync, APIs, and Frontend Rendering

This checklist tracks the implementation of Phase 2 of SimuLearn.

## 1. Supabase Sync Engine Improvements
- [x] Read and parse `.tutorial/quiz.json` inside each topic directory if present.
- [x] Map and split questions based on `stage` (e.g. `stage: "pre"` maps to Simple/Medium lessons, `stage: "post"` maps to Hard lessons).
- [x] Upsert questions into the `quizzes` table and link them to `lessons`.
- [x] Run sync and verify that courses, topics, lessons, and quizzes are fully populated (Requires executing SQL migration on Supabase).

## 2. FastAPI Course Content Router
- [x] Create `backend/app/routers/courses.py` defining endpoints for courses, topics, and lesson details.
- [x] Implement `GET /api/v1/courses` to list synced courses.
- [x] Implement `GET /api/v1/courses/{course_slug}` to retrieve course details and ordered topics.
- [x] Implement `GET /api/v1/courses/{course_slug}/topics/{topic_slug}` to load the lesson details, markdown text, code contents, and quizzes dynamically.
- [x] Include the router in `backend/main.py`.

## 3. Frontend Pages
- [x] Update `frontend/src/App.jsx` to register routes:
  - `/courses/:course_slug` -> `CourseOverview`
  - `/courses/:course_slug/topics/:topic_slug` -> `CourseViewer`
  - `/courses/:course_slug/quizzes/:quiz_id` -> `QuizPage`
- [x] Implement `CourseOverview.jsx` rendering the list of topics in a course with progress indicators.
- [x] Implement split-screen `CourseViewer.jsx`:
  - **Left column**: Custom markdown notes renderer.
  - **Right column**: Visualizer wrapper that loads corresponding simulation engine (Python, ML Plotter, DL Visualizer, etc.) with difficulty toggles.
- [x] Implement `QuizPage.jsx` for rendering multiple choice questions with feedback, saving scores/progress to Supabase.
- [x] Connect `Dashboard.jsx` cards to fetch actual data from Supabase and navigate to course detail pages.
