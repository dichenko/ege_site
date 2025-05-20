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
      <div className="w-full max-w-md mb-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center mt-2">Прогресс: {progress}%</p>
      </div>
      {currentTask ? (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <p className="text-lg mb-4">{currentTask.text}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="answer" className="block mb-2">Ваш ответ:</label>
              <input
                id="answer"
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                required
              />
            </div>
            {message && (
              <p className={message.includes("Правильно") ? "text-green-500" : "text-red-500"}>{message}</p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Ответить
              </button>
              <button
                type="button"
                onClick={() => loadRandomTask()}
                className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 py-2 px-4 rounded"
              >
                Другая задача
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl mb-4">🎉 Поздравляем! 🎉</h2>
          <p className="mb-4">Вы решили все задачи!</p>
          <button
            onClick={resetProgress}
            className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Начать сначала
          </button>
        </div>
      )}
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

Trainer.ThemeToggle = ThemeToggle 