import { useFlags } from "../hooks/useFlags";

export default function MotivationalMessage({ visible }) {
  const { motivationalMsg } = useFlags();

  if (!visible) return null;

  return (
    <p className="mt-6 text-sm italic text-gray-500 dark:text-gray-400">
      {motivationalMsg}
    </p>
  );
}
