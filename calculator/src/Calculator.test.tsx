import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Calculator from './Calculator';

describe('Calculator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(cleanup);

  it('calculates expressions and adds them to the history tab', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));

    expect(screen.getByLabelText('Calculator display')).toHaveValue('10');
    fireEvent.click(screen.getByRole('tab', { name: /history/i }));
    expect(screen.getByText('7 + 3')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('supports division by zero without displaying Infinity', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '8' }));
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));

    expect(screen.getByLabelText('Calculator display')).toHaveValue('Error');
  });

  it('changes the selected theme and persists it', () => {
    render(<Calculator />);
    fireEvent.change(screen.getByLabelText('Theme'), { target: { value: 'light' } });

    expect(screen.getByTestId('calculator-shell')).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem('calculator-theme')).toBe('light');
  });
});
