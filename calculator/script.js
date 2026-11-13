class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;

        this.init();
    }

    init() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(btn => {
            btn.addEventListener('click', () => this.handleNumber(btn.dataset.number));
        });

        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(btn => {
            btn.addEventListener('click', () => this.handleOperator(btn.dataset.operator));
        });

        // Clear button
        document.getElementById('clear').addEventListener('click', () => this.clear());

        // Delete button
        document.getElementById('delete').addEventListener('click', () => this.delete());

        // Equals button
        document.getElementById('equals').addEventListener('click', () => this.calculate());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = num;
            this.shouldResetDisplay = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
        this.updateDisplay();
    }

    handleOperator(op) {
        if (op === '.') {
            if (!this.currentValue.includes('.')) {
                this.currentValue += '.';
            }
            return;
        }

        if (this.operation !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operation = op;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    calculate() {
        if (this.operation === null || this.shouldResetDisplay) return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current === 0 ? 'Error' : prev / current;
                break;
            default:
                return;
        }

        this.currentValue = result.toString();
        this.operation = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    delete() {
        if (this.shouldResetDisplay) return;
        this.currentValue = this.currentValue.slice(0, -1) || '0';
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.value = this.currentValue;
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') this.handleNumber(e.key);
        if (e.key === '.') this.handleOperator('.');
        if (e.key === '+' || e.key === '-') this.handleOperator(e.key);
        if (e.key === '*') { e.preventDefault(); this.handleOperator('*'); }
        if (e.key === '/') { e.preventDefault(); this.handleOperator('/'); }
        if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); this.calculate(); }
        if (e.key === 'Backspace') this.delete();
        if (e.key === 'Escape') this.clear();
    }
}

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
