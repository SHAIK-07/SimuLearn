import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Settings,
  LogOut,
  GraduationCap,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  User,
  ShieldCheck,
  Calendar,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'
import './Dashboard.css'

/* ================================================================
   COURSE & PHASE DATA
   Maps the 21 Courses/ directories into 7 learning phases.
   ================================================================ */

const CURRICULUM = [
  {
    phase: 1,
    title: 'Foundation Tools',
    color: '#22C55E',
    courses: [
      { slug: 'Course-setup-and-tooling', title: 'Setup & Tooling', desc: 'Configure your environment with VS Code, Git, and terminal essentials.', difficulty: 'Beginner', icon: '🛠️' },
      { slug: 'Course-python', title: 'Python Programming', desc: 'Master Python from variables and loops to OOP, decorators, and async.', difficulty: 'Beginner', icon: '🐍' },
      { slug: 'Course-tools-and-protocols', title: 'Tools & Protocols', desc: 'Learn APIs, HTTP, JSON, MCP, and developer collaboration protocols.', difficulty: 'Beginner', icon: '🔗' },
    ],
  },
  {
    phase: 2,
    title: 'Math & Classical ML',
    color: '#3B82F6',
    courses: [
      { slug: 'Course-math-foundations', title: 'Math Foundations', desc: 'Linear algebra, calculus, probability, and statistics for ML.', difficulty: 'Intermediate', icon: '📐' },
      { slug: 'Course-ml-fundamentals', title: 'ML Fundamentals', desc: 'Regression, classification, clustering, and evaluation metrics.', difficulty: 'Intermediate', icon: '📊' },
    ],
  },
  {
    phase: 3,
    title: 'Deep Learning Core',
    color: '#F59E0B',
    courses: [
      { slug: 'Course-deep-learning-core', title: 'Deep Learning', desc: 'Neural networks, backpropagation, CNNs, RNNs, and optimization.', difficulty: 'Intermediate', icon: '🧠' },
      { slug: 'Course-computer-vision', title: 'Computer Vision', desc: 'Image classification, object detection, segmentation, and GANs.', difficulty: 'Intermediate', icon: '👁️' },
      { slug: 'Course-speech-and-audio', title: 'Speech & Audio', desc: 'Audio processing, spectrograms, ASR, and TTS systems.', difficulty: 'Intermediate', icon: '🎙️' },
      { slug: 'Course-reinforcement-learning', title: 'Reinforcement Learning', desc: 'MDPs, Q-learning, policy gradients, and multi-agent RL.', difficulty: 'Advanced', icon: '🎮' },
    ],
  },
  {
    phase: 4,
    title: 'NLP & Transformers',
    color: '#EF4444',
    courses: [
      { slug: 'Course-nlp-foundations-to-advanced', title: 'NLP Foundations', desc: 'Tokenization, embeddings, seq2seq, and attention mechanisms.', difficulty: 'Intermediate', icon: '💬' },
      { slug: 'Course-transformers-deep-dive', title: 'Transformers Deep Dive', desc: 'Self-attention, BERT, GPT architectures, and fine-tuning.', difficulty: 'Advanced', icon: '⚡' },
    ],
  },
  {
    phase: 5,
    title: 'GenAI & LLM Foundations',
    color: '#EC4899',
    courses: [
      { slug: 'Course-llms-from-scratch', title: 'LLMs from Scratch', desc: 'Build a language model from tokenizer to training loop.', difficulty: 'Advanced', icon: '🏗️' },
      { slug: 'Course-llm-engineering', title: 'LLM Engineering', desc: 'Prompt engineering, RAG, fine-tuning, and deployment patterns.', difficulty: 'Advanced', icon: '⚙️' },
      { slug: 'Course-generative-ai', title: 'Generative AI', desc: 'Diffusion models, VAEs, image and text generation.', difficulty: 'Advanced', icon: '🎨' },
      { slug: 'Course-multimodal-ai', title: 'Multimodal AI', desc: 'Vision-language models, CLIP, and cross-modal learning.', difficulty: 'Advanced', icon: '🌐' },
    ],
  },
  {
    phase: 6,
    title: 'Agentic AI & Swarms',
    color: '#8B5CF6',
    courses: [
      { slug: 'Course-agent-engineering', title: 'Agent Engineering', desc: 'Tool use, ReAct, function calling, and agent architectures.', difficulty: 'Advanced', icon: '🤖' },
      { slug: 'Course-multi-agent-and-swarms', title: 'Multi-Agent & Swarms', desc: 'Agent orchestration, communication protocols, and swarm patterns.', difficulty: 'Advanced', icon: '🐝' },
      { slug: 'Course-autonomous-systems', title: 'Autonomous Systems', desc: 'Self-driving logic, robotics integration, and decision loops.', difficulty: 'Advanced', icon: '🚀' },
    ],
  },
  {
    phase: 7,
    title: 'Production & Alignment',
    color: '#06B6D4',
    courses: [
      { slug: 'Course-infrastructure-and-production', title: 'Infrastructure & Prod', desc: 'MLOps, model serving, monitoring, and CI/CD for ML.', difficulty: 'Advanced', icon: '🏭' },
      { slug: 'Course-ethics-safety-alignment', title: 'Ethics & Alignment', desc: 'AI safety, fairness, RLHF, constitutional AI, and governance.', difficulty: 'Advanced', icon: '🛡️' },
      { slug: 'Course-capstone-projects', title: 'Capstone Projects', desc: 'End-to-end projects combining everything you have learned.', difficulty: 'Advanced', icon: '🏆' },
    ],
  },
]

