const { useState, useEffect, useRef } = React;

// --- Data Payload ---
const topics = [
  {
    "id": "optimization",
    "title": "Quadratic Optimization (Vertex)",
    "trigger": "Prompt asks for 'maximum area', 'minimum cost', or optimal dimensions of a quadratic function.",
    "formula": "$$\\text{Vertex } x = -\\frac{b}{2a}$$",
    "pitfall": "Incomplete Execution: The formula only gives the INPUT (e.g., width). To find the maximum AREA, you MUST substitute $t$ back into the original $h(t)$ function.",
    "example": {
      "problem": "Find the maximum area of a rectangular enclosure given $A(x) = -2x^2 + 40x$.",
      "solution": "1. Identify $a=-2, b=40$.\n2. Calculate input: $x = -\\frac{40}{2(-2)} = 10$.\n3. Calculate max area: $A(10) = -2(10)^2 + 40(10) = 200$."
    }
  },
  {
    "id": "difference_quotient",
    "title": "The Difference Quotient",
    "trigger": "Prompt asks for 'average rate of change' or explicitly to evaluate the difference quotient.",
    "formula": "$$\\frac{f(x+h) - f(x)}{h}$$",
    "pitfall": "The Subtraction Trap & Destruction Checkpoint: You MUST distribute the negative sign to the entire $f(x)$ polynomial. Before factoring out $h$, EVERY term in the numerator without an $h$ MUST cancel to zero.",
    "example": {
      "problem": "Evaluate for $f(x) = x^2 - 3x$.",
      "solution": "1. Substitute: $\\frac{((x+h)^2 - 3(x+h)) - (x^2 - 3x)}{h}$\n2. Expand: $\\frac{x^2 + 2xh + h^2 - 3x - 3h - x^2 + 3x}{h}$\n3. Cancel (Checkpoint): $\\frac{2xh + h^2 - 3h}{h}$\n4. Factor & Simplify: $\\frac{h(2x + h - 3)}{h} \\rightarrow 2x + h - 3$"
    }
  },
  {
    "id": "rational_characteristics",
    "title": "Rational Functions: Asymptotes & Holes",
    "trigger": "Prompt asks to identify vertical/horizontal asymptotes, holes, or intercepts.",
    "formula": "$$\\begin{aligned} \\text{Holes:} & \\quad \\text{Canceled factors} \\\\ \\text{VA:} & \\quad \\text{Denominator } = 0 \\\\ \\text{HA:} & \\quad \\text{Compare degrees } (\\text{Top vs Bottom}) \\end{aligned}$$",
    "pitfall": "Order of Operations: ALWAYS factor the top and bottom completely first. If a term cancels out (e.g., $(x-2)/(x-2)$), it is a HOLE, not a vertical asymptote. Do this before finding VAs.",
    "example": {
      "problem": "Find characteristics of $f(x) = \\frac{x^2 - 4}{x - 2}$",
      "solution": "1. Factor: $\\frac{(x-2)(x+2)}{x-2}$.\n2. Hole: $(x-2)$ cancels, so hole at $x=2$.\n3. VA: None remaining in denominator.\n4. HA: Top degree (2) > Bottom degree (1), so no HA (slant)."
    }
  },
  {
    "id": "inverse_functions",
    "title": "Inverse Functions $f^{-1}(x)$",
    "trigger": "Prompt asks to find the inverse function or its domain.",
    "formula": "$$\\begin{aligned} &\\text{1. Swap } x \\text{ and } y \\\\ &\\text{2. Isolate the new } y \\end{aligned}$$",
    "pitfall": "Domain/Range Negligence: The Domain of $f(x)$ is the Range of $f^{-1}(x)$. If the original function is a radical or restricted rational, you must explicitly state the restricted domain for the inverse.",
    "example": {
      "problem": "Find inverse of $f(x) = \\sqrt{x-5}$",
      "solution": "1. Swap: $x = \\sqrt{y-5}$. Note: original range is $y \\ge 0$, so new domain is $x \\ge 0$.\n2. Square: $x^2 = y-5$.\n3. Isolate: $f^{-1}(x) = x^2 + 5$, where $x \\ge 0$."
    }
  },
  {
    "id": "extrema_vocabulary",
    "title": "Extrema Vocabulary (At vs. Value)",
    "trigger": "Reading graphs for local maximums or minimums.",
    "formula": "$$\\begin{aligned} \\text{“Where” or “At what value”} & \\implies x\\text{-coordinate} \\\\ \\text{“What is the minimum / value”} & \\implies y\\text{-coordinate} \\end{aligned}$$",
    "pitfall": "Over-answering: Writing the full coordinate pair $(x,y)$. The grading system will mark this wrong if it specifically asks 'What is the value?'. Give only the specific integer requested.",
    "example": {
      "problem": "A graph has a local minimum at $(4, -10)$. What is the local minimum?",
      "solution": "The question asks 'What is'. The correct answer is $-10$. If it asked 'Where does it occur?', the answer would be $4$."
    }
  }
];

