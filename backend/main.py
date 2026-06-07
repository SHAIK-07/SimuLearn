import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import admin, courses

app = FastAPI(
    title="SimuLearn API Engine", 
    description="Stateless compute services and sync engine for SimuLearn",
    version="1.0.0"
)

# Allow React app (local development & standard subdomains)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://simulearn.vercel.app",
    "https://simu-learn.vercel.app",
    "https://simu-learn-teal.vercel.app",
    "https://simulation-learn.vercel.app",
]

# Allow additional origins from environment variable if set
env_origins = os.getenv("CORS_ORIGINS")
if env_origins:
    origins.extend([origin.strip() for origin in env_origins.split(",") if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(courses.router, prefix="/api/v1/courses", tags=["courses"])

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "app": "SimuLearn API",
        "message": "Engine is running. Documentation available at /docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
