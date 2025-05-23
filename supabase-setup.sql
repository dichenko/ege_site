-- Удаление таблицы, если она существует
DROP TABLE IF EXISTS public.ege9;

-- Создание таблицы ege9
CREATE TABLE public.ege9 (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  answer integer NOT NULL
);

-- Вставка примеров задач
INSERT INTO public.ege9 (text, answer)
VALUES
  ('Решите задачу: 2 + 2 * 2 = ?', 6),
  ('Вычислите значение: 5! / 3! = ?', 20),
  ('Найдите сумму: 1 + 2 + 3 + ... + 10 = ?', 55),
  ('Решите уравнение: 2x + 5 = 15. x = ?', 5),
  ('Найдите значение выражения: 3³ + 2² = ?', 31);

-- Активируем Row Level Security (RLS)
ALTER TABLE public.ege9 ENABLE ROW LEVEL SECURITY;

-- Создаем политику чтения для анонимных пользователей
CREATE POLICY "Allow anonymous read access" 
ON public.ege9
FOR SELECT 
TO anon
USING (true);

-- Создание таблицы user_profiles для хранения профилей пользователей
DROP TABLE IF EXISTS public.user_profiles;

CREATE TABLE public.user_profiles (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_hash VARCHAR(64) UNIQUE NOT NULL,
  photo_url TEXT,
  first_name TEXT,
  username TEXT,
  solved_tasks INTEGER[] DEFAULT '{}',
  total_attempts INTEGER DEFAULT 0,
  total_errors INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- Активируем Row Level Security для user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Создаем политику для сервисного ключа (используется в API)
CREATE POLICY "Allow service role full access" 
ON public.user_profiles
FOR ALL 
TO service_role
USING (true);

-- Вывод содержимого таблицы для проверки
SELECT * FROM public.ege9; 