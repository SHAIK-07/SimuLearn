import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Heart,
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react'
import Logo from '../components/Logo'
import './AboutPage.css'

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

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Navbar */}
      <header className="about-header">
        <Link to="/" className="about-logo">
          <Logo size={32} variant="full" />
        </Link>
        <nav className="about-nav">
          <Link to="/" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <Link to="/auth" className="btn btn-primary btn-sm">
            Get Started <ArrowRight size={14} />
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="about-main-content">
        
        {/* Why we built this */}
        <section className="about-section text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="about-badge">About the Project</div>
            <h1 className="mb-4 font-bold">Why We Built SimuLearn</h1>
            <p className="about-subtitle max-w-2xl mx-auto">
              SimuLearn was built to bridge the gap between theory and execution in software engineering and machine learning. Abstract formulas, data flow stacks, and multi-agent loops are difficult to visualize. Our platform transforms these concepts into interactive, hands-on simulation sandboxes.
            </p>
          </motion.div>
        </section>

        {/* Creator Info Simple Card */}
        <section className="about-creator-simple glass-panel text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="section-badge-creator mb-2">Creator</div>
            <h2 className="creator-name font-bold mb-1">Shaik Hidaythulla</h2>
            <p className="creator-title text-sm text-slate-400 mb-6">Senior AI / ML Engineer</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://shaik-07.github.io/Portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View Portfolio <ExternalLink size={14} />
              </a>
              <a
                href="https://github.com/SHAIK-07"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <GithubIcon size={16} /> GitHub Profile
              </a>
            </div>
          </motion.div>
        </section>

        {/* Special Credits & Inspirations (Highlighted Grid Layout) */}
        <section className="about-credits-highlighted mb-16">
          <div className="text-center mb-8">
            <div className="section-badge-credits">Acknowledgements</div>
            <h2 className="font-bold mb-2">Special Credits & Inspiration</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              This platform was designed and structured with course outline references and educational guides from these amazing contributors:
            </p>
          </div>

          <div className="credits-highlight-grid">
            <motion.div
              className="credit-highlight-card glass-panel border-l-4 border-emerald-500"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="card-top-header mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg text-emerald-400">CodeWithHarry</h4>
                  <span className="credit-tag-badge bg-emerald-950 text-emerald-300 text-xxs font-bold px-2.5 py-0.5 rounded-full border border-emerald-800">
                    Python Core Reference
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deep appreciation for his comprehensive, highly engaging, and structured Python programming curriculum. His educational guides helped map the fundamental syntax and concepts for our Phase 1 Python course.
                </p>
              </div>
              <a
                href="https://github.com/CodeWithHarry/100-days-of-code-youtube"
                target="_blank"
                rel="noopener noreferrer"
                className="credit-link font-mono text-xs"
              >
                100-days-of-code-youtube <ExternalLink size={10} style={{ display: 'inline', marginLeft: 4 }} />
              </a>
            </motion.div>

            <motion.div
              className="credit-highlight-card glass-panel border-l-4 border-purple-500"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="card-top-header mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg text-purple-400">Rohit Ghumare</h4>
                  <span className="credit-tag-badge bg-purple-950 text-purple-300 text-xxs font-bold px-2.5 py-0.5 rounded-full border border-purple-800">
                    AI Engineering Guide
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deep appreciation for his repository detailing guidelines to build AI engineering solutions from scratch. His structure served as a core blueprint for constructing our Phase 5 & 6 agentic execution courses.
                </p>
              </div>
              <a
                href="https://github.com/rohitg00/ai-engineering-from-scratch"
                target="_blank"
                rel="noopener noreferrer"
                className="credit-link font-mono text-xs"
              >
                ai-engineering-from-scratch <ExternalLink size={10} style={{ display: 'inline', marginLeft: 4 }} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* GitHub Contribute CTA */}
        <section className="opensource-invite-section text-center mb-12">
          <div className="glass-panel opensource-card p-10 rounded-lg">
            <div className="heart-icon-wrapper mb-4">
              <Heart size={28} color="#EF4444" fill="#EF4444" className="animate-pulse" />
            </div>
            <h2 className="font-bold">Contribute to SimuLearn</h2>
            <p className="section-desc max-w-2xl mx-auto mb-6 text-slate-300">
              This project is 100% open-source and free to use. We encourage developers to suggest custom simulation modules, write courses, or contribute to our codebase.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://github.com/SHAIK-07/SimuLearn"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <GithubIcon size={18} /> Star on GitHub <ExternalLink size={12} />
              </a>
              <Link to="/auth" className="btn btn-secondary">
                Sign Up & Use Free
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer-text">
          © {new Date().getFullYear()} SimuLearn — Managed by Shaik Hidaythulla. Released under MIT Open-Source License.
        </div>
        <div className="about-footer-links">
          <a href="https://github.com/SHAIK-07" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://shaik-07.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
          <Link to="/">Home</Link>
        </div>
      </footer>
    </div>
  )
}
