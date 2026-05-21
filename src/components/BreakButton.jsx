import { useState, useEffect, useRef } from "react";

const BREAK_SECONDS = 5 * 60;

export default function BreakButton() {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else {
      setSecondsLeft(null);
    }

    return () => clearInterval(intervalRef.current);
  }, [secondsLeft]);

  const start = () => setSecondsLeft(BREAK_SECONDS);
  const cancel = () => setSecondsLeft(null);

  if (secondsLeft === null) {
    return (
      <button
        onClick={start}
        className="mt-4 px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
      >
        Take a 5-min break
      </button>
    );
  }

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
        Break: {mm}:{ss}
      </span>
      <button
        onClick={cancel}
        className="px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white text-gray-800 text-sm font-medium transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
