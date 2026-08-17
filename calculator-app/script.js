/**
 * Advanced Calculator with History
 * Highly efficient calculation engine with calculation history tracking
 */

class Calculator {
    constructor(previousOperandEl, currentOperandEl) {
        this.previousOperandEl = previousOperandEl;
        this.currentOperandEl = currentOperandEl;
        this.clear();
        this.history = this.loadHistory();
    }

    /**
     * Clear the calculator to initial state
     * Time Complexity: O(1)
     */
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    /**
     * Delete the last character from current operand
     * Time Complexity: O(n) where n is length of currentOperand
     */
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    /**
     * Append a number or decimal point to current operand
     * Time Complexity: O(1)
     */
    appendNumber(number) {
        // Prevent multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;
        // Prevent leading zeros (except for decimal numbers)
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    /**
     * Set the operation and move to next operand
     * Time Complexity: O(1)
     */
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    /**
     * Perform the calculation with high precision
     * Time Complexity: O(1) - single arithmetic operation
     */
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                // Handle division by zero
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        // Round to avoid floating-point precision issues
        this.currentOperand = this.formatResult(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    /**
     * Calculate percentage
     * Time Complexity: O(1)
     */
    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (this.previousOperand === '') {
            this.currentOperand = current / 100;
        } else {
            const prev = parseFloat(this.previousOperand);
            this.currentOperand = (prev * current) / 100;
        }
        this.updateDisplay();
    }

    /**
     * Format result to handle floating-point precision
     * Rounds to 10 decimal places to avoid floating-point errors
     * Time Complexity: O(1)
     */
    formatResult(value) {
        return Math.round(value * 10000000000) / 10000000000;
    }

    /**
     * Update the display with formatted numbers
     * Time Complexity: O(n) where n is length of operands
     */
    updateDisplay() {
        this.currentOperandEl.textContent = this.formatDisplayValue(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandEl.textContent = 
                `${this.formatDisplayValue(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandEl.textContent = '';
        }
    }

    /**
     * Format display value with thousand separators for readability
     * Time Complexity: O(n) where n is length of value
     */
    formatDisplayValue(value) {
        const stringValue = value.toString();
        const integerDigits = parseFloat(stringValue.split('.')[0]);
        const decimalDigits = stringValue.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    /**
     * Execute calculation and add to history
     * Time Complexity: O(n) where n is history array length
     */
    executeCalculation() {
        if (this.previousOperand === '' || this.currentOperand === '' || this.operation == null) {
            return;
        }

        const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
        const prevOperand = this.previousOperand;
        const prevOperation = this.operation;
        const currOperand = this.currentOperand;

        this.compute();

        // Add to history
        const result = this.currentOperand;
        this.addToHistory(expression, result);
    }

    /**
     * Add calculation to history
     * Time Complexity: O(1) - array unshift is O(n), but we manage array size
     */
    addToHistory(expression, result) {
        const historyItem = {
            expression,
            result,
            timestamp: new Date().getTime()
        };
        
        this.history.unshift(historyItem);
        
        // Keep only last 50 calculations in memory for efficiency
        if (this.history.length > 50) {
            this.history.pop();
        }
        
        this.saveHistory();
    }

    /**
     * Load history from localStorage
     * Time Complexity: O(n) where n is stored history items
     */
    loadHistory() {
        const stored = localStorage.getItem('calculatorHistory');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Save history to localStorage
     * Time Complexity: O(n) where n is history length
     */
    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    /**
     * Clear all history
     * Time Complexity: O(1)
     */
    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    /**
     * Get history items
     * Time Complexity: O(1) - returns reference to array
     */
    getHistory() {
        return this.history;
    }

    /**
     * Apply historical calculation to current
     * Time Complexity: O(1)
     */
    useFromHistory(result) {
        this.currentOperand = result;
        this.updateDisplay();
    }

    // ===== SCIENTIFIC FUNCTIONS =====

    /**
     * Calculate square root
     * Time Complexity: O(1)
     */
    sqrt() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current < 0) {
            this.currentOperand = 'Error';
            this.updateDisplay();
            return;
        }
        this.currentOperand = this.formatResult(Math.sqrt(current));
        this.addToHistory(`√${current}`, this.currentOperand);
        this.updateDisplay();
    }

    /**
     * Calculate square (x²)
     * Time Complexity: O(1)
     */
    square() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = this.formatResult(current * current);
        this.addToHistory(`${current}²`, this.currentOperand);
        this.updateDisplay();
    }

    /**
     * Set power operation (x^y)
     * Time Complexity: O(1)
     */
    choosePower() {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = '^';
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    /**
     * Calculate logarithm (base 10)
     * Time Complexity: O(1)
     */
    log() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current <= 0) {
            this.currentOperand = 'Error';
            this.updateDisplay();
            return;
        }
        this.currentOperand = this.formatResult(Math.log10(current));
        this.addToHistory(`log(${current})`, this.currentOperand);
        this.updateDisplay();
    }

    /**
     * Calculate natural logarithm (ln)
     * Time Complexity: O(1)
     */
    ln() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current <= 0) {
            this.currentOperand = 'Error';
            this.updateDisplay();
            return;
        }
        this.currentOperand = this.formatResult(Math.log(current));
        this.addToHistory(`ln(${current})`, this.currentOperand);
        this.updateDisplay();
    }

    /**
     * Extended compute to handle power operation
     * Time Complexity: O(1)
     */
    computeExtended() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return this.compute();
        }

        this.currentOperand = this.formatResult(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    /**
     * Execute calculation for scientific operations
     */
    executeScientificCalculation() {
        if (this.operation === '^') {
            if (this.previousOperand === '' || this.currentOperand === '') return;
            const prev = this.previousOperand;
            const curr = this.currentOperand;
            this.computeExtended();
            this.addToHistory(`${prev}^${curr}`, this.currentOperand);
        } else {
            this.executeCalculation();
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const previousOperandEl = document.getElementById('previousOperand');
    const currentOperandEl = document.getElementById('currentOperand');
    const numberButtons = document.querySelectorAll('[data-number]');
    const operatorButtons = document.querySelectorAll('[data-operator]');
    const equalsBtn = document.getElementById('equalsBtn');
    const clearBtn = document.getElementById('clearBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const percentBtn = document.getElementById('percentBtn');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Initialize calculator
    const calculator = new Calculator(previousOperandEl, currentOperandEl);

    // Number button event listeners
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.dataset.number);
        });
    });

    // Operator button event listeners
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.dataset.operator);
        });
    });

    // Equals button
    equalsBtn.addEventListener('click', () => {
        calculator.executeCalculation();
        updateHistoryDisplay();
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        calculator.clear();
    });

    // Delete button
    deleteBtn.addEventListener('click', () => {
        calculator.delete();
    });

    // Percent button
    percentBtn.addEventListener('click', () => {
        calculator.percentage();
    });

    // Clear history button
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Clear all calculation history?')) {
            calculator.clearHistory();
            updateHistoryDisplay();
        }
    });

    /**
     * Update history display
     * Time Complexity: O(n) where n is number of history items displayed
     */
    function updateHistoryDisplay() {
        const history = calculator.getHistory();
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="empty-message">No calculations yet</p>';
            return;
        }

        historyList.innerHTML = history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${calculator.formatDisplayValue(item.result)}</div>
            </div>
        `).join('');

        // Add click handlers to history items
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                const result = history[index].result;
                calculator.useFromHistory(result);
            });
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        // Number keys
        if (e.key >= '0' && e.key <= '9') {
            calculator.appendNumber(e.key);
        }
        // Decimal point
        if (e.key === '.') {
            calculator.appendNumber('.');
        }
        // Operations
        if (e.key === '+' || e.key === '-') {
            calculator.chooseOperation(e.key);
        }
        if (e.key === '*') {
            e.preventDefault();
            calculator.chooseOperation('*');
        }
        if (e.key === '/') {
            e.preventDefault();
            calculator.chooseOperation('/');
        }
        // Equals / Enter
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculator.executeCalculation();
            updateHistoryDisplay();
        }
        // Backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            calculator.delete();
        }
        // Escape to clear
        if (e.key === 'Escape') {
            calculator.clear();
        }
    });

    // Initial history display
    updateHistoryDisplay();

    // ===== MODE SWITCHING =====
    const basicModeBtn = document.getElementById('basicModeBtn');
    const scientificModeBtn = document.getElementById('scientificModeBtn');
    const baseConverterBtn = document.getElementById('baseConverterBtn');
    
    const basicGrid = document.getElementById('basicGrid');
    const scientificGrid = document.getElementById('scientificGrid');
    const baseConverterGrid = document.getElementById('baseConverterGrid');

    function switchMode(mode) {
        // Remove active class from all buttons
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        
        // Hide all grids
        basicGrid.classList.add('hidden');
        scientificGrid.classList.add('hidden');
        baseConverterGrid.classList.add('hidden');

        // Show selected grid and mark button active
        if (mode === 'basic') {
            basicModeBtn.classList.add('active');
            basicGrid.classList.remove('hidden');
        } else if (mode === 'scientific') {
            scientificModeBtn.classList.add('active');
            scientificGrid.classList.remove('hidden');
        } else if (mode === 'base') {
            baseConverterBtn.classList.add('active');
            baseConverterGrid.classList.remove('hidden');
        }
    }

    basicModeBtn.addEventListener('click', () => switchMode('basic'));
    scientificModeBtn.addEventListener('click', () => switchMode('scientific'));
    baseConverterBtn.addEventListener('click', () => switchMode('base'));

    // ===== SCIENTIFIC FUNCTIONS =====
    const sqrtBtn = document.getElementById('sqrtBtn');
    const squareBtn = document.getElementById('squareBtn');
    const powerBtn = document.getElementById('powerBtn');
    const logBtn = document.getElementById('logBtn');
    const lnBtn = document.getElementById('lnBtn');
    const equalsBtnSci = document.getElementById('equalsBtnSci');
    const clearBtnSci = document.getElementById('clearBtnSci');
    const deleteBtnSci = document.getElementById('deleteBtnSci');

    // Scientific calculator buttons - numbers
    const scientificNumberButtons = scientificGrid.querySelectorAll('[data-number]');
    scientificNumberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.dataset.number);
        });
    });

    // Scientific calculator buttons - operators
    const scientificOperatorButtons = scientificGrid.querySelectorAll('[data-operator]');
    scientificOperatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.dataset.operator);
        });
    });

    sqrtBtn.addEventListener('click', () => {
        calculator.sqrt();
        updateHistoryDisplay();
    });

    squareBtn.addEventListener('click', () => {
        calculator.square();
        updateHistoryDisplay();
    });

    powerBtn.addEventListener('click', () => {
        calculator.choosePower();
    });

    logBtn.addEventListener('click', () => {
        calculator.log();
        updateHistoryDisplay();
    });

    lnBtn.addEventListener('click', () => {
        calculator.ln();
        updateHistoryDisplay();
    });

    equalsBtnSci.addEventListener('click', () => {
        calculator.executeScientificCalculation();
        updateHistoryDisplay();
    });

    clearBtnSci.addEventListener('click', () => {
        calculator.clear();
    });

    deleteBtnSci.addEventListener('click', () => {
        calculator.delete();
    });

    // ===== BASE CONVERTER =====
    const decimalInput = document.getElementById('decimalInput');
    const binaryInput = document.getElementById('binaryInput');
    const hexInput = document.getElementById('hexInput');
    const octalInput = document.getElementById('octalInput');
    const clearBaseBtn = document.getElementById('clearBaseBtn');

    /**
     * Convert number between bases
     * Time Complexity: O(1) for small numbers, O(log n) for large numbers
     */
    function convertBases(decimalValue) {
        if (decimalValue === '' || decimalValue === null) {
            binaryInput.value = '';
            hexInput.value = '';
            octalInput.value = '';
            return;
        }

        const num = parseInt(decimalValue, 10);
        
        if (isNaN(num) || num < 0) {
            binaryInput.value = 'Invalid';
            hexInput.value = 'Invalid';
            octalInput.value = 'Invalid';
            return;
        }

        // Convert to different bases
        binaryInput.value = num.toString(2);      // Binary (base 2)
        hexInput.value = num.toString(16).toUpperCase();    // Hexadecimal (base 16)
        octalInput.value = num.toString(8);       // Octal (base 8)
    }

    decimalInput.addEventListener('input', (e) => {
        convertBases(e.target.value);
    });

    clearBaseBtn.addEventListener('click', () => {
        decimalInput.value = '';
        binaryInput.value = '';
        hexInput.value = '';
        octalInput.value = '';
    });
});
