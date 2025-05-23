'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  }
  const postgresHost = process.env.POSTGRES_HOST || '';
  if (postgresHost) {
    const host = postgresHost.replace(/:.*$/, '').replace(/^.*@/, '');
    return `https://${host}`;
  }
  return '';
};

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({});
  const [tableStructure, setTableStructure] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Проверяем переменные окружения
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'НЕ УСТАНОВЛЕНА',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'УСТАНОВЛЕНА' : 'НЕ УСТАНОВЛЕНА',
      NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'НЕ УСТАНОВЛЕНА',
      generatedSupabaseUrl: getSupabaseUrl()
    });

    // Проверяем структуру таблицы
    async function checkTable() {
      try {
        const supabase = createClient(
          getSupabaseUrl(),
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);

        if (error) {
          setError(`Ошибка базы данных: ${error.message}`);
        } else {
          setTableStructure(data);
        }
      } catch (err) {
        setError(`Ошибка подключения: ${err}`);
      }
    }

    checkTable();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Отладочная информация</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">📋 Переменные окружения:</h2>
          <pre className="text-sm">{JSON.stringify(envVars, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">🗄️ Структура таблицы user_profiles:</h2>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <pre className="text-sm">{JSON.stringify(tableStructure, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
} 