const practiceProblems = [
  {
    "category_id": "optimization",
    "problem_statement": "You have $120$ feet of fencing to enclose a rectangular garden against an existing brick wall. Find the dimensions that maximize the area, and state the maximum area.",
    "key_points_to_remember": [
      "Define the perimeter constraint first: $2x + y = 120$",
      "Isolate $y$ and substitute into $\\text{Area} = x \\cdot y$",
      "The formula $t = -\\frac{b}{2a}$ only gives the width. You MUST plug it back into the Area function to get the final answer."
    ],
    "execution_steps": [
      {"step": 1, "description": "Constraint: $y = 120 - 2x$"},
      {"step": 2, "description": "Area Function: $A(x) = x(120 - 2x) \\implies A(x) = -2x^2 + 120x$"},
      {"step": 3, "description": "Vertex Input: $x = -\\frac{120}{2(-2)} = 30$ feet (Width)"},
      {"step": 4, "description": "Output (Max Area): $A(30) = -2(30)^2 + 120(30) = 1800 \\text{ sq ft}$"}
    ]
  },
  {
    "category_id": "difference_quotient",
    "problem_statement": "Evaluate the difference quotient $\\frac{f(x+h) - f(x)}{h}$ for the function $f(x) = -2x^2 + 5x - 3$.",
    "key_points_to_remember": [
      "Wrap the subtracted $f(x)$ in parentheses and distribute the negative sign to every term.",
      "DESTRUCTION CHECKPOINT: Before factoring out $h$, every term without an $h$ in the numerator must cancel out."
    ],
    "execution_steps": [
      {"step": 1, "description": "Substitute: $-2(x+h)^2 + 5(x+h) - 3$"},
      {"step": 2, "description": "Expand: $-2x^2 - 4xh - 2h^2 + 5x + 5h - 3$"},
      {"step": 3, "description": "Subtract $f(x)$: $(-2x^2 - 4xh - 2h^2 + 5x + 5h - 3) - (-2x^2 + 5x - 3)$"},
      {"step": 4, "description": "Checkpoint Cancel: $-4xh - 2h^2 + 5h$ remains in numerator."},
      {"step": 5, "description": "Factor & Simplify: $\\frac{h(-4x - 2h + 5)}{h} \\implies -4x - 2h + 5$"}
    ]
  },
  {
    "category_id": "rational_characteristics",
    "problem_statement": "Find the domain, holes, vertical asymptotes (VA), and horizontal asymptotes (HA) for $f(x) = \\frac{x^2 - x - 6}{x^2 - 9}$.",
    "key_points_to_remember": [
      "NEVER find asymptotes before factoring completely.",
      "If a factor cancels from the top and bottom, it is a HOLE, not a VA.",
      "HA is found by comparing the leading degrees of the original polynomial."
    ],
    "execution_steps": [
      {"step": 1, "description": "Factor completely: $\\frac{(x-3)(x+2)}{(x-3)(x+3)}$"},
      {"step": 2, "description": "Holes: $(x-3)$ cancels. Hole exists at $x = 3$."},
      {"step": 3, "description": "Vertical Asymptotes: Remaining denominator is $(x+3)$. VA at $x = -3$."},
      {"step": 4, "description": "Horizontal Asymptotes: Degrees are equal ($x^2$ over $x^2$). Ratio is $\\frac{1}{1}$. HA at $y = 1$."}
    ]
  },
  {
    "category_id": "inverse_functions",
    "problem_statement": "Find the inverse function $f^{-1}(x)$ for $f(x) = \\sqrt{3x - 12}$ and state its domain.",
    "key_points_to_remember": [
      "The Range of the original function becomes the Domain of the inverse.",
      "The output of a primary square root is always $\\ge 0$, so the inverse domain must be $x \\ge 0$."
    ],
    "execution_steps": [
      {"step": 1, "description": "Original Range constraint: Square root outputs $y \\ge 0$."},
      {"step": 2, "description": "Swap Variables: $x = \\sqrt{3y - 12}$"},
      {"step": 3, "description": "Square both sides: $x^2 = 3y - 12$"},
      {"step": 4, "description": "Isolate $y$: $y = \\frac{1}{3}x^2 + 4$"},
      {"step": 5, "description": "Apply Domain Restriction: $f^{-1}(x) = \\frac{1}{3}x^2 + 4$, for $x \\ge 0$"}
    ]
  },
  {
    "category_id": "extrema_vocabulary",
    "problem_statement": "A polynomial graph has a valley at $(4, -12)$. A) Where does the local minimum occur? B) What is the local minimum?",
    "key_points_to_remember": [
      "“Where” or “At what value” ALWAYS means the input ($x$-coordinate).",
      "“What is” or “Minimum value” ALWAYS means the output ($y$-coordinate).",
      "Do not provide a full coordinate pair."
    ],
    "execution_steps": [
      {"step": 1, "description": "Question A (“Where”): Requests the $x$-coordinate. Answer is $4$."},
      {"step": 2, "description": "Question B (“What is”): Requests the $y$-coordinate. Answer is $-12$."}
    ]
  }
];

