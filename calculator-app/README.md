# Advanced Calculator

A highly efficient, feature-rich calculator application built with vanilla JavaScript and HTML/CSS.

## Features

✨ **Core Features:**
- Basic arithmetic operations: Addition (+), Subtraction (−), Multiplication (×), Division (÷)
- Percentage calculations
- Clear (AC) and Delete (DEL) functions
- Floating-point precision handling
- Division by zero protection

🔍 **Display Features:**
- Large, readable digit display
- Previous operand display with operation indicator
- Thousand separators for large numbers
- Result formatting with proper decimal handling

📊 **History Management:**
- Complete calculation history with expressions and results
- Click any history item to use its result
- LocalStorage persistence (survives browser refresh)
- Clear history button with confirmation
- Stores up to 50 most recent calculations
- Organized, scrollable history panel

⌨️ **Input Methods:**
- Mouse/touch button clicking
- Full keyboard support:
  - Numbers: `0-9`
  - Operators: `+`, `-`, `*`, `/`
  - Decimal: `.`
  - Equals: `Enter` or `=`
  - Delete: `Backspace`
  - Clear: `Escape`

📱 **Responsive Design:**
- Desktop layout: Calculator and history side-by-side
- Tablet layout: Single column, optimized spacing
- Mobile layout: Compact, touch-friendly buttons
- Smooth animations and hover effects

## Efficiency Features

### Algorithm Efficiency
- **O(1) Time Complexity**: Calculations, operations, clear
- **O(n) Time Complexity**: Display formatting, history operations
- **Floating-Point Precision**: Rounds to 10 decimal places to avoid JavaScript floating-point errors
- **Memory Optimization**: Stores only last 50 calculations

### Performance Optimizations
- Single calculator instance (no duplicate listeners)
- Efficient DOM updates (only when needed)
- LocalStorage for history persistence
- No external dependencies (vanilla JavaScript)
- Minimal CSS reflows/repaints

## Usage

1. Open `index.html` in a web browser
2. Click buttons or use keyboard to enter calculations
3. View calculation history on the right panel
4. Click any history item to reuse its result
5. Use "Clear History" to remove all previous calculations

## Technical Stack

- **HTML5** — Semantic structure with accessibility in mind
- **CSS3** — Modern styling with CSS custom properties, Grid, and Flexbox
- **Vanilla JavaScript** — No frameworks, pure ES6+ for maximum efficiency

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
calculator-app/
├── index.html      # HTML structure and layout
├── style.css       # Responsive styling with dark theme
├── script.js       # Calculator logic and event handling
└── README.md       # This file
```

## Code Architecture

### Calculator Class
The application uses a single `Calculator` class that encapsulates:
- State management (current operand, previous operand, operation)
- Arithmetic operations (compute, percentage)
- Display formatting
- History management (load, save, clear)

### Display Formatting
- Numbers are formatted with thousand separators
- Decimal places are preserved for precision
- Results are rounded to prevent floating-point artifacts

### History System
- Stores calculation expressions and results
- Uses browser LocalStorage for persistence
- Maintains order with newest calculations at the top
- Supports clicking to reuse historical results

## Features Walkthrough

### Basic Calculation
1. Enter first number
2. Choose operation
3. Enter second number
4. Press equals
5. Calculation appears in history

### Using History
1. Complete any calculation
2. Calculation automatically added to history panel
3. Click any history item to load its result
4. Continue calculating with that result

### Keyboard Shortcuts
- `0-9`: Enter numbers
- `.`: Add decimal point
- `+`, `-`, `*`, `/`: Operations
- `Enter` or `=`: Calculate
- `Backspace`: Delete last digit
- `Escape`: Clear calculator

## Future Enhancements

- Scientific calculator mode (trigonometry, logarithms)
- Calculation undo/redo
- Dark/light theme toggle
- Export history as CSV
- Calculation expressions (e.g., "2+3*4")
- Keyboard shortcut customization

---

**Developed with efficiency and user experience in mind.** 🚀
