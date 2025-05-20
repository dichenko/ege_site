import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['ege9']['Row']

export default async function EgeTasks() {
  const supabase = await createClient()
  const { data: tasks } = await supabase.from('ege9').select()

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Задачи ЕГЭ</h1>
      
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
        <p>Задачи не найдены или произошла ошибка при загрузке.</p>
      )}
    </div>
  )
} 