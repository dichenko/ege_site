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

export default function TelegramAuth({ onSuccess }: TelegramAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
    setDebugInfo(`Bot Username: ${botUsername || 'не установлен'}`);

    // Загружаем Telegram Widget скрипт
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername || '');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-auth-url', window.location.origin);
    
    // Глобальная функция для обработки авторизации
    (window as any).onTelegramAuth = async (user: any) => {
      setIsLoading(true);
      setError(null);
      setDebugInfo(prev => `${prev}\nПолучены данные от Telegram: ${JSON.stringify(user)}`);
      
      try {
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });

        const result = await response.json();
        setDebugInfo(prev => `${prev}\nОтвет сервера: ${JSON.stringify(result)}`);
        
        if (result.success) {
          // Сохраняем данные пользователя
          localStorage.setItem('userHash', result.userHash);
          localStorage.setItem('userPhoto', result.userData.photo_url || '');
          localStorage.setItem('userName', result.userData.first_name || result.userData.username || '');
          
          // Обновляем прогресс из базы данных
          if (result.userData.solved_tasks) {
            localStorage.setItem('solvedTasks', JSON.stringify(result.userData.solved_tasks));
          }
          
          onSuccess();
        } else {
          setError('Ошибка авторизации: ' + (result.error || 'Неизвестная ошибка'));
        }
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        setError('Ошибка подключения к серверу');
        setDebugInfo(prev => `${prev}\nОшибка: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    // Добавляем скрипт на страницу
    const container = document.getElementById('telegram-login');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      delete (window as any).onTelegramAuth;
      const scriptElement = document.querySelector('script[data-telegram-login]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [onSuccess]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md">
      {isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Авторизация...</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
            Войти через Telegram
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Авторизуйтесь, чтобы сохранять свой прогресс между устройствами
          </p>
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}
          <div id="telegram-login" className="mt-2"></div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono whitespace-pre-wrap">
              {debugInfo}
            </div>
          )}
        </>
      )}
    </div>
  );
} 