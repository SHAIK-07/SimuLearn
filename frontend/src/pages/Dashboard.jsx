import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Settings,
  LogOut,
  Clock,
  GraduationCap,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import './Dashboard.css'

/* ================================================================
   COURSE & PHASE DATA
   Maps the 21 Courses/ directories into 7 learning phases.
   In a real app this comes from the DB — hardcoded for Phase 1.
   ================================================================ */

const CURRICULUM = [
  {
    phase: 1,
    title: 'Foundation Tools',
    color: '#22C55E',
    courses: [
      { slug: 'Course-setup-and-tooling', title: 'Setup & Tooling', desc: 'Configure your environment with VS Code, Git, and terminal essentials.', difficulty: 'Beginner', hours: 6, icon: '🛠️' },
      { slug: 'Course-python', title: 'Python Programming', desc: 'Master Python from variables and loops to OOP, decorators, and async.', difficulty: 'Beginner', hours: 30, icon: '🐍' },
      { slug: 'Course-tools-and-protocols', title: 'Tools & Protocols', desc: 'Learn APIs, HTTP, JSON, MCP, and developer collaboration protocols.', difficulty: 'Beginner', hours: 8, icon: '🔗' },
    ],
  },
  {
    phase: 2,
    title: 'Math & Classical ML',
    color: '#3B82F6',
    courses: [
      { slug: 'Course-math-foundations', title: 'Math Foundations', desc: 'Linear algebra, calculus, probability, and statistics for ML.', difficulty: 'Intermediate', hours: 24, icon: '📐' },
      { slug: 'Course-ml-fundamentals', title: 'ML Fundamentals', desc: 'Regression, classification, clustering, and evaluation metrics.', difficulty: 'Intermediate', hours: 28, icon: '📊' },
    ],
  },
  {
    phase: 3,
    title: 'Deep Learning Core',
    color: '#F59E0B',
    courses: [
      { slug: 'Course-deep-learning-core', title: 'Deep Learning', desc: 'Neural networks, backpropagation, CNNs, RNNs, and optimization.', difficulty: 'Intermediate', hours: 32, icon: '🧠' },
      { slug: 'Course-computer-vision', title: 'Computer Vision', desc: 'Image classification, object detection, segmentation, and GANs.', difficulty: 'Intermediate', hours: 20, icon: '👁️' },
      { slug: 'Course-speech-and-audio', title: 'Speech & Audio', desc: 'Audio processing, spectrograms, ASR, and TTS systems.', difficulty: 'Intermediate', hours: 16, icon: '🎙️' },
      { slug: 'Course-reinforcement-learning', title: 'Reinforcement Learning', desc: 'MDPs, Q-learning, policy gradients, and multi-agent RL.', difficulty: 'Advanced', hours: 22, icon: '🎮' },
    ],
  },
  {
    phase: 4,
    title: 'NLP & Transformers',
    color: '#EF4444',
    courses: [
      { slug: 'Course-nlp-foundations-to-advanced', title: 'NLP Foundations', desc: 'Tokenization, embeddings, seq2seq, and attention mechanisms.', difficulty: 'Intermediate', hours: 24, icon: '💬' },
      { slug: 'Course-transformers-deep-dive', title: 'Transformers Deep Dive', desc: 'Self-attention, BERT, GPT architectures, and fine-tuning.', difficulty: 'Advanced', hours: 20, icon: '⚡' },
    ],
  },
  {
    phase: 5,
    title: 'GenAI & LLM Foundations',
    color: '#EC4899',
    courses: [
      { slug: 'Course-llms-from-scratch', title: 'LLMs from Scratch', desc: 'Build a language model from tokenizer to training loop.', difficulty: 'Advanced', hours: 28, icon: '🏗️' },
      { slug: 'Course-llm-engineering', title: 'LLM Engineering', desc: 'Prompt engineering, RAG, fine-tuning, and deployment patterns.', difficulty: 'Advanced', hours: 22, icon: '⚙️' },
      { slug: 'Course-generative-ai', title: 'Generative AI', desc: 'Diffusion models, VAEs, image and text generation.', difficulty: 'Advanced', hours: 18, icon: '🎨' },
      { slug: 'Course-multimodal-ai', title: 'Multimodal AI', desc: 'Vision-language models, CLIP, and cross-modal learning.', difficulty: 'Advanced', hours: 16, icon: '🌐' },
    ],
  },
  {
    phase: 6,
    title: 'Agentic AI & Swarms',
    color: '#8B5CF6',
    courses: [
      { slug: 'Course-agent-engineering', title: 'Agent Engineering', desc: 'Tool use, ReAct, function calling, and agent architectures.', difficulty: 'Advanced', hours: 20, icon: '🤖' },
      { slug: 'Course-multi-agent-and-swarms', title: 'Multi-Agent & Swarms', desc: 'Agent orchestration, communication protocols, and swarm patterns.', difficulty: 'Advanced', hours: 18, icon: '🐝' },
      { slug: 'Course-autonomous-systems', title: 'Autonomous Systems', desc: 'Self-driving logic, robotics integration, and decision loops.', difficulty: 'Advanced', hours: 16, icon: '🚀' },
    ],
  },
  {
    phase: 7,
    title: 'Production & Alignment',
    color: '#06B6D4',
    courses: [
      { slug: 'Course-infrastructure-and-production', title: 'Infrastructure & Prod', desc: 'MLOps, model serving, monitoring, and CI/CD for ML.', difficulty: 'Advanced', hours: 20, icon: '🏭' },
      { slug: 'Course-ethics-safety-alignment', title: 'Ethics & Alignment', desc: 'AI safety, fairness, RLHF, constitutional AI, and governance.', difficulty: 'Advanced', hours: 14, icon: '🛡️' },
      { slug: 'Course-capstone-projects', title: 'Capstone Projects', desc: 'End-to-end projects combining everything you have learned.', difficulty: 'Advanced', hours: 40, icon: '🏆' },
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

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Learner'
  const userEmail = user?.email || ''
  const initials = firstName.charAt(0).toUpperCase()

  /* Summary stats (placeholder — will connect to DB later) */
  const totalCourses = 21
  const totalHours = useMemo(
    () => CURRICULUM.flatMap((p) => p.courses).reduce((s, c) => s + c.hours, 0),
    [],
  )

  return (
    <div className="dashboard-layout">
      {/* ---- Sidebar ---- */}
      <aside className="dashboard-sidebar">
        <Link to="/" className="sidebar-brand">
          <Logo size={28} variant="full" />
        </Link>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Menu</div>
          <button className="sidebar-nav-item active" type="button">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className="sidebar-nav-item" type="button">
            <BookOpen size={18} /> My Courses
          </button>
          <button className="sidebar-nav-item" type="button">
            <Trophy size={18} /> Achievements
          </button>

          <div className="sidebar-nav-label">Account</div>
          <button className="sidebar-nav-item" type="button">
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
              <Clock size={22} color="#3B82F6" />
            </div>
            <div className="overview-content">
              <h3>{totalHours}h</h3>
              <p>Total Content</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <Sparkles size={22} color="#F59E0B" />
            </div>
            <div className="overview-content">
              <h3>0%</h3>
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
                percent={0}
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
                <motion.div
                  key={course.slug}
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
                    <CourseRing percent={0} color={phase.color} />
                  </div>

                  <div className="course-card-title">{course.title}</div>
                  <div className="course-card-desc">{course.desc}</div>

                  <div className="course-card-meta">
                    <span
                      className={`course-meta-tag ${course.difficulty.toLowerCase()}`}
                    >
                      {course.difficulty}
                    </span>
                    <span className="course-meta-hours">
                      <Clock size={13} />
                      {course.hours}h
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </main>
    </div>
  )
}
