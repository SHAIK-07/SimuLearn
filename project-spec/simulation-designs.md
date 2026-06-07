# Simulation Design Specifications

This document outlines the visual layout, mechanics, and example cases (Simple, Medium, Hard) for each of the core interactive simulation engines in SimuLearn, and maps them to the 21 courses in the workspace.

---

## 21-Course Simulation Mapping

All 21 courses in the platform map to one of our 5 core simulation engines to provide high-fidelity visual learning:

| Folder Name in `Courses/` | Course Title | Simulation Engine | Primary Visual Focus |
| :--- | :--- | :--- | :--- |
| `Course-python` | Python Programming | **1. Python Engine** | In-browser AST, call stack, and heap changes |
| `Course-setup-and-tooling` | Setup and Tooling | **1. Python Engine** | Visualizing command PATH routing and tool calls |
| `Course-tools-and-protocols` | Tools and Protocols | **1. Python Engine** | API requests and JSON payload serialization |
| `Course-math-foundations` | Math Foundations | **2. ML/Math Plotter** | Derivatives, gradient vector graphs, function boundaries |
| `Course-ml-fundamentals` | ML Fundamentals | **2. ML/Math Plotter** | 2D Linear Regression, K-Means clustering, decision splits |
| `Course-deep-learning-core` | Deep Learning Core | **3. DL Visualizer** | Multi-Layer Perceptrons, weights, activation pulses |
| `Course-computer-vision` | Computer Vision | **3. DL Visualizer** | 3D Convolution filter sliding and feature grid maps |
| `Course-speech-and-audio` | Speech and Audio | **3. DL Visualizer** | 1D wave convolution filters and Fourier transforms |
| `Course-reinforcement-learning` | Reinforcement Learning | **3. DL Visualizer** | Q-table value maps, grid-world policy arrows |
| `Course-nlp-foundations-to-advanced` | NLP Foundations | **4. LLM Visualizer** | BPE Tokenization, word piece splits, TF-IDF weights |
| `Course-transformers-deep-dive` | Transformers Deep Dive | **4. LLM Visualizer** | Attention grid matrices, Query/Key/Value vectors |
| `Course-llms-from-scratch` | LLMs from Scratch | **4. LLM Visualizer** | Token probability outputs and parameter scale changes |
| `Course-llm-engineering` | LLM Engineering | **4. LLM Visualizer** | Prompt formatting, structured JSON output matching |
| `Course-generative-ai` | Generative AI | **4. LLM Visualizer** | Token temperature, top-k, top-p generation sliders |
| `Course-multimodal-ai` | Multimodal AI | **4. LLM Visualizer** | Text-Image projection matrices and cross-attention mapping |
| `Course-agent-engineering` | Agent Engineering | **5. Agentic Flow** | Single agent ReAct loop and Tool invocation blocks |
| `Course-multi-agent-and-swarms` | Multi-Agent & Swarms | **5. Agentic Flow** | Peer-to-peer agent node graph debates and routers |
| `Course-autonomous-systems` | Autonomous Systems | **5. Agentic Flow** | State machines, loop conditions, feedback sensors |
| `Course-infrastructure-and-production` | Infrastructure & Production | **5. Agentic Flow** | Container orchestration nodes, CI/CD pipeline steps |
| `Course-ethics-safety-alignment` | Ethics, Safety & Alignment | **5. Agentic Flow** | Guardrail evaluator blocks, input classification routing |
| `Course-capstone-projects` | Capstone Projects | **Dynamic** | Hybrid view combining code editor and dynamic canvas |

---


## 1. Python: Visual Execution Engine

### Visual Layout & Mechanics
- **Left Panel**: Code editor with current executing line highlighted in a soft green gradient.
- **Right Panel**: A interactive visual inspector built with Framer Motion:
  - **Call Stack**: Stack frames depicted as vertical blocks. Each frame shows the function name and local variable bindings.
  - **Heap**: Objects like Lists, Dictionaries, and Custom Objects are shown as circular or rounded-box nodes. Pointer lines with arrows connect variables from the stack to their heap nodes.
  - **Standard Output**: A terminal-style box showing print statements.

### Difficulty Levels
- **Simple (Variables & Operations)**:
  - *Code*: `a = 10; b = 20; c = a + b`
  - *Simulation*: Visualizes memory allocation in stack cells. Line-by-line step shows the value of `c` resolving.
- **Medium (Function Calls & Recursion)**:
  - *Code*: Recursive Factorial `fact(n)`
  - *Simulation*: Shows stack frames piling up. Pushing `fact(3) -> fact(2) -> fact(1)`. When base case is met, shows frames popping and returning values down the stack.
- **Hard (Object-Oriented Memory)**:
  - *Code*: Creating a `Person` class and instantiating two objects with properties.
  - *Simulation*: Heap shows instances pointing to class templates. Visualizes reference passing (e.g., if `p2 = p1`, both point to the same object node on the heap).

### Interactive Parameters
- **Execution Speed**: Slider to adjust automatic step intervals (0.5s to 3s).
- **Console Input**: Input box to pass user inputs for `input()` prompts.
- **Interactive Stack Frame Explorer**: Clicking a stack frame expands it to show hidden closure scopes.

---

## 2. Machine Learning: Interactive 2D Plotter

### Visual Layout & Mechanics
- **Canvas**: An interactive coordinates plane ($X$ and $Y$ from -10 to 10).
- **Mechanics**: Users can click on the canvas to add data points (labeled Red or Blue). As they adjust model parameters, the decision boundary updates in real-time.

### Difficulty Levels
- **Simple (Linear Regression)**:
  - *Goal*: Place points and fit a line of best fit $y = mx + c$.
  - *Simulation*: Slider adjusts $m$ (slope) and $c$ (intercept) manually. Click "Auto Fit" to watch gradient descent step-by-step; the line rotates and shifts as the loss value (Mean Squared Error bar chart) drops.
