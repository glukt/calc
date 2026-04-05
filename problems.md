# Specification Extension: MAT 170 Problem Sets & Rendering Strategy

## 1. Objective
Expand the existing MAT 170 interactive study dashboard to include a `Practice Problems` module. This module will map specific, multi-step execution problems to their respective archetypes. The UI must support progressive disclosure (step-by-step reveals) to prevent cognitive overload and allow the user to test their logic before seeing the answer.

## 2. UI/UX Rendering Strategy: "How to Best View These"

To build an effective study tool, we cannot just dump text on the screen. The viewing format must actively train the user's execution habits.

* **Progressive Accordions (The Step-by-Step Reveal):** For multi-step algebraic problems (like the Difference Quotient), the solution should not be visible all at once. Implement a component where the user clicks "Next Step" to reveal the algebraic progression.
* **The "Destruction Checkpoint" UI State:** When a problem reaches a critical rule (e.g., factoring out $h$), the UI component should temporarily shift its border or background color to a "Warning/Amber" state to train the visual memory that a critical check is occurring.
* **Formula vs. Execution Split:** Display the core formula pinned to the top of the card, while the specific problem execution scrolls beneath it.
* **LaTeX Rendering Engine Integration:** Ensure KaTeX or MathJax is properly initialized in the React components. Raw strings like `\frac{x^2}{h}` must render natively to match the visual style of the actual exam.

## 3. Data Payload: Practice Problems Schema

Inject this JSON array into the application state to populate the practice problem data.

```json
[
  {
    "category_id": "optimization",
    "problem_statement": "You have 120 feet of fencing to enclose a rectangular garden against an existing brick wall. Find the dimensions that maximize the area, and state the maximum area.",
    "key_points_to_remember": [
      "Define the perimeter constraint first: 2x + y = 120",
      "Isolate 'y' and substitute into Area = x * y",
      "The formula $t = -\\frac{b}{2a}$ only gives the width. You MUST plug it back into the Area function to get the final answer."
    ],
    "execution_steps": [
      {"step": 1, "description": "Constraint: $y = 120 - 2x$"},
      {"step": 2, "description": "Area Function: $A(x) = x(120 - 2x) \\rightarrow -2x^2 + 120x$"},
      {"step": 3, "description": "Vertex Input: $x = -\\frac{120}{2(-2)} = 30$ feet (Width)"},
      {"step": 4, "description": "Output (Max Area): $A(30) = -2(30)^2 + 120(30) = 1800$ sq ft"}
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
      {"step": 5, "description": "Factor & Simplify: $\\frac{h(-4x - 2h + 5)}{h} \\rightarrow -4x - 2h + 5$"}
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
      {"step": 4, "description": "Horizontal Asymptotes: Degrees are equal ($x^2$ over $x^2$). Ratio is $1/1$. HA at $y = 1$."}
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
      "'Where' or 'At what value' ALWAYS means the input ($x$-coordinate).",
      "'What is' or 'Minimum value' ALWAYS means the output ($y$-coordinate).",
      "Do not provide a full coordinate pair."
    ],
    "execution_steps": [
      {"step": 1, "description": "Question A ('Where'): Requests the $x$-coordinate. Answer is $4$."},
      {"step": 2, "description": "Question B ('What is'): Requests the $y$-coordinate. Answer is $-12$."}
    ]
  }
]