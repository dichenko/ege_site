import Header from '@/components/Header'
import TaskCard from '@/components/TaskCard'

const TASKS = [
  { number: 1, title: "Графы", icon: "💾", description: "Ищем по картинке склкакие вершины соединены" },
  { number: 2, title: "Таблицы истинности", icon: "🔢", description: "Миша сделал кривую таблицу, надо выручить парня" },
  { number: 3, title: "Таблицы Excel", icon: "🤔", description: "Сколько зефира продали в Ценртальном районе" },
  { number: 4, title: "Фано, двоичный код", icon: "📁", description: "Рисуем двоичное дерево" },
  { number: 5, title: "Алгоритмы", icon: "🔐", description: "Берем число, переводим в двоичную, издеваемся над ним" },
  { number: 6, title: "Исполнители", icon: "📝", description: "Черепахе скучно, она рисует прямоугольники" },
  { number: 7, title: "Кодирование графики, звука", icon: "🎨", description: "Картинки и звуки, что-то там с ними делаем" },
  { number: 8, title: "Комбинации символов", icon: "📡", description: "Сколько разных слов можно составить из букв О, П,Ж и А" },
  { number: 9, title: "Excel с кучей чисел", icon: "📊", description: "В квадрат разности наибольшего и наименьшего не меньше куба суммы остальных чисел" },
  { number: 10, title: "Поиск в тексте", icon: "🔍", description: "Открываем Word и ищем слово" },
  { number: 11, title: "Кодирование текста", icon: "🔄", description: "Пароли, индентификаторы, пользователи и т.д." },
  { number: 12, title: "Алгоритмы на строках", icon: "⚙️", description: "Берём очень длинную строку и сильно укорачиваем" },
  { number: 13, title: "IP-адреса", icon: "🕸️", description: "Ничего не понятно, но очень интересно" },
  { number: 14, title: "Позиционные системы счисления", icon: "🔢", description: "21-ричная система? Кто-то ей вообще пользуется?" },
  { number: 15, title: "IP-адресация", icon: "🌐", description: "Работа с сетевыми адресами" },
  { number: 16, title: "Логические выражения", icon: "🤖", description: "Следите за скобками! " },
  { number: 17, title: "Пары чисел", icon: "💻", description: "Только одно число в паре пятизначное и оканчивается на 35" },
  { number: 18, title: "Робот-исполнитель", icon: "🤖", description: "Робот в Excel? В Microsoft об этом не слышали" },
  { number: 19, title: "Теория игр (части 19-21)", icon: "🎮", description: "Вася и Петя играют в кучи камней. Три части одной задачи" },
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
