"use client"

import { useState, useEffect } from "react"
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['ege9']['Row']

export default function Trainer({ tasks }: { tasks: Task[] }) {
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [message, setMessage] = useState("")
  const [solvedTaskIds, setSolvedTaskIds] = useState<number[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("solvedTaskIds")
    if (saved) {
      const parsed = JSON.parse(saved)
      setSolvedTaskIds(parsed)
      setProgress(Math.round((parsed.length / tasks.length) * 100))
    }
    loadRandomTask(tasks, saved ? JSON.parse(saved) : [])
    // eslint-disable-next-line
  }, [tasks])

  function loadRandomTask(taskList = tasks, solvedIds = solvedTaskIds) {
    const unsolved = taskList.filter((t) => !solvedIds.includes(t.id))
    if (unsolved.length === 0) {
      setCurrentTask(null)
      return
    }
    const randomIndex = Math.floor(Math.random() * unsolved.length)
    setCurrentTask(unsolved[randomIndex])
    setUserAnswer("")
    setMessage("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentTask) return
    const isCorrect = Number(userAnswer) === currentTask.answer
    if (isCorrect) {
      const updated = [...solvedTaskIds, currentTask.id]
      setSolvedTaskIds(updated)
      localStorage.setItem("solvedTaskIds", JSON.stringify(updated))
      setProgress(Math.round((updated.length / tasks.length) * 100))
      setMessage("Правильно!")
      setTimeout(() => loadRandomTask(tasks, updated), 1000)
    } else {
      setMessage("Неправильно. Попробуйте ещё раз или выберите другую задачу.")
    }
  }

  function resetProgress() {
    localStorage.removeItem("solvedTaskIds")
    setSolvedTaskIds([])
    setProgress(0)
    loadRandomTask(tasks, [])
  }

  return (
    <>
      {/* Прогресс-бар — отдельный блок */}
      <div className="w-4/5 max-w-2xl mx-auto mb-8">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
          <div
            className="bg-blue-500 dark:bg-blue-400 h-4 rounded-full transition-all duration-500 shadow"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 text-gray-700 dark:text-gray-200 font-medium">Прогресс: {progress}%</p>
      </div>
      {/* Карточка задачи */}
      <div className="w-4/5 max-w-2xl mx-auto">
        {currentTask ? (
          <div className="bg-white/90 dark:bg-gray-900/90 shadow-2xl rounded-2xl p-6 md:p-10 flex flex-col gap-4 animate-fade-in">
            <p className="text-lg md:text-xl mb-4 text-gray-900 dark:text-white leading-relaxed">Откройте файл электронной таблицы, содержащей в каждой строке восемь натуральных чисел. Определите количество строк таблицы, для чисел которых выполнено условие: <span className='font-normal'>{currentTask.text}</span></p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Ваш ответ:</label>
                <input
                  id="answer"
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
                  required
                />
              </div>
              {message && (
                <p className={message.includes("Правильно") ? "text-green-600 dark:text-green-400 font-semibold" : "text-red-600 dark:text-red-400 font-semibold"}>{message}</p>
              )}
              <div className="flex gap-2 justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-bold shadow transition-colors"
                >
                  Затащить
                </button>
                <button
                  type="button"
                  onClick={() => loadRandomTask()}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 py-2 px-6 rounded-lg font-bold shadow transition-colors"
                >
                  Скипнуть
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-900/90 shadow-2xl rounded-2xl p-6 md:p-10 text-center animate-fade-in">
            <h2 className="text-2xl md:text-3xl mb-4 font-extrabold text-blue-600 dark:text-blue-400">🎉 Поздравляем! 🎉</h2>
            <p className="mb-4 text-lg text-gray-800 dark:text-gray-200">Вы решили все задачи!</p>
            <button
              onClick={resetProgress}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-bold shadow transition-colors"
            >
              Начать сначала
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// Переключатель темы
function ThemeToggle() {
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