// --- Components ---

const MathRenderer = ({ text, block = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && window.katex) {
      let innerHTML = text;
      try {
        const parts = text.split(/(\\$\\$.*?\\$\\$|\\$.*?\\$)/g);
        innerHTML = parts.map((part) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const math = part.slice(2, -2);
            return window.katex.renderToString(math, { throwOnError: false, displayMode: true });
          } else if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1);
            return window.katex.renderToString("\\displaystyle " + math, { throwOnError: false, displayMode: false });
          }
          return part.replace(/\n|\\n/g, '<br/>');
        }).join('');
        containerRef.current.innerHTML = innerHTML;
      } catch (e) {
        console.error("KaTeX Error", e);
        containerRef.current.textContent = text;
      }
    }
  }, [text, block]);

  return <span ref={containerRef} className={block ? "block w-full" : "inline"} />;
};

const Icons = {
  BookOpen: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Brain: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
};

const VisualDiagram = ({ categoryId }) => {
  if (categoryId === 'optimization') {
    return (
      <div className="w-full flex justify-center py-6 mt-4">
        <svg viewBox="0 0 300 200" className="w-full max-w-sm drop-shadow-2xl">
          {/* Brick Wall */}
          <pattern id="brick" width="30" height="20" patternUnits="userSpaceOnUse">
            <rect width="30" height="20" fill="#1e293b" />
            <path d="M0,10 h30 M15,10 v10 M0,0 v10 M30,0 v10" stroke="#0f172a" strokeWidth="2" />
          </pattern>
          <rect x="10" y="10" width="280" height="40" fill="url(#brick)" rx="4" />
          <text x="150" y="35" fill="#475569" fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="2">EXISTING WALL</text>

          {/* Fence Area */}
          <rect x="50" y="50" width="200" height="100" fill="#0f172a" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="4" strokeDasharray="8 4" rx="2" />
          
          {/* Labels */}
          <text x="35" y="105" fill="#38bdf8" fontSize="20" fontWeight="bold" textAnchor="middle">x</text>
          <text x="265" y="105" fill="#38bdf8" fontSize="20" fontWeight="bold" textAnchor="middle">x</text>
          <text x="150" y="175" fill="#38bdf8" fontSize="20" fontWeight="bold" textAnchor="middle">y</text>
          
          {/* Area Text */}
          <text x="150" y="105" fill="#cbd5e1" fontSize="16" fontStyle="italic" textAnchor="middle">Area = x · y</text>
        </svg>
      </div>
    );
  }
  
  if (categoryId === 'difference_quotient') {
    return (
      <div className="w-full flex justify-center py-6 mt-4">
        <svg viewBox="0 0 300 200" className="w-full max-w-md">
          {/* Axes */}
          <line x1="20" y1="180" x2="280" y2="180" stroke="#334155" strokeWidth="2" />
          <line x1="40" y1="20" x2="40" y2="180" stroke="#334155" strokeWidth="2" />
          
          {/* Curve */}
          <path d="M40,150 Q150,150 250,40" fill="none" stroke="#6366f1" strokeWidth="3" />
          
          {/* Points */}
          <circle cx="100" cy="140" r="4" fill="#ec4899" />
          <circle cx="200" cy="80" r="4" fill="#ec4899" />
          
          {/* Secant Line */}
          <line x1="50" y1="170" x2="250" y2="50" stroke="#ec4899" strokeWidth="2" strokeDasharray="4" />
          
          {/* Annotations */}
          <line x1="100" y1="140" x2="100" y2="180" stroke="#64748b" strokeDasharray="2" />
          <line x1="200" y1="80" x2="200" y2="180" stroke="#64748b" strokeDasharray="2" />
          <text x="100" y="195" fill="#94a3b8" fontSize="14" textAnchor="middle">x</text>
          <text x="200" y="195" fill="#94a3b8" fontSize="14" textAnchor="middle">x+h</text>
        </svg>
      </div>
    );
  }

  if (categoryId === 'rational_characteristics') {
    return (
      <div className="w-full flex justify-center py-6 mt-4">
        <svg viewBox="0 0 300 200" className="w-full max-w-sm">
          {/* Axes */}
          <line x1="20" y1="100" x2="280" y2="100" stroke="#334155" strokeWidth="2" />
          <line x1="150" y1="20" x2="150" y2="180" stroke="#334155" strokeWidth="2" />
          
          {/* Asymptotes */}
          <line x1="90" y1="20" x2="90" y2="180" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="20" y1="60" x2="280" y2="60" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />
          <text x="90" y="15" fill="#f59e0b" fontSize="12" textAnchor="middle">VA: x = -3</text>
          <text x="260" y="52" fill="#10b981" fontSize="12" textAnchor="middle">HA: y = 1</text>
          
          {/* Curves */}
          <path d="M20,90 Q70,90 85,180" fill="none" stroke="#6366f1" strokeWidth="3" />
          <path d="M95,20 Q120,55 280,55" fill="none" stroke="#6366f1" strokeWidth="3" />
          
          {/* Hole */}
          <circle cx="210" cy="55.5" r="4" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
          <text x="210" y="75" fill="#ef4444" fontSize="12" textAnchor="middle">Hole (x=3)</text>
        </svg>
      </div>
    );
  }

  if (categoryId === 'inverse_functions') {
    return (
      <div className="w-full flex justify-center py-6 mt-4">
        <svg viewBox="0 0 300 200" className="w-full max-w-sm">
          <line x1="20" y1="180" x2="280" y2="180" stroke="#334155" strokeWidth="2" />
          <line x1="150" y1="20" x2="150" y2="180" stroke="#334155" strokeWidth="2" />
          
          {/* y=x symmetry line */}
          <line x1="50" y1="180" x2="250" y2="20" stroke="#64748b" strokeWidth="2" strokeDasharray="5" />
          <text x="260" y="30" fill="#64748b" fontSize="12">y = x</text>
          
          {/* f(x) and f^-1(x) */}
          <path d="M150,120 Q200,120 250,50" fill="none" stroke="#6366f1" strokeWidth="3" />
          <text x="230" y="60" fill="#6366f1" fontSize="14" fontWeight="bold">f(x)</text>
          
          <path d="M110,180 Q110,130 200,60" fill="none" stroke="#ec4899" strokeWidth="3" />
          <text x="180" y="100" fill="#ec4899" fontSize="14" fontWeight="bold">f⁻¹(x)</text>
        </svg>
      </div>
    );
  }
  
  if (categoryId === 'extrema_vocabulary') {
    return (
      <div className="w-full flex justify-center py-6 mt-4">
        <svg viewBox="0 0 300 200" className="w-full max-w-sm">
          <line x1="20" y1="80" x2="280" y2="80" stroke="#334155" strokeWidth="2" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="#334155" strokeWidth="2" />
          
          {/* Parabola */}
          <path d="M40,20 Q160,250 260,20" fill="none" stroke="#38bdf8" strokeWidth="3" />
          
          {/* Minimum Point */}
          <circle cx="150" cy="135" r="5" fill="#f59e0b" />
          
          {/* Guidelines */}
          <line x1="150" y1="135" x2="150" y2="80" stroke="#f59e0b" strokeDasharray="3" />
          <line x1="150" y1="135" x2="100" y2="135" stroke="#f59e0b" strokeDasharray="3" />
          
          {/* Text Labels */}
          <text x="150" y="70" fill="#cbd5e1" fontSize="12" textAnchor="middle">"Where" (x=4)</text>
          <text x="50" y="140" fill="#cbd5e1" fontSize="12" textAnchor="middle">"What" (y=-12)</text>
        </svg>
      </div>
    );
  }

  return null;
};

