import React from 'react';

interface Props {
  topic: string;
}

export const BottomRightTag: React.FC<Props> = ({ topic }) => {
  return (
    <div className="fixed bottom-4 right-5 pointer-events-none select-none z-20">
      <div className="flex items-center gap-2 bg-navy-950/85 backdrop-blur-sm px-3 py-1.5 rounded border border-slate-800 text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-400 uppercase shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-retro-lime" />
        <span>{topic}</span>
      </div>
    </div>
  );
};
