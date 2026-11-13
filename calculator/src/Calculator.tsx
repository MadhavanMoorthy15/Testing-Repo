import { useEffect, useState } from 'react';

type Operator = '+' | '-' | '*' | '/';
type Calculation = { expression: string; result: string };
type Theme = 'dark' | 'light' | 'midnight';

const operators: Record<Operator, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const storedTheme = (): Theme => {
  const theme = localStorage.getItem('calculator-theme');
  return theme === 'light' || theme === 'midnight' ? theme : 'dark';
};

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState('');
  const [operation, setOperation] = useState<Operator | null>(null);
  const [resetOnNumber, setResetOnNumber] = useState(false);
  const [history, setHistory] = useState<Calculation[]>(() => {
    try {
      const saved = localStorage.getItem('calculator-history');
      return saved ? JSON.parse(saved) as Calculation[] : [];
    } catch {
      return [];
    }
  });
  const [theme, setTheme] = useState<Theme>(storedTheme);
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');

  useEffect(() => localStorage.setItem('calculator-theme', theme), [theme]);
  useEffect(() => localStorage.setItem('calculator-history', JSON.stringify(history)), [history]);

  const inputNumber = (value: string) => {
    setDisplay(current => resetOnNumber || current === 'Error' ? value : current === '0' ? value : current + value);
    setResetOnNumber(false);
  };

  const inputDecimal = () => {
    if (resetOnNumber || display === 'Error') {
      setDisplay('0.');
      setResetOnNumber(false);
    } else if (!display.includes('.')) setDisplay(current => `${current}.`);
  };

  const clear = () => {
    setDisplay('0');
    setPrevious('');
    setOperation(null);
    setResetOnNumber(false);
  };

  const calculate = () => {
    if (!operation || resetOnNumber) return;
    const left = Number(previous);
    const right = Number(display);
    let result: number;
    switch (operation) {
      case '+': result = left + right; break;
      case '-': result = left - right; break;
      case '*': result = left * right; break;
      case '/': result = left / right; break;
    }
    const resultText = right === 0 && operation === '/' ? 'Error' : String(Number(result.toPrecision(12)));
    const expression = `${previous} ${operators[operation]} ${display}`;
    if (resultText !== 'Error') setHistory(items => [{ expression, result: resultText }, ...items].slice(0, 50));
    setDisplay(resultText);
    setPrevious('');
    setOperation(null);
    setResetOnNumber(true);
  };

  const inputOperator = (next: Operator) => {
    if (operation && !resetOnNumber) calculate();
    setPrevious(display);
    setOperation(next);
    setResetOnNumber(true);
  };

  const removeDigit = () => {
    if (resetOnNumber) return;
    setDisplay(value => value.length <= 1 || (value.length === 2 && value.startsWith('-')) ? '0' : value.slice(0, -1));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
      else if (event.key === '.') inputDecimal();
      else if (['+', '-', '*', '/'].includes(event.key)) inputOperator(event.key as Operator);
      else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); calculate(); }
      else if (event.key === 'Backspace') removeDigit();
      else if (event.key === 'Escape') clear();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const buttons = [
    { label: 'AC', action: clear, style: 'utility' },
    { label: 'DEL', action: removeDigit, style: 'utility' },
    { label: '÷', action: () => inputOperator('/'), style: 'operator' },
    { label: '×', action: () => inputOperator('*'), style: 'operator' },
    ...['7', '8', '9'].map(label => ({ label, action: () => inputNumber(label), style: 'number' })),
    { label: '−', action: () => inputOperator('-'), style: 'operator' },
    ...['4', '5', '6'].map(label => ({ label, action: () => inputNumber(label), style: 'number' })),
    { label: '+', action: () => inputOperator('+'), style: 'operator' },
    ...['1', '2', '3'].map(label => ({ label, action: () => inputNumber(label), style: 'number' })),
    { label: '.', action: inputDecimal, style: 'number' },
    { label: '0', action: () => inputNumber('0'), style: 'zero number' },
    { label: '=', action: calculate, style: 'equals' },
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="workspace" data-testid="calculator-shell" data-theme={theme}>
        <header className="topbar">
          <a className="brand" href="#calculator" onClick={event => event.preventDefault()} aria-label="Calc home"><span className="brand-mark">∑</span><span>CALC<span className="brand-dot">.</span></span></a>
          <div className="theme-select"><span className="theme-glyph" aria-hidden="true">◐</span><label className="sr-only" htmlFor="theme">Theme</label><select id="theme" aria-label="Theme" value={theme} onChange={event => setTheme(event.target.value as Theme)}><option value="dark">Obsidian</option><option value="light">Paper</option><option value="midnight">Midnight</option></select><span className="select-chevron">⌄</span></div>
        </header>
        <nav className="tabs" aria-label="Calculator sections" role="tablist">
          <button role="tab" aria-selected={activeTab === 'calculator'} className={activeTab === 'calculator' ? 'tab active' : 'tab'} onClick={() => setActiveTab('calculator')}><span>⌗</span> Calculator</button>
          <button role="tab" aria-selected={activeTab === 'history'} className={activeTab === 'history' ? 'tab active' : 'tab'} onClick={() => setActiveTab('history')}><span>↺</span> History <span className="history-count">{history.length}</span></button>
        </nav>
        {activeTab === 'calculator' ? <div className="calculator-panel">
          <div className="display-card"><div className="display-meta"><span>STANDARD</span><span className="live-indicator">● READY</span></div><output className="display" aria-label="Calculator display">{display}</output><div className="display-expression">{operation ? `${previous} ${operators[operation]}` : 'Precision, in motion'}</div></div>
          <div className="keypad">{buttons.map(button => <button key={button.label} type="button" className={`key ${button.style}`} onClick={button.action} aria-label={button.label === 'AC' ? 'Clear' : button.label === 'DEL' ? 'Delete' : button.label}>{button.label}</button>)}</div>
          <div className="keyboard-hint"><span>KEYBOARD SUPPORTED</span><span><kbd>↵</kbd> ENTER <kbd>⌫</kbd> DELETE</span></div>
        </div> : <section className="history-panel" role="tabpanel" aria-label="History">
          <div className="history-heading"><div><span className="eyebrow">YOUR RECENT WORK</span><h1>History</h1></div>{history.length > 0 && <button className="clear-history" onClick={() => setHistory([])}>Clear all <span>↗</span></button>}</div>
          {history.length === 0 ? <div className="empty-history"><span className="empty-icon">↺</span><h2>Nothing here yet</h2><p>Your completed calculations will appear in this space.</p><button onClick={() => setActiveTab('calculator')}>Start calculating <span>→</span></button></div> : <ol className="history-list">{history.map((item, index) => <li className="history-item" key={`${item.expression}-${index}`}><span className="history-index">{String(history.length - index).padStart(2, '0')}</span><span className="history-expression">{item.expression}</span><span className="history-equals">=</span><strong>{item.result}</strong><button className="reuse-result" aria-label={`Use result ${item.result}`} onClick={() => { setDisplay(item.result); setOperation(null); setPrevious(''); setResetOnNumber(true); setActiveTab('calculator'); }}>↗</button></li>)}</ol>}
          <button className="back-calculator" onClick={() => setActiveTab('calculator')}>← Back to calculator</button>
        </section>}
        <footer className="app-footer"><span>MADE FOR THE MOMENT</span><span>v1.0 <i /> LOCAL SESSION</span></footer>
      </section>
      <aside className="side-note"><span className="side-rule"/><span>FIG. 01</span><p>Thoughtful<br/>arithmetic.</p><span className="side-caption">A CLEARER WAY TO THINK<br/>THROUGH THE NUMBERS.</span></aside>
    </main>
  );
}
