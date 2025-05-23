import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  solved_tasks: number[];
  total_attempts: number;
  total_errors: number;
}

export default function TelegramAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Проверяем, не авторизован ли уже пользователь
    const userHash = localStorage.getItem('userHash');
    if (userHash) {
      return;
    }

    // Загружаем Telegram Widget скрипт
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-button-size', 'large');
    
    // Глобальная функция для обработки авторизации
    (window as any).onTelegramAuth = async (user: any) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });

        const result = await response.json();
        
        if (result.success) {
          localStorage.setItem('userHash', result.userHash);
          // Обновляем прогресс из базы данных
          if (result.userData.solved_tasks) {
            localStorage.setItem('solvedTasks', JSON.stringify(result.userData.solved_tasks));
          }
          router.refresh();
        } else {
          console.error('Ошибка авторизации:', result.error);
        }
      } catch (error) {
        console.error('Ошибка авторизации:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Добавляем скрипт на страницу
    document.getElementById('telegram-login')?.appendChild(script);

    return () => {
      delete (window as any).onTelegramAuth;
      const scriptElement = document.querySelector('script[data-telegram-login]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Авторизация...</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Войти через Telegram
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Авторизуйтесь, чтобы сохранять свой прогресс
          </p>
          <div id="telegram-login" className="mt-2"></div>
        </>
      )}
    </div>
  );
} 