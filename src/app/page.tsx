import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'
import Trainer from './trainer-client'
import ThemeToggle from './theme-toggle'

const SQL_SCRIPT = `-- Создание таблицы ege9\ncreate table if not exists public.ege9 (\n  id bigint primary key generated always as identity,\n  text text not null,\n  answer integer not null\n);\n\n-- Вставка примеров задач\ninsert into public.ege9 (text, answer) values\n  ('Решите задачу: 2 + 2 * 2 = ?', 6),\n  ('Вычислите значение: 5! / 3! = ?', 20);\n\n-- Включить RLS и разрешить анонимное чтение\nalter table public.ege9 enable row level security;\ncreate policy if not exists "Allow anonymous read access" on public.ege9 for select to anon using (true);`

type Task = Database['public']['Tables']['ege9']['Row']

export default async function Home() {
  const supabase = await createClient()
  const { data: tasks, error } = await supabase.from('ege9').select()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="fixed top-4 right-4 flex items-center gap-4 z-10">
        <ThemeToggle />
        <a href="https://docs.google.com/spreadsheets/d/1VioaO7HN5oghStZKfPpGivCNJUQwsIMLKOYRia5sKRI/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 shadow-lg transition-colors flex items-center justify-center" title="Открыть Google-таблицу">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1"><path d="M19.6 3.2c-.2-.2-.5-.2-.7-.2H7.5c-.6 0-1 .4-1 1v2.5H4.1c-.6 0-1 .4-1 1v13c0 .6.4 1 1 1h13c.6 0 1-.4 1-1v-2.4h2.4c.6 0 1-.4 1-1V3.9c0-.2 0-.5-.2-.7zM17.6 19.6c0 .2-.2.4-.4.4H4.8c-.2 0-.4-.2-.4-.4V7.5c0-.2.2-.4.4-.4h2.4v9.4c0 .6.4 1 1 1h9.4v2.1zm3.1-3.1c0 .2-.2.4-.4.4h-13c-.2 0-.4-.2-.4-.4V4.8c0-.2.2-.4.4-.4h11.1c.2 0 .4.2.4.4v11.7z"/></svg>
        </a>
        <a href="/Excel-Tasks.xlsx" download className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-lg transition-colors" title="Скачать Excel-файл">📊</a>
      </div>
      <header className="w-full flex flex-col items-center mt-8 mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-900 dark:text-white drop-shadow-lg">ЕГЭ по информатике: Задача №9</h1>
      </header>
      <section className="w-full flex flex-col items-center mb-8">
        {/* Прогресс-бар теперь отдельный блок, Trainer сам не рисует прогресс */}
        {error || !tasks || tasks.length === 0 ? (
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-200 rounded mb-4 text-center">
            <p className="font-bold mb-2">Задачи не найдены или таблица ege9 отсутствует.</p>
            <p>Проверьте настройки Supabase.</p>
          </div>
        ) : (
          <Trainer tasks={tasks} />
        )}
      </section>
    </main>
  )
}