- **Medium (K-Means Clustering)**:
  - *Goal*: Group points into $K$ clusters.
  - *Simulation*: User chooses $K$ (2 to 5) and clicks to place initial cluster centers (centroids). Stepping forward shows data points color-coding to their nearest centroid, and then centroids moving to the average location of their clusters.
- **Hard (Decision Tree splits)**:
  - *Goal*: Partition data using axis-aligned decision boundaries.
  - *Simulation*: Canvas splits horizontally or vertically as tree nodes are added. Shows the corresponding Decision Tree hierarchy diagram. Adjusting "Max Depth" slider cuts off splits and visualizes underfitting vs overfitting.

### Interactive Parameters
- **Centroid Count ($K$)** / **Tree Depth** sliders.
- **Learning Rate ($\alpha$)** slider for Gradient Descent.
- **Noise Generator**: Adds random jitter to points to show outlier effects.

---

## 3. Deep Learning: Neural Network node visualizer

### Visual Layout & Mechanics
- **Canvas**: Rendered in Three.js (WebGL) for 3D layout or responsive 2D SVG.
- **Mechanics**: Layer nodes are displayed, connected by links representing weights. Edge colors indicate weight polarity (Green for positive, Red for negative), and thickness represents weight magnitude. Forward pass runs glowing pulses from input to output layers. Backward pass shows color pulses travelling in reverse.

### Difficulty Levels
- **Simple (Single Perceptron)**:
  - *Goal*: Learn logic gates (AND/OR).
  - *Simulation*: 2 input nodes, 1 output node. Shows the decision boundary line separating inputs on a 2D plane in real-time as users slide weight and bias parameters.
- **Medium (Multi-Layer Perceptron)**:
  - *Goal*: Solve the XOR problem.
  - *Simulation*: 2-4-1 Network structure. Users input features, click "Forward" to watch intermediate activations compute (highlighted node glow intensity), and "Backward" to see weights adjust.
- **Hard (Convolutional Filter Sliding)**:
  - *Goal*: Understand feature extraction.
  - *Simulation*: 3D grid layout showing a $3 \times 3$ Kernel sliding over a $5 \times 5$ input image matrix, generating a $3 \times 3$ Feature Map. User adjusts Kernel weights and stride.

### Interactive Parameters
- **Activation Function dropdown**: Sigmoid, ReLU, Tanh.
- **Weight / Bias sliders**: Direct adjustment of individual network parameters.
- **Batch Size & Epochs**: Settings for training speed controls.

---

## 4. LLMs: Tokenizer & Self-Attention Heatmap

### Visual Layout & Mechanics
- **Upper Panel**: Plain text input area.
- **Lower Left**: Colored token tags showcasing text segmentation.
- **Lower Right**: Interactive grid mapping token index vs token index (Attention Heatmap).

### Difficulty Levels
- **Simple (Tokenizer Comparison)**:
  - *Goal*: Understand token IDs.
  - *Simulation*: Type a custom sentence. Highlights token spans (using alternating green, emerald, and slate backgrounds) and displays their integer token IDs from the vocabulary index.
- **Medium (Softmax & Text Generation Parameters)**:
  - *Goal*: Control generation creativity.
  - *Simulation*: Shows the top 5 next-token candidates with their raw logits. Sliders adjust **Temperature** (flattens/sharpens distribution), **Top-K**, and **Top-P**. Shows the updated probabilities in a bar chart.
- **Hard (Transformer Self-Attention Matrix)**:
  - *Goal*: Visualizing core attention links.
  - *Simulation*: Renders a 2D grid matrix of attention weights. Hovering over a token highlights its attention connections to all other tokens (e.g. mapping "bank" to either "river" or "money" based on context).

### Interactive Parameters
- **Vocabulary Size** slider (shows how lower vocab causes words to split into individual characters).
- **Temperature / Top-P / Top-K** generation parameters.
- **Attention Head Selector**: Dropdown to view different heads inside the multi-head attention layer.

---

## 5. Agentic AI: React Flow Workflow Visualizer

### Visual Layout & Mechanics
- **Canvas**: Built with React Flow. Node types include:
  - `User Input`: The starting query.
  - `LLM Planner / Agent`: Brain node displaying prompt context and current thought.
  - `Tool Node`: Calculator, Web Search, Database Query.
  - `Output / Response`: Final text output node.
- **Mechanics**: Clicking "Step" animates packets along the edges, showing the routing of information.

### Difficulty Levels
- **Simple (ReAct Loop)**:
  - *Goal*: Single-agent tool calling.
  - *Simulation*: User asks "What is $123 \times 456$?". Agent node flashes "Thought: I need to use the calculator tool". Edge animates to Calculator tool, receives output, routes back to Agent, then outputs final answer.
- **Medium (Router / Classifier Chain)**:
  - *Goal*: Select appropriate specialist agent.
  - *Simulation*: User query is analyzed by a Router node. Visualizes conditional routing branches: coding query goes to "Python Agent Node", writing query goes to "Doc Agent Node".
- **Hard (Multi-Agent Debate/Swarms)**:
  - *Goal*: Collaborative code review.
  - *Simulation*: Tri-agent architecture: `Developer Agent` writes code -> sends to `Reviewer Agent` -> rejects and returns to `Developer` (loop) -> once approved, sends to `Deployer Agent`. Users watch packets bounce back and forth with interactive debug logs.

### Interactive Parameters
- **Agent Prompts**: Text areas to customize system instructions for each agent.
- **Tool Toggle**: Checkboxes to enable/disable tools (forces agent to adapt its thoughts).
- **Agent Max Iteration Limit** slider.
