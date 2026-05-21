export default function StatsWidget({ sessions }) {
  return (
    <div className="mt-6 px-6 py-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm text-sm text-gray-600 dark:text-gray-300">
      Sessions completed today: <span className="font-bold text-gray-800 dark:text-white">{sessions}</span>
    </div>
  );
}
