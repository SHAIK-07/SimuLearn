from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import supabase_client, get_current_user

router = APIRouter()

@router.get("")
def get_all_courses(user=Depends(get_current_user)):
    """
    Retrieves all available courses.
    """
    try:
        response = supabase_client.table("courses").select("*").order("created_at").execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve courses: {str(e)}"
        )

@router.get("/{course_slug}")
def get_course_details(course_slug: str, user=Depends(get_current_user)):
    """
    Retrieves details of a specific course, including its topics.
    """
    try:
        # Fetch course record
        course_res = supabase_client.table("courses").select("*").eq("slug", course_slug).execute()
        if not course_res.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course '{course_slug}' not found"
            )
        course = course_res.data[0]

        # Fetch topics for this course
        topics_res = supabase_client.table("topics").select("*").eq("course_slug", course_slug).order("order_index").execute()
        course["topics"] = topics_res.data

        return course
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve course details: {str(e)}"
        )

@router.get("/{course_slug}/topics/{topic_slug}")
def get_topic_details(course_slug: str, topic_slug: str, user=Depends(get_current_user)):
    """
    Retrieves a specific topic, its lessons (with markdown/code content), and associated quizzes.
    """
    try:
        # Fetch topic record
        topic_res = supabase_client.table("topics").select("*").eq("slug", topic_slug).execute()
        if not topic_res.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Topic '{topic_slug}' not found"
            )
        topic = topic_res.data[0]

        # Fetch lessons for this topic
        lessons_res = supabase_client.table("lessons").select("*").eq("topic_slug", topic_slug).order("order_index").execute()
        lessons = lessons_res.data

        # Fetch quizzes for each lesson
        for lesson in lessons:
            quiz_res = supabase_client.table("quizzes").select("*").eq("lesson_slug", lesson["slug"]).execute()
            lesson["quiz"] = quiz_res.data[0] if quiz_res.data else None

        topic["lessons"] = lessons
        return topic
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve topic details: {str(e)}"
        )
