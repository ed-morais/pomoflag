import flagsmith from "flagsmith";

// Centralises all flag access — flag names are case-sensitive
export function useFlags() {
  return {
    darkMode: flagsmith.hasFeature("ui_dark_mode"),
    shortBreak: flagsmith.hasFeature("feature_short_break"),
    statsWidget: flagsmith.hasFeature("feature_stats_widget"),
    soundAlerts: flagsmith.hasFeature("feature_sound_alerts"),
    // getValue() returns a string, so parse to int
    pomoDuration: parseInt(flagsmith.getValue("pomodoro_duration_minutes") ?? 25, 10),
    motivationalMsg: flagsmith.getValue("motivational_message") ?? "Stay focused!",
  };
}
