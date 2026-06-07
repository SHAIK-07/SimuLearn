import os
import re
import glob
from supabase import Client

def parse_markdown_title(md_path: str) -> str:
    """Extracts the first H1 header title from a markdown file."""
    if not os.path.exists(md_path):
        return "Untitled Lesson"
    try:
        with open(md_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("# "):
                    return line.replace("# ", "").strip()
    except Exception as e:
        print(f"Error parsing markdown title from {md_path}: {e}")
    return "Untitled Lesson"

def sync_courses_filesystem_to_db(supabase_client: Client, courses_root_dir: str):
    """
    Scans the filesystem Courses/ directory, extracts structure, and upserts to Supabase.
    """
    if not os.path.exists(courses_root_dir):
        raise FileNotFoundError(f"Courses root directory not found: {courses_root_dir}")
        
    print(f"Starting content synchronization from: {courses_root_dir}")
    
    # 1. Discover all Course folders starting with 'Course-'
    course_paths = glob.glob(os.path.join(courses_root_dir, "Course-*"))
    sync_results = {
        "courses_synced": 0,
        "topics_synced": 0,
        "lessons_synced": 0,
        "details": []
    }
    
    for c_path in course_paths:
        course_slug = os.path.basename(c_path) # e.g. 'Course-python'
        
        # Format human-friendly title
        title_words = course_slug.replace("Course-", "").replace("-", " ").title()
        
        # Choose custom meta properties based on course keywords
        difficulty = "Advanced"
        estimated_hours = 12
        icon_name = "Cpu"
        
        if "python" in course_slug or "setup" in course_slug:
            difficulty = "Beginner"
            estimated_hours = 8
            icon_name = "Terminal"
        elif "math" in course_slug or "ml-" in course_slug:
            difficulty = "Intermediate"
            estimated_hours = 10
            icon_name = "Activity"
        elif "llm" in course_slug or "generative" in course_slug or "transformers" in course_slug:
            difficulty = "Advanced"
            estimated_hours = 15
            icon_name = "MessageSquare"
        
        # Upsert Course record
        course_data = {
            "slug": course_slug,
            "title": title_words,
            "description": f"Learn the concepts, tools, and practices of {title_words} with hands-on interactive simulations.",
            "difficulty": difficulty,
            "estimated_hours": estimated_hours,
            "icon_name": icon_name
        }
        
        try:
            supabase_client.table("courses").upsert(course_data).execute()
            sync_results["courses_synced"] += 1
        except Exception as e:
            print(f"Error syncing course {course_slug}: {e}")
            continue
            
        # 2. Discover all Topic subdirectories (e.g. '01-Intro-to-Python')
        topic_dirs = [d for d in os.listdir(c_path) if os.path.isdir(os.path.join(c_path, d))]
        
        for t_dir in topic_dirs:
            # Check for order prefix (e.g., '01-Intro-to-Python')
            prefix_match = re.match(r"^(\d+)", t_dir)
            if not prefix_match:
                continue
            order_index = int(prefix_match.group(1))
            
            # Read Tutorial.md path
            md_file_path = os.path.join(c_path, t_dir, ".tutorial", "Tutorial.md")
            topic_title = parse_markdown_title(md_file_path)
            topic_slug = t_dir
            
            # Upsert Topic record
            topic_data = {
                "slug": topic_slug,
                "course_slug": course_slug,
                "title": topic_title,
                "description": f"Interactive course materials and conceptual animations for {topic_title}.",
                "order_index": order_index
            }
            
            try:
                supabase_client.table("topics").upsert(topic_data).execute()
                sync_results["topics_synced"] += 1
            except Exception as e:
                print(f"Error syncing topic {topic_slug}: {e}")
                continue
                
            # 3. Read quiz questions if quiz.json exists
            quiz_file_path = os.path.join(c_path, t_dir, ".tutorial", "quiz.json")
            quiz_questions = []
            if os.path.exists(quiz_file_path):
                try:
                    import json
                    with open(quiz_file_path, "r", encoding="utf-8") as f:
                        quiz_data = json.load(f)
                    if isinstance(quiz_data, dict):
                        quiz_questions = quiz_data.get("questions", [])
                    elif isinstance(quiz_data, list):
                        quiz_questions = quiz_data
                except Exception as e:
                    print(f"Error reading/parsing quiz.json for {topic_slug}: {e}")

            # 4. Create default Simple, Medium, and Hard simulation lessons
            for difficulty_level in ["Simple", "Medium", "Hard"]:
                lesson_idx = 1 if difficulty_level == "Simple" else (2 if difficulty_level == "Medium" else 3)
                lesson_slug = f"{topic_slug}-{difficulty_level.lower()}"
                
                # Relativize path for frontend fetching/reading
                content_path = os.path.relpath(md_file_path, courses_root_dir).replace("\\", "/")
                
                # Load markdown and code contents
                markdown_content = ""
                if os.path.exists(md_file_path):
                    try:
                        with open(md_file_path, "r", encoding="utf-8") as f:
                            markdown_content = f.read()
                    except Exception as e:
                        print(f"Error reading {md_file_path}: {e}")

                code_content = ""
                code_file_path = os.path.join(c_path, t_dir, "main.py")
                if os.path.exists(code_file_path):
                    try:
                        with open(code_file_path, "r", encoding="utf-8") as f:
                            code_content = f.read()
                    except Exception as e:
                        print(f"Error reading {code_file_path}: {e}")

                lesson_data = {
                    "slug": lesson_slug,
                    "topic_slug": topic_slug,
                    "title": f"{topic_title} ({difficulty_level} Mode)",
                    "content_path": content_path,
                    "difficulty_level": difficulty_level,
                    "order_index": lesson_idx,
                    "content_markdown": markdown_content,
                    "code_content": code_content
                }
                
                try:
                    supabase_client.table("lessons").upsert(lesson_data).execute()
                    sync_results["lessons_synced"] += 1
                except Exception as e:
                    print(f"Error syncing lesson {lesson_slug}: {e}")
                    continue

                # Filter and upsert quiz questions for this lesson
                # stage "pre" for Simple/Medium, stage "post" for Hard
                lesson_questions = []
                for q in quiz_questions:
                    stage = q.get("stage", "")
                    if difficulty_level in ["Simple", "Medium"]:
                        if stage == "pre" or not stage:
                            lesson_questions.append(q)
                    elif difficulty_level == "Hard":
                        if stage == "post" or not stage:
                            lesson_questions.append(q)

                if lesson_questions:
                    quiz_data = {
                        "lesson_slug": lesson_slug,
                        "questions": lesson_questions,
                        "passing_score": 70
                    }
                    try:
                        supabase_client.table("quizzes").upsert(quiz_data, on_conflict="lesson_slug").execute()
                    except Exception as e:
                        print(f"Error syncing quiz for lesson {lesson_slug}: {e}")
                    
        sync_results["details"].append(f"Successfully synced {course_slug} with {len(topic_dirs)} topics.")
        
    print(f"Synchronization complete: {sync_results['courses_synced']} courses, {sync_results['topics_synced']} topics, {sync_results['lessons_synced']} lessons.")
    return sync_results
