'use client'

import { useState, useEffect } from 'react'
import { Task } from '../types/task'
import { getTasks } from '../lib/supabase'

// Резервные задачи на случай ошибки с Supabase
const FALLBACK_TASKS: Task[] = [
  { id: 1, text: 'Решите задачу: 2 + 2 * 2 = ?', answer: 6 },
  { id: 2, text: 'Вычислите значение: 5! / 3! = ?', answer: 20 },
  { id: 3, text: 'Найдите сумму: 1 + 2 + 3 + ... + 10 = ?', answer: 55 },
]

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [solvedTaskIds, setSolvedTaskIds] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Функция для загрузки данных при первом рендеринге
  useEffect(() => {
    async function initialize() {
      try {
        // Загружаем задачи из Supabase
        const supabaseTasks = await getTasks()
        
        // Если задачи получены успешно, используем их, иначе - резервные
        const loadedTasks = supabaseTasks.length > 0 ? supabaseTasks : FALLBACK_TASKS
        setTasks(loadedTasks)
        
        // Загружаем прогресс из localStorage
        const savedSolvedTaskIds = localStorage.getItem('solvedTaskIds')
        let parsedIds: number[] = []
        if (savedSolvedTaskIds) {
          parsedIds = JSON.parse(savedSolvedTaskIds)
          setSolvedTaskIds(parsedIds)
          setProgress(Math.round((parsedIds.length / loadedTasks.length) * 100))
        }

        // Проверяем тему
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDarkMode(prefersDark)
        if (prefersDark) {
          document.documentElement.classList.add('dark')
        }
        
        // Загружаем первую задачу
        await loadRandomTask(loadedTasks, parsedIds)
        
      } catch (error) {
        console.error('Ошибка инициализации:', error)
        setTasks(FALLBACK_TASKS)
        await loadRandomTask(FALLBACK_TASKS, [])
      } finally {
        setIsLoading(false)
      }
    }
    
    initialize()
  }, [])

  // Загрузка случайной задачи, которую пользователь еще не решил
  const loadRandomTask = async (taskList = tasks, solvedIds = solvedTaskIds) => {
    const unsolvedTasks = taskList.filter(task => !solvedIds.includes(task.id))
    
    if (unsolvedTasks.length === 0) {
      // Все задачи решены
      setCurrentTask(null)
      return
    }

    const randomIndex = Math.floor(Math.random() * unsolvedTasks.length)
    setCurrentTask(unsolvedTasks[randomIndex])
    setUserAnswer('')
    setMessage('')
  }

  // Обработка ответа пользователя
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentTask) return

    const userAnswerNumber = Number(userAnswer)
    const isCorrect = userAnswerNumber === currentTask.answer

    if (isCorrect) {
      const updatedSolvedTaskIds = [...solvedTaskIds, currentTask.id]
      setSolvedTaskIds(updatedSolvedTaskIds)
      localStorage.setItem('solvedTaskIds', JSON.stringify(updatedSolvedTaskIds))
      
      const newProgress = Math.round((updatedSolvedTaskIds.length / tasks.length) * 100)
      setProgress(newProgress)
      
      setMessage('Правильно!')
      
      // Загружаем следующую задачу через секунду
      setTimeout(() => loadRandomTask(), 1000)
    } else {
      setMessage('Неправильно. Попробуйте еще раз или перейдите к другой задаче.')
    }
  }

  // Переключение темы
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Начать заново
  const resetProgress = () => {
    localStorage.removeItem('solvedTaskIds')
    setSolvedTaskIds([])
    setProgress(0)
    loadRandomTask()
  }

  return (
    <main className={`flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12`}>
      <div className="fixed top-4 right-4 flex items-center gap-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <a 
          href="/Excel-Tasks.xlsx" 
          download 
          className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
        >
          📊
        </a>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Тренажер задач ЕГЭ по Excel
      </h1>

      <div className="w-full max-w-md mb-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            className="bg-primary h-4 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center mt-2">Прогресс: {progress}%</p>
      </div>

      {isLoading ? (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
          <p>Загрузка задач...</p>
        </div>
      ) : currentTask ? (
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
              <p className={message.includes('Правильно') ? 'text-green-500' : 'text-red-500'}>
                {message}
              </p>
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
    </main>
  )
}
