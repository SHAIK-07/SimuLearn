# Backend Development Guidelines

This document details the FastAPI application setup, API endpoints structure, Supabase authentication integration, CORS setup, and mock simulation execution pipelines.

---

## 1. FastAPI Application Setup

The backend handles computationally heavy simulation steps (e.g. running linear regressions, calculating attention scores, simulating agent reasoning loops).

### Required Dependencies (`backend/requirements.txt`)
```text
fastapi>=0.110.0
uvicorn>=0.28.0
pydantic>=2.6.0
python-dotenv>=1.0.1
supabase>=2.4.0
numpy>=1.26.0
scikit-learn>=1.4.0
```

---

## 2. Supabase JWT Authentication Integration

To secure endpoints, FastAPI validates the `Authorization: Bearer <JWT>` token issued by Supabase:

```python
# backend/app/dependencies.py
from fastapi import Header, HTTPException, status
from supabase import create_client, Client
import os

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header"
        )
    
    token = authorization.split(" ")[1]
    try:
        # Validate JWT with Supabase Auth
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid session token: {str(e)}"
        )
```

---

## 3. CORS & Middleware Configuration

Since the React app runs on a separate domain (or port during local development), CORS must be explicitly configured in `backend/main.py`:

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import simulation

app = FastAPI(title="SimuLearn Compute Engine API", version="1.0.0")

# Allow localhost (React) and production Vercel deployment domains
origins = [
    "http://localhost:5173",
    "https://simulearn.vercel.app",
    "https://simu-learn.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation.router, prefix="/api/v1/simulation")
```

---

## 4. Simulation Execution Helpers

### 4.1 Python Safe Run Executor (`app/services/code_exec.py`)
Provides safe AST parsing to mock the local scope updates:
- Parse code using `ast.parse` and check for unsafe packages (e.g. `import os`, `subprocess`).
- Step through the AST nodes, executing simple actions in a sandboxed local environment and capturing `locals()` at each step.
- Return variables dictionary alongside stack frames.

### 4.2 ML Gradient Descent Generator (`app/routers/simulation.py`)
Computes regression fitting iterations:
```python
# Example endpoint payload schema
from pydantic import BaseModel
from typing import List, Tuple

class MLFitRequest(BaseModel):
    points: List[Tuple[float, float]] # [(x1, y1), (x2, y2), ...]
    learning_rate: float
    epochs: int

@router.post("/ml/fit")
async def fit_linear_regression(data: MLFitRequest):
    # Calculates m, c updates per epoch and yields the line coordinates
    # and Mean Squared Error for animation steps.
    ...
```

### 4.3 Agentic ReAct Runner (`app/services/agent_loop.py`)
Steps through Agent Reasoning loops:
- Receives a prompt and system instruction.
- Runs a single cycle of the ReAct chain (Thought -> Action -> Observation).
- Evaluates if a tool (e.g. `Calculator`) needs to be run. If so, returns tool payload for the frontend to animate before proceeding.

---

## 5. Content Sync Service (`app/services/sync_engine.py`)

The Sync Engine reads the local `Courses/` directory recursively and updates Supabase tables. Below is the blueprint implementation:

```python
import os
import re
import glob
from supabase import Client

def parse_markdown_title(md_path: str) -> str:
    """Extracts the first H1 header title from a markdown file."""
    if not os.path.exists(md_path):
        return "Untitled Lesson"
    with open(md_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("# "):
                return line.replace("# ", "").strip()
    return "Untitled Lesson"

def sync_courses_filesystem_to_db(supabase_client: Client, courses_root_dir: str):
    """
    Scans the filesystem, parses metadata, and performs bulk upserts into Supabase.
    """
    # 1. Discover all Course folders starting with 'Course-'
    course_paths = glob.glob(os.path.join(courses_root_dir, "Course-*"))
    
    for c_path in course_paths:
        course_slug = os.path.basename(c_path) # e.g. 'Course-python'
        
        # Format human-friendly title
        title_words = course_slug.replace("Course-", "").replace("-", " ").title()
        
        # Upsert Course
        course_data = {
            "slug": course_slug,
            "title": title_words,
            "description": f"Comprehensive masterclass on {title_words}.",
            "difficulty": "Beginner" if "python" in course_slug or "math" in course_slug else "Advanced",
            "estimated_hours": 10,
            "icon_name": "Terminal" if "python" in course_slug else "Cpu"
        }
        supabase_client.table("courses").upsert(course_data).execute()
        
        # 2. Discover all Topic subdirectories (e.g. '01-Intro-to-Python')
        topic_dirs = [d for d in os.listdir(c_path) if os.path.isdir(os.path.join(c_path, d))]
        
        for t_dir in topic_dirs:
            # Check for ordering prefix (e.g., '01-Intro' -> order_index = 1)
            prefix_match = re.match(r"^(\d+)", t_dir)
            if not prefix_match:
                continue
            order_index = int(prefix_match.group(1))
            
            # Read Tutorial.md path
            md_file_path = os.path.join(c_path, t_dir, ".tutorial", "Tutorial.md")
            topic_title = parse_markdown_title(md_file_path)
            topic_slug = t_dir # e.g. '01-Intro-to-Python'
            
            # Upsert Topic
            topic_data = {
                "slug": topic_slug,
                "course_slug": course_slug,
                "title": topic_title,
                "description": f"Learn about {topic_title} step-by-step.",
                "order_index": order_index
            }
            supabase_client.table("topics").upsert(topic_data).execute()
            
            # 3. Create default Simple, Medium, and Hard simulation lessons
            for difficulty in ["Simple", "Medium", "Hard"]:
                lesson_idx = 1 if difficulty == "Simple" else (2 if difficulty == "Medium" else 3)
                lesson_slug = f"{topic_slug}-{difficulty.lower()}"
                
                lesson_data = {
                    "slug": lesson_slug,
                    "topic_slug": topic_slug,
                    "title": f"{topic_title} - {difficulty} Simulation",
                    "content_path": os.path.relpath(md_file_path, courses_root_dir).replace("\\", "/"),
                    "difficulty_level": difficulty,
                    "order_index": lesson_idx
                }
                supabase_client.table("lessons").upsert(lesson_data).execute()
```

