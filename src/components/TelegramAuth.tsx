import { useEffect, useState } from 'react';

interface UserData {
  solved_tasks: number[];
  total_attempts: number;
  total_errors: number;
  photo_url?: string;
  first_name?: string;
  username?: string;
}

interface TelegramAuthProps {
  onSuccess: () => void;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export default function TelegramAuth({ onSuccess }: TelegramAuthProps) {
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
    
    if (!botUsername) {
      setError('Бот не настроен. Обратитесь к администратору.');
      return;
    }

    // Проверяем, не загружен ли уже скрипт
    if (document.querySelector('script[src*="telegram-widget.js"]')) {
      setIsScriptLoaded(true);
      return;
    }

    // Загружаем скрипт Telegram
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', `${window.location.origin}/api/auth/telegram/callback`);
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-radius', '8');
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      setError('Не удалось загрузить виджет Telegram');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup при размонтировании компонента
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
          Войти через Telegram
        </h2>
        <div className="text-red-500 text-sm text-center p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
        Войти через Telegram
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Авторизуйтесь, чтобы сохранять свой прогресс между устройствами
      </p>
      
      <div className="flex flex-col items-center gap-3">
        <div className="min-h-[50px] flex items-center justify-center">
          {!isScriptLoaded && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          )}
          {/* Telegram виджет будет добавлен автоматически после загрузки скрипта */}
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
            Bot: {process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'НЕ УСТАНОВЛЕН'}
            <br />
            URL: {window.location.origin}/api/auth/telegram/callback
          </div>
        )}
      </div>
    </div>
  );
} 