'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Функция для загрузки данных при первом рендеринге
  useEffect(() => {
    async function initialize() {
      console.log('Инициализация приложения...')
      try {
        // Загружаем задачи из Supabase
        console.log('Запрашиваем задачи из Supabase...')
        const supabaseTasks = await getTasks()
        console.log(`Получили ${supabaseTasks.length} задач из Supabase.`)
        
        // Если задачи получены успешно, используем их, иначе - резервные
        const loadedTasks = supabaseTasks.length > 0 ? supabaseTasks : FALLBACK_TASKS
        if (supabaseTasks.length === 0) {
          console.warn('Используем резервные задачи из-за пустого ответа Supabase.')
          setErrorMessage('Не удалось загрузить задачи из базы данных. Используются резервные задачи.')
        }
        console.log(`Всего задач для работы: ${loadedTasks.length}`)
        setTasks(loadedTasks)
        
        // Загружаем прогресс из localStorage
        console.log('Загружаем прогресс из localStorage...')
        const savedSolvedTaskIds = localStorage.getItem('solvedTaskIds')
        let parsedIds: number[] = []
        if (savedSolvedTaskIds) {
          parsedIds = JSON.parse(savedSolvedTaskIds)
          console.log(`Найдено ${parsedIds.length} решенных задач.`)
          setSolvedTaskIds(parsedIds)
          setProgress(Math.round((parsedIds.length / loadedTasks.length) * 100))
        } else {
          console.log('Решенных задач не найдено.')
        }

        // Проверяем тему
        console.log('Проверяем предпочтения по теме...')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDarkMode(prefersDark)
        if (prefersDark) {
          document.documentElement.classList.add('dark')
          console.log('Установлена темная тема.')
        } else {
          console.log('Установлена светлая тема.')
        }
        
        // Загружаем первую задачу
        console.log('Загружаем случайную задачу...')
        await loadRandomTask(loadedTasks, parsedIds)
        
      } catch (error) {
        console.error('Критическая ошибка инициализации:', error)
        setErrorMessage(`Произошла ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
        setTasks(FALLBACK_TASKS)
        await loadRandomTask(FALLBACK_TASKS, [])
      } finally {
        setIsLoading(false)
        console.log('Инициализация завершена.')
      }
    }
    
    initialize()
  }, [])

  // Загрузка случайной задачи, которую пользователь еще не решил
  const loadRandomTask = async (taskList = tasks, solvedIds = solvedTaskIds) => {
    console.log(`Ищем нерешенные задачи (всего задач: ${taskList.length}, решено: ${solvedIds.length})`)
    const unsolvedTasks = taskList.filter(task => !solvedIds.includes(task.id))
    console.log(`Найдено ${unsolvedTasks.length} нерешенных задач.`)
    
    if (unsolvedTasks.length === 0) {
      // Все задачи решены
      console.log('Все задачи решены!')
      setCurrentTask(null)
      return
    }

    const randomIndex = Math.floor(Math.random() * unsolvedTasks.length)
    const selectedTask = unsolvedTasks[randomIndex]
    console.log(`Выбрана задача ID: ${selectedTask.id}`)
    setCurrentTask(selectedTask)
    setUserAnswer('')
    setMessage('')
  }

  // Обработка ответа пользователя
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentTask) return

    const userAnswerNumber = Number(userAnswer)
    const isCorrect = userAnswerNumber === currentTask.answer
    console.log(`Проверка ответа (задача ${currentTask.id}): введено ${userAnswerNumber}, правильно: ${currentTask.answer}, результат: ${isCorrect ? 'верно' : 'неверно'}`)

    if (isCorrect) {
      const updatedSolvedTaskIds = [...solvedTaskIds, currentTask.id]
      setSolvedTaskIds(updatedSolvedTaskIds)
      localStorage.setItem('solvedTaskIds', JSON.stringify(updatedSolvedTaskIds))
      console.log(`Задача ${currentTask.id} отмечена как решенная. Всего решено: ${updatedSolvedTaskIds.length}`)
      
      const newProgress = Math.round((updatedSolvedTaskIds.length / tasks.length) * 100)
      setProgress(newProgress)
      console.log(`Обновлен прогресс: ${newProgress}%`)
      
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
    console.log(`Тема переключена на ${isDarkMode ? 'светлую' : 'темную'}`)
  }

  // Начать заново
  const resetProgress = () => {
    localStorage.removeItem('solvedTaskIds')
    setSolvedTaskIds([])
    setProgress(0)
    console.log('Прогресс сброшен, начинаем заново.')
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

      <div className="flex gap-4 mb-8">
        <Link 
          href="/ege" 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
        >
          Просмотреть все задачи
        </Link>
      </div>

      <div className="w-full max-w-md mb-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            className="bg-primary h-4 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center mt-2">Прогресс: {progress}%</p>
      </div>

      {errorMessage && (
        <div className="w-full max-w-md mb-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          <p>{errorMessage}</p>
          <button 
            className="text-sm underline mt-1" 
            onClick={() => setErrorMessage(null)}
          >
            Скрыть
          </button>
        </div>
      )}

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

      {/* Отладочная информация */}
      <div className="mt-8 w-full max-w-md p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-xs">
        <p className="font-bold mb-2">Информация для отладки:</p>
        <p>Количество задач: {tasks.length}</p>
        <p>Решено задач: {solvedTaskIds.length}</p>
        <p>Текущая задача ID: {currentTask?.id || 'нет'}</p>
        <p>Использованы резервные задачи: {tasks === FALLBACK_TASKS ? 'да' : 'нет'}</p>
      </div>
    </main>
  )
}
