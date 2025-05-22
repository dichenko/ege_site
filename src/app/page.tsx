import Header from '@/components/Header'
import TaskCard from '@/components/TaskCard'

const TASKS = [
  { number: 1, title: "Информационные процессы", icon: "💾", description: "Анализ информационных процессов и систем" },
  { number: 2, title: "Кодирование информации", icon: "🔢", description: "Двоичное кодирование и системы счисления" },
  { number: 3, title: "Логика", icon: "🤔", description: "Логические выражения и операции" },
  { number: 4, title: "Файловая система", icon: "📁", description: "Работа с файлами и каталогами" },
  { number: 5, title: "Кодирование и декодирование", icon: "🔐", description: "Передача информации" },
  { number: 6, title: "Анализ программ", icon: "📝", description: "Исполнение алгоритмов" },
  { number: 7, title: "Кодирование графики", icon: "🎨", description: "Растровое и векторное кодирование" },
  { number: 8, title: "Передача информации", icon: "📡", description: "Скорость передачи данных" },
  { number: 9, title: "Анализ таблиц Excel", icon: "📊", description: "Обработка числовых данных" },
  { number: 10, title: "Поиск символов", icon: "🔍", description: "Анализ текстовых данных" },
  { number: 11, title: "Рекурсивные алгоритмы", icon: "🔄", description: "Анализ рекурсивных выражений" },
  { number: 12, title: "Выполнение алгоритмов", icon: "⚙️", description: "Исполнение программ" },
  { number: 13, title: "Поиск путей в графе", icon: "🕸️", description: "Анализ графов" },
  { number: 14, title: "Кодирование чисел", icon: "🔢", description: "Позиционные системы счисления" },
  { number: 15, title: "IP-адресация", icon: "🌐", description: "Работа с сетевыми адресами" },
  { number: 16, title: "Алгоритмы и исполнители", icon: "🤖", description: "Выполнение алгоритмов" },
  { number: 17, title: "Программирование", icon: "💻", description: "Анализ программного кода" },
  { number: 18, title: "Робот-исполнитель", icon: "🤖", description: "Управление роботом" },
  { number: 19, title: "Выигрышная стратегия", icon: "🎮", description: "Теория игр" },
  { number: 20, title: "Выигрышная стратегия", icon: "🎲", description: "Анализ игровых стратегий" },
  { number: 21, title: "Выигрышная стратегия", icon: "🎯", description: "Построение стратегий" },
  { number: 22, title: "Анализ программ", icon: "📊", description: "Перебор вариантов" },
  { number: 23, title: "Исполнение алгоритмов", icon: "🔄", description: "Анализ циклов" },
  { number: 24, title: "Обработка строк", icon: "📝", description: "Анализ текстовых данных" },
  { number: 25, title: "Программирование", icon: "💻", description: "Написание программ" },
  { number: 26, title: "Программирование", icon: "⌨️", description: "Обработка массивов" },
  { number: 27, title: "Программирование", icon: "📊", description: "Эффективные алгоритмы" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900 dark:text-white">
          Тренажер ЕГЭ по информатике
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {TASKS.map((task) => (
            <TaskCard
              key={task.number}
              number={task.number}
              title={task.title}
              icon={task.icon}
              description={task.description}
              isActive={task.number === 9}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
