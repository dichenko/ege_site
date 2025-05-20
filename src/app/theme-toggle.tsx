"use client"
import { useState, useEffect } from "react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])
  return (
    <button
      onClick={() => {
        document.documentElement.classList.toggle('dark')
        setIsDark((v) => !v)
      }}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      aria-label="Переключить тему"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
} 