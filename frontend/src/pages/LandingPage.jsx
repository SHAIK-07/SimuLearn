import { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Zap,
  RotateCcw,
} from 'lucide-react'
import Logo from '../components/Logo'
import './LandingPage.css'

/* ---- Phase data for the landing grid ---- */
const PHASES = [
  {
    number: 'Phase 1',
    title: 'Foundation Tools',
    desc: 'Set up your environment and master Python, Git, and developer tooling.',
    courses: ['Setup & Tooling', 'Python', 'Tools & Protocols'],
    color: '#22C55E',
  },
  {
    number: 'Phase 2',
    title: 'Math & Classical ML',
    desc: 'Build intuition for linear algebra, calculus, probability, and core ML algorithms.',
    courses: ['Math Foundations', 'ML Fundamentals'],
    color: '#3B82F6',
  },
  {
    number: 'Phase 3',
    title: 'Deep Learning Core',
    desc: 'Dive into neural networks, computer vision, audio processing, and reinforcement learning.',
    courses: ['Deep Learning', 'Computer Vision', 'Speech & Audio', 'RL'],
    color: '#F59E0B',
  },
  {
    number: 'Phase 4',
    title: 'NLP & Transformers',
    desc: 'From word embeddings to attention mechanisms and state-of-the-art transformer architectures.',
    courses: ['NLP Foundations', 'Transformers Deep Dive'],
    color: '#EF4444',
  },
  {
    number: 'Phase 5',
    title: 'GenAI & LLM Foundations',
    desc: 'Understand LLMs from scratch, prompt engineering, multimodal AI, and generative models.',
    courses: ['LLMs from Scratch', 'LLM Engineering', 'GenAI', 'Multimodal AI'],
    color: '#EC4899',
  },
  {
    number: 'Phase 6',
    title: 'Agentic AI & Swarms',
    desc: 'Build autonomous agents, multi-agent systems, and tool-using AI architectures.',
    courses: ['Agent Engineering', 'Multi-Agent & Swarms', 'Autonomous Systems'],
    color: '#8B5CF6',
  },
  {
    number: 'Phase 7',
    title: 'Production & Alignment',
    desc: 'Deploy ML systems to production, study AI safety, ethics, and complete capstone projects.',
    courses: ['Infrastructure & Prod', 'Ethics & Alignment', 'Capstone'],
    color: '#06B6D4',
  },
]

/* ---- Linear regression helper ---- */
function computeRegression(points) {
  const n = points.length
  if (n < 2) return null
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  for (const { x, y } of points) {
    sumX += x
    sumY += y
    sumXY += x * y
    sumX2 += x * x
  }
  const denom = n * sumX2 - sumX * sumX
  if (Math.abs(denom) < 1e-10) return null
  const m = (n * sumXY - sumX * sumY) / denom
  const b = (sumY - m * sumX) / n
  return { m, b }
}

