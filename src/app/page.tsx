import Header from '@/components/Header'
import TaskCard from '@/components/TaskCard'

const TASKS = [
  { number: 1, title: "Графы", icon: "💾", description: "Ищем по картинке склкакие вершины соединены" },
  { number: 2, title: "Таблицы истинности", icon: "🔢", description: "Пишем свою таблицу истинности и сравниваем" },
  { number: 3, title: "Таблицы Excel", icon: "🤔", description: "Сколько зефира продали в Ценртальном районе" },
  { number: 4, title: "Фано, двоичный код", icon: "📁", description: "Рисуем двоичное дерево" },
  { number: 5, title: "Алгоритмы", icon: "🔐", description: "Берем число, переводим в двоичную, издеваемся над ним" },
  { number: 6, title: "Черепаха", icon: "📝", description: "Площадь пересечения двух фигур" },
  { number: 7, title: "Кодирование графики, звука", icon: "🎨", description: "Картинки и звуки, что-то там с ними делаем" },
  { number: 8, title: "Комбинации символов", icon: "📡", description: "Сколько разных слов можно составить из букв О, П,Ж и А" },
  { number: 9, title: "Excel с кучей чисел", icon: "📊", description: "В квадрат разности наибольшего и наименьшего не меньше куба суммы остальных чисел" },
  { number: 10, title: "Поиск в тексте", icon: "🔍", description: "Открываем Word и ищем слово" },
  { number: 11, title: "Кодирование текста", icon: "🔄", description: "Пароли, индентификаторы, и т.д." },
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
