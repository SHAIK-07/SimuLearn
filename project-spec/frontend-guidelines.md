# Frontend Development Guidelines

This document details the theme design tokens, custom styling guidelines (without utility-first tailwind framework dependencies), layouts, and interactive component specifications.

---

## 1. Design System & CSS Variables

To achieve a premium, minimal, and modern technical aesthetic matching Linear and Stripe, we will build a custom CSS design system using vanilla CSS variables.

Save the following base variables inside `frontend/src/index.css`:

```css
:root {
  /* Color Palette */
  --color-primary: #22C55E;       /* Learning Green */
  --color-secondary: #10B981;     /* Emerald */
  --color-bg-main: #0F172A;       /* Dark Navy */
  --color-bg-card: #1E293B;       /* Slate */
  --color-border: #334155;        /* Muted border slate */
  
  --color-text-primary: #F8FAFC;  /* Off White */
  --color-text-secondary: #94A3B8;/* Soft Muted Gray */
  
  --color-accent-blue: #3B82F6;   /* Details & Info */
  --color-accent-purple: #8B5CF6; /* High-level Agentic AI indicator */
  --color-danger: #EF4444;        /* Error state */
  
  /* Typography */
  --font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif;
  
  /* Elevation / Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-glow: 0 0 20px rgba(34, 197, 94, 0.15);
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Global Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-bg-main);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 2. Page & Layout Specifications

### 2.1 Landing Page Layout
- **Hero Section**: Sleek gradient header (`background: radial-gradient(circle at top, rgba(34, 197, 94, 0.08) 0%, transparent 60%)`).
- **Interactive Pitch**: A live mini-simulation embedded directly on the landing page (e.g., a simple coordinate space where visitors can place 3 dots and watch a linear regression line animate to fit them).
- **Course Grid**: Sleek card components displaying:
  - Title, description, estimated learning hours, difficulty tags.
  - Glowing borders on hover (`box-shadow: var(--shadow-glow)`).

### 2.2 Dashboard Layout
- **Structure**: Grid-based navigation with a left-hand Sidebar (fixed, `width: 260px`) and main dashboard panel (`flex-grow: 1; padding: 40px`).
- **Phased Curriculum Sections**: Rather than a flat list, the 21 courses are grouped into 7 developmental phases:
  1. **Phase 1: Foundation Tools** (`Course-setup-and-tooling`, `Course-python`, `Course-tools-and-protocols`)
  2. **Phase 2: Math & Classical ML** (`Course-math-foundations`, `Course-ml-fundamentals`)
  3. **Phase 3: Deep Learning Core** (`Course-deep-learning-core`, `Course-computer-vision`, `Course-speech-and-audio`, `Course-reinforcement-learning`)
  4. **Phase 4: NLP & Transformers** (`Course-nlp-foundations-to-advanced`, `Course-transformers-deep-dive`)
  5. **Phase 5: GenAI & LLM Foundations** (`Course-llms-from-scratch`, `Course-llm-engineering`, `Course-generative-ai`, `Course-multimodal-ai`)
  6. **Phase 6: Agentic AI & Swarms** (`Course-agent-engineering`, `Course-multi-agent-and-swarms`, `Course-autonomous-systems`)
  7. **Phase 7: Production & Alignment** (`Course-infrastructure-and-production`, `Course-ethics-safety-alignment`, `Course-capstone-projects`)
- **Progress Trackers**: Display circular progress bars (`svg` elements with `stroke-dasharray` and `stroke-dashoffset` animated using CSS transitions) indicating percent completion for each Phase and individual Course.

### 2.3 Course Split-Screen Layout (CourseViewer)
This is the core learning workspace of the platform.

```text
+------------------------------------+------------------------------------+
|                HEADER: Course Name | Lesson Title | Progress Bar        |
+------------------------------------+------------------------------------+
| LEFT COLUMN (45% Width)            | RIGHT COLUMN (55% Width)           |
|                                    |                                    |
| [Back to Dashboard]                | [DIFFICULTY: Simple | Med | Hard]  |
|                                    | [Parameters Sliders: m=..., c=...] |
| ## Lesson Title                    | +--------------------------------+ |
| Markdown notes content goes here.  | | INTERACTIVE CANVAS (SIMULATION)| |
| Explains the logic of recursion.   | |                                | |
|                                    | |  (Three.js / React Flow /      | |
| ```python                          | |   Framer Motion Visuals)       | |
| def fact(n):                       | |                                | |
|     ...                            | +--------------------------------+ |
| ```                                | [Execution Console / Control Buttons]|
|                                    | [ Run Simulation ]  [ Reset ]      |
+------------------------------------+------------------------------------+
```

- **Styling**:
  - Main container: `display: grid; grid-template-columns: 45fr 55fr; height: calc(100vh - 60px); overflow: hidden;`
  - Left panel: `overflow-y: auto; padding: 32px; border-right: 1px solid var(--color-border);`
  - Right panel: `display: flex; flex-direction: column; background: rgba(30, 41, 59, 0.4); padding: 24px;`

---

## 3. UI Component Specifications

### 3.1 Notes Renderer (`MarkdownRenderer.jsx`)
- Uses `react-markdown` and `prismjs` (or `react-syntax-highlighter`) to render lesson files.
- Code blocks must have a "Copy" button and a "Send to Simulator" button that updates the code inside the simulation compiler state on the right.

### 3.2 Slider / Control Knobs
- Pure CSS styling for sliders:
  ```css
  input[type="range"] {
    -webkit-appearance: none;
    background: var(--color-border);
    height: 6px;
    border-radius: var(--radius-full);
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: var(--color-primary);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 8px var(--color-primary);
  }
  ```

---

## 4. Animation Framework Integration

### 4.1 Framer Motion Patterns
- Use for UI transition states, sliders, and standard rendering overlays:
  - Slide-in sidebars.
  - Variable blocks growing or shifting in the Python heap representation.
  - Hover states on course cards.

### 4.2 React Flow Configurations
- Used exclusively for Agentic AI node diagrams.
- Use custom nodes (`customNodes` key in React Flow) to format agent structures (brain symbols, tools, and databases).
- Edge routing must be set to `smoothstep` with animated dashed paths when active (`animated: true`).

### 4.3 Three.js Configuration
- Integrate using `@react-three/fiber` and `@react-three/drei`.
- Use for 3D Neural Networks layers representation:
  - Node spheres positioned in 3D coordinate space.
  - Lines joining layer nodes with alpha values proportional to weight values.
  - Canvas element needs a simple `OrbitControls` component so users can rotate, pan, and zoom into the network layers.
