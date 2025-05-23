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

interface TelegramAuthData {
  id: number;
  first_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export async function POST(request: NextRequest) {
  console.log('=== Telegram Auth API Called ===');
  
  try {
    const authData: TelegramAuthData = await request.json();
    console.log('Received auth data:', { ...authData, hash: '***' });
    
    // Проверяем наличие необходимых переменных
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const hashSalt = process.env.HASH_SALT || 'default_salt_123';
    
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN not found');
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    // Проверяем подлинность данных от Telegram
    const isValid = verifyTelegramAuth(authData, botToken);
    if (!isValid) {
      console.error('Invalid auth data from Telegram');
      return NextResponse.json({ error: 'Invalid auth data' }, { status: 400 });
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

    return NextResponse.json({ 
      success: true, 
      userHash,
      userData
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ 
      error: 'Authentication failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function verifyTelegramAuth(authData: TelegramAuthData, botToken: string): boolean {
  try {
    const { hash, ...data } = authData;
    
    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const checkString = Object.entries(data)
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