/* ---- Mini Regression Plotter ---- */
function RegressionPlotter() {
  const [points, setPoints] = useState([])
  const svgRef = useRef(null)

  const handleClick = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPoints((prev) => [...prev, { x, y }])
  }, [])

  const handleReset = useCallback(() => {
    setPoints([])
  }, [])

  const reg = computeRegression(points)
  let lineX1, lineY1, lineX2, lineY2
  if (reg) {
    lineX1 = 0
    lineY1 = reg.b
    lineX2 = 100
    lineY2 = reg.m * 100 + reg.b
  }

  return (
    <div className="landing-demo-container">
      <div className="landing-demo-header">
        <div className="landing-demo-title">
          <span className="landing-demo-dot" />
          Interactive Linear Regression
        </div>
        <button
          className="landing-demo-reset"
          onClick={handleReset}
          type="button"
        >
          <RotateCcw size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Reset
        </button>
      </div>

      <div className="landing-demo-canvas-wrapper" onClick={handleClick}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[20, 40, 60, 80].map((v) => (
            <g key={v}>
              <line
                x1={v} y1={0} x2={v} y2={100}
                stroke="rgba(51,65,85,0.3)" strokeWidth="0.2"
              />
              <line
                x1={0} y1={v} x2={100} y2={v}
                stroke="rgba(51,65,85,0.3)" strokeWidth="0.2"
              />
            </g>
          ))}

          {/* Regression line */}
          {reg && (
            <line
              x1={lineX1} y1={lineY1}
              x2={lineX2} y2={lineY2}
              stroke="#22C55E"
              strokeWidth="0.5"
              strokeDasharray="1.5 0.8"
              opacity={0.85}
            />
          )}

          {/* Data points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x} cy={pt.y} r="1.6"
                fill="#22C55E"
                opacity={0.9}
              />
              <circle
                cx={pt.x} cy={pt.y} r="3"
                fill="none"
                stroke="#22C55E"
                strokeWidth="0.3"
                opacity={0.3}
              />
            </g>
          ))}
        </svg>

        {points.length === 0 && (
          <div className="landing-demo-hint">
            Click anywhere to place data points
          </div>
        )}
      </div>

      <div className="landing-demo-equation">
        <span className="eq-label">Equation</span>
        {reg
          ? `y = ${reg.m.toFixed(3)}x + ${reg.b.toFixed(3)}`
          : 'Add 2+ points to fit a line'}
      </div>
    </div>
  )
}

/* ---- Landing Page ---- */
export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <Logo size={32} variant="full" />
        </Link>
        <nav className="landing-nav">
          <Link to="/auth" className="btn btn-secondary">
            Log In
          </Link>
          <Link to="/auth" className="btn btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <motion.div
          className="landing-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            21 Interactive Courses · 7 Learning Phases
          </div>

          <h1>
            Master AI & ML{' '}
            <span className="hero-gradient">Through Simulation</span>
          </h1>

          <p className="landing-hero-subtitle">
            SimuLearn transforms abstract machine learning concepts into
            hands-on interactive experiences. From Python basics to Agentic AI
            — learn by doing, not just reading.
          </p>

          <div className="landing-hero-cta">
            <Link to="/auth" className="btn btn-primary">
              Start Learning Free <ArrowRight size={16} />
            </Link>
            <a href="#demo" className="btn btn-outline">
              Try a Simulation
            </a>
          </div>
        </motion.div>

        <motion.div
          className="landing-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <div className="landing-stat">
            <div className="landing-stat-value">21</div>
            <div className="landing-stat-label">Courses</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-value">7</div>
            <div className="landing-stat-label">Phases</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-value">∞</div>
            <div className="landing-stat-label">Simulations</div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Demo */}
      <section className="landing-demo-section" id="demo">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          Try It Now
        </motion.h2>
        <motion.p
          className="landing-demo-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Click on the canvas below to place data points. Watch a linear
          regression line fit in real-time.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <RegressionPlotter />
        </motion.div>
      </section>

      {/* Phases Grid */}
      <section className="landing-phases-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          Your Learning Journey
        </motion.h2>
        <motion.p
          className="landing-phases-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Seven curated phases take you from zero to building production-grade
          AI systems.
        </motion.p>

        <div className="landing-phases-grid">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.number}
              className="landing-phase-card"
              style={{ '--phase-color': phase.color }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
            >
              <div
                className="landing-phase-number"
                style={{ color: phase.color }}
              >
                {phase.number}
              </div>
              <div className="landing-phase-title">{phase.title}</div>
              <div className="landing-phase-desc">{phase.desc}</div>
              <div className="landing-phase-courses">
                {phase.courses.map((c) => (
                  <span key={c} className="landing-phase-course-tag">
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-text">
          © {new Date().getFullYear()} SimuLearn — Interactive AI Learning
        </div>
        <div className="landing-footer-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <Link to="/auth">Sign Up</Link>
        </div>
      </footer>
    </div>
  )
}
