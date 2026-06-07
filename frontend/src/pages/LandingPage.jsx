import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Zap,
  RotateCcw,
  Code,
  Cpu,
  Layers,
  Sliders,
  Terminal,
  ExternalLink,
  Heart,
  Play,
  CheckCircle,
  Network
} from 'lucide-react'
import Logo from '../components/Logo'
import './LandingPage.css'

const GithubIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-github ${className}`}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

/* ---- Phase Data for Roadmap ---- */
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

/* ============================================================================
   ENGINES DATA CONFIG
   ============================================================================ */
const ENGINES = [
  {
    id: 'python',
    name: 'Python Engine',
    icon: Code,
    color: '#22C55E',
    topic: 'Memory & Execution Visualizer',
    desc: 'Witness variables, frame scopes, and OOP heap references update line-by-line.'
  },
  {
    id: 'ml',
    name: 'ML 2D Plotter',
    icon: Sliders,
    color: '#3B82F6',
    topic: 'Geometric Intuition & Loss Fitting',
    desc: 'Adjust decision boundaries and watch gradient descent, K-Means clustering, or tree cuts fit data.'
  },
  {
    id: 'dl',
    name: 'DL Visualizer',
    icon: Network,
    color: '#F59E0B',
    topic: 'Synapse Weights & Activation Flows',
    desc: 'Trigger forward/backward propagation pulses or watch 2D convolution filters extract features.'
  },
  {
    id: 'llm',
    name: 'LLM Tokenizer & Softmax',
    icon: Layers,
    color: '#EC4899',
    topic: 'Vocabulary IDs & Attention Context',
    desc: 'Visualize subword tokenization, temperature creativity probabilities, and attention weights.'
  },
  {
    id: 'agent',
    name: 'Agentic Flow',
    icon: Cpu,
    color: '#8B5CF6',
    topic: 'ReAct loops & Multi-Agent Swarms',
    desc: 'Trace LLM planners calling tools, routing queries, or running collaborative peer debates.'
  }
]

/* ============================================================================
   ENGINE 1: PYTHON EXECUTION SIMULATOR
   ============================================================================ */
function PythonSimulator({ level }) {
  const [step, setStep] = useState(0)

  // Reset step when level changes
  useEffect(() => {
    setStep(0)
  }, [level])

  // Simple Level Data
  const simpleCode = [
    'a = 10',
    'b = 20',
    'c = a + b'
  ]
  const simpleStack = [
    {},
    { a: 10 },
    { a: 10, b: 20 },
    { a: 10, b: 20, c: 30 }
  ]

  // Medium Level Data (Recursion)
  const mediumCode = [
    'def fact(n):',
    '    if n <= 1: return 1',
    '    return n * fact(n-1)',
    '# Call function',
    'result = fact(3)'
  ]
  const mediumStack = [
    [{ name: 'Global', vars: {} }], // step 0
    [{ name: 'Global', vars: {} }, { name: 'fact(n=3)', vars: { n: 3 } }], // step 1
    [{ name: 'Global', vars: {} }, { name: 'fact(n=3)', vars: { n: 3 } }, { name: 'fact(n=2)', vars: { n: 2 } }], // step 2
    [{ name: 'Global', vars: {} }, { name: 'fact(n=3)', vars: { n: 3 } }, { name: 'fact(n=2)', vars: { n: 2 } }, { name: 'fact(n=1)', vars: { n: 1 } }], // step 3 (base case reached)
    [{ name: 'Global', vars: {} }, { name: 'fact(n=3)', vars: { n: 3 } }, { name: 'fact(n=2)', vars: { n: 2, 'ret': 1 } }], // step 4
    [{ name: 'Global', vars: {} }, { name: 'fact(n=3)', vars: { n: 3, 'ret': 2 } }], // step 5
    [{ name: 'Global', vars: { result: 6 } }] // step 6
  ]

  // Advanced Level Data (OOP References)
  const advCode = [
    'class Person:',
    '    def __init__(self, name):',
    '        self.name = name',
    '',
    'p1 = Person("Alice")',
    'p2 = p1'
  ]

  const totalSteps = level === 'simple' ? 3 : level === 'medium' ? 6 : 2

  const handleNext = () => {
    if (step < totalSteps) setStep(prev => prev + 1)
  }
  const handlePrev = () => {
    if (step > 0) setStep(prev => prev - 1)
  }

  return (
    <div className="sim-panel-split">
      <div className="sim-code-column">
        <div className="column-title">Code Editor</div>
        <div className="code-box font-mono">
          {level === 'simple' && simpleCode.map((line, idx) => (
            <div key={idx} className={`code-line ${step === idx + 1 ? 'active' : ''}`}>
              <span className="line-num">{idx + 1}</span> {line}
            </div>
          ))}
          {level === 'medium' && mediumCode.map((line, idx) => {
            let active = false
            if (step === 0 && idx === 4) active = true
            if (step === 1 && idx === 0) active = true
            if (step === 2 && idx === 2) active = true
            if (step === 3 && idx === 1) active = true
            if (step === 4 && idx === 2) active = true
            if (step === 5 && idx === 2) active = true
            if (step === 6 && idx === 4) active = true
            return (
              <div key={idx} className={`code-line ${active ? 'active' : ''}`}>
                <span className="line-num">{idx + 1}</span> {line}
              </div>
            )
          })}
          {level === 'advanced' && advCode.map((line, idx) => (
            <div key={idx} className={`code-line ${(step === 1 && idx === 4) || (step === 2 && idx === 5) ? 'active' : ''}`}>
              <span className="line-num">{idx + 1}</span> {line}
            </div>
          ))}
        </div>
        <div className="sim-controls">
          <button className="btn btn-secondary btn-xs" onClick={handlePrev} disabled={step === 0}>
            Back
          </button>
          <button className="btn btn-primary btn-xs" onClick={handleNext} disabled={step === totalSteps}>
            Next Step
          </button>
          <button className="btn btn-outline btn-xs" onClick={() => setStep(0)}>
            Reset
          </button>
        </div>
      </div>

      <div className="sim-viz-column">
        <div className="column-title">Memory State</div>
        <div className="viz-container">
          {level === 'simple' && (
            <div className="stack-container">
              <h4>Stack Variables</h4>
              <div className="stack-items">
                {Object.keys(simpleStack[step]).length === 0 ? (
                  <div className="empty-msg">No variables allocated yet. Click 'Next Step'.</div>
                ) : (
                  Object.entries(simpleStack[step]).map(([key, val]) => (
                    <motion.div
                      key={key}
                      className="stack-var-card"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="var-name font-mono">{key}</span>
                      <span className="var-arrow">→</span>
                      <span className="var-val font-mono">{val}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {level === 'medium' && (
            <div className="stack-frames-list">
              <h4>Active Call Stack</h4>
              <AnimatePresence mode="popLayout">
                {mediumStack[step].slice().reverse().map((frame, idx) => (
                  <motion.div
                    key={frame.name + idx}
                    className="stack-frame-card"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className="frame-name font-mono">{frame.name}</div>
                    <div className="frame-vars">
                      {Object.entries(frame.vars).map(([k, v]) => (
                        <div key={k} className="frame-var font-mono">
                          {k}: {v}
                        </div>
                      ))}
                      {Object.keys(frame.vars).length === 0 && <span className="muted font-sans">No local vars</span>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {level === 'advanced' && (
            <div className="heap-layout">
              <div className="heap-section">
                <h4>Stack (References)</h4>
                <div className="stack-items">
                  {step >= 1 && (
                    <div className="stack-var-card">
                      <span className="var-name font-mono">p1</span>
                      <span className="var-arrow font-mono">→ #0x7f1a</span>
                    </div>
                  )}
                  {step >= 2 && (
                    <div className="stack-var-card">
                      <span className="var-name font-mono">p2</span>
                      <span className="var-arrow font-mono">→ #0x7f1a</span>
                    </div>
                  )}
                  {step === 0 && <div className="empty-msg">Step to instantiate Person.</div>}
                </div>
              </div>
              <div className="heap-section">
                <h4>Heap Objects</h4>
                {step >= 1 ? (
                  <motion.div
                    className="heap-node font-mono"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="node-address">#0x7f1a</div>
                    <div className="node-type">Person Object</div>
                    <div className="node-content">name: "Alice"</div>
                  </motion.div>
                ) : (
                  <div className="empty-msg">Heap is empty.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   ENGINE 2: ML COORDINATE PLOTTER & SPLITS
   ============================================================================ */
function MLSimulator({ level }) {
  const [points, setPoints] = useState([
    { x: 20, y: 30, label: 'red' },
    { x: 30, y: 55, label: 'red' },
    { x: 45, y: 35, label: 'red' },
    { x: 60, y: 75, label: 'blue' },
    { x: 75, y: 65, label: 'blue' },
    { x: 80, y: 80, label: 'blue' }
  ])
  const [m, setM] = useState(0.8)
  const [b, setB] = useState(20)
  const [isFitting, setIsFitting] = useState(false)
  
  // K-means states
  const [kmeansCentroids, setKmeansCentroids] = useState([
    { x: 30, y: 70, label: 'red' },
    { x: 70, y: 30, label: 'blue' }
  ])
  const [kmeansStep, setKmeansStep] = useState(0) // 0: initial, 1: assigned, 2: updated centroids

  // Decision splits states
  const [depth, setDepth] = useState(0)

  const svgRef = useRef(null)

  const handleCanvasClick = (e) => {
    if (level !== 'simple') return // Click to add points only in simple mode
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = 100 - ((e.clientY - rect.top) / rect.height) * 100 // flip Y for coordinates
    const label = x + y > 100 ? 'blue' : 'red'
    setPoints(prev => [...prev, { x, y, label }])
  }

  // Linear Regression Exact Best Fit values
  const getOptimalRegression = () => {
    const n = points.length
    if (n < 2) return { m: 1, b: 0 }
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
    for (const p of points) {
      sumX += p.x
      sumY += p.y
      sumXY += p.x * p.y
      sumX2 += p.x * p.x
    }
    const denom = n * sumX2 - sumX * sumX
    if (Math.abs(denom) < 1e-6) return { m: 1, b: 0 }
    const optM = (n * sumXY - sumX * sumY) / denom
    const optB = (sumY - optM * sumX) / n
    return { m: optM, b: optB }
  }

  // Calculate Mean Squared Error
  const calculateMSE = () => {
    let sumErr = 0
    for (const p of points) {
      const predY = m * p.x + b
      sumErr += Math.pow(p.y - predY, 2)
    }
    return points.length > 0 ? (sumErr / points.length).toFixed(1) : 0
  }

  const triggerAutoFit = () => {
    if (isFitting) return
    setIsFitting(true)
    const { m: optM, b: optB } = getOptimalRegression()
    
    let currentStep = 0
    const totalSteps = 25
    const startM = m
    const startB = b

    const interval = setInterval(() => {
      currentStep++
      const ratio = currentStep / totalSteps
      setM(startM + (optM - startM) * ratio)
      setB(startB + (optB - startB) * ratio)
      if (currentStep >= totalSteps) {
        clearInterval(interval)
        setIsFitting(false)
      }
    }, 40)
  }

  const handleKmeansStep = () => {
    if (kmeansStep === 0) {
      // Step 1: Assign points to nearest centroid
      const updatedPoints = points.map(pt => {
        const distRed = Math.hypot(pt.x - kmeansCentroids[0].x, pt.y - kmeansCentroids[0].y)
        const distBlue = Math.hypot(pt.x - kmeansCentroids[1].x, pt.y - kmeansCentroids[1].y)
        return { ...pt, label: distRed < distBlue ? 'red' : 'blue' }
      })
      setPoints(updatedPoints)
      setKmeansStep(1)
    } else {
      // Step 2: Recalculate centroids
      const reds = points.filter(p => p.label === 'red')
      const blues = points.filter(p => p.label === 'blue')
      const newCentroids = [...kmeansCentroids]
      if (reds.length > 0) {
        newCentroids[0] = {
          x: reds.reduce((s, p) => s + p.x, 0) / reds.length,
          y: reds.reduce((s, p) => s + p.y, 0) / reds.length,
          label: 'red'
        }
      }
      if (blues.length > 0) {
        newCentroids[1] = {
          x: blues.reduce((s, p) => s + p.x, 0) / blues.length,
          y: blues.reduce((s, p) => s + p.y, 0) / blues.length,
          label: 'blue'
        }
      }
      setKmeansCentroids(newCentroids)
      setKmeansStep(0)
    }
  }

  const resetMLDemo = () => {
    setPoints([
      { x: 20, y: 30, label: 'red' },
      { x: 30, y: 55, label: 'red' },
      { x: 45, y: 35, label: 'red' },
      { x: 60, y: 75, label: 'blue' },
      { x: 75, y: 65, label: 'blue' },
      { x: 80, y: 80, label: 'blue' }
    ])
    setM(0.8)
    setB(20)
    setKmeansCentroids([
      { x: 30, y: 70, label: 'red' },
      { x: 70, y: 30, label: 'blue' }
    ])
    setKmeansStep(0)
    setDepth(0)
  }

  return (
    <div className="sim-panel-split">
      <div className="sim-code-column">
        <div className="column-title">Parameters & Config</div>
        
        {level === 'simple' && (
          <div className="controls-group">
            <h4 className="control-header">Linear Regression ($y = mx + b$)</h4>
            <div className="slider-wrapper">
              <label>Slope ($m$): {m.toFixed(2)}</label>
              <input
                type="range" min="-1.5" max="2.5" step="0.05"
                value={m} onChange={(e) => setM(parseFloat(e.target.value))}
                disabled={isFitting}
              />
            </div>
            <div className="slider-wrapper">
              <label>Intercept ($b$): {b.toFixed(0)}</label>
              <input
                type="range" min="-10" max="80" step="1"
                value={b} onChange={(e) => setB(parseFloat(e.target.value))}
                disabled={isFitting}
              />
            </div>
            
            <div className="stats-box">
              <div className="stat-row">
                <span>Equation:</span>
                <strong className="font-mono">y = {m.toFixed(2)}x + {b.toFixed(1)}</strong>
              </div>
              <div className="stat-row">
                <span>Loss (MSE):</span>
                <strong className="font-mono text-danger">{calculateMSE()}</strong>
              </div>
            </div>

            <div className="sim-controls">
              <button className="btn btn-primary btn-sm" onClick={triggerAutoFit} disabled={isFitting}>
                {isFitting ? 'Fitting...' : 'Auto Fit (Gradient Descent)'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={resetMLDemo}>
                Clear Points
              </button>
            </div>
            <p className="hint-text">💡 Tip: Click inside the grid graph to place custom coordinates.</p>
          </div>
        )}

        {level === 'medium' && (
          <div className="controls-group">
            <h4 className="control-header">K-Means Cluster Centroids</h4>
            <p className="engine-desc-p">
              Partitions points into 2 groups by distance. Centroids move to the average position of assigned points.
            </p>
            <div className="stats-box">
              <div className="stat-row">
                <span>Centroid Red (K1):</span>
                <span className="font-mono font-bold text-red">({kmeansCentroids[0].x.toFixed(0)}, {kmeansCentroids[0].y.toFixed(0)})</span>
              </div>
              <div className="stat-row">
                <span>Centroid Blue (K2):</span>
                <span className="font-mono font-bold text-blue">({kmeansCentroids[1].x.toFixed(0)}, {kmeansCentroids[1].y.toFixed(0)})</span>
              </div>
              <div className="stat-row">
                <span>Current Phase:</span>
                <strong className="text-emerald">{kmeansStep === 0 ? 'centroids updated - click to assign' : 'points assigned - click to update means'}</strong>
              </div>
            </div>
            <div className="sim-controls">
              <button className="btn btn-primary btn-sm" onClick={handleKmeansStep}>
                {kmeansStep === 0 ? '1. Assign Points' : '2. Move Centroids'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={resetMLDemo}>
                Reset Centers
              </button>
            </div>
          </div>
        )}

        {level === 'advanced' && (
          <div className="controls-group">
            <h4 className="control-header">Decision Trees Cuts</h4>
            <div className="slider-wrapper">
              <label>Tree Splitting Depth: {depth}</label>
              <input
                type="range" min="0" max="2" step="1"
                value={depth} onChange={(e) => setDepth(parseInt(e.target.value))}
              />
            </div>
            
            <div className="tree-diagram-box">
              <h5 className="font-bold mb-2">Calculated Splits:</h5>
              <div className="tree-nodes font-mono">
                {depth === 0 && <div className="tree-node">Root Node (Predict All Red)</div>}
                {depth >= 1 && (
                  <div className="tree-node">
                    [x &lt; 50]
                    <div className="tree-branches">
                      <div className="branch-line">├── Left: Red</div>
                      <div className="branch-line">└── Right: [y &lt; 60]</div>
                    </div>
                  </div>
                )}
                {depth >= 2 && (
                  <div className="tree-node depth-2-branch">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Bottom Right: Blue
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Top Right: Blue
                  </div>
                )}
              </div>
            </div>
            
            <div className="sim-controls">
              <button className="btn btn-outline btn-sm" onClick={resetMLDemo}>
                Reset Tree
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="sim-viz-column">
        <div className="column-title">2D Feature Plane</div>
        <div className="viz-container canvas-container-wrapper">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="ml-plot-svg"
            onClick={handleCanvasClick}
          >
            {/* Grid Lines */}
            {[20, 40, 60, 80].map((val) => (
              <g key={val}>
                <line x1={val} y1={0} x2={val} y2={100} stroke="#334155" strokeWidth="0.2" />
                <line x1={0} y1={val} x2={100} y2={val} stroke="#334155" strokeWidth="0.2" />
              </g>
            ))}

            {/* Linear Regression Line */}
            {level === 'simple' && (
              <line
                x1={0} y1={100 - b}
                x2={100} y2={100 - (m * 100 + b)}
                stroke="#22C55E"
                strokeWidth="1.2"
                strokeDasharray="2 1"
              />
            )}

            {/* Decision Splits lines */}
            {level === 'advanced' && depth >= 1 && (
              <line x1={50} y1={0} x2={50} y2={100} stroke="#EF4444" strokeWidth="1" />
            )}
            {level === 'advanced' && depth >= 2 && (
              <line x1={50} y1={40} x2={100} y2={40} stroke="#EC4899" strokeWidth="1" />
            )}

            {/* Plot Points */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={100 - pt.y}
                  r="2.5"
                  fill={pt.label === 'red' ? '#EF4444' : '#3B82F6'}
                  opacity={0.85}
                />
                <circle
                  cx={pt.x}
                  cy={100 - pt.y}
                  r="4.5"
                  fill="none"
                  stroke={pt.label === 'red' ? '#EF4444' : '#3B82F6'}
                  strokeWidth="0.3"
                  opacity={0.4}
                />
              </g>
            ))}

            {/* Centroids in K-Means */}
            {level === 'medium' && kmeansCentroids.map((centroid, idx) => (
              <g key={idx}>
                {/* Centroid plus markers */}
                <circle
                  cx={centroid.x}
                  cy={100 - centroid.y}
                  r="4"
                  fill="none"
                  stroke={centroid.label === 'red' ? '#F59E0B' : '#E9D5FF'}
                  strokeWidth="1.5"
                />
                <line
                  x1={centroid.x - 5} y1={100 - centroid.y}
                  x2={centroid.x + 5} y2={100 - centroid.y}
                  stroke={centroid.label === 'red' ? '#F59E0B' : '#E9D5FF'}
                  strokeWidth="1.5"
                />
                <line
                  x1={centroid.x} y1={100 - centroid.y - 5}
                  x2={centroid.x} y2={100 - centroid.y + 5}
                  stroke={centroid.label === 'red' ? '#F59E0B' : '#E9D5FF'}
                  strokeWidth="1.5"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   ENGINE 3: DEEP LEARNING MODEL PULSES & CNN KERNEL
   ============================================================================ */
function DLSimulator({ level }) {
  const [inputs, setInputs] = useState({ x1: 1, x2: 0 })
  const [w1, setW1] = useState(1.5)
  const [w2, setW2] = useState(-1.0)
  const [bias, setBias] = useState(-0.5)
  const [gate, setGate] = useState('AND') // OR, AND

  // MLP pulse state
  const [isPropagating, setIsPropagating] = useState(null) // null, 'forward', 'backward'
  
  // CNN slides
  const [kernelIndex, setKernelIndex] = useState(0) // 0 to 8 positions

  const calculatePerceptron = () => {
    const rawVal = inputs.x1 * w1 + inputs.x2 * w2 + bias
    const activation = rawVal > 0 ? 1 : 0
    return { rawVal, activation }
  }

  // Gates evaluation checking
  const testGateCorrect = () => {
    const cases = [
      { x1: 0, x2: 0 },
      { x1: 0, x2: 1 },
      { x1: 1, x2: 0 },
      { x1: 1, x2: 1 }
    ]
    return cases.every(c => {
      const val = c.x1 * w1 + c.x2 * w2 + bias
      const act = val > 0 ? 1 : 0
      const expected = gate === 'AND'
        ? (c.x1 && c.x2 ? 1 : 0)
        : (c.x1 || c.x2 ? 1 : 0)
      return act === expected
    })
  }

  const runMLPPulse = (direction) => {
    if (isPropagating) return
    setIsPropagating(direction)
    setTimeout(() => {
      setIsPropagating(null)
    }, 1500)
  }

  // 5x5 Grid representation for convolution slide
  const imageGrid = [
    [1, 1, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [2, 2, 2, 0, 0]
  ]
  const kernel = [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1]
  ]

  // Translate kernel position index (0..8) to row/col offsets
  const getKernelCoords = () => {
    const r = Math.floor(kernelIndex / 3)
    const c = kernelIndex % 3
    return { r, c }
  }

  const getConvolutionValue = () => {
    const { r, c } = getKernelCoords()
    let sum = 0
    for (let ki = 0; ki < 3; ki++) {
      for (let kj = 0; kj < 3; kj++) {
        sum += imageGrid[r + ki][c + kj] * kernel[ki][kj]
      }
    }
    return sum
  }

  return (
    <div className="sim-panel-split">
      <div className="sim-code-column">
        <div className="column-title">Weights & Activations</div>
        
        {level === 'simple' && (
          <div className="controls-group">
            <div className="gate-selector">
              <label>Target Task:</label>
              <select value={gate} onChange={(e) => setGate(e.target.value)}>
                <option value="AND">AND Gate</option>
                <option value="OR">OR Gate</option>
              </select>
            </div>
            
            <div className="inputs-toggle">
              <label>Inputs:</label>
              <div className="toggle-buttons">
                <button
                  className={`btn btn-xs ${inputs.x1 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setInputs(prev => ({ ...prev, x1: prev.x1 ? 0 : 1 }))}
                >
                  X1: {inputs.x1}
                </button>
                <button
                  className={`btn btn-xs ${inputs.x2 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setInputs(prev => ({ ...prev, x2: prev.x2 ? 0 : 1 }))}
                >
                  X2: {inputs.x2}
                </button>
              </div>
            </div>

            <div className="slider-wrapper">
              <label>Weight 1 ($w_1$): {w1.toFixed(2)}</label>
              <input type="range" min="-2" max="2.5" step="0.1" value={w1} onChange={(e) => setW1(parseFloat(e.target.value))} />
            </div>
            <div className="slider-wrapper">
              <label>Weight 2 ($w_2$): {w2.toFixed(2)}</label>
              <input type="range" min="-2" max="2.5" step="0.1" value={w2} onChange={(e) => setW2(parseFloat(e.target.value))} />
            </div>
            <div className="slider-wrapper">
              <label>Bias ($b$): {bias.toFixed(2)}</label>
              <input type="range" min="-2" max="2" step="0.1" value={bias} onChange={(e) => setBias(parseFloat(e.target.value))} />
            </div>

            <div className="stats-box">
              <div className="stat-row">
                <span>Weighted Sum:</span>
                <span className="font-mono">{calculatePerceptron().rawVal.toFixed(2)}</span>
              </div>
              <div className="stat-row">
                <span>Output (ReLU/Step):</span>
                <strong className={`font-mono text-emerald`}>{calculatePerceptron().activation}</strong>
              </div>
              <div className="stat-row">
                <span>Weights Learned Gate?</span>
                <strong className={testGateCorrect() ? 'text-emerald' : 'text-danger'}>
                  {testGateCorrect() ? 'SUCCESS' : 'FALSE'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {level === 'medium' && (
          <div className="controls-group">
            <h4 className="control-header">XOR Multi-Layer Perceptron</h4>
            <p className="engine-desc-p">
              XOR requires a hidden layer to learn nonlinear separation. Run propagation sweeps to see vectors update.
            </p>
            <div className="sim-controls vertical-controls">
              <button className="btn btn-primary btn-sm" onClick={() => runMLPPulse('forward')} disabled={!!isPropagating}>
                {isPropagating === 'forward' ? 'Forwarding activation pulses...' : 'Run Forward Pass'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => runMLPPulse('backward')} disabled={!!isPropagating}>
                {isPropagating === 'backward' ? 'Updating gradient weight cells...' : 'Run Backward Pass'}
              </button>
            </div>
          </div>
        )}

        {level === 'advanced' && (
          <div className="controls-group">
            <h4 className="control-header">CNN 2D Convolution filter</h4>
            <p className="hint-text mb-3">
              Slides a $3\times3$ kernel weights matrix over a $5\times5$ source image grid.
            </p>
            
            <div className="kernel-box font-mono mb-4 text-xs">
              <div className="font-bold text-center mb-1 text-emerald">Kernel Weights</div>
              <div className="grid grid-cols-3 gap-1 border border-slate-700 p-2 rounded bg-slate-950">
                {kernel.map((row, r) => row.map((val, c) => (
                  <div key={`${r}-${c}`} className="text-center p-1 bg-slate-800 rounded">
                    {val}
                  </div>
                )))}
              </div>
            </div>

            <div className="stats-box text-xs">
              <div className="stat-row">
                <span>Dot Product calc:</span>
                <span className="font-mono">Sum(Image * Kernel)</span>
              </div>
              <div className="stat-row">
                <span>Calculated Feature:</span>
                <strong className="text-emerald font-mono">{getConvolutionValue()}</strong>
              </div>
            </div>

            <div className="sim-controls mt-2">
              <button className="btn btn-primary btn-sm" onClick={() => setKernelIndex(prev => (prev + 1) % 9)}>
                Slide Kernel Step
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setKernelIndex(0)}>
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="sim-viz-column">
        <div className="column-title">Visual Architecture</div>
        <div className="viz-container flex-centered">
          {level === 'simple' && (
            <svg viewBox="0 0 100 60" className="perceptron-svg">
              <text x="5" y="15" fill="#94A3B8" fontSize="5" fontWeight="bold">X1 ({inputs.x1})</text>
              <text x="5" y="45" fill="#94A3B8" fontSize="5" fontWeight="bold">X2 ({inputs.x2})</text>
              <circle cx="35" cy="12" r="6" fill="#1E293B" stroke="#334155" strokeWidth="1" />
              <circle cx="35" cy="42" r="6" fill="#1E293B" stroke="#334155" strokeWidth="1" />
              <circle cx="70" cy="27" r="8" fill="#1E293B" stroke={calculatePerceptron().activation ? '#22C55E' : '#EF4444'} strokeWidth="1.5" />
              
              {/* weights line */}
              <line x1="41" y1="12" x2="62" y2="27" stroke={w1 >= 0 ? '#22C55E' : '#EF4444'} strokeWidth={Math.max(0.5, Math.abs(w1) * 1.5)} />
              <line x1="41" y1="42" x2="62" y2="27" stroke={w2 >= 0 ? '#22C55E' : '#EF4444'} strokeWidth={Math.max(0.5, Math.abs(w2) * 1.5)} />
              
              <text x="45" y="16" fill="#94A3B8" fontSize="4.5">w1: {w1.toFixed(1)}</text>
              <text x="45" y="40" fill="#94A3B8" fontSize="4.5">w2: {w2.toFixed(1)}</text>
              
              <text x="66" y="29.5" fill="#F8FAFC" fontSize="7" fontWeight="bold" textAnchor="middle">{calculatePerceptron().activation}</text>
              <text x="82" y="29.5" fill="#94A3B8" fontSize="5">Output</text>
            </svg>
          )}

          {level === 'medium' && (
            <svg viewBox="0 0 100 60" className="mlp-svg">
              {/* Synapses and glowing lines */}
              <line x1="15" y1="15" x2="45" y2="10" stroke="#334155" />
              <line x1="15" y1="15" x2="45" y2="22" stroke="#334155" />
              <line x1="15" y1="15" x2="45" y2="34" stroke="#334155" />
              <line x1="15" y1="15" x2="45" y2="48" stroke="#334155" />
              <line x1="15" y1="42" x2="45" y2="10" stroke="#334155" />
              <line x1="15" y1="42" x2="45" y2="22" stroke="#334155" />
              <line x1="15" y1="42" x2="45" y2="34" stroke="#334155" />
              <line x1="15" y1="42" x2="45" y2="48" stroke="#334155" />
              <line x1="45" y1="10" x2="80" y2="27" stroke="#334155" />
              <line x1="45" y1="22" x2="80" y2="27" stroke="#334155" />
              <line x1="45" y1="34" x2="80" y2="27" stroke="#334155" />
              <line x1="45" y1="48" x2="80" y2="27" stroke="#334155" />

              {/* Glowing pulses */}
              {isPropagating === 'forward' && (
                <>
                  <motion.circle r="1.5" fill="#22C55E" initial={{ x: 15, y: 15 }} animate={{ x: 45, y: [10, 22, 34, 48] }} transition={{ duration: 0.6 }} />
                  <motion.circle r="1.5" fill="#22C55E" initial={{ x: 15, y: 42 }} animate={{ x: 45, y: [10, 22, 34, 48] }} transition={{ duration: 0.6 }} />
                  <motion.circle r="1.5" fill="#22C55E" initial={{ x: 45, y: 22 }} animate={{ x: 80, y: 27 }} transition={{ delay: 0.6, duration: 0.6 }} />
                </>
              )}
              {isPropagating === 'backward' && (
                <>
                  <motion.circle r="1.5" fill="#A855F7" initial={{ x: 80, y: 27 }} animate={{ x: 45, y: [10, 22, 34, 48] }} transition={{ duration: 0.6 }} />
                  <motion.circle r="1.5" fill="#A855F7" initial={{ x: 45, y: 22 }} animate={{ x: 15, y: [15, 42] }} transition={{ delay: 0.6, duration: 0.6 }} />
                </>
              )}

              {/* Nodes */}
              <circle cx="15" cy="15" r="4.5" fill="#3B82F6" />
              <circle cx="15" cy="42" r="4.5" fill="#3B82F6" />
              <circle cx="45" cy="10" r="4.5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <circle cx="45" cy="22" r="4.5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <circle cx="45" cy="34" r="4.5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <circle cx="45" cy="48" r="4.5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <circle cx="80" cy="27" r="5.5" fill="#F59E0B" />
              
              <text x="15" y="27" fill="#94A3B8" fontSize="4.5" textAnchor="middle">Input</text>
              <text x="45" y="57" fill="#94A3B8" fontSize="4.5" textAnchor="middle">Hidden</text>
              <text x="80" y="37" fill="#94A3B8" fontSize="4.5" textAnchor="middle">Output</text>
            </svg>
          )}

          {level === 'advanced' && (
            <div className="cnn-grid-wrapper font-mono text-center">
              <div className="grid-labels">
                <span className="label text-green-400">Input (5x5)</span>
                <span className="label text-purple-400">Feature (3x3)</span>
              </div>
              <div className="grids-align">
                {/* 5x5 Input */}
                <div className="grid grid-cols-5 gap-0.5 border border-slate-700 p-1.5 rounded bg-slate-900 text-xs">
                  {imageGrid.flatMap((row, r) => row.map((val, c) => {
                    const { r: kr, c: kc } = getKernelCoords()
                    const inKernel = r >= kr && r < kr + 3 && c >= kc && c < kc + 3
                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`w-6 h-6 flex items-center justify-center rounded-sm transition-colors ${inKernel ? 'bg-emerald-900 border border-emerald-400' : 'bg-slate-800'}`}
                      >
                        {val}
                      </div>
                    )
                  }))}
                </div>
                
                <div className="mx-2 text-slate-500">→</div>

                {/* 3x3 Feature map */}
                <div className="grid grid-cols-3 gap-1 border border-slate-700 p-2 rounded bg-slate-900 text-xs">
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const isComputed = idx <= kernelIndex
                    const { r, c } = Math.floor(idx / 3)
                    let currentVal = ''
                    if (idx < kernelIndex) {
                      // Calculate previous values
                      let sum = 0
                      const rowOff = Math.floor(idx / 3)
                      const colOff = idx % 3
                      for (let ki = 0; ki < 3; ki++) {
                        for (let kj = 0; kj < 3; kj++) {
                          sum += imageGrid[rowOff + ki][colOff + kj] * kernel[ki][kj]
                        }
                      }
                      currentVal = sum
                    } else if (idx === kernelIndex) {
                      currentVal = getConvolutionValue()
                    }
                    return (
                      <div
                        key={idx}
                        className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${idx === kernelIndex ? 'bg-purple-900 text-purple-200 border border-purple-400 font-bold' : isComputed ? 'bg-slate-750 text-slate-300' : 'bg-slate-950 text-slate-600'}`}
                      >
                        {currentVal}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   ENGINE 4: LLM TOKENIZER & ATTENTION DYNAMICS
   ============================================================================ */
