import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'
import Link from 'next/link'

type Task = Database['public']['Tables']['ege9']['Row']

export default async function EgeTasks() {
  let tasks = null
  let error = null
  
  try {
    console.log('Подключение к Supabase с сервера...')
    const supabase = await createClient()
    
    console.log('Запрос к таблице ege9...')
    const { data, error: queryError } = await supabase.from('ege9').select()
    
    if (queryError) {
      console.error('Ошибка запроса к Supabase:', queryError)
      error = queryError.message
    } else {
      console.log(`Получено ${data?.length || 0} задач из таблицы ege9`)
      tasks = data
    }
  } catch (e) {
    console.error('Критическая ошибка при работе с Supabase:', e)
    error = e instanceof Error ? e.message : 'Неизвестная ошибка'
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-block mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          &larr; Вернуться на главную
        </Link>
        <h1 className="text-2xl font-bold">Задачи ЕГЭ</h1>
      </div>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded">
          <p className="font-bold">Ошибка:</p>
          <p>{error}</p>
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
            <p>Для исправления этой проблемы:</p>
            <ol className="list-decimal pl-5">
              <li>Проверьте, что таблица ege9 создана в Supabase</li>
              <li>Проверьте Row Level Security для таблицы</li>
              <li>Убедитесь, что переменные окружения настроены правильно</li>
            </ol>
          </div>
        </div>
      )}
      
      {tasks && tasks.length > 0 ? (
        <div className="grid gap-4">
          {tasks.map((task: Task) => (
            <div key={task.id} className="p-4 border rounded bg-white shadow dark:bg-gray-800">
              <h2 className="font-semibold mb-2">Задача #{task.id}</h2>
              <p className="mb-4">{task.text}</p>
              <div className="text-right text-sm text-gray-500">
                Ответ: <span className="font-mono">{task.answer}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border rounded bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
          <p className="mb-2">Задачи не найдены или произошла ошибка при загрузке.</p>
          <p className="text-sm">Убедитесь, что таблица ege9 существует и содержит данные.</p>
          
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded text-gray-800 dark:text-gray-200 text-sm">
            <p className="font-bold mb-2">Выполните следующий SQL-скрипт в Supabase:</p>
            <pre className="p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto text-xs">
{`-- Создание таблицы ege9
CREATE TABLE public.ege9 (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  answer integer NOT NULL
);

-- Вставка примеров задач
INSERT INTO public.ege9 (text, answer)
VALUES
  ('Решите задачу: 2 + 2 * 2 = ?', 6),
  ('Вычислите значение: 5! / 3! = ?', 20);
  
-- RLS политика для чтения
ALTER TABLE public.ege9 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON public.ege9 FOR SELECT TO anon USING (true);`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
} 