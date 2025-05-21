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
