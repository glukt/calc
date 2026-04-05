const { useState, useEffect, useRef } = React;

// --- Data Payload ---
const topics = [
  {
    "id": "optimization",
    "title": "Quadratic Optimization (Vertex)",
    "trigger": "Prompt asks for 'maximum area', 'minimum cost', or optimal dimensions of a quadratic function.",
    "formula": "Vertex occurs at $t = -\\frac{b}{2a}$",
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
    "formula": "\\frac{f(x+h) - f(x)}{h}",
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
    "formula": "Holes: Canceled factors.\nVA: Denominator = 0.\nHA: Compare degrees (Top = Bottom \\rightarrow ratio of coefficients).",
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
    "formula": "1. Swap $x$ and $y$.\n2. Isolate the new $y$.",
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
    "formula": "'Where' / 'At what value' = $x$-coordinate.\n'What is the minimum' / 'Value' = $y$-coordinate.",
    "pitfall": "Over-answering: Writing the full coordinate pair $(x,y)$. The grading system will mark this wrong if it specifically asks 'What is the value?'. Give only the specific integer requested.",
    "example": {
      "problem": "A graph has a local minimum at $(4, -10)$. What is the local minimum?",
      "solution": "The question asks 'What is'. The correct answer is $-10$. If it asked 'Where does it occur?', the answer would be $4$."
    }
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
            return window.katex.renderToString(math, { throwOnError: false, displayMode: false });
          }
          return part.replace(/\\n/g, '<br/>');
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

// SVG Icons (Lucide alternatives inline since dynamic cdn loading reacts weirdly sometimes)
const Icons = {
  BookOpen: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Brain: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
};

const App = () => {
  const [activeTopic, setActiveTopic] = useState(topics[0]);
  const [testMode, setTestMode] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Reset reveal state when topic changes or test mode toggles
  useEffect(() => {
    setRevealed(false);
  }, [activeTopic, testMode]);

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
                  <div className="text-3xl md:text-5xl text-white font-medium py-2 relative z-10 math-display w-full drop-shadow-md">
                    {/* Add $$ around formula to force block display in KaTeX if not present */}
                    <MathRenderer text={activeTopic.formula.includes('$') ? activeTopic.formula : `$$\\displaystyle ${activeTopic.formula}$$`} block={true} />
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

                {/* 4. Interactive Example */}
                <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10">
                  <div className="bg-slate-900/50 px-8 py-5 border-b border-white/5 flex items-center gap-3">
                    <div className="text-slate-400"><Icons.BookOpen /></div>
                    <h3 className="text-slate-200 font-bold text-xs tracking-widest uppercase">Example Walkthrough</h3>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="bg-slate-950/50 rounded-2xl p-6 text-slate-200 shadow-inner border border-white/5">
                      <strong className="text-white mb-2 block font-bold text-sm uppercase tracking-wider text-slate-400">Problem Space</strong>
                      <div className="text-lg"><MathRenderer text={activeTopic.example.problem} /></div>
                    </div>
                    <div className="pl-6 border-l-2 border-indigo-500/30 text-slate-300 space-y-4">
                      {activeTopic.example.solution.split('\\n').map((step, idx) => (
                        <div key={idx} className="leading-relaxed">
                          <MathRenderer text={step} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

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
