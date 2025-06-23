"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { FaMoon, FaSun } from "react-icons/fa"
import './theme-toggle.css';

export function VibeThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return (
      <button className="vibe-theme-switch" aria-label="Switch theme" disabled style={{ opacity: 0.5 }}>
        <span className="vibe-theme-switch-icon" />
        <span className="vibe-theme-switch-label" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`vibe-theme-switch${isDark ? ' dark' : ''}`}
      aria-label="Switch theme"
    >
      <span className="vibe-theme-switch-icon">
        {isDark ? <FaSun /> : <FaMoon />}
      </span>
      <span className="vibe-theme-switch-label">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
}