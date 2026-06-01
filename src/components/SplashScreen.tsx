import { useEffect, useState } from "react";

const WORD = ["H", "R", "O", "N", "É", "A"];

const SplashScreen = ({ onDone }: { onDone?: () => void }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 3000);
    const doneTimer = setTimeout(() => onDone?.(), 3700);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-1 sm:gap-2 select-none">
        {/* Crescent — drops & swings in */}
        <svg
          viewBox="0 0 100 100"
          className="h-20 sm:h-28 w-auto splash-crescent"
          aria-hidden
        >
          <path
            d="M70 12 A 40 40 0 1 0 70 88"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-foreground"
          />
        </svg>

        {/* Letters — reveal one by one */}
        <div className="flex items-center -ml-3 sm:-ml-5">
          {WORD.map((letter, i) => (
            <span
              key={i}
              className="splash-letter font-display text-foreground text-4xl sm:text-6xl tracking-[0.35em] font-light"
              style={{ animationDelay: `${1700 + i * 130}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes splash-drop {
          0%   { transform: translateY(-130%) rotate(0deg) scale(0.55); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(0) rotate(360deg) scale(1); opacity: 1; }
        }
        @keyframes splash-letter-spit {
          0%   { opacity: 0; transform: translateY(6px) scale(0.94); filter: blur(6px); letter-spacing: 0.1em; }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); letter-spacing: 0.35em; }
        }
        .splash-crescent {
          transform-origin: 50% 50%;
          animation: splash-drop 1.5s cubic-bezier(.22,.9,.28,1) both;
        }
        .splash-letter {
          display: inline-block;
          opacity: 0;
          animation: splash-letter-spit .7s cubic-bezier(.22,.9,.28,1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
