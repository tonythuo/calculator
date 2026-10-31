# Calculator

A browser calculator built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

## Run it

Open `index.html` in any browser.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Display, buttons, page structure |
| `style.css` | Display box and button grid styling |
| `script.js` | Shared state, input handling, logic, and output functions |

## How it's split (One Function, One Job)

- **Tony** — Structure & Input: HTML, buttons, event listeners, keyboard support, dispatcher
- **Lefa** — Logic & State: math operations, state management, chained operations, error handling
- **Karim** — Output & Feedback: display updates, error messages, number rounding

## Features

- Basic arithmetic: `+`, `-`, `*`, `/`
- Chained operations (e.g. `12 + 7 - 5`)
- Divide-by-zero error handling
- One decimal per number
- Clear and backspace
- Keyboard support
- Long decimals rounded
