import { createClient } from '@supabase/supabase-js'

// Мы используем публичные ключи Supabase, поэтому их можно хранить в коде клиента
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Логируем данные подключения (маскируем ключ для безопасности)
console.log('Supabase URL:', supabaseUrl)
console.log('Anon Key defined:', !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Функция для получения задач из таблицы ege9
export async function getTasks() {
  console.log('Начинаем запрос к Supabase, таблица ege9...')
  try {
    const { data, error } = await supabase
      .from('ege9')
      .select('*')
    
    if (error) {
      console.error('Ошибка загрузки задач из Supabase:', error)
      return []
    }
    
    console.log(`Успешно загружены данные из Supabase. Получено ${data?.length || 0} задач.`)
    if (data && data.length > 0) {
      console.log('Пример первой задачи:', JSON.stringify(data[0]))
    } else {
      console.warn('Таблица ege9 пустая или данные не соответствуют ожидаемому формату.')
    }
    
    return data || []
  } catch (e) {
    console.error('Критическая ошибка при запросе к Supabase:', e)
    return []
  }
} 