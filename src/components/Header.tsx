'use client';

import Link from 'next/link'
import ThemeToggle from '@/app/theme-toggle'
import { UserCircle2, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import TelegramAuth from './TelegramAuth'

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const checkAuthStatus = () => {
    const userHash = localStorage.getItem('userHash');
    const photo = localStorage.getItem('userPhoto') || '';
    const name = localStorage.getItem('userName') || '';
    
    setIsLoggedIn(!!userHash);
    setUserPhoto(photo);
    setUserName(name);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userHash');
    localStorage.removeItem('solvedTasks');
    localStorage.removeItem('userPhoto');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserPhoto('');
    setUserName('');
    setIsAuthOpen(false);
    window.location.reload();
  };

  const handleAuthSuccess = () => {
    checkAuthStatus();
    setIsAuthOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          Егэшечная
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Кнопка авторизации/профиля */}
          <button 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 relative"
            title={isLoggedIn ? `${userName || 'Пользователь'}` : "Войти через Telegram"}
            onClick={() => setIsAuthOpen(!isAuthOpen)}
          >
            {isLoggedIn && userPhoto ? (
              <img 
                src={userPhoto} 
                alt="Фото профиля"
                className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
              />
            ) : (
              <UserCircle2 className={`w-6 h-6 ${isLoggedIn ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`} />
            )}
          </button>
        </div>
      </div>
      
      {/* Модальное окно авторизации/профиля */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsAuthOpen(false)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            {isLoggedIn ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl min-w-[300px]">
                <div className="flex items-center gap-4 mb-6">
                  {userPhoto ? (
                    <img 
                      src={userPhoto} 
                      alt="Фото профиля"
                      className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                      <UserCircle2 className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {userName || 'Пользователь'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Авторизован через Telegram
                    </p>
                  </div>
                </div>
                
                <button
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из аккаунта
                </button>
              </div>
            ) : (
              <TelegramAuth onSuccess={handleAuthSuccess} />
            )}
          </div>
        </div>
      )}
    </header>
  )
} 