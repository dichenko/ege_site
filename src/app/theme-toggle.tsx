"use client"
import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

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
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label="Переключить тему"
    >
      <div className="relative w-6 h-6">
        <div className={`absolute inset-0 transform transition-transform duration-200 ${isDark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
          <Sun className="w-6 h-6 text-amber-500" />
        </div>
        <div className={`absolute inset-0 transform transition-transform duration-200 ${isDark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
          <Moon className="w-6 h-6 text-blue-400" />
        </div>
      </div>
    </button>
  )
} 