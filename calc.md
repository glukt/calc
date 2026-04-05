# Specification: MAT 170 Pre-Calculus Interactive Study Dashboard

## 1. Overview
Build a single-page web application designed as a rapid-review dashboard and interactive flashcard system for a Pre-Calculus exam. The UI must be exceptionally clean, modern, and optimized for quick scanning and memory retention ("brain dump" preparation). 

## 2. Technical Stack & Libraries
- Framework: React (or framework of choice)
- Styling: Tailwind CSS (for clean, utility-driven design)
- Math Rendering: KaTeX or MathJax integration for rendering LaTeX strings.
- Icons: Lucide React (or similar) for UI iconography (warnings, checks, navigation).

## 3. UI/UX Architecture
The application should use a two-column layout (desktop) or a collapsible sidebar (mobile).
- **Left Panel (Navigation):** A list of the core topics. The active topic should be highlighted.
- **Right Panel (Content):** The main display area for the selected topic.
- **Global Header:** Includes a "Study Mode" vs. "Test Mode" toggle switch.

### 3.1 Content Panel Layout (Study Mode)
For the selected topic, display the following components in vertical order:
1.  **Header:** Topic title with a subtle icon.
2.  **The Trigger:** A prominent, styled callout box detailing "When to use this" (e.g., specific wording in a test question).
3.  **The Formula/Rule:** Displayed prominently using LaTeX rendering. High-contrast typography.
4.  **The Pitfall (Warning Box):** A UI component styled with warning colors (e.g., amber/red borders or backgrounds) highlighting the common trap for this problem type.
5.  **Interactive Example:** An accordion or card containing a step-by-step walkthrough of a specific problem.

### 3.2 Test Mode Behavior
When the user toggles "Test Mode" ON:
- The "Formula", "Pitfall", and "Example" sections are hidden and replaced with a blurred placeholder or a "Click to Reveal" button.
- This allows the user to read the "Trigger", attempt to write down the formula and pitfall from memory, and then verify their accuracy.

## 4. Data Payload (State)
Initialize the application with the following hardcoded JSON array of topics. Ensure all `math` fields are properly parsed by the LaTeX renderer.

```json
[
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
    "formula": "$\\frac{f(x+h) - f(x)}{h}$",
    "pitfall": "The Subtraction Trap & Destruction Checkpoint: You MUST distribute the negative sign to the entire $f(x)$ polynomial. Before factoring out $h$, EVERY term in the numerator without an $h$ MUST cancel to zero.",
    "example": {
      "problem": "Evaluate for $f(x) = x^2 - 3x$.",
      "solution": "1. Substitute: $((x+h)^2 - 3(x+h)) - (x^2 - 3x) / h$\n2. Expand: $x^2 + 2xh + h^2 - 3x - 3h - x^2 + 3x / h$\n3. Cancel (Checkpoint): $2xh + h^2 - 3h / h$\n4. Factor & Simplify: $h(2x + h - 3) / h \\rightarrow 2x + h - 3$"
    }
  },
  {
    "id": "rational_characteristics",
    "title": "Rational Functions: Asymptotes & Holes",
    "trigger": "Prompt asks to identify vertical/horizontal asymptotes, holes, or intercepts.",
    "formula": "Holes: Canceled factors.\nVA: Denominator = 0.\nHA: Compare degrees (Top = Bottom $\\rightarrow$ ratio of coefficients).",
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
]