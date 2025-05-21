import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'
import Link from 'next/link'
import Trainer from './trainer-client'
import ThemeToggle from './theme-toggle'

const SQL_SCRIPT = `-- Создание таблицы ege9\ncreate table if not exists public.ege9 (\n  id bigint primary key generated always as identity,\n  text text not null,\n  answer integer not null\n);\n\n-- Вставка примеров задач\ninsert into public.ege9 (text, answer) values\n  ('Решите задачу: 2 + 2 * 2 = ?', 6),\n  ('Вычислите значение: 5! / 3! = ?', 20);\n\n-- Включить RLS и разрешить анонимное чтение\nalter table public.ege9 enable row level security;\ncreate policy if not exists "Allow anonymous read access" on public.ege9 for select to anon using (true);`

type Task = Database['public']['Tables']['ege9']['Row']

export default async function Home() {
  const supabase = await createClient()
  const { data: tasks, error } = await supabase.from('ege9').select()

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <div className="fixed top-4 right-4 flex items-center gap-4">
        <ThemeToggle />
        <a href="/Excel-Tasks.xlsx" download className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600">📊</a>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Тренажер задач ЕГЭ по Excel</h1>
      {error || !tasks || tasks.length === 0 ? (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-200 rounded mb-4">
          <p className="font-bold mb-2">Задачи не найдены или таблица ege9 отсутствует.</p>
          <p>Проверьте настройки Supabase.</p>
        </div>
      ) : (
        <Trainer tasks={tasks} />
      )}
    </main>
  )
}
