import { useState, useEffect } from "react";
import flagsmith from "@flagsmith/flagsmith";
import { useFlags } from "./hooks/useFlags";
import Timer from "./components/Timer";
import BreakButton from "./components/BreakButton";
import StatsWidget from "./components/StatsWidget";
import MotivationalMessage from "./components/MotivationalMessage";

// Fallback values used when the Flagsmith API is unreachable
const DEFAULT_FLAGS = {
  ui_dark_mode: { enabled: false },
  feature_short_break: { enabled: false },
  feature_stats_widget: { enabled: true },
  feature_sound_alerts: { enabled: false },
  pomodoro_duration_minutes: { enabled: true, value: 30 },
  motivational_message: { enabled: true, value: "Let's keep working!" },
};

export default function App() {
  const [flagsLoaded, setFlagsLoaded] = useState(false);
  const [flagsFromDefault, setFlagsFromDefault] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

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

  const togglePremium = async () => {
    if (isPremium) {
      await flagsmith.logout();
    } else {
      await flagsmith.identify("user_premium", { plan: "premium" });
    }
    setIsPremium((p) => !p);
    setFlagsLoaded((prev) => !prev);
  };

  const { darkMode, shortBreak, statsWidget } = useFlags();

  if (!flagsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  // dark class must be on a parent element so dark: variants apply to all children
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-gray-950 transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pomoflag</h1>
          <div className="h-7 mt-1 mb-6 flex items-center justify-center">
            {flagsFromDefault && (
              <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium">
                offline — using default flags
              </span>
            )}
          </div>

          <div className={`relative rounded-2xl px-10 py-8 transition-all duration-500 ${
            isPremium
              ? "bg-white dark:bg-gray-900 ring-2 ring-amber-400 shadow-xl shadow-amber-300/40 dark:shadow-amber-500/20"
              : "bg-white dark:bg-gray-900 shadow-md"
          }`}>
            {isPremium && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-amber-900 text-xs font-semibold tracking-wide">
                ✦ Premium
              </span>
            )}
            <Timer
              onComplete={() => setSessions((s) => s + 1)}
              onRunningChange={setIsActive}
              isPremium={isPremium}
            />
            <MotivationalMessage visible={isActive} />
          </div>

          <div className="flex flex-col items-center">
            {shortBreak && <BreakButton />}
            {statsWidget && <StatsWidget sessions={sessions} />}
            <button
              onClick={togglePremium}
              className={`mt-8 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isPremium
                  ? "bg-amber-400 hover:bg-amber-500 text-amber-900"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {isPremium ? "Premium user" : "Free user"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
