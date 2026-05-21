import { useState, useEffect } from "react";
import flagsmith from "@flagsmith/flagsmith";
import { useFlags } from "./hooks/useFlags";
import Timer from "./components/Timer";
import BreakButton from "./components/BreakButton";
import StatsWidget from "./components/StatsWidget";

// Fallback values used when the Flagsmith API is unreachable
const DEFAULT_FLAGS = {
  ui_dark_mode: { enabled: false },
  feature_short_break: { enabled: true },
  feature_stats_widget: { enabled: false },
  feature_sound_alerts: { enabled: false },
  pomodoro_duration_minutes: { enabled: true, value: 25 },
  motivational_message: { enabled: true, value: "Stay focused!" },
};

export default function App() {
  const [flagsLoaded, setFlagsLoaded] = useState(false);
  const [flagsFromDefault, setFlagsFromDefault] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    const initFlagsmith = async () => {
      try {
        // Must await before evaluating any flags
        await flagsmith.init({
          environmentID: import.meta.env.VITE_FLAGSMITH_KEY,
          defaultFlags: DEFAULT_FLAGS,
          enableAnalytics: true,
          onChange: () => {
            setFlagsLoaded((prev) => !prev);
          },
        });
        console.log("Flagsmith flags:", flagsmith.getAllFlags());
        setFlagsLoaded(true);
      } catch (error) {
        console.warn("Flagsmith init failed — using default flags", error);
        setFlagsFromDefault(true);
        setFlagsLoaded(true);
      }
    };

    initFlagsmith();
  }, []);

  const { darkMode, shortBreak, statsWidget } = useFlags();

  if (!flagsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors ${darkMode ? "dark" : ""}`}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pomoflag</h1>
        <p className="text-gray-400 text-sm mt-1 mb-8">
          {flagsFromDefault ? "offline mode" : ""}
        </p>
        <Timer onComplete={() => setSessions((s) => s + 1)} />
        {shortBreak && <BreakButton />}
        {statsWidget && <StatsWidget sessions={sessions} />}
      </div>
    </div>
  );
}
