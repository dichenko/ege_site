import { MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-gray-600 dark:text-gray-400">
          © Михаил Диченко {new Date().getFullYear()}
        </div>
        <a 
          href="https://t.me/dichenko" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          title="Написать в Telegram"
        >
          <MessageCircle className="w-5 h-5" />
          <span>@dichenko</span>
        </a>
      </div>
    </footer>
  )
} 