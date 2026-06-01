import { useEffect, useState } from "react";

const WORD = ["H", "R", "O", "N", "É", "A"];

const SplashScreen = ({ onDone }: { onDone?: () => void }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 2700);
    const doneTimer = setTimeout(() => onDone?.(), 3400);
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
              style={{ animationDelay: `${1100 + i * 90}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes splash-drop {
          0%   { transform: translateY(-120%) rotate(-25deg); opacity: 0; }
          55%  { transform: translateY(8%) rotate(8deg); opacity: 1; }
          75%  { transform: translateY(-3%) rotate(-3deg); }
          100% { transform: translateY(0) rotate(0); opacity: 1; }
        }
        @keyframes splash-letter-in {
          0%   { opacity: 0; transform: translateY(8px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .splash-crescent {
          transform-origin: 70% 12%;
          animation: splash-drop 1.1s cubic-bezier(.34,1.2,.5,1) both;
        }
        .splash-letter {
          display: inline-block;
          opacity: 0;
          animation: splash-letter-in .5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
