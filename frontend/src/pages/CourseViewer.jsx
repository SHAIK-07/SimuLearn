import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Play, RotateCcw, Award, CheckCircle, HelpCircle, Code, Cpu, Activity, MessageSquare, Terminal } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { BACKEND_URL } from '../lib/api'
import Logo from '../components/Logo'
import './CourseViewer.css'
import mermaid from 'mermaid'

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    background: '#1e293b',
    primaryColor: '#22c55e',
    primaryTextColor: '#f8fafc',
    lineColor: '#334155',
  }
})

let mermaidCounter = 0

function MermaidRenderer({ chart }) {
  const containerRef = useRef(null)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    const id = `mermaid-chart-${++mermaidCounter}`

    const renderChart = async () => {
      try {
        setError(null)
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        if (isMounted) {
          setSvg(renderedSvg)
        }
      } catch (err) {
        console.error('Mermaid render error:', err)
        if (isMounted) {
          setError(err.message || 'Syntax Error in Mermaid diagram')
        }
        const badge = document.getElementById(id)
        if (badge) badge.remove()
      }
    }

    renderChart()

    return () => {
      isMounted = false
    }
  }, [chart])

  if (error) {
    return (
      <div className="mermaid-error">
        <span className="error-title">Mermaid Render Error</span>
        <pre>{chart}</pre>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="mermaid-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

/* ================================================================
   LIGHTWEIGHT CUSTOM MARKDOWN & SYNTAX HIGHLIGHTER
   ================================================================ */
function MarkdownRenderer({ content }) {
  if (!content) return <p className="notes-placeholder">No notes available for this difficulty level.</p>

  // Simple custom parser for markdown
  const parsedElements = useMemo(() => {
    const lines = content.split('\n')
    let inCodeBlock = false
    let codeLines = []
    let codeLang = ''
    const elements = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          inCodeBlock = false
          const codeString = codeLines.join('\n')
          if (codeLang === 'mermaid') {
            elements.push(
              <MermaidRenderer key={`mermaid-${i}`} chart={codeString} />
            )
          } else {
            elements.push(
              <pre key={`code-${i}`} className={`code-block lang-${codeLang}`}>
                <div className="code-block-header">
                  <span>{codeLang || 'code'}</span>
                  <button 
                    className="btn-copy-code"
                    onClick={() => navigator.clipboard.writeText(codeString)}
                  >
                    Copy
                  </button>
                </div>
                <code>{codeString}</code>
              </pre>
            )
          }
          codeLines = []
        } else {
          // Open code block
          inCodeBlock = true
          codeLang = line.replace('```', '').trim()
        }
        continue
      }

      if (inCodeBlock) {
        codeLines.push(line)
        continue
      }

      // Tables parsing
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines = []
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i])
          i++
        }
        i-- // backtrack since loop increments

        if (tableLines.length >= 2) {
          const rawHeaders = tableLines[0].split('|').map(s => s.trim()).filter((s, idx) => idx > 0 && idx < tableLines[0].split('|').length - 1)
          const isDivider = /^\|[\s-|-|:|]*\|$/.test(tableLines[1].trim())
          const startIdx = isDivider ? 2 : 1
          
          const rows = []
          for (let r = startIdx; r < tableLines.length; r++) {
            const rawCells = tableLines[r].split('|').map(s => s.trim()).filter((s, idx) => idx > 0 && idx < tableLines[r].split('|').length - 1)
            rows.push(rawCells)
          }

          elements.push(
            <div className="table-responsive" key={`table-${i}`}>
              <table className="md-table">
                <thead>
                  <tr>
                    {rawHeaders.map((h, idx) => (
                      <th key={idx}>{parseInline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>{parseInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        } else {
          elements.push(<p key={i}>{parseInline(line)}</p>)
        }
        continue
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i}>{parseInline(line.substring(2))}</h1>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i}>{parseInline(line.substring(3))}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i}>{parseInline(line.substring(4))}</h3>)
      }
      // Lists
      else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(<li key={i}>{parseInline(line.trim().substring(2))}</li>)
      }
      // Blockquotes
      else if (line.trim().startsWith('> ')) {
        elements.push(<blockquote key={i}>{parseInline(line.trim().substring(2))}</blockquote>)
      }
      // Empty lines
      else if (line.trim() === '') {
        elements.push(<div key={i} className="md-spacer"></div>)
      }
      // Standard paragraphs
      else {
        elements.push(<p key={i}>{parseInline(line)}</p>)
      }
    }

    return elements
  }, [content])

  // Simple inline parser for bold/italics
  function parseInline(text) {
    if (!text) return ''
    const boldRegex = /\*\*(.*?)\*\*/g
    const codeRegex = /`(.*?)`/g
    
    let textStr = text
    return <span dangerouslySetInnerHTML={{ 
      __html: textStr
        .replace(boldRegex, '<strong>$1</strong>')
        .replace(codeRegex, '<code class="inline-code">$1</code>') 
    }} />
  }

  return <div className="markdown-body">{parsedElements}</div>
}