function LLMSimulator({ level }) {
  const [inputText, setInputText] = useState('Learning AI is fun and interactive!')
  const [temp, setTemp] = useState(0.7)
  const [hoveredToken, setHoveredToken] = useState(null)
  const [contextText, setContextText] = useState('river') // river or bank account

  const tokenColorList = ['token-bg-green', 'token-bg-blue', 'token-bg-purple', 'token-bg-amber', 'token-bg-emerald']

  // Split input into mock tokens
  const getTokens = () => {
    return inputText.split(/\s+/).flatMap((word, idx) => {
      // Split long words for token demonstration
      if (word.length > 5) {
        const mid = Math.floor(word.length / 2)
        return [
          { text: word.slice(0, mid), id: 1000 + idx * 7 },
          { text: word.slice(mid), id: 2000 + idx * 7 }
        ]
      }
      return [{ text: word, id: 3000 + idx * 7 }]
    })
  }

  // Next Token candidates distribution
  const candidates = [
    { text: 'simulations', logit: 4.5 },
    { text: 'models', logit: 3.8 },
    { text: 'algorithms', logit: 2.9 },
    { text: 'concepts', logit: 2.1 },
    { text: 'systems', logit: 1.4 }
  ]

  // Calculate Softmax probabilities with Temperature
  const getSoftmaxProbabilities = () => {
    const scaledLogits = candidates.map(c => Math.exp(c.logit / temp))
    const sum = scaledLogits.reduce((s, val) => s + val, 0)
    return candidates.map((c, i) => ({
      text: c.text,
      prob: (scaledLogits[i] / sum) * 100
    }))
  }

  // Attention scores setup
  const sentenceRiver = ['The', 'bank', 'of', 'the', 'river', 'is', 'rocky']
  const sentenceCredit = ['The', 'bank', 'approved', 'the', 'loan', 'credits', 'quickly']
  
  const currentSentence = contextText === 'river' ? sentenceRiver : sentenceCredit

  const getAttentionWeight = (fromWord, toWord) => {
    if (contextText === 'river') {
      if (fromWord === 'bank' && toWord === 'river') return 0.85
      if (fromWord === 'bank' && toWord === 'bank') return 0.35
      if (fromWord === 'river' && toWord === 'bank') return 0.70
    } else {
      if (fromWord === 'bank' && toWord === 'loan') return 0.90
      if (fromWord === 'bank' && toWord === 'bank') return 0.25
      if (fromWord === 'loan' && toWord === 'bank') return 0.75
    }
    if (fromWord === toWord) return 0.4
    return 0.1
  }

  return (
    <div className="sim-panel-split">
      <div className="sim-code-column">
        <div className="column-title">Input Controls</div>
        
        {level === 'simple' && (
          <div className="controls-group">
            <h4 className="control-header">Tokenizer Segmentation</h4>
            <div className="text-input-wrapper">
              <label>Custom Text Input:</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="form-input text-xs w-full h-20"
                rows="3"
              />
            </div>
            <p className="hint-text mt-3">
              LLMs do not read words directly. The input string is broken down into sub-word byte-pair encoding (BPE) tokens.
            </p>
          </div>
        )}

        {level === 'medium' && (
          <div className="controls-group">
            <h4 className="control-header">Text Generation Softmax</h4>
            <div className="slider-wrapper">
              <label>Temperature ($\tau$): {temp.toFixed(1)}</label>
              <input
                type="range" min="0.1" max="2.0" step="0.1"
                value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))}
              />
            </div>
            <div className="stats-box text-xs mt-3">
              <p className="hint-text">
                🌡️ Low Temperature (&lt; 0.5) concentrates distribution on the peak word (highly focused/logical).
                <br /><br />
                🔥 High Temperature (&gt; 1.2) flattens weights (highly creative/random).
              </p>
            </div>
          </div>
        )}

        {level === 'advanced' && (
          <div className="controls-group">
            <h4 className="control-header">Attention Context Target</h4>
            <div className="gate-selector mb-4">
              <label>Sentence Context:</label>
              <select value={contextText} onChange={(e) => setContextText(e.target.value)}>
                <option value="river">The bank of the river...</option>
                <option value="credit">The bank approved the loan...</option>
              </select>
            </div>
            <p className="hint-text text-xs leading-relaxed">
              Hover over a word in the right visual grid matrix to see self-attention correlation weights. Note how "bank" shifts attention based on context (from "river" to "loan").
            </p>
          </div>
        )}
      </div>

      <div className="sim-viz-column">
        <div className="column-title">Model Token Output</div>
        <div className="viz-container font-sans">
          
          {level === 'simple' && (
            <div className="tokenizer-output">
              <div className="tokens-display mb-4">
                {getTokens().map((t, idx) => (
                  <span key={idx} className={`token-badge-highlight ${tokenColorList[idx % tokenColorList.length]}`}>
                    {t.text}
                  </span>
                ))}
              </div>
              <h4>Vocabulary IDs Table</h4>
              <div className="tokens-table font-mono text-xs">
                {getTokens().map((t, idx) => (
                  <div key={idx} className="token-table-row">
                    <span className="tok-word">{t.text}</span>
                    <span className="tok-arrow">→</span>
                    <span className="tok-id text-emerald">{t.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {level === 'medium' && (
            <div className="softmax-bar-chart w-full font-mono text-xs">
              <h4 className="font-sans mb-3 text-sm">Next Token Probability Distribution</h4>
              <div className="chart-rows">
                {getSoftmaxProbabilities().map((cand, idx) => (
                  <div key={idx} className="chart-row mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="cand-word">"{cand.text}"</span>
                      <span className="cand-prob">{cand.prob.toFixed(1)}%</span>
                    </div>
                    <div className="bar-bg w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="bar-fill h-full bg-emerald-500"
                        animate={{ width: `${cand.prob}%` }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {level === 'advanced' && (
            <div className="attention-matrix-grid">
              <div className="matrix-labels font-mono text-xxs flex justify-around mb-2">
                {currentSentence.map((w, idx) => (
                  <span
                    key={idx}
                    className={`matrix-label-w ${hoveredToken === w ? 'text-emerald font-bold' : 'text-slate-500'}`}
                  >
                    {w}
                  </span>
                ))}
              </div>

              <div className="matrix-cells flex flex-col gap-1.5">
                {currentSentence.map((rowWord, rIdx) => (
                  <div key={rowWord + rIdx} className="flex gap-1.5 items-center justify-between">
                    <span className="w-12 font-mono text-xxs text-right pr-2 text-slate-500">{rowWord}</span>
                    <div className="flex gap-1.5 flex-1 justify-around">
                      {currentSentence.map((colWord, cIdx) => {
                        const weight = getAttentionWeight(rowWord, colWord)
                        const isPrimary = hoveredToken === rowWord && weight > 0.5
                        return (
                          <div
                            key={colWord + cIdx}
                            className="w-7 h-7 flex items-center justify-center rounded-sm text-xxs font-mono cursor-pointer transition-all duration-200"
                            style={{
                              backgroundColor: `rgba(34, 197, 94, ${weight})`,
                              border: isPrimary ? '1.5px solid #F8FAFC' : '1px solid transparent',
                              color: weight > 0.4 ? '#064e3b' : '#94A3B8'
                            }}
                            onMouseEnter={() => setHoveredToken(rowWord)}
                            onMouseLeave={() => setHoveredToken(null)}
                            title={`${rowWord} attending to ${colWord}: ${weight}`}
                          >
                            {weight.toFixed(2)}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   ENGINE 5: AGENTIC AI RE-ACT LOOPS & DEBATE SWARMS
   ============================================================================ */
function AgentSimulator({ level }) {
  const [step, setStep] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [agentOutputLogs, setAgentOutputLogs] = useState([])
  const intervalRef = useRef(null)

  // Reset states and clear intervals on level change
  useEffect(() => {
    setStep(0)
    setAgentOutputLogs([])
    setIsLooping(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [level])

  // Simple ReAct loop sequence
  const reactSteps = [
    { log: 'User asks: "Calculate (45 + 15) * 5"', type: 'user' },
    { log: 'Thought: I need to evaluate the addition first. Tool: Calculator(45 + 15)', type: 'thought' },
    { log: 'Calculator Tool outputs: 60', type: 'tool' },
    { log: 'Thought: Now multiply by 5. Tool: Calculator(60 * 5)', type: 'thought' },
    { log: 'Calculator Tool outputs: 300', type: 'tool' },
    { log: 'Thought: Calculation resolved. Final Response: The result is 300.', type: 'response' }
  ]

  // Medium Router branches
  const routerChoices = [
    { query: 'Write a Python script to filter odd numbers', target: 'Coding Agent' },
    { query: 'Create a social media copy for a gym brand', target: 'Copywriter Agent' }
  ]
  const [selectedRouterIndex, setSelectedRouterIndex] = useState(0)

  // Advanced Debate Swarm steps
  const debateSteps = [
    { actor: 'Developer Agent', text: 'Drafted function code: `def sum_list(l): return sum(l)`', label: 'developer' },
    { actor: 'Reviewer Agent', text: 'REJECT: Missing docstrings and type hinting parameters.', label: 'reviewer' },
    { actor: 'Developer Agent', text: 'Refactored: Added docstrings & PEP8 types.', label: 'developer' },
    { actor: 'Reviewer Agent', text: 'APPROVED! Forwarding to Deployer Node...', label: 'reviewer' },
    { actor: 'Deployer Agent', text: 'Building image container & deployed to Production.', label: 'deployer' }
  ]

  const runReactSequence = () => {
    if (isLooping) return
    setIsLooping(true)
    setAgentOutputLogs([])
    let currentIdx = 0

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      if (currentIdx < reactSteps.length) {
        setAgentOutputLogs(prev => [...prev, reactSteps[currentIdx]])
        currentIdx++
      }
      if (currentIdx >= reactSteps.length) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsLooping(false)
      }
    }, 1200)
  }

  const runDebateSequence = () => {
    if (isLooping) return
    setIsLooping(true)
    setAgentOutputLogs([])
    let currentIdx = 0

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      if (currentIdx < debateSteps.length) {
        setAgentOutputLogs(prev => [...prev, debateSteps[currentIdx]])
        currentIdx++
      }
      if (currentIdx >= debateSteps.length) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsLooping(false)
      }
    }, 1400)
  }

  return (
    <div className="sim-panel-split">
      <div className="sim-code-column">
        <div className="column-title">Agent Settings</div>
        
        {level === 'simple' && (
          <div className="controls-group">
            <h4 className="control-header">ReAct Logic Loop</h4>
            <p className="engine-desc-p">
              Reasoning & Action. Watch the planner evaluate user intent, choose a tool, fetch outputs, and structure the final answer.
            </p>
            <div className="sim-controls">
              <button className="btn btn-primary btn-sm" onClick={runReactSequence} disabled={isLooping}>
                {isLooping ? 'Running Loop...' : 'Animate ReAct Loop'}
              </button>
            </div>
          </div>
        )}

        {level === 'medium' && (
          <div className="controls-group">
            <h4 className="control-header">Agent Classifier Router</h4>
            <div className="text-input-wrapper mb-3">
              <label>User Input Query:</label>
              <select
                value={selectedRouterIndex}
                onChange={(e) => {
                  setSelectedRouterIndex(parseInt(e.target.value))
                  setAgentOutputLogs([])
                }}
                className="form-input text-xs w-full"
              >
                {routerChoices.map((c, i) => (
                  <option key={i} value={i}>
                    "{c.query}"
                  </option>
                ))}
              </select>
            </div>
            <div className="sim-controls">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setAgentOutputLogs([
                    { log: `Analyzing incoming text: "${routerChoices[selectedRouterIndex].query}"...`, type: 'thought' },
                    { log: `Routing parameters matched: directing query to ${routerChoices[selectedRouterIndex].target}`, type: 'response' }
                  ])
                }}
              >
                Evaluate Routing
              </button>
            </div>
          </div>
        )}

        {level === 'advanced' && (
          <div className="controls-group">
            <h4 className="control-header">Multi-Agent Debate Swarms</h4>
            <p className="engine-desc-p">
              Collaborative multi-agent environments. Watch Developer, Reviewer, and Deployer agents validate and deploy features autonomously.
            </p>
            <div className="sim-controls">
              <button className="btn btn-primary btn-sm" onClick={runDebateSequence} disabled={isLooping}>
                {isLooping ? 'Simulating Swarm...' : 'Run Swarm Loop'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="sim-viz-column">
        <div className="column-title">Agent Terminal Logs</div>
        <div className="viz-container font-mono text-xs bg-slate-950 p-4 rounded-md border border-slate-800 text-slate-300 overflow-y-auto max-h-80">
          
          {level === 'simple' && (
            <div className="react-log-panel flex flex-col gap-2.5">
              {agentOutputLogs.map((entry, idx) => {
                if (!entry) return null
                return (
                  <motion.div
                    key={idx}
                    className={`log-entry ${entry.type}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span className="log-prefix">
                      {entry.type === 'user' ? '👤 USER:' : entry.type === 'thought' ? '🧠 AGENT THOUGHT:' : entry.type === 'tool' ? '🔧 TOOL OUTPUT:' : '🏁 RESPONSE:'}
                    </span>
                    &nbsp;{entry.log}
                  </motion.div>
                )
              })}
              {agentOutputLogs.length === 0 && (
                <div className="empty-msg text-center text-slate-500 mt-6">Click 'Animate ReAct Loop' to initialize.</div>
              )}
            </div>
          )}

          {level === 'medium' && (
            <div className="router-viz-wrapper flex flex-col gap-4 items-center">
              <div className="node-wrapper bg-slate-800 border border-slate-700 p-2 rounded text-center">
                Classifier Router
              </div>
              <div className="flex gap-8 justify-around mt-4 w-full">
                <div className={`node-wrapper p-2 rounded text-center ${agentOutputLogs[1]?.log?.includes('Coding') ? 'border border-blue-400 bg-blue-950' : 'opacity-40 border border-slate-800 bg-slate-900'}`}>
                  🖥️ Coding Agent
                </div>
                <div className={`node-wrapper p-2 rounded text-center ${agentOutputLogs[1]?.log?.includes('Copywriter') ? 'border border-amber-400 bg-amber-950' : 'opacity-40 border border-slate-800 bg-slate-900'}`}>
                  ✍️ Copywriter Agent
                </div>
              </div>
              
              {agentOutputLogs.map((l, i) => {
                if (!l) return null
                return (
                  <div key={i} className="text-xxs font-mono text-emerald mt-2">
                    • {l.log}
                  </div>
                )
              })}
            </div>
          )}

          {level === 'advanced' && (
            <div className="debate-swarm flex flex-col gap-3">
              {agentOutputLogs.map((entry, idx) => {
                if (!entry) return null
                return (
                  <motion.div
                    key={idx}
                    className={`swarm-bubble ${entry.label}`}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="bubble-actor font-bold">{entry.actor}</div>
                    <div className="bubble-text">{entry.text}</div>
                  </motion.div>
                )
              })}
              {agentOutputLogs.length === 0 && (
                <div className="empty-msg text-center text-slate-500 mt-6">Click 'Run Swarm Loop' to initialize multi-agent discussion.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   MAIN LANDING PAGE VIEW
   ============================================================================ */
export default function LandingPage() {
  const [activeEngine, setActiveEngine] = useState('python')
  const [activeLevel, setActiveLevel] = useState('simple')

  const selectedEngineObj = ENGINES.find(e => e.id === activeEngine)

  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <Logo size={32} variant="full" />
        </Link>
        <nav className="landing-nav">
          <Link to="/about" className="btn btn-secondary btn-sm">
            About & Credits
          </Link>
          <Link to="/auth" className="btn btn-secondary">
            Log In
          </Link>
          <Link to="/auth" className="btn btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <motion.div
          className="landing-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            100% Free & Open-Source · 21 Interactive Courses
          </div>

          <h1>
            Master AI & ML{' '}
            <span className="hero-gradient">Through Simulation</span>
          </h1>

          <p className="landing-hero-subtitle">
            SimuLearn transforms abstract computer science and machine learning concepts into
            interactive, high-fidelity visual sandboxes. Master coding, algorithms, and swarms by doing.
          </p>

          <div className="landing-hero-cta">
            <Link to="/auth" className="btn btn-primary">
              Sign Up & Learn Free <ArrowRight size={16} />
            </Link>
            <a href="#sandbox" className="btn btn-outline">
              Explore 5 Simulators
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
            <div className="landing-stat-value">5</div>
            <div className="landing-stat-label">Visual Engines</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-value">21</div>
            <div className="landing-stat-label">Full Courses</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-value">7</div>
            <div className="landing-stat-label">Journey Phases</div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Simulation Sandbox Hub */}
      <section className="landing-sandbox-section" id="sandbox">
        <div className="sandbox-header text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-badge">Visual Sandbox</div>
            <h2>Interactive Execution Hub</h2>
            <p className="section-desc">
              All 21 courses connect directly to one of our 5 specialized learning simulation engines.
              Choose an engine and level below to test drive the platform before signing up.
            </p>
          </motion.div>
        </div>

        <div className="sandbox-player-container glass-panel">
          {/* Simulator Sidebar selectors */}
          <div className="sandbox-sidebar">
            <div className="sidebar-group-title">1. Select Simulation Engine</div>
            <div className="engine-selectors">
              {ENGINES.map((eng) => {
                const Icon = eng.icon
                const isActive = activeEngine === eng.id
                return (
                  <button
                    key={eng.id}
                    className={`engine-selector-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveEngine(eng.id)
                      setActiveLevel('simple')
                    }}
                    style={{ '--engine-color': eng.color }}
                  >
                    <div className="engine-btn-icon">
                      <Icon size={18} />
                    </div>
                    <div className="engine-btn-text">
                      <div className="btn-name">{eng.name}</div>
                      <div className="btn-topic">{eng.topic}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="sidebar-group-title mt-6">2. Select Difficulty Tier</div>
            <div className="level-tabs">
              {['simple', 'medium', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  className={`level-tab-btn ${activeLevel === lvl ? 'active' : ''}`}
                  onClick={() => setActiveLevel(lvl)}
                  style={{ '--engine-color': selectedEngineObj?.color }}
                >
                  {lvl.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Display Frame */}
          <div className="sandbox-display-panel">
            <div className="display-panel-header">
              <span className="window-dot red" />
              <span className="window-dot yellow" />
              <span className="window-dot green" />
              <span className="window-engine-title font-mono font-bold ml-4">
                {selectedEngineObj?.name} // {activeLevel}
              </span>
            </div>

            <div className="display-panel-body">
              <div className="engine-description-box mb-4">
                <h3>{selectedEngineObj?.topic}</h3>
                <p>{selectedEngineObj?.desc}</p>
              </div>

              {/* Dynamic Sandbox Selector */}
              <div className="sandbox-inner-view">
                {activeEngine === 'python' && <PythonSimulator level={activeLevel} />}
                {activeEngine === 'ml' && <MLSimulator level={activeLevel} />}
                {activeEngine === 'dl' && <DLSimulator level={activeLevel} />}
                {activeEngine === 'llm' && <LLMSimulator level={activeLevel} />}
                {activeEngine === 'agent' && <AgentSimulator level={activeLevel} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Phase Grid */}
      <section className="landing-phases-section">
        <div className="text-center mb-10">
          <h2>Your Learning Journey</h2>
          <p className="landing-phases-subtitle">
            Seven structured phases that take you from foundational setup tools to advanced Multi-Agentic AI systems.
          </p>
        </div>

        <div className="landing-phases-grid">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.number}
              className="landing-phase-card"
              style={{ '--phase-color': phase.color }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
            >
              <div className="landing-phase-number" style={{ color: phase.color }}>
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

      {/* Open Source Contribution Section */}
      <section className="landing-opensource-section">
        <div className="glass-panel opensource-card text-center">
          <div className="heart-icon-wrapper mb-4">
            <Heart size={32} color="#EF4444" fill="#EF4444" className="animate-pulse" />
          </div>
          <h2>100% Free & Open Source</h2>
          <p className="section-desc max-w-2xl mx-auto mb-6">
            We believe that high-quality visual education should be open and accessible to all.
            SimuLearn is fully open source. You can download the code, deploy it on your own server,
            customize the simulation engines, or add custom courses.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://github.com/SHAIK-07/SimuLearn"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <GithubIcon size={18} /> Star on GitHub <ExternalLink size={14} />
            </a>
            <Link to="/auth" className="btn btn-secondary">
              Sign Up & Start Using
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-text">
          © {new Date().getFullYear()} SimuLearn — Managed by Shaik Hidaythulla. Released under MIT Open-Source License.
        </div>
        <div className="landing-footer-links">
          <a href="https://github.com/SHAIK-07" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <Link to="/about">About & Credits</Link>
          <Link to="/auth">Sign Up</Link>
        </div>
      </footer>
    </div>
  )
}
