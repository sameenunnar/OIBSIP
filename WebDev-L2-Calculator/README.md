![Calculator](./task1-intro.png)

# Calculator — OIBSIP Web Development & Designing (Level 2, Task 1)

A fully functional browser-based calculator built with HTML5, CSS3, and vanilla JavaScript.

## Live features

- Display screen showing the running expression trail and the current input/result
- Digit buttons (0–9) and a decimal point
- Operators: addition (+), subtraction (−), multiplication (×), division (÷)
- Equals (=) button to evaluate the expression
- Clear (C) button to fully reset the calculator
- Backspace (⌫) button to delete the last entered character
- Division-by-zero protection — shows "Cannot divide by zero" instead of crashing
- Operator chaining — e.g. `5 + 3 × 2` computes left-to-right without needing a reset between operators
- Percent (%) key converts the current value to a hundredth
- CSS Grid used for the button layout
- All interactivity wired with `addEventListener` — no inline `onclick` attributes anywhere in the HTML
- No `eval()` — all arithmetic is done with a small, explicit `compute()` function
- Optional keyboard support (number keys, operators, Enter, Backspace, Escape) as a bonus, non-required enhancement

## Tech stack

- HTML5
- CSS3 (CSS Grid, CSS variables, no framework)
- JavaScript (Vanilla, ES6+)
- Font: IBM Plex Mono (Google Fonts)

## How it works

The calculator keeps a small state object (`current`, `previous`, `operator`, `overwrite`, `error`) instead of ever calling `eval()` on typed text. Pressing an operator immediately resolves any pending calculation against the previous operand (this is what allows chained operations like `5 + 3 × 2` to work without a full reset), and pressing `=` resolves the final pending calculation. Division by zero sets an `error` flag that blocks further input until `C` is pressed.

## How to run

1. Clone this repository.
2. Open `OIBSIP/WebDev-L2-Calculator/index.html` directly in any modern browser.
3. No build step, server, or dependencies are required.

## How to test

Manual test checklist used during development:

| Scenario | Expected result | Verified |
|---|---|---|
| `7 + 8 =` | `15` | ✅ |
| `9 × 6 =` | `54` | ✅ |
| `5 + 3 × 2` (chained, no `=` between) | `16` (left-to-right) | ✅ |
| `10 ÷ 0 =` | "Cannot divide by zero", no crash | ✅ |
| `12` then `⌫` | `1` | ✅ |
| `5` then `C` | `0`, all state reset | ✅ |
| `50` then `%` | `0.5` | ✅ |
| Rapid repeated taps on any key | No crash, no duplicate operators | ✅ |
| Resize to a 320px-wide viewport | Layout stays intact, no overlap | ✅ |
| Tab through buttons with keyboard | Visible focus ring on each key | ✅ |

JavaScript syntax was also verified with `node -c script.js`, and the core `compute()` logic was unit-checked in isolation (see commit history) for chaining, division-by-zero, and floating-point rounding (`0.1 + 0.2 = 0.3`, not `0.30000000000000004`).

## Folder contents

```
WebDev-L2-Calculator/
├── index.html
├── style.css
├── script.js
└── README.md
```
