import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Функция для получения Supabase URL
const getSupabaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  }
  // Если есть POSTGRES_HOST, формируем URL из него
  const postgresHost = process.env.POSTGRES_HOST || '';
  if (postgresHost) {
    // Убираем порт и добавляем https://
    const host = postgresHost.replace(/:.*$/, '').replace(/^.*@/, '');
    return `https://${host}`;
  }
  return '';
};

const supabase = createClient(
  getSupabaseUrl(),
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  console.log('=== Telegram Auth Callback ===');
  
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Получаем данные от Telegram
    const authData = {
      id: parseInt(searchParams.get('id') || '0'),
      first_name: searchParams.get('first_name') || '',
      username: searchParams.get('username') || '',
      photo_url: searchParams.get('photo_url') || '',
      auth_date: parseInt(searchParams.get('auth_date') || '0'),
      hash: searchParams.get('hash') || ''
    };

    console.log('Received auth data:', { ...authData, hash: '***' });

    // Проверяем наличие необходимых переменных
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const hashSalt = process.env.HASH_SALT || 'default_salt_123';
    
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN not found');
      return new Response(`
        <html>
          <body>
            <script>
              alert('Ошибка конфигурации сервера');
              window.close();
            </script>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // Проверяем подлинность данных от Telegram
    const isValid = verifyTelegramAuth(authData, botToken);
    if (!isValid) {
      console.error('Invalid auth data from Telegram');
      return new Response(`
        <html>
          <body>
            <script>
              alert('Ошибка авторизации: неверные данные');
              window.close();
            </script>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    console.log('Auth data verified successfully');

    // Хешируем tgid с солью
    const userHash = crypto
      .createHash('sha256')
      .update(authData.id.toString() + hashSalt)
      .digest('hex');

    console.log('User hash generated:', userHash.substring(0, 8) + '...');

    // Проверяем существование пользователя
    const { data: existingUser, error: selectError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_hash', userHash)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Database select error:', selectError);
      throw selectError;
    }

    if (!existingUser) {
      console.log('Creating new user');
      // Создаем нового пользователя
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_hash: userHash,
          photo_url: authData.photo_url,
          first_name: authData.first_name,
          username: authData.username,
          solved_tasks: [],
          total_attempts: 0,
          total_errors: 0
        });
      
      if (insertError) {
        console.error('Database insert error:', insertError);
        throw insertError;
      }
    } else {
      console.log('Updating existing user');
      // Обновляем данные существующего пользователя
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          photo_url: authData.photo_url,
          first_name: authData.first_name,
          username: authData.username,
          last_active: new Date().toISOString()
        })
        .eq('user_hash', userHash);
      
      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }
    }

    // Получаем актуальные данные пользователя
    const { data: userData, error: getUserError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_hash', userHash)
      .single();

    if (getUserError) {
      console.error('Database get user error:', getUserError);
      throw getUserError;
    }

    console.log('Auth successful for user:', userData.first_name || userData.username);

    // Возвращаем HTML страницу, которая передаст данные родительскому окну
    return new Response(`
      <html>
        <body>
          <script>
            // Передаем данные в localStorage родительского окна
            if (window.opener) {
              window.opener.localStorage.setItem('userHash', '${userHash}');
              window.opener.localStorage.setItem('userPhoto', '${userData.photo_url || ''}');
              window.opener.localStorage.setItem('userName', '${userData.first_name || userData.username || ''}');
              
              if ('${JSON.stringify(userData.solved_tasks)}') {
                window.opener.localStorage.setItem('solvedTasks', '${JSON.stringify(userData.solved_tasks)}');
              }
              
              // Отправляем событие об успешной авторизации
              window.opener.postMessage({ type: 'telegram_auth_success' }, '*');
            }
            
            // Закрываем окно
            window.close();
          </script>
          <p>Авторизация прошла успешно! Окно закроется автоматически...</p>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error('Auth error:', error);
    return new Response(`
      <html>
        <body>
          <script>
            alert('Ошибка авторизации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}');
            window.close();
          </script>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}

function verifyTelegramAuth(authData: any, botToken: string): boolean {
  try {
    const { hash, ...data } = authData;
    
    // Удаляем пустые значения
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== 0)
    );
    
    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const checkString = Object.entries(cleanData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    const hmac = crypto.createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');

    const isValid = hmac === hash;
    console.log('Auth verification:', isValid ? 'SUCCESS' : 'FAILED');
    
    return isValid;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
} 