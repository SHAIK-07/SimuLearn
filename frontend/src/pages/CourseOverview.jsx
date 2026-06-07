import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Award, Play, CheckCircle, Circle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { BACKEND_URL } from '../lib/api'
import Logo from '../components/Logo'
import './CourseOverview.css'

export default function CourseOverview() {
  const { courseSlug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [completedTopics, setCompletedTopics] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user || !courseSlug) return

    async function fetchCourseAndProgress() {
      try {
        setLoading(true)
        // Get JWT session token
        const sessionRes = await supabase.auth.getSession()
        const token = sessionRes.data.session?.access_token

        if (!token) {
          throw new Error('Not authenticated')
        }

        // Fetch course details from backend
        const courseRes = await fetch(`${BACKEND_URL}/api/v1/courses/${courseSlug}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!courseRes.ok) {
          throw new Error(`Failed to load course details (Status: ${courseRes.status})`)
        }

        const courseData = await courseRes.json()
        setCourse(courseData)

        // Fetch user progress for this course from Supabase
        const { data: progressList, error: pError } = await supabase
          .from('user_progress')
          .select('topic_slug, completed')
          .eq('user_id', user.id)
          .eq('course_slug', courseSlug)

        if (pError) throw pError

        const completedSet = new Set(
          progressList.filter(p => p.completed).map(p => p.topic_slug)
        )
        setCompletedTopics(completedSet)
      } catch (err) {
        console.error('Error fetching course overview:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseAndProgress()
  }, [courseSlug, user])

  if (loading) {
    return (
      <div className="course-overview-loading">
        <div className="loader"></div>
        <p>Loading curriculum...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="course-overview-error">
        <h2>Failed to load course</h2>
        <p>{error || 'Course not found'}</p>
        <Link to="/dashboard" className="btn-back">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    )
  }

  const topics = course.topics || []
  const percentCompleted = topics.length > 0 
    ? Math.round((completedTopics.size / topics.length) * 100) 
    : 0

  return (
    <div className="course-overview-layout">
      {/* Top Header Navigation */}
      <header className="course-overview-nav">
        <Link to="/dashboard" className="btn-back">
          <ChevronLeft size={18} /> Back to Dashboard
        </Link>
        <Logo size={24} variant="symbol" />
      </header>

      <main className="course-overview-content">
        {/* Course Hero Panel */}
        <section className="course-hero-card">
          <div className="course-hero-info">
            <span className={`difficulty-badge ${course.difficulty.toLowerCase()}`}>
              {course.difficulty}
            </span>
            <h1>{course.title}</h1>
            <p className="course-desc">{course.description}</p>
            
            <div className="course-stats">
              <div className="stat-item">
                <Award size={16} />
                <span>{topics.length} Interactive Topics</span>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="course-progress-card">
            <div className="progress-card-info">
              <h3>Your Progress</h3>
              <p>{completedTopics.size} of {topics.length} topics completed</p>
            </div>
            
            <div className="progress-bar-wrapper">
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${percentCompleted}%` }}
                ></div>
              </div>
              <span className="progress-percent-label">{percentCompleted}%</span>
            </div>

            {topics.length > 0 && (
              <button 
                className="btn-start-course"
                onClick={() => {
                  // Find first incomplete topic or default to first topic
                  const nextTopic = topics.find(t => !completedTopics.has(t.slug)) || topics[0]
                  navigate(`/courses/${courseSlug}/topics/${nextTopic.slug}`)
                }}
              >
                <Play size={16} fill="currentColor" />
                {completedTopics.size > 0 ? 'Resume Learning' : 'Start Learning'}
              </button>
            )}
          </div>
        </section>

        {/* Curriculum Timeline */}
        <section className="curriculum-timeline-section">
          <h2>Curriculum Structure</h2>
          
          <div className="timeline-list">
            {topics.map((topic, index) => {
              const isCompleted = completedTopics.has(topic.slug)
              const displayIdx = String(index + 1).padStart(2, '0')
              
              return (
                <div 
                  key={topic.slug} 
                  className={`timeline-item ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="timeline-badge-column">
                    <div className="timeline-badge">
                      {isCompleted ? <CheckCircle size={16} className="icon-completed" /> : displayIdx}
                    </div>
                    {index < topics.length - 1 && <div className="timeline-line"></div>}
                  </div>

                  <div className="timeline-card">
                    <div className="timeline-card-main">
                      <h3>{topic.title}</h3>
                      <p>{topic.description || 'Practice coding and explore key concepts with interactive visualizations.'}</p>
                    </div>

                    <Link 
                      to={`/courses/${courseSlug}/topics/${topic.slug}`}
                      className="btn-enter-lesson"
                    >
                      <span>Explore</span>
                      <Play size={14} fill="currentColor" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