/* ---- SVG Progress Ring ---- */
function ProgressRing({ size = 48, strokeWidth = 3, percent = 0, color = '#22C55E', className = '' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} className={className}>
      <circle
        className="phase-ring-bg"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className="phase-ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        className="phase-ring-text"
        x={size / 2}
        y={size / 2}
      >
        {percent}%
      </text>
    </svg>
  )
}

/* Small ring variant for course cards */
function CourseRing({ percent = 0, color = '#22C55E' }) {
  const size = 36
  const sw = 2.5
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const off = circ - (percent / 100) * circ

  return (
    <svg width={size} height={size} className="course-card-progress">
      <circle className="course-ring-bg" cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} />
      <circle
        className="course-ring-fill"
        cx={size / 2} cy={size / 2} r={r}
        strokeWidth={sw}
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text className="course-ring-text" x={size / 2} y={size / 2}>
        {percent}%
      </text>
    </svg>
  )
}

/* ================================================================
   DASHBOARD PAGE
   ================================================================ */
export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, my-courses, achievements, settings

  const [progressData, setProgressData] = useState({})
  const [totalTopicsCount, setTotalTopicsCount] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(true)

  // Settings Form State
  const [fullNameInput, setFullNameInput] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Achievements State
  const [achievementsList, setAchievementsList] = useState([])
  const [quizzesCount, setQuizzesCount] = useState(0)

  // Fetch Supabase data
  useEffect(() => {
    if (!user) return

    setFullNameInput(user?.user_metadata?.full_name || '')

    async function fetchProgress() {
      try {
        setLoadingProgress(true)
        // Fetch user progress
        const { data: progressList, error: pError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)

        if (pError) throw pError

        // Fetch topics to know how many there are per course
        const { data: topicsList, error: tError } = await supabase
          .from('topics')
          .select('slug, course_slug')

        if (tError) throw tError

        setTotalTopicsCount(topicsList.length)

        // Calculate progress percentage per course
        const courseMap = {}
        topicsList.forEach((topic) => {
          if (!courseMap[topic.course_slug]) {
            courseMap[topic.course_slug] = { total: 0, completed: 0 }
          }
          courseMap[topic.course_slug].total += 1
          
          const isCompleted = progressList.some(
            (p) => p.topic_slug === topic.slug && p.completed
          )
          if (isCompleted) {
            courseMap[topic.course_slug].completed += 1
          }
        })

        const progressPercent = {}
        Object.keys(courseMap).forEach((slug) => {
          const { total, completed } = courseMap[slug]
          progressPercent[slug] = total > 0 ? Math.round((completed / total) * 100) : 0
        })

        setProgressData(progressPercent)

        // Fetch quiz submissions for achievements checking
        const { data: quizSubs, error: qError } = await supabase
          .from('quiz_submissions')
          .select('*')
          .eq('user_id', user.id)

        if (!qError && quizSubs) {
          const passedCount = quizSubs.filter(s => s.passed).length
          setQuizzesCount(passedCount)

          const completedCount = progressList.filter(p => p.completed).length
          const hasPerfectScore = quizSubs.some(s => s.score === 100)
          
          // Count completed Python topics
          const pythonCompletedCount = progressList.filter(
            p => p.topic_slug.startsWith('0') && p.completed && topicsList.some(t => t.slug === p.topic_slug && t.course_slug === 'Course-python')
          ).length

          // Check if Phase 1 is fully completed (all courses inside phase 1 have progress === 100%)
          const phase1Courses = CURRICULUM[0].courses
          const isPhase1Done = phase1Courses.length > 0 && phase1Courses.every(c => progressPercent[c.slug] === 100)

          // Unlocking Badges dynamically
          const badges = [
            { id: 'first-steps', title: 'First Steps', desc: 'Completed your first lesson topic', unlocked: completedCount > 0 },
            { id: 'python-cadet', title: 'Python Cadet', desc: 'Completed 5 topics in Python Programming', unlocked: pythonCompletedCount >= 5 },
            { id: 'quiz-whiz', title: 'Quiz Whiz', desc: 'Passed 3 checkpoint quizzes', unlocked: passedCount >= 3 },
            { id: 'perfect-score', title: 'Perfect Score', desc: 'Scored 100% on any lesson quiz', unlocked: hasPerfectScore },
            { id: 'phase1-grad', title: 'Phase 1 Graduate', desc: 'Fully completed Phase 1 (Foundation Tools)', unlocked: isPhase1Done },
          ]
          setAchievementsList(badges)
        }
      } catch (err) {
        console.error('Error fetching progress:', err)
      } finally {
        setLoadingProgress(false)
      }
    }

    fetchProgress()
  }, [user])

  // Filter CURRICULUM for started courses
  const enrolledCourses = useMemo(() => {
    return CURRICULUM.flatMap(p => p.courses.map(c => ({ ...c, phaseColor: p.color })))
      .filter(c => (progressData[c.slug] || 0) > 0)
  }, [progressData])

  // For each phase, average progress of its courses
  const phaseProgress = useMemo(() => {
    const progress = {}
    CURRICULUM.forEach((phase) => {
      let totalCompleted = 0
      let totalCount = 0
      phase.courses.forEach((course) => {
        const percent = progressData[course.slug] || 0
        totalCompleted += percent
        totalCount += 1
      })
      progress[phase.phase] = totalCount > 0 ? Math.round(totalCompleted / totalCount) : 0
    })
    return progress
  }, [progressData])

  // Overall course completion rate
  const overallProgress = useMemo(() => {
    const coursesCount = CURRICULUM.flatMap((p) => p.courses).length
    if (coursesCount === 0) return 0
    const totalPercentage = CURRICULUM.flatMap((p) => p.courses).reduce(
      (sum, course) => sum + (progressData[course.slug] || 0),
      0
    )
    return Math.round(totalPercentage / coursesCount)
  }, [progressData])

  // Update full name in Supabase
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!fullNameInput.trim()) return

    try {
      setIsUpdatingProfile(true)
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullNameInput }
      })
      if (error) throw error
      alert('Profile updated successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to update profile: ' + err.message)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Learner'
  const userFullName = user?.user_metadata?.full_name || 'Learner'
  const userEmail = user?.email || ''
  const initials = firstName.charAt(0).toUpperCase()

  const totalCourses = 21

  return (
    <div className="dashboard-layout">
      {/* ---- Sidebar ---- */}
      <aside className="dashboard-sidebar">
        <Link to="/" className="sidebar-brand">
          <Logo size={28} variant="full" />
        </Link>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Menu</div>
          <button 
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            type="button"
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'my-courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-courses')}
            type="button"
          >
            <BookOpen size={18} /> My Courses
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
            type="button"
          >
            <Trophy size={18} /> Achievements
          </button>

          <div className="sidebar-nav-label">Account</div>
          <button 
            className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            type="button"
          >
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{firstName}</div>
            <div className="sidebar-user-email">{userEmail}</div>
          </div>
          <button
            className="sidebar-signout"
            onClick={handleSignOut}
            title="Sign out"
            type="button"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* ---- Main Content ---- */}
      <main className="dashboard-main">
        {/* TAB 1: CURRICULUM GRID */}
        {activeTab === 'dashboard' && (
          <>
            {/* Greeting */}
            <motion.div
              className="dashboard-greeting"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h1>Welcome back, {firstName} 👋</h1>
              <p>Pick up where you left off, or start a new course.</p>
            </motion.div>

            {/* Overview Cards */}
            <motion.div
              className="dashboard-overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
            >
              <div className="overview-card">
                <div className="overview-icon" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <BookOpen size={22} color="#22C55E" />
                </div>
                <div className="overview-content">
                  <h3>{totalCourses}</h3>
                  <p>Total Courses</p>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-icon" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <Layers size={22} color="#8B5CF6" />
                </div>
                <div className="overview-content">
                  <h3>7</h3>
                  <p>Learning Phases</p>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <GraduationCap size={22} color="#3B82F6" />
                </div>
                <div className="overview-content">
                  <h3>{totalTopicsCount}</h3>
                  <p>Total Topics</p>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
                  <Sparkles size={22} color="#F59E0B" />
                </div>
                <div className="overview-content">
                  <h3>{overallProgress}%</h3>
                  <p>Completed</p>
                </div>
              </div>
            </motion.div>

            {/* Phase Sections */}
            {CURRICULUM.map((phase, phaseIdx) => (
              <motion.section
                key={phase.phase}
                className="dashboard-phase"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + phaseIdx * 0.06, duration: 0.45 }}
              >
                <div className="phase-header">
                  <ProgressRing
                    size={48}
                    percent={phaseProgress[phase.phase] || 0}
                    color={phase.color}
                    className="phase-progress-ring"
                  />
                  <div>
                    <div className="phase-label" style={{ color: phase.color }}>
                      Phase {phase.phase}
                    </div>
                    <div className="phase-title">{phase.title}</div>
                  </div>
                </div>

                <div className="phase-courses-grid">
                  {phase.courses.map((course, ci) => (
                    <Link
                      key={course.slug}
                      to={`/courses/${course.slug}`}
                      className="course-card-link"
                    >
                      <motion.div
                        className="course-card"
                        style={{ '--course-accent': phase.color }}
                        whileHover={{ y: -3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <div className="course-card-header">
                          <div
                            className="course-card-icon"
                            style={{ background: `${phase.color}15` }}
                          >
                            {course.icon}
                          </div>
                          <CourseRing percent={progressData[course.slug] || 0} color={phase.color} />
                        </div>

                        <div className="course-card-title">{course.title}</div>
                        <div className="course-card-desc">{course.desc}</div>

                        <div className="course-card-meta">
                          <span
                            className={`course-meta-tag ${course.difficulty.toLowerCase()}`}
                          >
                            {course.difficulty}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            ))}
          </>
        )}

        {/* TAB 2: MY COURSES */}
        {activeTab === 'my-courses' && (
          <motion.div
            className="tab-my-courses"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="dashboard-greeting">
              <h1>My Enrolled Courses</h1>
              <p>Continue your progress in the courses you have started.</p>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="tab-empty-state">
                <BookOpen size={48} className="icon-empty" />
                <h3>No courses started yet</h3>
                <p>Select any course from the dashboard catalog to begin your learning journey.</p>
                <button className="btn-empty-action" onClick={() => setActiveTab('dashboard')}>
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="phase-courses-grid">
                {enrolledCourses.map((course) => (
                  <Link
                    key={course.slug}
                    to={`/courses/${course.slug}`}
                    className="course-card-link"
                  >
                    <motion.div
                      className="course-card"
                      style={{ '--course-accent': course.phaseColor }}
                      whileHover={{ y: -3 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div className="course-card-header">
                        <div
                          className="course-card-icon"
                          style={{ background: `${course.phaseColor}15` }}
                        >
                          {course.icon}
                        </div>
                        <CourseRing percent={progressData[course.slug] || 0} color={course.phaseColor} />
                      </div>

                      <div className="course-card-title">{course.title}</div>
                      <div className="course-card-desc">{course.desc}</div>

                      <div className="course-card-meta">
                        <span
                          className={`course-meta-tag ${course.difficulty.toLowerCase()}`}
                        >
                          {course.difficulty}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <motion.div
            className="tab-achievements"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="dashboard-greeting">
              <h1>Achievements & Badges</h1>
              <p>Unlock checkpoint milestones as you master simulations and pass quizzes.</p>
            </div>

            <div className="achievements-summary-panel">
              <div className="ach-stat-card">
                <span className="stat-num">{achievementsList.filter(a => a.unlocked).length} / {achievementsList.length}</span>
                <span className="stat-lbl">Badges Unlocked</span>
              </div>
              <div className="ach-stat-card">
                <span className="stat-num">{quizzesCount}</span>
                <span className="stat-lbl">Quizzes Passed</span>
              </div>
            </div>

            <div className="badges-list-grid">
              {achievementsList.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`badge-item-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="badge-icon-box">
                    {badge.unlocked ? (
                      <Award size={32} className="icon-badge-active" />
                    ) : (
                      <Lock size={32} className="icon-badge-inactive" />
                    )}
                  </div>
                  <div className="badge-details">
                    <h3>{badge.title}</h3>
                    <p>{badge.desc}</p>
                    <span className="status-label">{badge.unlocked ? '✓ Unlocked' : 'Locked'}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <motion.div
            className="tab-settings"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="dashboard-greeting">
              <h1>Profile & Settings</h1>
              <p>Manage your account configuration and personalization stats.</p>
            </div>

            <div className="settings-split-layout">
              {/* Profile card */}
              <form className="settings-card" onSubmit={handleUpdateProfile}>
                <h3>Account Details</h3>
                
                <div className="settings-field-group">
                  <label htmlFor="fullName">Display Name</label>
                  <div className="input-with-icon">
                    <User size={16} />
                    <input 
                      id="fullName" 
                      type="text" 
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className="settings-field-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon disabled">
                    <ShieldCheck size={16} />
                    <input id="email" type="email" value={userEmail} disabled />
                  </div>
                  <span className="field-note">Email cannot be changed on free trial.</span>
                </div>

                <button className="btn-update-profile" type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? 'Updating...' : 'Update Details'}
                </button>
              </form>

              {/* Stats card */}
              <div className="settings-card stats-card">
                <h3>Technical Stats</h3>
                <div className="tech-stats-list">
                  <div className="tech-stat-row">
                    <span className="lbl"><Calendar size={14} /> Joined SimuLearn</span>
                    <span className="val">{new Date(user?.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="tech-stat-row">
                    <span className="lbl"><ShieldCheck size={14} /> Account Role</span>
                    <span className="val font-mono">user_sandbox</span>
                  </div>
                  <div className="tech-stat-row">
                    <span className="lbl"><Layers size={14} /> Synced Core Version</span>
                    <span className="val font-mono">v1.2.0-stable</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