/* ================================================================
   SIMULATION WORKSPACE PAGE
   ================================================================ */
export default function CourseViewer() {
  const { courseSlug, topicSlug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [topic, setTopic] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLevel, setCurrentLevel] = useState('Simple') // Simple, Medium, Hard
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Simulation parameters
  const [simRunning, setSimRunning] = useState(false)
  const [simStep, setSimStep] = useState(0)
  const [simParams, setSimParams] = useState({
    m: 2.0, // slope
    c: 1.0, // intercept
    learningRate: 0.1,
    k: 3, // cluster centers
    temperature: 0.7,
    speed: 1.0, // running speed
  })
  const [simConsole, setSimConsole] = useState([])
  const [simPoints, setSimPoints] = useState([
    { x: -5, y: -9, cluster: 0 },
    { x: -3, y: -5, cluster: 0 },
    { x: 1, y: 3, cluster: 0 },
    { x: 3, y: 7, cluster: 0 },
    { x: 5, y: 11, cluster: 0 },
  ])

  // Custom visual state hooks
  const [selectedToken, setSelectedToken] = useState(null)

  // Fetch data
  useEffect(() => {
    if (!user || !courseSlug || !topicSlug) return

    async function fetchTopicData() {
      try {
        setLoading(true)
        const sessionRes = await supabase.auth.getSession()
        const token = sessionRes.data.session?.access_token

        if (!token) throw new Error('Not authenticated')

        const res = await fetch(`${BACKEND_URL}/api/v1/courses/${courseSlug}/topics/${topicSlug}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error(`Failed to load topic (Status: ${res.status})`)

        const topicData = await res.json()
        setTopic(topicData)
        setLessons(topicData.lessons || [])
        
        // Default console log
        setSimConsole([`[SimuLearn Workspace] Initialized topic: ${topicData.title}`])
      } catch (err) {
        console.error('Error fetching topic details:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTopicData()
  }, [courseSlug, topicSlug, user])

  // Resolve current active lesson based on currentLevel state
  const activeLesson = useMemo(() => {
    return lessons.find(l => l.difficulty_level === currentLevel) || (lessons.length > 0 ? lessons[0] : null)
  }, [lessons, currentLevel])

  // Determine which simulation engine to load based on course slug
  const engineType = useMemo(() => {
    if (!courseSlug) return 'python'
    const slug = courseSlug.toLowerCase()
    
    if (slug.includes('python') || slug.includes('setup') || slug.includes('protocols')) {
      return 'python'
    } else if (slug.includes('math') || slug.includes('ml-')) {
      return 'ml'
    } else if (slug.includes('deep-learning') || slug.includes('vision') || slug.includes('speech') || slug.includes('reinforcement')) {
      return 'dl'
    } else if (slug.includes('nlp') || slug.includes('transformer') || slug.includes('llm') || slug.includes('generative') || slug.includes('multimodal')) {
      return 'llm'
    } else if (slug.includes('agent') || slug.includes('autonomous') || slug.includes('infrastructure') || slug.includes('ethics') || slug.includes('capstone')) {
      return 'agent'
    }
    return 'python'
  }, [courseSlug])

  // Handlers for simulation runs
  const handleRunSimulation = () => {
    setSimRunning(true)
    setSimConsole(prev => [...prev, `[System] Starting simulation execution for '${currentLevel}' Mode...`])
    setSimStep(0)
  }

  const handleResetSimulation = () => {
    setSimRunning(false)
    setSimStep(0)
    setSimConsole(prev => [...prev, `[System] Reset simulation workspace.`])
  }

  // Auto-running steps in simulation
  useEffect(() => {
    if (!simRunning) return

    const timer = setInterval(() => {
      setSimStep(prev => {
        const next = prev + 1
        
        // Log simulator specific steps based on engine
        if (engineType === 'python') {
          if (currentLevel === 'Simple') {
            const steps = [
              "Line 1: Allocating variable 'a' in stack with value 10",
              "Line 2: Allocating variable 'b' in stack with value 20",
              "Line 3: Reading variable 'a' (10) and 'b' (20)",
              "Line 3: Computation completed: 'c' = 30",
              "Execution Finished. Stack frames cleared."
            ]
            if (next <= steps.length) {
              setSimConsole(c => [...c, `[Python VM] ${steps[next-1]}`])
              return next
            }
          } else if (currentLevel === 'Medium') {
            const steps = [
              "Invoking fact(3): Pushing new frame to stack. Locating local n=3",
              "Inside fact(3): n is not 1. Invoking fact(2)",
              "Invoking fact(2): Pushing frame to stack. Locating local n=2",
              "Inside fact(2): n is not 1. Invoking fact(1)",
              "Invoking fact(1): Pushing frame to stack. Locating local n=1",
              "Inside fact(1): n == 1 base case met. Returning 1",
              "Popping fact(1) frame. fact(2) receives 1, returns 2 * 1 = 2",
              "Popping fact(2) frame. fact(3) receives 2, returns 3 * 2 = 6",
              "Popping fact(3) frame. Final result: 6"
            ]
            if (next <= steps.length) {
              setSimConsole(c => [...c, `[Stack Trace] ${steps[next-1]}`])
              return next
            }
          } else {
            const steps = [
              "Class template Person loaded in memory",
              "Instantiating Person('Alice', 25). Allocating heap object #001",
              "Stack pointer 'p1' created, pointing to heap object #001",
              "Instantiating Person('Bob', 30). Allocating heap object #002",
              "Stack pointer 'p2' created, pointing to heap object #002",
              "Assignment p3 = p1: Pointer 'p3' created, pointing to heap object #001",
              "Heap object #001 now has 2 pointers (p1, p3). Object #002 has 1 pointer (p2)."
            ]
            if (next <= steps.length) {
              setSimConsole(c => [...c, `[Heap Manager] ${steps[next-1]}`])
              return next
            }
          }
        } else if (engineType === 'ml') {
          if (currentLevel === 'Simple') {
            const lr = simParams.learningRate
            setSimParams(p => {
              // Simulating Gradient descent line fitting
              const diffM = 2.0 - p.m
              const diffC = 1.0 - p.c
              const newM = p.m + diffM * lr
              const newC = p.c + diffC * lr
              return { ...p, m: parseFloat(newM.toFixed(3)), c: parseFloat(newC.toFixed(3)) }
            })
            const loss = Math.pow(2.0 - simParams.m, 2) + Math.pow(1.0 - simParams.c, 2)
            setSimConsole(c => [...c, `[Optimizer] Epoch ${next}: weights updated. Loss (MSE): ${loss.toFixed(4)}`])
            if (loss < 0.001 || next > 15) {
              setSimRunning(false)
              setSimConsole(c => [...c, `[Optimizer] Optimization converged to optimal fit!`])
            }
            return next
          } else {
            // General steps
            const steps = [
              "Epoch 1: Randomly selecting initial centroid positions",
              "Epoch 2: Assigning points to nearest centroids",
              "Epoch 3: Recomputing centroid coordinates as center-of-mass",
              "Epoch 4: Points shifting cluster labels",
              "Epoch 5: Centroids stable. Clustering converged!"
            ]
            if (next <= steps.length) {
              setSimConsole(c => [...c, `[K-Means] ${steps[next-1]}`])
              return next
            }
          }
        } else if (engineType === 'dl') {
          const steps = [
            "Initializing forward pass...",
            "Forward: Input activations mapped to hidden layer nodes",
            "Forward: Activation functions applied (ReLU). Output: [0.98, 0.02]",
            "Computing loss value (Cross Entropy): 0.035",
            "Initializing backward pass...",
            "Backward: Backpropagating delta weights from output to hidden nodes",
            "Backward: Applying weight updates with gradient step",
            "Weights optimized successfully."
          ]
          if (next <= steps.length) {
            setSimConsole(c => [...c, `[DeepNet] ${steps[next-1]}`])
            return next
          }
        } else if (engineType === 'llm') {
          const steps = [
            "Tokenizing input sequence...",
            "BPE Vocabulary index matches found. Generating token array.",
            "Loading Embeddings matrix map...",
            "Softmax distributions loaded for Query/Key matrix weights",
            "Self-attention grid calculation finished."
          ]
          if (next <= steps.length) {
            setSimConsole(c => [...c, `[LLM Engine] ${steps[next-1]}`])
            return next
          }
        } else if (engineType === 'agent') {
          const steps = [
            "Query received: 'What is 123 * 456?'",
            "Agent Thought: I need to calculate 123 multiplied by 456. I should invoke the calculator tool.",
            "Action: Calling Tool 'Calculator' with arguments '123 * 456'",
            "Observation: Calculator returned result '56088'",
            "Agent Thought: I now have the calculation result. I can return the final answer.",
            "Final Output: The result of 123 * 456 is 56,088."
          ]
          if (next <= steps.length) {
            setSimConsole(c => [...c, `[ReAct Loop] ${steps[next-1]}`])
            return next
          }
        }

        setSimRunning(false)
        return next
      })
    }, 1500 / simParams.speed)

    return () => clearInterval(timer)
  }, [simRunning, simParams.speed, currentLevel, engineType, simParams.m, simParams.c, simParams.learningRate])

  if (loading) {
    return (
      <div className="course-viewer-loading">
        <div className="loader"></div>
        <p>Initializing simulation workspace...</p>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="course-viewer-error">
        <h2>Workspace Error</h2>
        <p>{error || 'Topic details could not be loaded.'}</p>
        <Link to={`/courses/${courseSlug}`} className="btn-back">
          <ChevronLeft size={16} /> Back to Course Overview
        </Link>
      </div>
    )
  }

  return (
    <div className="course-viewer-layout">
      {/* Workspace Header */}
      <header className="workspace-header">
        <div className="header-left">
          <Link to={`/courses/${courseSlug}`} className="btn-back-link">
            <ChevronLeft size={18} />
          </Link>
          <div className="header-titles">
            <span className="course-title-micro">{topic.title}</span>
            <h2>{activeLesson ? activeLesson.title : 'Theory & Concepts'}</h2>
          </div>
        </div>

        {/* Difficulty Level Tabs */}
        <div className="difficulty-toggle">
          {['Simple', 'Medium', 'Hard'].map(lvl => (
            <button
              key={lvl}
              className={`difficulty-tab-btn ${currentLevel === lvl ? 'active' : ''}`}
              onClick={() => {
                setCurrentLevel(lvl)
                handleResetSimulation()
              }}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Action button for quiz */}
        <div className="header-right">
          {activeLesson?.quiz && (
            <Link 
              to={`/courses/${courseSlug}/quizzes/${activeLesson.slug}`}
              className="btn-quiz"
            >
              <Award size={16} />
              <span>Take Quiz</span>
            </Link>
          )}
        </div>
      </header>

      {/* Split Columns */}
      <div className="workspace-body">
        {/* LEFT COLUMN: Markdown content */}
        <div className="workspace-notes-panel">
          {activeLesson ? (
            <MarkdownRenderer content={activeLesson.content_markdown} />
          ) : (
            <p className="no-content-message">Select a difficulty mode to begin learning.</p>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Simulation Canvas */}
        <div className="workspace-simulation-panel">
          <div className="simulation-canvas-card">
            <div className="simulation-card-header">
              <span className="engine-badge">
                {engineType === 'python' && <Terminal size={14} />}
                {engineType === 'ml' && <Activity size={14} />}
                {engineType === 'dl' && <Cpu size={14} />}
                {engineType === 'llm' && <MessageSquare size={14} />}
                {engineType === 'agent' && <Cpu size={14} />}
                <span>{engineType.toUpperCase()} SIMULATION ENGINE</span>
              </span>
              <span className="status-indicator-light">
                <span className={`pulse-dot ${simRunning ? 'running' : ''}`}></span>
                {simRunning ? 'Executing' : 'Idle'}
              </span>
            </div>

            {/* Render proper simulation panel based on engine type */}
            <div className="simulation-rendering-area">
              {engineType === 'python' && (
                <div className="python-sim-engine">
                  <div className="python-layout">
                    {/* Visual Call Stack */}
                    <div className="stack-area">
                      <h4>Call Stack</h4>
                      <div className="stack-frames">
                        {simStep === 0 && <div className="frame-empty">Empty Frame</div>}
                        
                        {currentLevel === 'Simple' && simStep >= 1 && (
                          <div className="stack-frame animate-frame">
                            <div className="frame-title">main()</div>
                            <div className="frame-vars">
                              {simStep >= 1 && <div>a = 10</div>}
                              {simStep >= 2 && <div>b = 20</div>}
                              {simStep >= 4 && <div className="highlight-var">c = 30</div>}
                            </div>
                          </div>
                        )}

                        {currentLevel === 'Medium' && simStep >= 1 && (
                          <div className="recursion-frames-container">
                            {simStep >= 5 && (
                              <div className="stack-frame recursion-frame layer-3">
                                <div className="frame-title">fact(1)</div>
                                <div className="frame-vars">n = 1 {simStep >= 6 && <span className="ret-val">→ returns 1</span>}</div>
                              </div>
                            )}
                            {simStep >= 3 && (
                              <div className="stack-frame recursion-frame layer-2">
                                <div className="frame-title">fact(2)</div>
                                <div className="frame-vars">n = 2 {simStep >= 7 && <span className="ret-val">→ returns 2</span>}</div>
                              </div>
                            )}
                            {simStep >= 1 && (
                              <div className="stack-frame recursion-frame layer-1">
                                <div className="frame-title">fact(3)</div>
                                <div className="frame-vars">n = 3 {simStep >= 8 && <span className="ret-val">→ returns 6</span>}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {currentLevel === 'Hard' && simStep >= 1 && (
                          <div className="stack-frame animate-frame">
                            <div className="frame-title">global()</div>
                            <div className="frame-vars">
                              {simStep >= 3 && <div>p1 = <span className="heap-ptr">Heap #001</span></div>}
                              {simStep >= 5 && <div>p2 = <span className="heap-ptr">Heap #002</span></div>}
                              {simStep >= 6 && <div>p3 = <span className="heap-ptr">Heap #001</span></div>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visual Heap Memory */}
                    <div className="heap-area">
                      <h4>Heap Objects</h4>
                      <div className="heap-blocks">
                        {simStep === 0 && <div className="heap-empty">Heap Empty</div>}

                        {currentLevel === 'Hard' && simStep >= 2 && (
                          <div className="heap-row">
                            {simStep >= 2 && (
                              <div className="heap-node">
                                <div className="node-id">Heap #001 (Person)</div>
                                <div className="node-props">
                                  <div>name: "Alice"</div>
                                  <div>age: 25</div>
                                </div>
                              </div>
                            )}
                            {simStep >= 4 && (
                              <div className="heap-node">
                                <div className="node-id">Heap #002 (Person)</div>
                                <div className="node-props">
                                  <div>name: "Bob"</div>
                                  <div>age: 30</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {currentLevel !== 'Hard' && simStep > 0 && (
                          <div className="heap-primitive-message">
                            Primitives stored on stack frames directly.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {engineType === 'ml' && (
                <div className="ml-sim-engine">
                  {/* ML coordinate canvas */}
                  <div className="ml-coordinate-plane">
                    {/* Grid lines */}
                    <div className="axis-y"></div>
                    <div className="axis-x"></div>
                    
                    {/* Scatter points */}
                    {simPoints.map((p, idx) => (
                      <div 
                        key={idx} 
                        className={`point point-${p.cluster}`} 
                        style={{ 
                          left: `${50 + p.x * 8}%`, 
                          top: `${50 - p.y * 4}%` 
                        }}
                      ></div>
                    ))}

                    {/* Linear Regression Line */}
                    {currentLevel === 'Simple' && (
                      <div 
                        className="regression-line"
                        style={{
                          transform: `rotate(${-simParams.m * 12}deg) translateY(${simParams.c * 15}px)`,
                          borderColor: 'var(--color-primary)'
                        }}
                      ></div>
                    )}

                    {/* K-Means centroids */}
                    {currentLevel === 'Medium' && simStep >= 2 && (
                      <>
                        <div className="centroid c-0" style={{ left: '40%', top: '60%' }}>X</div>
                        <div className="centroid c-1" style={{ left: '65%', top: '35%' }}>X</div>
                      </>
                    )}
                  </div>

                  {/* Sidebar stats panel */}
                  <div className="ml-sliders-panel">
                    {currentLevel === 'Simple' && (
                      <>
                        <div className="param-slider-group">
                          <label>Slope (m): {simParams.m}</label>
                          <input 
                            type="range" min="-5" max="5" step="0.1" 
                            value={simParams.m} 
                            onChange={(e) => setSimParams(p => ({ ...p, m: parseFloat(e.target.value) }))}
                            disabled={simRunning}
                          />
                        </div>
                        <div className="param-slider-group">
                          <label>Y-Intercept (c): {simParams.c}</label>
                          <input 
                            type="range" min="-5" max="5" step="0.1" 
                            value={simParams.c} 
                            onChange={(e) => setSimParams(p => ({ ...p, c: parseFloat(e.target.value) }))}
                            disabled={simRunning}
                          />
                        </div>
                        <div className="param-slider-group">
                          <label>Learning Rate (&alpha;): {simParams.learningRate}</label>
                          <input 
                            type="range" min="0.01" max="0.5" step="0.01" 
                            value={simParams.learningRate} 
                            onChange={(e) => setSimParams(p => ({ ...p, learningRate: parseFloat(e.target.value) }))}
                            disabled={simRunning}
                          />
                        </div>
                      </>
                    )}
                    {currentLevel === 'Medium' && (
                      <div className="param-slider-group">
                        <label>Cluster Centroids (K): {simParams.k}</label>
                        <input 
                          type="range" min="2" max="5" step="1" 
                          value={simParams.k} 
                          onChange={(e) => setSimParams(p => ({ ...p, k: parseInt(e.target.value) }))}
                          disabled={simRunning}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {engineType === 'dl' && (
                <div className="dl-sim-engine">
                  <svg className="neural-net-svg" viewBox="0 0 500 300">
                    {/* Connective links */}
                    {/* Layer 1 (Inputs) to Layer 2 (Hidden) */}
                    <line x1="100" y1="100" x2="250" y2="70" className={`net-link ${simRunning && simStep >= 1 ? 'glow-forward' : ''}`} stroke="rgba(34,197,94,0.4)" strokeWidth="3" />
                    <line x1="100" y1="100" x2="250" y2="150" className="net-link" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
                    <line x1="100" y1="100" x2="250" y2="230" className="net-link" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
                    
                    <line x1="100" y1="200" x2="250" y2="70" className="net-link" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
                    <line x1="100" y1="200" x2="250" y2="150" className={`net-link ${simRunning && simStep >= 1 ? 'glow-forward' : ''}`} stroke="rgba(34,197,94,0.3)" strokeWidth="2.5" />
                    <line x1="100" y1="200" x2="250" y2="230" className="net-link" stroke="rgba(34,197,94,0.4)" strokeWidth="3" />

                    {/* Layer 2 (Hidden) to Layer 3 (Outputs) */}
                    <line x1="250" y1="70" x2="400" y2="150" className={`net-link ${simRunning && simStep >= 2 ? 'glow-forward' : ''}`} stroke="rgba(34,197,94,0.5)" strokeWidth="4" />
                    <line x1="250" y1="150" x2="400" y2="150" className="net-link" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
                    <line x1="250" y1="230" x2="400" y2="150" className={`net-link ${simRunning && simStep >= 2 ? 'glow-forward' : ''}`} stroke="rgba(34,197,94,0.4)" strokeWidth="3" />

                    {/* Backward glow pulses */}
                    {simRunning && simStep >= 5 && (
                      <>
                        <line x1="400" y1="150" x2="250" y2="70" className="net-link glow-backward" stroke="rgba(139,92,246,0.6)" strokeWidth="3" />
                        <line x1="250" y1="70" x2="100" y2="100" className="net-link glow-backward" stroke="rgba(139,92,246,0.6)" strokeWidth="3" />
                      </>
                    )}

                    {/* Layer Nodes */}
                    {/* Layer 1 (Inputs) */}
                    <circle cx="100" cy="100" r="16" className="net-node input-node" />
                    <text x="100" y="104" textAnchor="middle" className="node-text">x1</text>
                    
                    <circle cx="100" cy="200" r="16" className="net-node input-node" />
                    <text x="100" y="204" textAnchor="middle" className="node-text">x2</text>

                    {/* Layer 2 (Hidden) */}
                    <circle cx="250" cy="70" r="18" className={`net-node hidden-node ${simRunning && simStep >= 1 ? 'activated' : ''}`} />
                    <text x="250" y="74" textAnchor="middle" className="node-text">h1</text>
                    
                    <circle cx="250" cy="150" r="18" className={`net-node hidden-node ${simRunning && simStep >= 1 ? 'activated' : ''}`} />
                    <text x="250" y="154" textAnchor="middle" className="node-text">h2</text>
                    
                    <circle cx="250" cy="230" r="18" className="net-node hidden-node" />
                    <text x="250" y="234" textAnchor="middle" className="node-text">h3</text>

                    {/* Layer 3 (Output) */}
                    <circle cx="400" cy="150" r="20" className={`net-node output-node ${simRunning && simStep >= 2 ? 'activated-out' : ''}`} />
                    <text x="400" y="154" textAnchor="middle" className="node-text">y</text>
                  </svg>
                </div>
              )}

              {engineType === 'llm' && (
                <div className="llm-sim-engine">
                  <div className="llm-token-viewer">
                    <h4>Tokenizer Splits</h4>
                    <div className="token-grid">
                      {["Self", "attention", "is", "all", "you", "need"].map((t, idx) => (
                        <div 
                          key={idx} 
                          className={`token-tag index-${idx} ${selectedToken === idx ? 'selected' : ''}`}
                          onClick={() => setSelectedToken(idx)}
                        >
                          <span className="token-text">{t}</span>
                          <span className="token-id">#{1024 + idx * 8}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="attention-matrix-viewer">
                    <h4>Attention Weights {selectedToken !== null && `(Query: "${["Self", "attention", "is", "all", "you", "need"][selectedToken]}")`}</h4>
                    <div className="attention-grid">
                      {["Self", "attention", "is", "all", "you", "need"].map((row, rIdx) => (
                        <div key={rIdx} className="attention-row">
                          {["Self", "attention", "is", "all", "you", "need"].map((col, cIdx) => {
                            // Compute dummy intensity
                            let weight = 0.05
                            if (selectedToken !== null) {
                              if (rIdx === selectedToken) {
                                if (cIdx === rIdx) weight = 0.7
                                else if (Math.abs(cIdx - rIdx) === 1) weight = 0.3
                                else weight = 0.1
                              }
                            } else {
                              if (rIdx === cIdx) weight = 0.8
                              else if (Math.abs(rIdx - cIdx) === 1) weight = 0.2
                            }
                            
                            return (
                              <div 
                                key={cIdx} 
                                className="attention-cell" 
                                style={{ background: `rgba(34, 197, 94, ${weight})` }}
                                title={`${row} -> ${col}: ${weight}`}
                              ></div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {engineType === 'agent' && (
                <div className="agent-sim-engine">
                  <div className="agent-nodes-graph">
                    {/* User Query Node */}
                    <div className="flow-node flow-user">
                      <div className="flow-node-title">User Query</div>
                      <div className="flow-node-body">"What is 123 * 456?"</div>
                    </div>
                    
                    {/* Connective Line 1 */}
                    <div className={`flow-connector ${simRunning && simStep >= 1 ? 'active' : ''}`}></div>

                    {/* Agent Brain Node */}
                    <div className={`flow-node flow-agent ${simRunning && simStep >= 2 ? 'active-brain' : ''}`}>
                      <div className="flow-node-title">LLM Planner / Agent</div>
                      <div className="flow-node-body">
                        {simStep >= 5 ? "Final Output generated" : (simStep >= 2 ? "Thought: Call calculator" : "Waiting for input...")}
                      </div>
                    </div>

                    {/* Connective Line 2 */}
                    <div className={`flow-connector ${simRunning && simStep >= 3 ? 'active' : ''}`}></div>

                    {/* Calculator Tool Node */}
                    <div className={`flow-node flow-tool ${simRunning && simStep >= 4 ? 'active-tool' : ''}`}>
                      <div className="flow-node-title">Calculator Tool</div>
                      <div className="flow-node-body">
                        {simStep >= 4 ? "Output: 56,088" : "Args: '123 * 456'"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Console Log Footer */}
            <div className="simulation-console">
              <div className="console-header">
                <span>Console Logs</span>
                <button className="btn-clear-console" onClick={() => setSimConsole([])}>Clear</button>
              </div>
              <div className="console-lines">
                {simConsole.map((line, idx) => (
                  <div key={idx} className="console-line">{line}</div>
                ))}
              </div>
            </div>

            {/* Simulation Controls Footer */}
            <div className="simulation-controls">
              <button 
                className="btn-control btn-run"
                onClick={handleRunSimulation}
                disabled={simRunning}
              >
                <Play size={15} fill="currentColor" />
                <span>Run Simulation</span>
              </button>
              <button 
                className="btn-control btn-reset"
                onClick={handleResetSimulation}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>

              <div className="speed-slider-group">
                <span>Speed: {simParams.speed}x</span>
                <input 
                  type="range" min="0.5" max="3" step="0.5" 
                  value={simParams.speed}
                  onChange={(e) => setSimParams(p => ({ ...p, speed: parseFloat(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