const App = () => {
  const [activeTopic, setActiveTopic] = useState(topics[0]);
  const [testMode, setTestMode] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [revealedStepIndex, setRevealedStepIndex] = useState(-1);

  // Reset reveal states when topic changes or test mode toggles
  useEffect(() => {
    setRevealed(false);
    setRevealedStepIndex(-1);
  }, [activeTopic, testMode]);

  const currentProblem = practiceProblems.find(p => p.category_id === activeTopic.id);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans text-slate-100">
      
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-white/5 bg-slate-950/50 backdrop-blur-3xl flex flex-col z-20 shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
        <div className="p-6 border-b border-white/5 flex items-center gap-4 relative z-10">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Icons.Brain />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-white tracking-tight">Pre-Calculus</h1>
            <p className="text-[10px] text-indigo-300/80 font-bold tracking-widest uppercase">Interactive Dashboard</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar relative z-10">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic)}
              className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-between group
                ${activeTopic.id === topic.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-md shadow-indigo-500/20 text-white font-semibold' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'}`}
            >
              <div className="truncate pr-4 text-sm leading-tight">{topic.title}</div>
              {activeTopic.id === topic.id && <span className="text-white/70"><Icons.ChevronRight /></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent z-10">
        
        {/* Global Header */}
        <header className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5 bg-slate-950/30 backdrop-blur-2xl sticky top-0 z-30 relative shadow-sm">
          <div className="hidden md:flex items-center gap-3 text-sm text-slate-500 font-medium">
            <span className="uppercase tracking-wider text-[11px] font-bold">Review</span>
            <Icons.ChevronRight />
            <span className="text-slate-200">{activeTopic.title}</span>
          </div>
          <div className="md:hidden text-white font-bold">{activeTopic.title}</div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            <button 
              onClick={() => setTestMode(false)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${!testMode ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Study Mode
            </button>
            <button 
              onClick={() => setTestMode(true)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${testMode ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Test Mode
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8 pb-32">
            
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-teal-500/20 ring-4 ring-teal-500/10">
                <Icons.Target />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{activeTopic.title}</h2>
            </div>

            {/* 1. The Trigger */}
            <div className="glass-panel rounded-3xl p-8 border-l-4 border-l-teal-500 relative overflow-hidden group hover:bg-white/[0.07] transition-all duration-500">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-teal-500/20 transition-all duration-500"></div>
              <h3 className="text-teal-400 text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                The Trigger
              </h3>
              <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed">
                {activeTopic.trigger}
              </p>
            </div>

            <div className="relative pt-4">
              {/* Test Mode Overlay Placeholder */}
              {testMode && !revealed && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl mt-4">
                  <div className="text-rose-400 mb-6 p-4 bg-rose-500/10 rounded-2xl ring-4 ring-rose-500/5">
                    <Icons.Brain />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-3">Test Your Memory</h3>
                  <p className="text-slate-400 mb-8 max-w-sm text-center font-medium leading-relaxed">Recall the formula and the common pitfall before reviewing the answer.</p>
                  <button 
                    onClick={() => setRevealed(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] group"
                  >
                    <Icons.Eye />
                    <span>Reveal Answer</span>
                  </button>
                </div>
              )}

              {/* Dynamic Content Area (Blurred during test mode) */}
              <div className={`space-y-8 transition-all duration-700 ease-in-out ${testMode && !revealed ? 'opacity-20 blur-xl pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
                
                {/* 2. The Formula */}
                <div className="glass-panel rounded-3xl p-10 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[200px] group hover:border-indigo-500/30 transition-colors duration-500">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                  <h3 className="text-indigo-400 text-xs font-black tracking-widest uppercase mb-6 relative z-10">The Formula</h3>
                  <div className="text-xl md:text-2xl text-white font-medium py-2 relative z-10 math-display w-full drop-shadow-md leading-relaxed tracking-wide">
                    {/* Render formula explicitly without forcing block styling implicitly */}
                    <MathRenderer text={activeTopic.formula} block={true} />
                  </div>
                </div>

                {/* 3. The Pitfall */}
                <div className="bg-rose-950/20 border border-rose-500/20 rounded-3xl p-8 relative overflow-hidden backdrop-blur-md">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-rose-500 to-rose-700 rounded-l-3xl"></div>
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -mr-32 -mb-32 pointer-events-none"></div>
                  <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                    <div className="text-rose-500 mt-1 flex-shrink-0 bg-rose-500/10 p-3 rounded-xl">
                      <Icons.AlertTriangle />
                    </div>
                    <div>
                      <h3 className="text-rose-400 font-extrabold mb-3 text-xs tracking-widest uppercase">Common Trap</h3>
                      <p className="text-slate-300 leading-loose text-[15px]"><MathRenderer text={activeTopic.pitfall} /></p>
                    </div>
                  </div>
                </div>

                {/* 4. Practice Problem (Progressive Accordion) */}
                {currentProblem && (
                  <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10">
                    <div className="bg-slate-900/50 px-8 py-5 border-b border-white/5 flex items-center gap-3">
                      <div className="text-slate-400"><Icons.BookOpen /></div>
                      <h3 className="text-slate-200 font-bold text-xs tracking-widest uppercase">Practice Problem: Step-by-Step</h3>
                    </div>
                    
                    <div className="p-8 space-y-6">
                      {/* Problem Statement */}
                      <div className="bg-slate-950/50 rounded-2xl p-6 text-slate-200 shadow-inner border border-white/5 mb-6">
                        <strong className="text-white mb-3 block font-bold text-xs uppercase tracking-wider text-slate-400">Problem Space</strong>
                        <div className="text-lg leading-relaxed font-medium"><MathRenderer text={currentProblem.problem_statement} /></div>
                        {/* Dynamic Contextual SVG */}
                        <VisualDiagram categoryId={currentProblem.category_id} />
                      </div>

                      {/* Key Points */}
                      <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-6 mb-8">
                        <h4 className="text-indigo-400 font-extrabold text-xs tracking-widest uppercase mb-4 flex items-center gap-2"><Icons.Brain /> Key Points to Remember</h4>
                        <ul className="list-disc list-outside ml-4 space-y-2 text-slate-300 text-sm">
                          {currentProblem.key_points_to_remember.map((point, idx) => (
                            <li key={idx} className="pl-1 leading-relaxed"><MathRenderer text={point} /></li>
                          ))}
                        </ul>
                      </div>

                      {/* Progressive Steps */}
                      <div className="space-y-6 relative pt-4">
                        <div className="absolute left-[26px] top-6 bottom-4 w-1 bg-white/5 rounded-full z-0"></div>
                        
                        {currentProblem.execution_steps.map((step, idx) => {
                          const isRevealed = idx <= revealedStepIndex;
                          const isNext = idx === revealedStepIndex + 1;
                          const isCheckpoint = step.description.toLowerCase().includes('checkpoint');

                          if (!isRevealed && !isNext) return null;

                          if (isNext) {
                            return (
                              <div key={idx} className="relative z-10 pl-16 pt-2 pb-4">
                                <button
                                  onClick={() => setRevealedStepIndex(idx)}
                                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/40 hover:text-white hover:border-indigo-500/50 font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/10"
                                >
                                  <Icons.Eye /> Reveal Step {step.step}
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div key={idx} className={`relative z-10 pl-16 transition-all duration-500 ${isCheckpoint ? 'scale-[1.02]' : ''}`}>
                              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[56px] h-[56px] flex items-center justify-center rounded-2xl font-black text-xl border-2 z-20 transition-colors duration-500 shadow-xl ${isCheckpoint ? 'bg-amber-950 border-amber-500 text-amber-400 shadow-amber-500/30' : 'bg-slate-900 border-indigo-500/50 text-indigo-400 shadow-black/50'}`}>
                                {step.step}
                              </div>
                              <div className={`rounded-2xl p-6 border transition-colors duration-500 shadow-lg ${isCheckpoint ? 'bg-amber-950/30 border-amber-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                {isCheckpoint && <span className="block text-amber-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2"><Icons.AlertTriangle /> Destruction Checkpoint</span>}
                                <div className={`text-slate-200 text-[16px] leading-relaxed ${isCheckpoint ? 'font-medium' : ''}`}>
                                  <MathRenderer text={step.description} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
