import { createClient } from '@supabase/supabase-js'

// Мы используем публичные ключи Supabase, поэтому их можно хранить в коде клиента
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Функция для получения задач из таблицы ege9
export async function getTasks() {
  const { data, error } = await supabase
    .from('ege9')
    .select('*')
  
  if (error) {
    console.error('Ошибка загрузки задач:', error)
    return []
  }
  
  return data || []
} 