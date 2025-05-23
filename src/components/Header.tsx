import Link from 'next/link'
import ThemeToggle from '@/app/theme-toggle'
import { UserCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import TelegramAuth from './TelegramAuth'

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userHash = localStorage.getItem('userHash');
    setIsLoggedIn(!!userHash);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          Егэшечная
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            title={isLoggedIn ? "Вы авторизованы" : "Авторизоваться"}
            onClick={() => setIsAuthOpen(!isAuthOpen)}
          >
            <UserCircle2 className={`w-6 h-6 ${isLoggedIn ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`} />
          </button>
        </div>
      </div>
      
      {/* Модальное окно авторизации */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsAuthOpen(false)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            {isLoggedIn ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Вы авторизованы</h2>
                <button
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={() => {
                    localStorage.removeItem('userHash');
                    localStorage.removeItem('solvedTasks');
                    setIsLoggedIn(false);
                    setIsAuthOpen(false);
                    window.location.reload();
                  }}
                >
                  Выйти
                </button>
              </div>
            ) : (
              <TelegramAuth />
            )}
          </div>
        </div>
      )}
    </header>
  )
} 