import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'
import Link from 'next/link'

const SQL_SCRIPT = `-- Создание таблицы ege9\ncreate table if not exists public.ege9 (\n  id bigint primary key generated always as identity,\n  text text not null,\n  answer integer not null\n);\n\n-- Вставка примеров задач\ninsert into public.ege9 (text, answer) values\n  ('Решите задачу: 2 + 2 * 2 = ?', 6),\n  ('Вычислите значение: 5! / 3! = ?', 20);\n\n-- Включить RLS и разрешить анонимное чтение\nalter table public.ege9 enable row level security;\ncreate policy if not exists "Allow anonymous read access" on public.ege9 for select to anon using (true);`

type Task = Database['public']['Tables']['ege9']['Row']

export default async function Home() {
  const supabase = await createClient()
  const { data: tasks, error } = await supabase.from('ege9').select()

  let content = null
  if (error || !tasks || tasks.length === 0) {
    content = (
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-200 rounded mb-4">
        <p className="font-bold mb-2">Задачи не найдены или таблица ege9 отсутствует.</p>
        <p className="mb-2">Для работы приложения выполните этот SQL-скрипт в <a href='https://app.supabase.com/project/_/sql' target='_blank' className='underline'>SQL Editor Supabase</a>:</p>
        <pre className="p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto text-xs mb-2 whitespace-pre-wrap">{SQL_SCRIPT}</pre>
        <p className="text-sm text-gray-600 dark:text-gray-400">После выполнения скрипта обновите страницу.</p>
      </div>
    )
  } else {
    content = (
      <div className="w-full max-w-md mb-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div className="bg-primary h-4 rounded-full transition-all duration-500" style={{ width: `${Math.round((0/tasks.length)*100)}%` }}></div>
        </div>
        <p className="text-center mt-2">Прогресс: 0%</p>
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Первая задача:</h2>
          <div className="p-4 border rounded bg-white shadow dark:bg-gray-800">
            <p className="mb-4">{tasks[0].text}</p>
            <div className="text-right text-sm text-gray-500">Ответ: <span className="font-mono">{tasks[0].answer}</span></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <div className="fixed top-4 right-4 flex items-center gap-4">
        <a href="/Excel-Tasks.xlsx" download className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600">📊</a>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Тренажер задач ЕГЭ по Excel</h1>
      <div className="flex gap-4 mb-8">
        <Link href="/ege" className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700">Просмотреть все задачи</Link>
      </div>
      {content}
    </main>
  )
}
