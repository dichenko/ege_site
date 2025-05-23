'use client';

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import Trainer from '@/app/trainer-client'
import Header from '@/components/Header'

type Task = Database['public']['Tables']['ege9']['Row']

// Создаем Supabase клиент для клиентского компонента
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function Task9Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTasks() {
      try {
        const { data, error } = await supabase.from('ege9').select()
        if (error) {
          throw error
        }
        setTasks(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки задач')
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">
          Задание №9: Анализ таблиц Excel
        </h1>
        <div className="relative">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : error || tasks.length === 0 ? (
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-200 rounded mb-4 text-center">
              <p className="font-bold mb-2">Задачи не найдены или таблица ege9 отсутствует.</p>
              <p>Проверьте настройки Supabase.</p>
              {error && <p className="mt-2 text-sm">Ошибка: {error}</p>}
            </div>
          ) : (
            <>
              <Trainer tasks={tasks} />
              <div className="fixed bottom-4 right-4">
                <a 
                  href="https://docs.google.com/spreadsheets/d/1VioaO7HN5oghStZKfPpGivCNJUQwsIMLKOYRia5sKRI/edit?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700 shadow-lg transition-colors flex items-center justify-center" 
                  title="Открыть Google-таблицу"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M19.6 3.2c-.2-.2-.5-.2-.7-.2H7.5c-.6 0-1 .4-1 1v2.5H4.1c-.6 0-1 .4-1 1v13c0 .6.4 1 1 1h13c.6 0 1-.4 1-1v-2.4h2.4c.6 0 1-.4 1-1V3.9c0-.2 0-.5-.2-.7zM17.6 19.6c0 .2-.2.4-.4.4H4.8c-.2 0-.4-.2-.4-.4V7.5c0-.2.2-.4.4-.4h2.4v9.4c0 .6.4 1 1 1h9.4v2.1zm3.1-3.1c0 .2-.2.4-.4.4h-13c-.2 0-.4-.2-.4-.4V4.8c0-.2.2-.4.4-.4h11.1c.2 0 .4.2.4.4v11.7z"/>
                  </svg>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
} 