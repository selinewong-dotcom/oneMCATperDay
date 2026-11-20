import React from 'react';

interface Props {
  enabled: boolean;
}

export const ScanlineOverlay: React.FC<Props> = ({ enabled }) => {
  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 select-none overflow-hidden"
      style={{
        background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.28) 50%)`,
        backgroundSize: '100% 4px',
        opacity: 0.65,
      }}
    />
  );
};
