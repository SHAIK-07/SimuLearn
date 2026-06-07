import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import admin

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
    "https://simu-learn.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "app": "SimuLearn API",
        "message": "Engine is running. Documentation available at /docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
