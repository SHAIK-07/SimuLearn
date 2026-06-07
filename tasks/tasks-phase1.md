# Phase 1: Foundation, Auth, Landing Page & Dashboard Home

This checklist tracks the implementation of Phase 1 of SimuLearn.

## 1. Database Schema Migrations
- [x] Write SQL schema updates in local Supabase migrations folder.
- [ ] Run migration on local/remote Supabase database to setup schema.

## 2. FastAPI Backend
- [x] Create `backend/requirements.txt` with dependencies.
- [x] Initialize `backend/main.py` with CORS, routing, and debug points.
- [x] Build the Content Sync Engine service (`backend/app/services/sync_engine.py`) to parse `Courses/` folders.
- [x] Implement Admin router and endpoint (`backend/app/routers/admin.py`) for triggering the synchronization.

## 3. React Frontend Foundation
- [x] Initialize Vite React SPA under `frontend/` directory.
- [x] Create `frontend/src/index.css` defining color variables and typography.
- [x] Configure Supabase client in `frontend/src/lib/supabase.js`.
- [x] Implement `frontend/src/context/AuthContext.jsx` for signup and login states.

## 4. Screens & Pages
- [x] Create the marketing Landing Page with a responsive hero and an interactive mini-regression plotter.
- [x] Create Auth page cards (unified Login and Signup screen).
- [x] Create Dashboard Home layout rendering the 21 courses mapped into 7 phases.
