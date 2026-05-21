import { useState, useEffect, useRef } from "react";
import { useFlags } from "../hooks/useFlags";

function playBeep() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 440;
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
}

export default function Timer({ onComplete }) {
  const { pomoDuration, soundAlerts } = useFlags();

  const [secondsLeft, setSecondsLeft] = useState(pomoDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Re-initialise when the flag value changes
  useEffect(() => {
    setIsRunning(false);
    setSecondsLeft(pomoDuration * 60);
  }, [pomoDuration]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      if (soundAlerts) playBeep();
      onComplete?.();
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, secondsLeft]);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(pomoDuration * 60);
  };

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");

  if (secondsLeft === 0) {
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-2xl font-semibold text-green-600">Session complete!</p>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-gray-800 font-medium transition-colors"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <span className="text-7xl font-mono font-bold tracking-tight text-gray-800 dark:text-white">
        {mm}:{ss}
      </span>
      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-gray-800 font-medium transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
