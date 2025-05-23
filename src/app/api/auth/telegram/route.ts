import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${process.env.POSTGRES_HOST}`,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface TelegramAuthData {
  id: number;
  first_name?: string;
  username?: string;
  auth_date: number;
  hash: string;
}

export async function POST(request: NextRequest) {
  try {
    const authData: TelegramAuthData = await request.json();
    
    // Проверяем подлинность данных от Telegram
    const isValid = verifyTelegramAuth(authData);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid auth data' }, { status: 400 });
    }

    // Хешируем tgid с солью
    const userHash = crypto
      .createHash('sha256')
      .update(authData.id.toString() + process.env.HASH_SALT)
      .digest('hex');

    // Проверяем существование пользователя
    const { data: existingUser, error: selectError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_hash', userHash)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (!existingUser) {
      // Создаем нового пользователя
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_hash: userHash,
          solved_tasks: [],
          total_attempts: 0,
          total_errors: 0
        });
      
      if (insertError) throw insertError;
    }

    // Получаем актуальные данные пользователя
    const { data: userData, error: getUserError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_hash', userHash)
      .single();

    if (getUserError) throw getUserError;

    return NextResponse.json({ 
      success: true, 
      userHash,
      userData
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

function verifyTelegramAuth(authData: TelegramAuthData): boolean {
  const { hash, ...data } = authData;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('Bot token not found');
    return false;
  }

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const checkString = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const hmac = crypto.createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  return hmac === hash;
} 