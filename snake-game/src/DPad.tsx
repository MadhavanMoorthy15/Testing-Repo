import React from 'react';
import { Direction } from './types';

interface Props {
  onDirection: (dir: Direction) => void;
}

const DPad: React.FC<Props> = ({ onDirection }) => {
  const btn = (dir: Direction, label: string, className: string) => (
    <button
      className={`dpad-btn ${className}`}
      onPointerDown={(e) => {
        e.preventDefault();
        onDirection(dir);
      }}
      aria-label={dir}
    >
      {label}
    </button>
  );

  return (
    <div className="dpad" aria-label="Directional pad">
      {btn('UP', '▲', 'dpad-up')}
      <div className="dpad-middle">
        {btn('LEFT', '◀', 'dpad-left')}
        <div className="dpad-center" />
        {btn('RIGHT', '▶', 'dpad-right')}
      </div>
      {btn('DOWN', '▼', 'dpad-down')}
    </div>
  );
};

export default DPad;
